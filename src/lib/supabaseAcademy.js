const SESSION_KEY = "sanaya_supabase_session";

const TABLES = {
  sections: "academy_sections",
  playlists: "academy_playlists",
  videos: "academy_videos",
  attachments: "academy_attachments",
};

function getConfig() {
  const url = process.env.REACT_APP_SUPABASE_URL;
  const anonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error("Missing Supabase environment variables.");
  }

  return {
    url: url.replace(/\/rest\/v1\/?$/, "").replace(/\/$/, ""),
    anonKey,
  };
}

function getSession() {
  try {
    const session = JSON.parse(localStorage.getItem(SESSION_KEY) || "null");
    return session?.access_token && session?.expires_at * 1000 > Date.now() ? session : null;
  } catch {
    return null;
  }
}

async function parseResponse(response) {
  const text = await response.text();
  const data = text ? JSON.parse(text) : null;

  if (!response.ok) {
    throw new Error(data?.message || data?.error_description || data?.hint || data?.error || "Academy request failed.");
  }

  return data;
}

async function request(path, { method = "GET", body, authenticated = false, prefer } = {}) {
  const config = getConfig();
  const session = getSession();

  if (authenticated && !session) {
    throw new Error("AUTH_REQUIRED");
  }

  const response = await fetch(`${config.url}/rest/v1/${path}`, {
    method,
    headers: {
      apikey: config.anonKey,
      Authorization: `Bearer ${session?.access_token || config.anonKey}`,
      ...(body ? { "Content-Type": "application/json" } : {}),
      ...(prefer ? { Prefer: prefer } : {}),
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });

  return parseResponse(response);
}

function queryString(values) {
  const query = new URLSearchParams();
  Object.entries(values).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      query.set(key, value);
    }
  });
  return query.toString();
}

export function getYouTubeVideoId(value = "") {
  const input = String(value).trim();
  if (/^[a-zA-Z0-9_-]{11}$/.test(input)) {
    return input;
  }

  try {
    const url = new URL(input.startsWith("http") ? input : `https://${input}`);
    const host = url.hostname.replace(/^www\./, "");
    let id = "";

    if (host === "youtu.be") {
      id = url.pathname.split("/").filter(Boolean)[0] || "";
    } else if (host.endsWith("youtube.com") || host.endsWith("youtube-nocookie.com")) {
      id = url.searchParams.get("v") || url.pathname.match(/\/(?:embed|shorts|live)\/([^/?]+)/)?.[1] || "";
    }

    return /^[a-zA-Z0-9_-]{11}$/.test(id) ? id : "";
  } catch {
    return "";
  }
}

export function getYouTubeThumbnail(videoId, quality = "hqdefault") {
  return videoId ? `https://i.ytimg.com/vi/${videoId}/${quality}.jpg` : "";
}

export async function getPublishedAcademy() {
  const sectionsQuery = queryString({ select: "*", is_published: "eq.true", order: "position.asc,created_at.asc" });
  const playlistsQuery = queryString({ select: "*", is_published: "eq.true", order: "position.asc,created_at.asc" });
  const videosQuery = queryString({ select: "*", is_published: "eq.true", order: "position.asc,created_at.asc" });
  const attachmentsQuery = queryString({ select: "*", order: "position.asc,created_at.asc" });

  const [sections, playlists, videos, attachments] = await Promise.all([
    request(`${TABLES.sections}?${sectionsQuery}`),
    request(`${TABLES.playlists}?${playlistsQuery}`),
    request(`${TABLES.videos}?${videosQuery}`),
    request(`${TABLES.attachments}?${attachmentsQuery}`),
  ]);

  return { sections, playlists, videos, attachments };
}

export async function getAcademyAdminData() {
  const ordered = (table) => request(`${table}?${queryString({ select: "*", order: "position.asc,created_at.asc" })}`, { authenticated: true });
  const [sections, playlists, videos, attachments] = await Promise.all([
    ordered(TABLES.sections),
    ordered(TABLES.playlists),
    ordered(TABLES.videos),
    ordered(TABLES.attachments),
  ]);
  return { sections, playlists, videos, attachments };
}

export async function createAcademyItem(type, values) {
  return request(TABLES[type], {
    method: "POST",
    body: values,
    authenticated: true,
    prefer: "return=representation",
  });
}

export async function updateAcademyItem(type, id, values) {
  return request(`${TABLES[type]}?id=eq.${encodeURIComponent(id)}`, {
    method: "PATCH",
    body: { ...values, updated_at: new Date().toISOString() },
    authenticated: true,
    prefer: "return=representation",
  });
}

export async function deleteAcademyItem(type, id) {
  return request(`${TABLES[type]}?id=eq.${encodeURIComponent(id)}`, {
    method: "DELETE",
    authenticated: true,
    prefer: "return=minimal",
  });
}
