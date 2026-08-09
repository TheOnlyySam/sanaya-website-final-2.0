let odooUid = null;
let productFields = null;
let productCache = { expiresAt: 0, products: [] };

async function requireAuthenticatedUser(req) {
  const authorization = String(req.headers.authorization || "");
  const accessToken = authorization.match(/^Bearer\s+(.+)$/i)?.[1];
  const supabaseUrl = String(process.env.SUPABASE_URL || process.env.REACT_APP_SUPABASE_URL || "")
    .replace(/\/rest\/v1\/?$/, "")
    .replace(/\/$/, "");
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.REACT_APP_SUPABASE_ANON_KEY;

  if (!accessToken || !supabaseUrl || !supabaseKey) return null;

  const response = await fetch(`${supabaseUrl}/auth/v1/user`, {
    headers: {
      apikey: supabaseKey,
      Authorization: `Bearer ${accessToken}`,
    },
  });
  if (!response.ok) return null;
  return response.json();
}

function getConfig() {
  const url = String(process.env.ODOO_URL || "").replace(/\/$/, "");
  const database = process.env.ODOO_DATABASE;
  const username = process.env.ODOO_USERNAME;
  const apiKey = process.env.ODOO_API_KEY;

  if (!url || !database || !username || !apiKey) {
    throw new Error("Missing ODOO_URL, ODOO_DATABASE, ODOO_USERNAME, or ODOO_API_KEY.");
  }
  return { url, database, username, apiKey };
}

async function rpc(service, method, args) {
  const { url } = getConfig();
  const response = await fetch(`${url}/jsonrpc`, {
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
    throw new Error(payload?.error?.data?.message || payload?.error?.message || "Odoo request failed.");
  }
  return payload.result;
}

async function getUid() {
  if (odooUid) return odooUid;
  const config = getConfig();
  odooUid = await rpc("common", "authenticate", [
    config.database,
    config.username,
    config.apiKey,
    {},
  ]);
  if (!odooUid) throw new Error("Odoo authentication failed. Check the database, username, and API key.");
  return odooUid;
}

async function execute(model, method, args = [], kwargs = {}) {
  const config = getConfig();
  const uid = await getUid();
  return rpc("object", "execute_kw", [
    config.database,
    uid,
    config.apiKey,
    model,
    method,
    args,
    kwargs,
  ]);
}

function slugify(value) {
  return String(value || "product")
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "") || "product";
}

async function getFields() {
  if (!productFields) {
    productFields = await execute("product.template", "fields_get", [], { attributes: ["type"] });
  }
  return productFields;
}

async function loadProducts() {
  if (productCache.expiresAt > Date.now()) return productCache.products;

  const config = getConfig();
  const fields = await getFields();
  const publishedField = fields.website_published ? "website_published" : fields.is_published ? "is_published" : null;
  const descriptionField = ["description_ecommerce", "website_description", "description_sale"].find((field) => fields[field]);
  const selectedFields = [
    "id",
    "name",
    "list_price",
    "currency_id",
    "website_url",
    "public_categ_ids",
    "description_sale",
    descriptionField,
  ].filter((field, index, list) => field && fields[field] && list.indexOf(field) === index);
  const domain = [["sale_ok", "=", true]];
  if (publishedField) domain.push([publishedField, "=", true]);

  const records = await execute("product.template", "search_read", [domain], {
    fields: selectedFields,
    limit: 500,
    order: fields.website_sequence ? "website_sequence asc, name asc" : "name asc",
    context: { lang: process.env.ODOO_LANGUAGE || "en_US" },
  });
  const categoryIds = [...new Set(records.flatMap((record) => record.public_categ_ids || []))];
  const categories = categoryIds.length
    ? await execute("product.public.category", "read", [categoryIds], { fields: ["name"] })
    : [];
  const categoryNames = new Map(categories.map((category) => [category.id, category.name]));

  const products = records.map((record) => {
    const websitePath = typeof record.website_url === "string" ? record.website_url : "";
    const fallbackPath = `/shop/product/${slugify(record.name)}-${record.id}`;
    const productCategoryIds = Array.isArray(record.public_categ_ids) ? record.public_categ_ids : [];
    return {
      id: record.id,
      name: record.name,
      slug: `${slugify(record.name)}-${record.id}`,
      description: record[descriptionField] || record.description_sale || "",
      price: typeof record.list_price === "number" ? record.list_price : null,
      currency: Array.isArray(record.currency_id) ? record.currency_id[1] : "",
      imageUrl: `${config.url}/web/image/product.template/${record.id}/image_1024`,
      productUrl: new URL(websitePath || fallbackPath, config.url).toString(),
      categories: productCategoryIds.map((id) => categoryNames.get(id)).filter(Boolean),
    };
  });

  const cacheSeconds = Math.max(30, Number(process.env.ODOO_PRODUCT_CACHE_SECONDS || 300));
  productCache = { expiresAt: Date.now() + cacheSeconds * 1000, products };
  return products;
}

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method not allowed." });
  }

  try {
    const user = await requireAuthenticatedUser(req);
    if (!user?.id) return res.status(401).json({ error: "Authentication required." });

    const products = await loadProducts();
    const identifier = String(req.query.identifier || "");
    res.setHeader("Cache-Control", "private, no-store");

    if (!identifier) return res.status(200).json({ products });

    const match = identifier.match(/(?:^|-)(\d+)$/);
    const id = match ? Number(match[1]) : null;
    const product = products.find((item) => item.id === id);
    if (!product) return res.status(404).json({ error: "Product not found." });
    return res.status(200).json({ product });
  } catch (error) {
    console.error("odoo_product_catalog_failed", { message: error.message });
    return res.status(502).json({ error: "Unable to connect to the Odoo product catalog." });
  }
}
