const cors = require("cors");
const express = require("express");

const DEFAULT_BUCKET = "sanaya-files";
const ACTIVITY_TABLE = "sanaya_file_activity";
const PORT = process.env.PORT || 4000;
const PRODUCT_CACHE_TTL_MS = Number(process.env.ODOO_PRODUCT_CACHE_SECONDS || 300) * 1000;

let odooUid = null;
let productFieldsCache = null;
let productCache = { expiresAt: 0, products: [] };

function getOdooConfig() {
  const url = (process.env.ODOO_URL || "").replace(/\/$/, "");
  const database = process.env.ODOO_DATABASE;
  const username = process.env.ODOO_USERNAME;
  const apiKey = process.env.ODOO_API_KEY;

  if (!url || !database || !username || !apiKey) {
    throw new Error("Missing ODOO_URL, ODOO_DATABASE, ODOO_USERNAME, or ODOO_API_KEY.");
  }

  return { url, database, username, apiKey };
}

async function odooRpc(service, method, args) {
  const config = getOdooConfig();
  const response = await fetch(`${config.url}/jsonrpc`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      jsonrpc: "2.0",
      method: "call",
      params: { service, method, args },
      id: Date.now(),
    }),
  });
  const payload = await response.json();

  if (!response.ok || payload.error) {
    const message = payload?.error?.data?.message || payload?.error?.message || "Odoo request failed.";
    throw new Error(message);
  }

  return payload.result;
}

async function getOdooUid() {
  if (odooUid) return odooUid;
  const config = getOdooConfig();
  odooUid = await odooRpc("common", "authenticate", [
    config.database,
    config.username,
    config.apiKey,
    {},
  ]);
  if (!odooUid) throw new Error("Odoo authentication failed.");
  return odooUid;
}

async function odooExecute(model, method, args = [], kwargs = {}) {
  const config = getOdooConfig();
  const uid = await getOdooUid();
  return odooRpc("object", "execute_kw", [
    config.database,
    uid,
    config.apiKey,
    model,
    method,
    args,
    kwargs,
  ]);
}

async function getProductFields() {
  if (productFieldsCache) return productFieldsCache;
  productFieldsCache = await odooExecute("product.template", "fields_get", [], {
    attributes: ["type"],
  });
  return productFieldsCache;
}

function firstAvailable(fields, names) {
  return names.find((name) => fields[name]);
}

function slugify(value) {
  return String(value || "product")
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "") || "product";
}

function mapProduct(record, config, options) {
  const websitePath = typeof record.website_url === "string" ? record.website_url : "";
  const productPath = websitePath || `/shop/product/${slugify(record.name)}-${record.id}`;
  const categoryIds = Array.isArray(record.public_categ_ids) ? record.public_categ_ids : [];

  return {
    id: record.id,
    name: record.name,
    slug: `${slugify(record.name)}-${record.id}`,
    description: record[options.descriptionField] || record.description_sale || "",
    price: typeof record.list_price === "number" ? record.list_price : null,
    currency: Array.isArray(record.currency_id) ? record.currency_id[1] : "",
    imageUrl: `${config.url}/web/image/product.template/${record.id}/image_1024`,
    productUrl: new URL(productPath, config.url).toString(),
    categoryIds,
    categories: categoryIds.map((id) => options.categoryNames.get(id)).filter(Boolean),
  };
}

async function loadProducts(force = false) {
  if (!force && productCache.expiresAt > Date.now()) return productCache.products;

  const config = getOdooConfig();
  const availableFields = await getProductFields();
  const publishedField = firstAvailable(availableFields, ["website_published", "is_published"]);
  const descriptionField = firstAvailable(availableFields, [
    "description_ecommerce",
    "website_description",
    "description_sale",
  ]);
  const requestedFields = [
    "id",
    "name",
    "list_price",
    "currency_id",
    "website_url",
    "public_categ_ids",
    "description_sale",
    descriptionField,
  ].filter((field, index, list) => field && availableFields[field] && list.indexOf(field) === index);
  const domain = [["sale_ok", "=", true]];
  if (publishedField) domain.push([publishedField, "=", true]);

  const records = await odooExecute("product.template", "search_read", [domain], {
    fields: requestedFields,
    limit: 500,
    order: availableFields.website_sequence ? "website_sequence asc, name asc" : "name asc",
    context: { lang: process.env.ODOO_LANGUAGE || "en_US" },
  });
  const categoryIds = [...new Set(records.flatMap((record) => record.public_categ_ids || []))];
  const categories = categoryIds.length
    ? await odooExecute("product.public.category", "read", [categoryIds], { fields: ["name"] })
    : [];
  const categoryNames = new Map(categories.map((category) => [category.id, category.name]));
  const products = records.map((record) => mapProduct(record, config, { descriptionField, categoryNames }));

  productCache = { expiresAt: Date.now() + PRODUCT_CACHE_TTL_MS, products };
  return products;
}

function getSupabaseConfig() {
  const url = (process.env.SUPABASE_URL || "").replace(/\/rest\/v1\/?$/, "").replace(/\/$/, "");
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const bucket = process.env.SUPABASE_FILES_BUCKET || DEFAULT_BUCKET;

  if (!url || !serviceKey) {
    throw new Error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.");
  }

  return { url, serviceKey, bucket };
}

function encodeStoragePath(path) {
  return encodeURIComponent(path).replace(/%2F/g, "/");
}

function getServiceHeaders(serviceKey) {
  return {
    apikey: serviceKey,
    ...(!serviceKey.startsWith("sb_secret_") ? { Authorization: `Bearer ${serviceKey}` } : {}),
  };
}

async function parseResponse(response) {
  const text = await response.text();
  const data = text ? JSON.parse(text) : null;

  if (!response.ok) {
    throw new Error(data?.msg || data?.message || data?.error_description || data?.error || "Supabase request failed.");
  }

  return data;
}

async function logActivity(config, filePath, fileName, userEmail) {
  if (!userEmail) {
    return;
  }

  const response = await fetch(`${config.url}/rest/v1/${ACTIVITY_TABLE}`, {
    method: "POST",
    headers: {
      ...getServiceHeaders(config.serviceKey),
      "Content-Type": "application/json",
      Prefer: "return=minimal",
    },
    body: JSON.stringify({
      file_path: filePath,
      file_name: fileName,
      action: "updated",
      user_email: userEmail,
    }),
  });

  if (!response.ok) {
    console.warn("Activity log failed:", await response.text());
  }
}

async function handleOnlyOfficeCallback(req, res) {
  const body = req.body || {};

  console.log("ONLYOFFICE callback received:", {
    status: body.status,
    hasUrl: Boolean(body.url),
    path: req.query.path,
    fileName: req.query.fileName,
    userEmail: req.query.userEmail,
  });

  if (![2, 6].includes(body.status)) {
    return res.status(200).json({ error: 0 });
  }

  try {
    const config = getSupabaseConfig();
    const filePath = String(req.query.path || "");
    const fileName = String(req.query.fileName || filePath.split("/").pop() || "");
    const userEmail = String(req.query.userEmail || "");

    if (!filePath) {
      throw new Error("Missing OnlyOffice callback data.");
    }

    if (body.status === 6) {
      await logActivity(config, filePath, fileName, userEmail);
      console.log("ONLYOFFICE edit noted:", {
        filePath,
        fileName,
        userEmail,
        status: body.status,
      });

      return res.status(200).json({ error: 0 });
    }

    if (!body.url) {
      throw new Error("Missing OnlyOffice edited document URL.");
    }

    const documentResponse = await fetch(body.url);

    if (!documentResponse.ok) {
      throw new Error("Unable to download edited document from OnlyOffice.");
    }

    const buffer = Buffer.from(await documentResponse.arrayBuffer());
    const uploadResponse = await fetch(`${config.url}/storage/v1/object/${config.bucket}/${encodeStoragePath(filePath)}`, {
      method: "POST",
      headers: {
        ...getServiceHeaders(config.serviceKey),
        "Content-Type": documentResponse.headers.get("content-type") || "application/octet-stream",
        "x-upsert": "true",
      },
      body: buffer,
    });

    await parseResponse(uploadResponse);
    await logActivity(config, filePath, fileName, userEmail);
    console.log("ONLYOFFICE file saved:", {
      filePath,
      fileName,
      userEmail,
      status: body.status,
    });

    return res.status(200).json({ error: 0 });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 1, message: error.message || "OnlyOffice save failed" });
  }
}

const app = express();

app.use(cors({
  origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(",").map((origin) => origin.trim()) : true,
}));
app.use(express.json({ limit: "25mb" }));

app.get("/health", (req, res) => {
  res.json({ ok: true });
});

app.get("/products", async (req, res) => {
  try {
    const products = await loadProducts(req.query.refresh === "true");
    res.set("Cache-Control", "public, max-age=60, stale-while-revalidate=300");
    return res.json({ products });
  } catch (error) {
    console.error("Odoo product catalog failed:", error.message);
    return res.status(502).json({ error: "The product catalog is temporarily unavailable." });
  }
});

app.get("/products/:identifier", async (req, res) => {
  try {
    const idMatch = String(req.params.identifier).match(/(?:^|-)(\d+)$/);
    const productId = idMatch ? Number(idMatch[1]) : null;
    if (!productId) return res.status(400).json({ error: "Invalid product identifier." });

    const products = await loadProducts();
    const product = products.find((item) => item.id === productId);
    if (!product) return res.status(404).json({ error: "Product not found." });

    res.set("Cache-Control", "public, max-age=60, stale-while-revalidate=300");
    return res.json({ product });
  } catch (error) {
    console.error("Odoo product lookup failed:", error.message);
    return res.status(502).json({ error: "The product is temporarily unavailable." });
  }
});

app.get("/onlyoffice/callback", (req, res) => {
  res.json({
    ok: true,
    message: "OnlyOffice callback is ready. ONLYOFFICE must POST save events to this URL.",
    query: req.query,
  });
});

app.post("/onlyoffice/callback", handleOnlyOfficeCallback);

app.listen(PORT, () => {
  console.log(`Sanaya office API listening on port ${PORT}`);
});
