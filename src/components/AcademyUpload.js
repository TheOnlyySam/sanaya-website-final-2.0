import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaBarsStaggered,
  FaCirclePlus,
  FaFloppyDisk,
  FaGraduationCap,
  FaLink,
  FaList,
  FaPen,
  FaRotate,
  FaTrash,
  FaVideo,
} from "react-icons/fa6";
import { getSupabaseFileUserRole, isSupabaseAuthenticated } from "../lib/supabaseFiles";
import {
  createAcademyItem,
  deleteAcademyItem,
  getAcademyAdminData,
  getYouTubeThumbnail,
  getYouTubeVideoId,
  updateAcademyItem,
} from "../lib/supabaseAcademy";

const emptyData = { sections: [], playlists: [], videos: [], attachments: [] };
const types = {
  sections: { singular: "section", title: "Section", icon: FaBarsStaggered },
  playlists: { singular: "playlist", title: "Playlist", icon: FaList },
  videos: { singular: "video", title: "Video", icon: FaVideo },
  attachments: { singular: "resource", title: "Resource link", icon: FaLink },
};

function slugify(value = "") {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function defaultValues(type, parentId, data) {
  const siblings = type === "sections"
    ? data.sections
    : data[type].filter((item) => item[`${types[type === "attachments" ? "videos" : type === "videos" ? "playlists" : "sections"].singular}_id`] === parentId);
  const position = siblings.length ? Math.max(...siblings.map((item) => Number(item.position) || 0)) + 10 : 10;

  if (type === "sections") return { name: "", slug: "", description: "", image_url: "", position, is_published: false };
  if (type === "playlists") return { section_id: parentId, title: "", slug: "", description: "", thumbnail_url: "", position, is_published: false };
  if (type === "videos") return { playlist_id: parentId, title: "", youtube_url: "", youtube_video_id: "", description: "", notes: "", duration_label: "", position, is_published: false };
  return { video_id: parentId, title: "", url: "", kind: "link", position };
}

const Field = ({ label, value, onChange, type = "text", placeholder, required, rows }) => (
  <label className="block">
    <span className="text-sm font-semibold text-slate-800">{label}{required ? " *" : ""}</span>
    {rows ? (
      <textarea
        value={value || ""}
        onChange={(event) => onChange(event.target.value)}
        rows={rows}
        placeholder={placeholder}
        required={required}
        className="mt-2 w-full resize-y rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-teal-400 focus:bg-white"
      />
    ) : (
      <input
        type={type}
        value={value ?? ""}
        onChange={(event) => onChange(type === "number" ? Number(event.target.value) : event.target.value)}
        placeholder={placeholder}
        required={required}
        className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-teal-400 focus:bg-white"
      />
    )}
  </label>
);

const AcademyUpload = () => {
  const navigate = useNavigate();
  const [data, setData] = useState(emptyData);
  const [role, setRole] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("error");
  const [selectedSectionId, setSelectedSectionId] = useState("");
  const [selectedPlaylistId, setSelectedPlaylistId] = useState("");
  const [selectedVideoId, setSelectedVideoId] = useState("");
  const [editor, setEditor] = useState(null);

  const load = useCallback(async () => {
    if (!isSupabaseAuthenticated()) {
      navigate("/login", { replace: true });
      return;
    }
    setIsLoading(true);
    setMessage("");
    try {
      const userRole = await getSupabaseFileUserRole();
      setRole(userRole);
      if (userRole === "admin") {
        setData(await getAcademyAdminData());
      }
    } catch (error) {
      if (error.message === "AUTH_REQUIRED") navigate("/login", { replace: true });
      else setMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  }, [navigate]);

  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    if (!selectedSectionId && data.sections[0]) setSelectedSectionId(data.sections[0].id);
  }, [data.sections, selectedSectionId]);

  const playlists = useMemo(() => data.playlists.filter((item) => item.section_id === selectedSectionId), [data.playlists, selectedSectionId]);
  const videos = useMemo(() => data.videos.filter((item) => item.playlist_id === selectedPlaylistId), [data.videos, selectedPlaylistId]);
  const resources = useMemo(() => data.attachments.filter((item) => item.video_id === selectedVideoId), [data.attachments, selectedVideoId]);

  useEffect(() => {
    if (!playlists.some((item) => item.id === selectedPlaylistId)) {
      setSelectedPlaylistId(playlists[0]?.id || "");
    }
  }, [playlists, selectedPlaylistId]);

  useEffect(() => {
    if (!videos.some((item) => item.id === selectedVideoId)) {
      setSelectedVideoId(videos[0]?.id || "");
    }
  }, [videos, selectedVideoId]);

  const startCreate = (type, parentId = "") => setEditor({ type, isNew: true, values: defaultValues(type, parentId, data) });
  const startEdit = (type, item) => setEditor({ type, isNew: false, values: { ...item } });
  const setValue = (key, value) => setEditor((current) => ({ ...current, values: { ...current.values, [key]: value } }));

  const save = async (event) => {
    event.preventDefault();
    const values = { ...editor.values };
    setIsSaving(true);
    setMessage("");
    setMessageType("error");
    try {
      if (editor.type === "sections" && !values.slug) values.slug = slugify(values.name);
      if (editor.type === "playlists" && !values.slug) values.slug = slugify(values.title);
      if (editor.type === "videos") {
        values.youtube_video_id = getYouTubeVideoId(values.youtube_url || values.youtube_video_id);
        if (!values.youtube_video_id) throw new Error("Enter a valid YouTube video, Shorts, Live, or youtu.be URL.");
        values.youtube_url = `https://www.youtube.com/watch?v=${values.youtube_video_id}`;
      }
      delete values.created_at;
      delete values.updated_at;
      delete values.id;

      if (editor.isNew) await createAcademyItem(editor.type, values);
      else await updateAcademyItem(editor.type, editor.values.id, values);

      await load();
      setEditor(null);
      setMessageType("success");
      setMessage(`${types[editor.type].title} saved.`);
    } catch (error) {
      setMessage(error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const remove = async () => {
    if (!window.confirm(`Delete this ${types[editor.type].singular}? Related content will also be deleted.`)) return;
    setIsSaving(true);
    setMessage("");
    try {
      await deleteAcademyItem(editor.type, editor.values.id);
      setEditor(null);
      await load();
      setMessageType("success");
      setMessage(`${types[editor.type].title} deleted.`);
    } catch (error) {
      setMessageType("error");
      setMessage(error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const openSection = (item) => { setSelectedSectionId(item.id); setEditor(null); };
  const openPlaylist = (item) => { setSelectedPlaylistId(item.id); setEditor(null); };
  const openVideo = (item) => { setSelectedVideoId(item.id); startEdit("videos", item); };

  if (isLoading) {
    return <main className="min-h-screen bg-slate-50 px-4 pt-36 text-center text-slate-600">Loading Academy manager…</main>;
  }

  if (role && role !== "admin") {
    return (
      <main className="min-h-screen bg-slate-50 px-4 pb-16 pt-36">
        <div className="mx-auto max-w-xl rounded-[2rem] border border-amber-200 bg-white p-9 text-center shadow-lg">
          <FaGraduationCap className="mx-auto text-4xl text-amber-500" />
          <h1 className="mt-5 font-display text-3xl font-bold text-slate-950">Admin access required</h1>
          <p className="mt-3 leading-7 text-slate-600">Academy content can only be managed by an account marked as admin in Sanaya’s user roles.</p>
          <button onClick={() => navigate("/portal")} className="mt-6 rounded-full bg-slate-950 px-5 py-3 text-sm font-bold text-white">Back to Portal</button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#eef6ff_0%,#f8fbff_42%,#ffffff_100%)] px-4 pb-16 pt-28 sm:px-6 lg:px-8">
      <section className="mx-auto w-full max-w-[90rem]">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <button type="button" onClick={() => navigate("/portal")} className="inline-flex items-center gap-2 text-sm font-bold text-blue-700"><FaArrowLeft /> Portal</button>
            <p className="section-kicker mt-5">Portal administration</p>
            <h1 className="mt-3 font-display text-4xl font-bold text-slate-950 sm:text-6xl">Academy Upload</h1>
            <p className="mt-4 max-w-3xl text-slate-600">Manage the full course hierarchy. Only published sections, playlists, and videos appear in the public Academy.</p>
          </div>
          <button type="button" onClick={load} className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-900 shadow-sm hover:border-teal-400"><FaRotate /> Refresh</button>
        </div>

        {message && <p className={`mt-6 rounded-2xl border px-5 py-4 text-sm ${messageType === "success" ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-red-200 bg-red-50 text-red-700"}`}>{message}</p>}

        <div className="mt-8 grid gap-5 xl:grid-cols-[0.72fr_0.9fr_1.15fr_1.25fr]">
          <ManagerColumn title="Sections" onAdd={() => startCreate("sections")} empty="Add your first Academy section.">
            {data.sections.map((item) => (
              <ManagerItem key={item.id} active={item.id === selectedSectionId} published={item.is_published} title={item.name} meta={`Order ${item.position}`} onOpen={() => openSection(item)} onEdit={() => startEdit("sections", item)} />
            ))}
          </ManagerColumn>

          <ManagerColumn title="Playlists" onAdd={() => selectedSectionId && startCreate("playlists", selectedSectionId)} disabled={!selectedSectionId} empty="Select a section, then add a playlist.">
            {playlists.map((item) => (
              <ManagerItem key={item.id} active={item.id === selectedPlaylistId} published={item.is_published} title={item.title} meta={`Order ${item.position}`} onOpen={() => openPlaylist(item)} onEdit={() => startEdit("playlists", item)} />
            ))}
          </ManagerColumn>

          <ManagerColumn title="Videos" onAdd={() => selectedPlaylistId && startCreate("videos", selectedPlaylistId)} disabled={!selectedPlaylistId} empty="Select a playlist, then add a video.">
            {videos.map((item) => (
              <button key={item.id} type="button" onClick={() => openVideo(item)} className={`flex w-full gap-3 rounded-2xl border p-3 text-left transition ${item.id === selectedVideoId ? "border-teal-400 bg-teal-50" : "border-slate-200 bg-white hover:border-teal-300"}`}>
                <img src={getYouTubeThumbnail(item.youtube_video_id)} alt="" className="h-14 w-20 rounded-xl bg-slate-100 object-cover" />
                <span className="min-w-0">
                  <span className="line-clamp-2 text-sm font-bold text-slate-950">{item.title}</span>
                  <span className={`mt-1 block text-xs ${item.is_published ? "text-emerald-600" : "text-amber-600"}`}>{item.is_published ? "Published" : "Draft"} · Order {item.position}</span>
                </span>
              </button>
            ))}
          </ManagerColumn>

          <div className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
            {editor ? (
              <EditorForm editor={editor} setValue={setValue} save={save} remove={remove} isSaving={isSaving} />
            ) : selectedVideoId ? (
              <div>
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-teal-700">Selected video</p>
                    <h2 className="mt-2 font-display text-2xl font-bold text-slate-950">Resources</h2>
                  </div>
                  <button type="button" onClick={() => startCreate("attachments", selectedVideoId)} className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-950 text-white" aria-label="Add resource"><FaCirclePlus /></button>
                </div>
                <div className="mt-5 space-y-3">
                  {resources.length ? resources.map((item) => (
                    <button key={item.id} type="button" onClick={() => startEdit("attachments", item)} className="flex w-full items-center justify-between gap-3 rounded-2xl border border-slate-200 p-4 text-left hover:border-teal-300">
                      <span className="min-w-0"><span className="block truncate text-sm font-bold text-slate-950">{item.title}</span><span className="mt-1 block truncate text-xs text-slate-500">{item.url}</span></span><FaPen className="shrink-0 text-blue-600" />
                    </button>
                  )) : <p className="rounded-2xl bg-slate-50 p-5 text-sm leading-6 text-slate-500">No resource links yet. Add PDFs, documents, websites, or downloadable files using a public URL.</p>}
                </div>
                <button type="button" onClick={() => startEdit("videos", data.videos.find((item) => item.id === selectedVideoId))} className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full border border-slate-200 px-4 py-3 text-sm font-bold text-slate-900"><FaPen /> Edit video details</button>
              </div>
            ) : (
              <div className="flex min-h-64 flex-col items-center justify-center text-center text-slate-500"><FaGraduationCap className="text-4xl text-teal-400" /><p className="mt-4 text-sm leading-6">Select an item to edit it, or use a plus button to add new content.</p></div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
};

const ManagerColumn = ({ title, onAdd, disabled, empty, children }) => {
  const items = React.Children.toArray(children);
  return (
    <div className="rounded-[1.75rem] border border-slate-200 bg-white p-4 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
      <div className="flex items-center justify-between px-1 py-2">
        <h2 className="font-display text-xl font-bold text-slate-950">{title}</h2>
        <button type="button" onClick={onAdd} disabled={disabled} className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-950 text-white disabled:cursor-not-allowed disabled:opacity-30" aria-label={`Add ${title}`}><FaCirclePlus /></button>
      </div>
      <div className="mt-3 space-y-2">
        {items.length ? items : <p className="rounded-2xl bg-slate-50 p-4 text-sm leading-6 text-slate-500">{empty}</p>}
      </div>
    </div>
  );
};

const ManagerItem = ({ active, published, title, meta, onOpen, onEdit }) => (
  <div className={`flex items-center gap-2 rounded-2xl border p-2 transition ${active ? "border-teal-400 bg-teal-50" : "border-slate-200 bg-white"}`}>
    <button type="button" onClick={onOpen} className="min-w-0 flex-1 px-2 py-1 text-left">
      <span className="block truncate text-sm font-bold text-slate-950">{title}</span>
      <span className={`mt-1 block text-xs ${published ? "text-emerald-600" : "text-amber-600"}`}>{published ? "Published" : "Draft"} · {meta}</span>
    </button>
    <button type="button" onClick={onEdit} className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-blue-600 shadow-sm" aria-label={`Edit ${title}`}><FaPen /></button>
  </div>
);

const EditorForm = ({ editor, setValue, save, remove, isSaving }) => {
  const { type, values, isNew } = editor;
  const ConfigIcon = types[type].icon;
  return (
    <form onSubmit={save}>
      <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
        <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950 text-teal-300"><ConfigIcon /></span>
        <div><p className="text-xs font-bold uppercase tracking-[0.18em] text-teal-700">{isNew ? "Create" : "Edit"}</p><h2 className="font-display text-2xl font-bold text-slate-950">{types[type].title}</h2></div>
      </div>
      <div className="mt-5 space-y-4">
        {type === "sections" && <><Field label="Name" value={values.name} onChange={(value) => setValue("name", value)} required /><Field label="URL slug" value={values.slug} onChange={(value) => setValue("slug", value)} placeholder="Generated from name if blank" /><Field label="Description" value={values.description} onChange={(value) => setValue("description", value)} rows={4} /><Field label="Cover image URL" value={values.image_url} onChange={(value) => setValue("image_url", value)} /></>}
        {type === "playlists" && <><Field label="Title" value={values.title} onChange={(value) => setValue("title", value)} required /><Field label="URL slug" value={values.slug} onChange={(value) => setValue("slug", value)} placeholder="Generated from title if blank" /><Field label="Description" value={values.description} onChange={(value) => setValue("description", value)} rows={4} /><Field label="Thumbnail URL" value={values.thumbnail_url} onChange={(value) => setValue("thumbnail_url", value)} /></>}
        {type === "videos" && <><Field label="Video title" value={values.title} onChange={(value) => setValue("title", value)} required /><Field label="YouTube URL" value={values.youtube_url} onChange={(value) => setValue("youtube_url", value)} placeholder="https://youtu.be/..." required /><Field label="Short description" value={values.description} onChange={(value) => setValue("description", value)} rows={4} /><Field label="Lesson notes" value={values.notes} onChange={(value) => setValue("notes", value)} rows={6} /><Field label="Duration label" value={values.duration_label} onChange={(value) => setValue("duration_label", value)} placeholder="8 min" /></>}
        {type === "attachments" && <><Field label="Link title" value={values.title} onChange={(value) => setValue("title", value)} required /><Field label="Public URL" value={values.url} onChange={(value) => setValue("url", value)} type="url" placeholder="https://..." required /><Field label="Type" value={values.kind} onChange={(value) => setValue("kind", value)} placeholder="PDF, worksheet, website…" /></>}
        <Field label="Display order" value={values.position} onChange={(value) => setValue("position", value)} type="number" required />
        {type !== "attachments" && (
          <label className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
            <span><span className="block text-sm font-bold text-slate-900">Published</span><span className="mt-1 block text-xs text-slate-500">Visible in the public Academy</span></span>
            <input type="checkbox" checked={Boolean(values.is_published)} onChange={(event) => setValue("is_published", event.target.checked)} className="h-5 w-5 accent-teal-600" />
          </label>
        )}
      </div>
      <button type="submit" disabled={isSaving} className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-blue-600 to-teal-500 px-5 py-3 text-sm font-bold text-white disabled:opacity-50"><FaFloppyDisk /> {isSaving ? "Saving…" : "Save"}</button>
      {!isNew && <button type="button" onClick={remove} disabled={isSaving} className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-full border border-red-200 px-5 py-3 text-sm font-bold text-red-600 disabled:opacity-50"><FaTrash /> Delete</button>}
    </form>
  );
};

export default AcademyUpload;
