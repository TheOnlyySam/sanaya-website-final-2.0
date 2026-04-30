const SESSION_KEY = "sanaya_supabase_session";
const DEFAULT_BUCKET = "sanaya-files";
const FOLDER_PLACEHOLDER = ".emptyFolderPlaceholder";
const ACTIVITY_TABLE = "sanaya_file_activity";

function getConfig() {
  const url = process.env.REACT_APP_SUPABASE_URL;
  const anonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;
  const bucket = process.env.REACT_APP_SUPABASE_FILES_BUCKET || DEFAULT_BUCKET;

  if (!url || !anonKey) {
    throw new Error("Missing Supabase environment variables.");
  }

  return {
    url: url.replace(/\/rest\/v1\/?$/, "").replace(/\/$/, ""),
    anonKey,
    bucket,
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

function encodeStoragePath(path) {
  return encodeURIComponent(path).replace(/%2F/g, "/");
}

function joinPath(...parts) {
  return parts
    .filter(Boolean)
    .join("/")
    .replace(/\/+/g, "/")
    .replace(/^\/|\/$/g, "");
}

function cleanName(name) {
  return String(name || "")
    .trim()
    .replace(/[\\/:*?"<>|#%{}^~[\]`]/g, "-")
    .replace(/\s+/g, " ");
}

function getAuthedConfig() {
  const config = getConfig();
  const session = getStoredSession();

  if (!session) {
    throw new Error("AUTH_REQUIRED");
  }

  return { ...config, session };
}

function authHeaders(config, extra = {}) {
  return {
    apikey: config.anonKey,
    Authorization: `Bearer ${config.session.access_token}`,
    ...extra,
  };
}

function getStoredSession() {
  try {
    const session = JSON.parse(localStorage.getItem(SESSION_KEY) || "null");

    if (!session?.access_token || !session?.expires_at || session.expires_at * 1000 <= Date.now()) {
      localStorage.removeItem(SESSION_KEY);
      return null;
    }

    return session;
  } catch {
    localStorage.removeItem(SESSION_KEY);
    return null;
  }
}

export function isSupabaseAuthenticated() {
  return Boolean(getStoredSession());
}

export function getSupabaseUserEmail() {
  return getStoredSession()?.user?.email || "";
}

export function logoutSupabaseFiles() {
  localStorage.removeItem(SESSION_KEY);
}

export async function loginSupabaseFiles(email, password) {
  const { url, anonKey } = getConfig();
  const response = await fetch(`${url}/auth/v1/token?grant_type=password`, {
    method: "POST",
    headers: {
      apikey: anonKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });
  const session = await parseResponse(response);

  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  return session;
}

export async function listSupabaseFiles(path = "") {
  const config = getAuthedConfig();

  const response = await fetch(`${config.url}/storage/v1/object/list/${config.bucket}`, {
    method: "POST",
    headers: authHeaders(config, {
      "Content-Type": "application/json",
    }),
    body: JSON.stringify({
      prefix: path,
      limit: 100,
      offset: 0,
      sortBy: { column: "name", order: "asc" },
    }),
  });
  const items = await parseResponse(response);

  return items
    .filter((item) => item.name !== FOLDER_PLACEHOLDER)
    .map((item) => ({
      name: item.name,
      path: joinPath(path, item.name),
      type: item.id ? "file" : "dir",
      size: item.metadata?.size || 0,
      modifiedAt: item.updated_at || item.created_at || null,
      mime: item.metadata?.mimetype || "",
    }));
}

export async function listSupabaseFileActivity(paths = []) {
  if (!paths.length) {
    return {};
  }

  const config = getAuthedConfig();
  const encodedPaths = paths.map((path) => `"${String(path).replace(/"/g, '\\"')}"`).join(",");
  const query = new URLSearchParams({
    select: "file_path,action,user_email,created_at",
    file_path: `in.(${encodedPaths})`,
    order: "created_at.desc",
    limit: "500",
  });

  const response = await fetch(`${config.url}/rest/v1/${ACTIVITY_TABLE}?${query.toString()}`, {
    headers: authHeaders(config),
  });
  const rows = await parseResponse(response);
  const activity = {};

  for (const row of rows || []) {
    const current = activity[row.file_path] || {};

    if (!current[row.action]) {
      current[row.action] = {
        email: row.user_email,
        at: row.created_at,
      };
    }

    activity[row.file_path] = current;
  }

  return activity;
}

export async function logSupabaseFileActivity(file, action) {
  const config = getAuthedConfig();
  const userEmail = getSupabaseUserEmail();

  if (!userEmail) {
    return null;
  }

  const response = await fetch(`${config.url}/rest/v1/${ACTIVITY_TABLE}`, {
    method: "POST",
    headers: authHeaders(config, {
      "Content-Type": "application/json",
      Prefer: "return=minimal",
    }),
    body: JSON.stringify({
      file_path: file.path,
      file_name: file.name,
      action,
      user_email: userEmail,
    }),
  });

  return parseResponse(response);
}

export async function createSupabaseDownloadUrl(path) {
  const config = getAuthedConfig();

  const response = await fetch(`${config.url}/storage/v1/object/sign/${config.bucket}/${encodeStoragePath(path)}`, {
    method: "POST",
    headers: authHeaders(config, {
      "Content-Type": "application/json",
    }),
    body: JSON.stringify({ expiresIn: 3600 }),
  });
  const data = await parseResponse(response);

  return data.signedURL?.startsWith("http") ? data.signedURL : `${config.url}/storage/v1${data.signedURL}`;
}

export async function replaceSupabaseFile(path, file) {
  const config = getAuthedConfig();

  const response = await fetch(`${config.url}/storage/v1/object/${config.bucket}/${encodeStoragePath(path)}`, {
    method: "POST",
    headers: authHeaders(config, {
      "Content-Type": file.type || "application/octet-stream",
      "x-upsert": "true",
    }),
    body: file,
  });

  return parseResponse(response);
}

export async function uploadSupabaseFile(folderPath, file) {
  const config = getAuthedConfig();
  const targetPath = joinPath(folderPath, file.name);

  const response = await fetch(`${config.url}/storage/v1/object/${config.bucket}/${encodeStoragePath(targetPath)}`, {
    method: "POST",
    headers: authHeaders(config, {
      "Content-Type": file.type || "application/octet-stream",
      "x-upsert": "true",
    }),
    body: file,
  });

  return parseResponse(response);
}

export async function createSupabaseFolder(parentPath, folderName) {
  const config = getAuthedConfig();
  const safeName = cleanName(folderName);

  if (!safeName) {
    throw new Error("Folder name is required.");
  }

  const placeholderPath = joinPath(parentPath, safeName, FOLDER_PLACEHOLDER);
  const response = await fetch(`${config.url}/storage/v1/object/${config.bucket}/${encodeStoragePath(placeholderPath)}`, {
    method: "POST",
    headers: authHeaders(config, {
      "Content-Type": "text/plain",
      "x-upsert": "true",
    }),
    body: "",
  });

  return parseResponse(response);
}

export async function deleteSupabaseItems(paths) {
  const config = getAuthedConfig();
  const response = await fetch(`${config.url}/storage/v1/object/${config.bucket}`, {
    method: "DELETE",
    headers: authHeaders(config, {
      "Content-Type": "application/json",
    }),
    body: JSON.stringify({ prefixes: paths }),
  });

  return parseResponse(response);
}

export async function moveSupabaseFile(sourcePath, destinationPath) {
  const config = getAuthedConfig();
  const response = await fetch(`${config.url}/storage/v1/object/move`, {
    method: "POST",
    headers: authHeaders(config, {
      "Content-Type": "application/json",
    }),
    body: JSON.stringify({
      bucketId: config.bucket,
      sourceKey: sourcePath,
      destinationKey: destinationPath,
    }),
  });

  return parseResponse(response);
}

async function listObjectPathsRecursive(folderPath) {
  const items = await listSupabaseFiles(folderPath);
  const paths = [];

  for (const item of items) {
    if (item.type === "dir") {
      const childPaths = await listObjectPathsRecursive(item.path);
      paths.push(...childPaths);
    } else {
      paths.push(item.path);
    }
  }

  paths.push(joinPath(folderPath, FOLDER_PLACEHOLDER));
  return [...new Set(paths)];
}

export async function deleteSupabaseFolder(folderPath) {
  const paths = await listObjectPathsRecursive(folderPath);
  return deleteSupabaseItems(paths);
}

export async function renameSupabaseItem(item, newName) {
  const safeName = cleanName(newName);

  if (!safeName) {
    throw new Error("Name is required.");
  }

  const parentPath = item.path.split("/").slice(0, -1).join("/");
  const destinationBase = joinPath(parentPath, safeName);

  if (item.type === "file") {
    return moveSupabaseFile(item.path, destinationBase);
  }

  const paths = await listObjectPathsRecursive(item.path);

  for (const sourcePath of paths) {
    const destinationPath = joinPath(destinationBase, sourcePath.slice(item.path.length).replace(/^\/+/, ""));
    await moveSupabaseFile(sourcePath, destinationPath);
  }

  return { ok: true };
}
