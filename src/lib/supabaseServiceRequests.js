const SESSION_KEY = "sanaya_supabase_session";
const TABLE = "service_requests";

function getConfig() {
  const url = process.env.REACT_APP_SUPABASE_URL;
  const anonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;
  const session = JSON.parse(localStorage.getItem(SESSION_KEY) || "null");
  if (!url || !anonKey || !session?.access_token || session.expires_at * 1000 <= Date.now()) {
    throw new Error("AUTH_REQUIRED");
  }
  return { url: url.replace(/\/$/, ""), anonKey, token: session.access_token };
}

async function request(path, options = {}) {
  const config = getConfig();
  const response = await fetch(`${config.url}/rest/v1/${path}`, {
    ...options,
    headers: {
      apikey: config.anonKey,
      Authorization: `Bearer ${config.token}`,
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...options.headers,
    },
  });
  const text = await response.text();
  const payload = text ? JSON.parse(text) : null;
  if (!response.ok) throw new Error(payload?.message || payload?.hint || payload?.error || "Service request operation failed.");
  return payload;
}

export function getServiceRequestAccessToken() {
  return getConfig().token;
}

export async function listServiceRequests() {
  const query = new URLSearchParams({ select: "*", order: "created_at.desc", limit: "500" });
  return request(`${TABLE}?${query.toString()}`);
}

export async function updateServiceRequest(id, values) {
  return request(`${TABLE}?id=eq.${encodeURIComponent(id)}`, {
    method: "PATCH",
    headers: { Prefer: "return=representation" },
    body: JSON.stringify({ ...values, updated_at: new Date().toISOString() }),
  });
}
