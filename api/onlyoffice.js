const DEFAULT_BUCKET = "sanaya-files";
const ACTIVITY_TABLE = "sanaya_file_activity";

function getSupabaseConfig() {
  const url = (process.env.SUPABASE_URL || process.env.REACT_APP_SUPABASE_URL || "").replace(/\/rest\/v1\/?$/, "").replace(/\/$/, "");
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const bucket = process.env.SUPABASE_FILES_BUCKET || process.env.REACT_APP_SUPABASE_FILES_BUCKET || DEFAULT_BUCKET;

  if (!url || !serviceKey) {
    throw new Error("Missing Supabase server environment variables.");
  }

  return { url, serviceKey, bucket };
}

function encodeStoragePath(path) {
  return encodeURIComponent(path).replace(/%2F/g, "/");
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
      apikey: config.serviceKey,
      Authorization: `Bearer ${config.serviceKey}`,
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
    console.warn(await response.text());
  }
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: 1, message: "Method not allowed" });
  }

  const body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : req.body || {};

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
        apikey: config.serviceKey,
        Authorization: `Bearer ${config.serviceKey}`,
        "Content-Type": documentResponse.headers.get("content-type") || "application/octet-stream",
        "x-upsert": "true",
      },
      body: buffer,
    });

    await parseResponse(uploadResponse);
    await logActivity(config, filePath, fileName, userEmail);

    return res.status(200).json({ error: 0 });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 1, message: error.message || "OnlyOffice save failed" });
  }
}
