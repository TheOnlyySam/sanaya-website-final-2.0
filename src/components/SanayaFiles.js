import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaArrowRotateRight,
  FaDownload,
  FaEye,
  FaFile,
  FaFloppyDisk,
  FaFolder,
  FaFolderPlus,
  FaPen,
  FaRightFromBracket,
  FaTrash,
  FaUpload,
  FaXmark,
} from "react-icons/fa6";
import {
  createSupabaseFolder,
  createSupabaseDownloadUrl,
  deleteSupabaseFolder,
  deleteSupabaseItems,
  getSupabaseUserEmail,
  listSupabaseFiles,
  listSupabaseFileActivity,
  logSupabaseFileActivity,
  logoutSupabaseFiles,
  renameSupabaseItem,
  replaceSupabaseFile,
  uploadSupabaseFile,
} from "../lib/supabaseFiles";

const OFFICE_EXTENSIONS = new Set(["doc", "docx", "xls", "xlsx", "ppt", "pptx"]);
const DEFAULT_ONLYOFFICE_DOCUMENT_SERVER_URL = "https://office.sanayatechs.com";
const DEFAULT_ONLYOFFICE_CALLBACK_URL = "https://office-api.sanayatechs.com/onlyoffice/callback";
let onlyOfficeScriptPromise = null;

function formatBytes(size) {
  if (!size) {
    return "0 B";
  }

  const units = ["B", "KB", "MB", "GB"];
  const index = Math.min(Math.floor(Math.log(size) / Math.log(1024)), units.length - 1);
  return `${(size / 1024 ** index).toFixed(index === 0 ? 0 : 1)} ${units[index]}`;
}

function getFileExtension(name = "") {
  return name.split(".").pop()?.toLowerCase() || "";
}

function canPreviewOfficeFile(file) {
  return file.type === "file" && OFFICE_EXTENSIONS.has(getFileExtension(file.name));
}

function getOfficeViewerUrl(fileUrl) {
  return `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(fileUrl)}`;
}

function getOnlyOfficeServerUrl() {
  const configuredUrl = process.env.REACT_APP_ONLYOFFICE_DOCUMENT_SERVER_URL || "";

  if (!configuredUrl || configuredUrl.includes("/onlyoffice/callback") || configuredUrl.includes("office-api.")) {
    return DEFAULT_ONLYOFFICE_DOCUMENT_SERVER_URL;
  }

  return configuredUrl;
}

function getLatestFileActivity(activity) {
  if (!activity) {
    return null;
  }

  return Object.entries(activity)
    .map(([action, details]) => ({ action, ...details }))
    .filter((details) => details.email && details.at)
    .sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime())[0] || null;
}

function formatActivity(activity) {
  if (!activity) {
    return "No activity yet";
  }

  const actionLabel = activity.action.charAt(0).toUpperCase() + activity.action.slice(1);
  const date = new Date(activity.at);
  const when = Number.isNaN(date.getTime()) ? "" : ` on ${date.toLocaleDateString()}`;

  return `${actionLabel} by ${activity.email}${when}`;
}

function getOnlyOfficeDocumentType(fileName) {
  const extension = getFileExtension(fileName);

  if (["xls", "xlsx"].includes(extension)) {
    return "cell";
  }

  if (["ppt", "pptx"].includes(extension)) {
    return "slide";
  }

  return "word";
}

function getDocumentKey(file) {
  const key = window.btoa(unescape(encodeURIComponent(`${file.path}-${file.modifiedAt || ""}-${file.size || 0}`)));
  return key.replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 120);
}

function loadOnlyOfficeScript(serverUrl) {
  if (window.DocsAPI?.DocEditor) {
    return Promise.resolve();
  }

  if (!onlyOfficeScriptPromise) {
    onlyOfficeScriptPromise = new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = `${serverUrl}/web-apps/apps/api/documents/api.js`;
      script.async = true;
      script.onload = resolve;
      script.onerror = () => {
        onlyOfficeScriptPromise = null;
        reject(new Error(`OnlyOffice editor failed to load from ${script.src}`));
      };
      document.body.appendChild(script);
    });
  }

  return onlyOfficeScriptPromise;
}

const SanayaFiles = () => {
  const [files, setFiles] = useState([]);
  const [fileActivity, setFileActivity] = useState({});
  const [path, setPath] = useState("");
  const [message, setMessage] = useState("");
  const [activityWarning, setActivityWarning] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [currentAction, setCurrentAction] = useState("");
  const [previewFile, setPreviewFile] = useState(null);
  const [editorError, setEditorError] = useState("");
  const fileInputRef = useRef(null);
  const replaceInputRef = useRef(null);
  const editorRef = useRef(null);
  const onlyOfficeServer = getOnlyOfficeServerUrl().replace(/\/$/, "");
  const onlyOfficeCallbackUrl = (process.env.REACT_APP_ONLYOFFICE_CALLBACK_URL || DEFAULT_ONLYOFFICE_CALLBACK_URL).replace(/\/$/, "");
  const navigate = useNavigate();

  const crumbs = useMemo(() => path.split("/").filter(Boolean), [path]);

  const loadFiles = useCallback(
    async (nextPath = "") => {
      setIsLoading(true);
      setMessage("");

      try {
        const query = new URLSearchParams();

        if (nextPath) {
          query.set("path", nextPath);
        }

        const data = await listSupabaseFiles(query.get("path") || "");
        const filePaths = (data || []).filter((item) => item.type === "file").map((item) => item.path);

        setFiles(data || []);
        setPath(query.get("path") || "");

        try {
          setFileActivity(await listSupabaseFileActivity(filePaths));
          setActivityWarning("");
        } catch (activityError) {
          setFileActivity({});
          setActivityWarning(`File activity is not available: ${activityError.message}`);
        }
      } catch (error) {
        if (error.message === "AUTH_REQUIRED") {
          navigate("/login");
          return;
        }

        setMessage(error.message);
      } finally {
        setIsLoading(false);
      }
    },
    [navigate]
  );

  useEffect(() => {
    loadFiles("");
  }, [loadFiles]);

  const openFolder = (folderPath) => {
    loadFiles(folderPath);
  };

  const goUp = () => {
    loadFiles(crumbs.slice(0, -1).join("/"));
  };

  const recordActivity = async (file, action) => {
    try {
      await logSupabaseFileActivity(file, action);
      setFileActivity((current) => ({
        ...current,
        [file.path]: {
          ...current[file.path],
          [action]: {
            email: getSupabaseUserEmail(),
            at: new Date().toISOString(),
          },
        },
      }));
      setActivityWarning("");
      await loadFiles(path);
    } catch (error) {
      setActivityWarning(`Could not save file activity: ${error.message}`);
    }
  };

  const downloadFile = async (file) => {
    try {
      const filePath = typeof file === "string" ? file : file.path;
      const url = await createSupabaseDownloadUrl(filePath);
      if (typeof file !== "string") {
        await recordActivity(file, "downloaded");
      }
      window.location.href = url;
    } catch (error) {
      if (error.message === "AUTH_REQUIRED") {
        navigate("/login");
        return;
      }

      setMessage(error.message);
    }
  };

  const openFile = async (file) => {
    if (!canPreviewOfficeFile(file)) {
      await downloadFile(file);
      return;
    }

    setCurrentAction("working");
    setMessage("");

    try {
      const url = await createSupabaseDownloadUrl(file.path);
      await recordActivity(file, "viewed");
      setPreviewFile({
        ...file,
        editorUrl: onlyOfficeServer ? url : "",
        viewerUrl: getOfficeViewerUrl(url),
      });
      setEditorError("");
    } catch (error) {
      if (error.message === "AUTH_REQUIRED") {
        navigate("/login");
        return;
      }

      setMessage(error.message);
    } finally {
      setCurrentAction("");
    }
  };

  const runFileAction = async (action, successMessage) => {
    setCurrentAction("working");
    setMessage("");

    try {
      await action();
      await loadFiles(path);
      if (successMessage) {
        setMessage(successMessage);
      }
    } catch (error) {
      if (error.message === "AUTH_REQUIRED") {
        navigate("/login");
        return;
      }

      setMessage(error.message);
    } finally {
      setCurrentAction("");
    }
  };

  const handleUpload = async (event) => {
    const selectedFiles = Array.from(event.target.files || []);
    event.target.value = "";

    if (!selectedFiles.length) {
      return;
    }

    await runFileAction(async () => {
      for (const selectedFile of selectedFiles) {
        await uploadSupabaseFile(path, selectedFile);
        try {
          await logSupabaseFileActivity({
            name: selectedFile.name,
            path: [path, selectedFile.name].filter(Boolean).join("/"),
          }, "updated");
        } catch (error) {
          setActivityWarning(`Could not save file activity: ${error.message}`);
        }
      }
    }, `${selectedFiles.length} file${selectedFiles.length === 1 ? "" : "s"} uploaded.`);
  };

  const handleReplaceFile = async (event) => {
    const selectedFile = event.target.files?.[0];
    event.target.value = "";

    if (!selectedFile || !previewFile) {
      return;
    }

    const selectedExtension = getFileExtension(selectedFile.name);
    const previewExtension = getFileExtension(previewFile.name);

    if (selectedExtension !== previewExtension) {
      setMessage(`Please choose a .${previewExtension} file to replace "${previewFile.name}".`);
      return;
    }

    await runFileAction(async () => {
      await replaceSupabaseFile(previewFile.path, selectedFile);
      const url = await createSupabaseDownloadUrl(previewFile.path);
      setPreviewFile((current) => current && {
        ...current,
        size: selectedFile.size,
        editorUrl: onlyOfficeServer ? url : "",
        viewerUrl: getOfficeViewerUrl(url),
      });
      try {
        await logSupabaseFileActivity(previewFile, "updated");
      } catch (error) {
        setActivityWarning(`Could not save file activity: ${error.message}`);
      }
    }, "File changes saved.");
  };

  useEffect(() => {
    if (!previewFile || !onlyOfficeServer || !previewFile.editorUrl) {
      return undefined;
    }

    let editor = null;
    let isCancelled = false;
    const userEmail = getSupabaseUserEmail();

    loadOnlyOfficeScript(onlyOfficeServer)
      .then(() => {
        if (isCancelled) {
          return;
        }

        const callbackUrl = `${onlyOfficeCallbackUrl}?path=${encodeURIComponent(previewFile.path)}&fileName=${encodeURIComponent(previewFile.name)}&userEmail=${encodeURIComponent(userEmail)}`;

        editor = new window.DocsAPI.DocEditor("onlyoffice-editor", {
          document: {
            fileType: getFileExtension(previewFile.name),
            key: getDocumentKey(previewFile),
            title: previewFile.name,
            url: previewFile.editorUrl,
            permissions: {
              download: true,
              edit: true,
              print: true,
            },
          },
          documentType: getOnlyOfficeDocumentType(previewFile.name),
          editorConfig: {
            callbackUrl,
            lang: "en",
            mode: "edit",
            user: {
              id: userEmail || "sanaya-user",
              name: userEmail || "Sanaya user",
            },
            customization: {
              autosave: true,
              forcesave: true,
            },
          },
          events: {
            onAppReady: () => setEditorError(""),
            onError: () => setEditorError("OnlyOffice could not open this file."),
          },
          height: "100%",
          width: "100%",
        });

        editorRef.current = editor;
      })
      .catch((error) => setEditorError(error.message));

    return () => {
      isCancelled = true;
      if (editor?.destroyEditor) {
        editor.destroyEditor();
      }
      editorRef.current = null;
    };
  }, [onlyOfficeCallbackUrl, onlyOfficeServer, previewFile]);

  const createFolder = async () => {
    const folderName = window.prompt("New folder name");

    if (!folderName) {
      return;
    }

    await runFileAction(() => createSupabaseFolder(path, folderName), "Folder created.");
  };

  const renameItem = async (item) => {
    const nextName = window.prompt("Rename to", item.name);

    if (!nextName || nextName === item.name) {
      return;
    }

    await runFileAction(() => renameSupabaseItem(item, nextName), "Item renamed.");
  };

  const deleteItem = async (item) => {
    const confirmed = window.confirm(`Delete "${item.name}"? This cannot be undone.`);

    if (!confirmed) {
      return;
    }

    await runFileAction(
      () => (item.type === "dir" ? deleteSupabaseFolder(item.path) : deleteSupabaseItems([item.path])),
      "Item deleted."
    );
  };

  const logout = () => {
    logoutSupabaseFiles();
    navigate("/login");
  };

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#eef6ff_0%,#ffffff_38%,#f8fbff_100%)] px-4 pb-16 pt-32 sm:px-6 lg:px-8">
      <section className="mx-auto w-full max-w-7xl">
        <div className="flex flex-col gap-5 border-b border-slate-200 pb-8 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="section-kicker">Private Library</p>
            <h1 className="mt-3 font-display text-4xl font-bold leading-tight text-slate-950 sm:text-5xl">
              Sanaya Files
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
              Files are served from a private Supabase Storage bucket after secure login.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <input
              ref={fileInputRef}
              type="file"
              multiple
              className="hidden"
              onChange={handleUpload}
            />
            <input
              ref={replaceInputRef}
              type="file"
              className="hidden"
              onChange={handleReplaceFile}
              accept={previewFile ? `.${getFileExtension(previewFile.name)}` : undefined}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={Boolean(currentAction)}
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-600 to-teal-500 px-4 py-2.5 text-sm font-semibold text-white shadow-[0_14px_35px_rgba(14,165,233,0.22)] transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-70"
            >
              <FaUpload />
              Upload
            </button>
            <button
              type="button"
              onClick={createFolder}
              disabled={Boolean(currentAction)}
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 transition hover:border-teal-400 hover:text-teal-700 disabled:cursor-not-allowed disabled:opacity-70"
            >
              <FaFolderPlus />
              New Folder
            </button>
            <button
              type="button"
              onClick={() => loadFiles(path)}
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 transition hover:border-teal-400 hover:text-teal-700"
            >
              <FaArrowRotateRight />
              Refresh
            </button>
            <button
              type="button"
              onClick={logout}
              className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              <FaRightFromBracket />
              Logout
            </button>
          </div>
        </div>

        <div className="mt-6 flex min-h-11 flex-wrap items-center gap-2 text-sm text-slate-600">
          <button
            type="button"
            onClick={() => loadFiles("")}
            className="font-semibold text-slate-950 transition hover:text-teal-700"
          >
            Home
          </button>
          {crumbs.map((crumb, index) => {
            const crumbPath = crumbs.slice(0, index + 1).join("/");
            return (
              <React.Fragment key={crumbPath}>
                <span>/</span>
                <button
                  type="button"
                  onClick={() => loadFiles(crumbPath)}
                  className="font-semibold text-slate-950 transition hover:text-teal-700"
                >
                  {crumb}
                </button>
              </React.Fragment>
            );
          })}
        </div>

        <div className="mt-6 overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-[0_24px_80px_rgba(15,23,42,0.08)]">
          <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
            <p className="text-sm font-semibold text-slate-900">
              {currentAction ? "Working..." : isLoading ? "Loading..." : `${files.length} items`}
            </p>
            {path && (
              <button
                type="button"
                onClick={goUp}
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-900 transition hover:border-teal-400 hover:text-teal-700"
              >
                <FaArrowLeft />
                Back
              </button>
            )}
          </div>

          {message && (
            <p className={`m-5 rounded-2xl border px-4 py-3 text-sm ${
              message.includes("failed") || message.includes("required") || message.includes("not") || message.includes("denied")
                ? "border-red-100 bg-red-50 text-red-700"
                : "border-emerald-100 bg-emerald-50 text-emerald-700"
            }`}>
              {message}
            </p>
          )}

          {activityWarning && (
            <p className="m-5 rounded-2xl border border-amber-100 bg-amber-50 px-4 py-3 text-sm text-amber-800">
              {activityWarning}
            </p>
          )}

          {!message && !isLoading && files.length === 0 && (
            <div className="px-5 py-12 text-center text-slate-500">No files found in this folder.</div>
          )}

          <div className="divide-y divide-slate-100">
            {files.map((file) => {
              const latestActivity = getLatestFileActivity(fileActivity[file.path]);
              const activityText = file.type === "file" ? formatActivity(latestActivity) : "";

              return (
              <div
                key={`${file.type}-${file.path}`}
                className="grid grid-cols-[1fr_auto] items-center gap-4 px-5 py-4 transition hover:bg-slate-50 md:grid-cols-[1fr_115px_130px_minmax(280px,1fr)_150px]"
              >
                <button
                  type="button"
                  onClick={() => (file.type === "dir" ? openFolder(file.path) : openFile(file))}
                  className="flex min-w-0 items-center gap-3 text-left"
                >
                  <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${file.type === "dir" ? "bg-amber-100 text-amber-700" : "bg-blue-100 text-blue-700"}`}>
                    {file.type === "dir" ? <FaFolder /> : <FaFile />}
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate font-semibold text-slate-950">{file.name}</span>
                    <span className="block text-sm text-slate-500 md:hidden">
                      {file.type === "dir" ? "Folder" : formatBytes(file.size)}
                    </span>
                    {file.type === "file" && (
                      <span className="mt-1 block text-xs leading-5 text-slate-500 md:hidden">
                        {activityText}
                      </span>
                    )}
                  </span>
                </button>
                <span className="hidden text-sm text-slate-500 md:block">{file.type === "dir" ? "Folder" : formatBytes(file.size)}</span>
                <span className="hidden text-sm text-slate-500 md:block">
                  {file.modifiedAt ? new Date(file.modifiedAt).toLocaleDateString() : ""}
                </span>
                <span className="hidden text-xs leading-5 text-slate-500 md:block">
                  {activityText}
                </span>
                <div className="flex items-center justify-end gap-2">
                  {canPreviewOfficeFile(file) && (
                    <button
                      type="button"
                      onClick={() => openFile(file)}
                      disabled={Boolean(currentAction)}
                      className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-900 transition hover:border-teal-400 hover:text-teal-700 disabled:cursor-not-allowed disabled:opacity-50"
                      aria-label={`Preview ${file.name}`}
                      title="Preview"
                    >
                      <FaEye />
                    </button>
                  )}
                  {file.type === "file" && (
                    <button
                      type="button"
                      onClick={() => downloadFile(file)}
                      className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-900 transition hover:border-teal-400 hover:text-teal-700"
                      aria-label={`Download ${file.name}`}
                      title="Download"
                    >
                      <FaDownload />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => renameItem(file)}
                    disabled={Boolean(currentAction)}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-900 transition hover:border-teal-400 hover:text-teal-700 disabled:cursor-not-allowed disabled:opacity-50"
                    aria-label={`Rename ${file.name}`}
                    title="Rename"
                  >
                    <FaPen />
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteItem(file)}
                    disabled={Boolean(currentAction)}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-900 transition hover:border-red-300 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
                    aria-label={`Delete ${file.name}`}
                    title="Delete"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
              );
            })}
          </div>
        </div>
      </section>

      {previewFile && (
        <div className="fixed inset-0 z-[100] flex bg-slate-950/80 p-3 backdrop-blur-sm sm:p-5">
          <section className="flex min-h-0 w-full flex-col overflow-hidden rounded-2xl bg-white shadow-[0_30px_120px_rgba(15,23,42,0.35)]">
            <div className="flex flex-col gap-3 border-b border-slate-200 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-slate-950">{previewFile.name}</p>
                <p className="text-xs text-slate-500">{formatBytes(previewFile.size)}</p>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <button
                  type="button"
                  onClick={() => replaceInputRef.current?.click()}
                  disabled={Boolean(currentAction)}
                  className="inline-flex h-10 items-center gap-2 rounded-full border border-slate-200 px-3 text-sm font-semibold text-slate-900 transition hover:border-teal-400 hover:text-teal-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <FaFloppyDisk />
                  Upload Copy
                </button>
                <button
                  type="button"
                  onClick={() => downloadFile(previewFile)}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-900 transition hover:border-teal-400 hover:text-teal-700"
                  aria-label={`Download ${previewFile.name}`}
                  title="Download"
                >
                  <FaDownload />
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewFile(null)}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-slate-950 text-white transition hover:bg-slate-800"
                  aria-label="Close preview"
                  title="Close"
                >
                  <FaXmark />
                </button>
              </div>
            </div>
            {onlyOfficeServer ? (
              <div className="relative min-h-0 flex-1">
                {editorError && (
                  <p className="absolute left-4 top-4 z-10 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {editorError}
                  </p>
                )}
                <div id="onlyoffice-editor" className="h-full w-full" />
              </div>
            ) : (
              <div className="flex min-h-0 flex-1 flex-col">
                <p className="border-b border-amber-100 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                  Live editing needs an OnlyOffice Document Server URL. This preview is read-only.
                </p>
                <iframe
                  title={`Preview ${previewFile.name}`}
                  src={previewFile.viewerUrl}
                  className="min-h-0 flex-1 border-0"
                />
              </div>
            )}
          </section>
        </div>
      )}
    </main>
  );
};

export default SanayaFiles;
