import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  FaArrowRight,
  FaBookOpen,
  FaCirclePlay,
  FaClock,
  FaGraduationCap,
  FaLink,
  FaList,
  FaPlay,
  FaYoutube,
} from "react-icons/fa6";
import { getPublishedAcademy, getYouTubeThumbnail } from "../lib/supabaseAcademy";

const emptyAcademy = { sections: [], playlists: [], videos: [], attachments: [] };

const Academy = () => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.resolvedLanguage === "ar";
  const [academy, setAcademy] = useState(emptyAcademy);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    let active = true;
    getPublishedAcademy()
      .then((data) => {
        if (active) setAcademy(data);
      })
      .catch((error) => {
        if (active) setMessage(error.message);
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });
    return () => { active = false; };
  }, []);

  const selectedSection = useMemo(() => {
    const slug = searchParams.get("section");
    return academy.sections.find((section) => section.slug === slug) || academy.sections[0] || null;
  }, [academy.sections, searchParams]);

  const playlists = useMemo(
    () => academy.playlists.filter((playlist) => playlist.section_id === selectedSection?.id),
    [academy.playlists, selectedSection]
  );

  const selectedPlaylist = useMemo(() => {
    const slug = searchParams.get("playlist");
    return playlists.find((playlist) => playlist.slug === slug) || playlists[0] || null;
  }, [playlists, searchParams]);

  const videos = useMemo(
    () => academy.videos.filter((video) => video.playlist_id === selectedPlaylist?.id),
    [academy.videos, selectedPlaylist]
  );

  const selectedVideo = useMemo(() => {
    const id = searchParams.get("video");
    return videos.find((video) => video.id === id) || videos[0] || null;
  }, [videos, searchParams]);

  const attachments = useMemo(
    () => academy.attachments.filter((attachment) => attachment.video_id === selectedVideo?.id),
    [academy.attachments, selectedVideo]
  );

  const selectSection = (section) => setSearchParams({ section: section.slug });
  const selectPlaylist = (playlist) => setSearchParams({
    section: selectedSection.slug,
    playlist: playlist.slug,
  });
  const selectVideo = (video) => setSearchParams({
    section: selectedSection.slug,
    playlist: selectedPlaylist.slug,
    video: video.id,
  });

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#eaf5ff_0%,#f8fbff_34%,#ffffff_100%)] pb-20 pt-28">
      <section className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto grid w-full max-w-7xl gap-8 lg:grid-cols-[1fr_0.55fr] lg:items-end">
          <div>
            <p className="section-kicker">{t("site.academy.kicker")}</p>
            <h1 className="mt-4 font-display text-5xl font-bold leading-none tracking-tight text-slate-950 sm:text-7xl">
              {t("site.academy.title")}
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-600">
              {t("site.academy.intro")}
            </p>
          </div>
          <div className="rounded-[1.75rem] border border-teal-200 bg-white/85 p-6 shadow-[0_24px_70px_rgba(15,23,42,0.10)]">
            <div className="flex items-center gap-4">
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-950 text-xl text-teal-300">
                <FaGraduationCap />
              </span>
              <div>
                <p className="font-display text-2xl font-bold text-slate-950">{t("site.academy.pace")}</p>
                <p className="mt-1 text-sm text-slate-600">{t("site.academy.paceText")}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-7xl">
          {isLoading && (
            <div className="rounded-[2rem] border border-slate-200 bg-white p-12 text-center text-slate-600 shadow-sm">
              {t("site.academy.loading")}
            </div>
          )}

          {!isLoading && message && (
            <div className="rounded-[2rem] border border-red-100 bg-red-50 p-8 text-center text-red-700">
              {t("site.academy.loadError")} {message}
            </div>
          )}

          {!isLoading && !message && !academy.sections.length && (
            <div className="rounded-[2rem] border border-slate-200 bg-white p-12 text-center shadow-sm">
              <FaBookOpen className="mx-auto text-3xl text-teal-500" />
              <h2 className="mt-4 font-display text-3xl font-bold text-slate-950">{t("site.academy.comingSoon")}</h2>
              <p className="mt-3 text-slate-600">{t("site.academy.comingSoonText")}</p>
            </div>
          )}

          {!isLoading && !message && academy.sections.length > 0 && (
            <>
              <div className="flex gap-3 overflow-x-auto pb-4 no-scrollbar" aria-label={t("site.academy.sectionsLabel")}>
                {academy.sections.map((section) => (
                  <button
                    key={section.id}
                    type="button"
                    onClick={() => selectSection(section)}
                    className={`shrink-0 rounded-full px-5 py-3 text-sm font-bold transition ${
                      selectedSection?.id === section.id
                        ? "bg-slate-950 text-white shadow-[0_12px_30px_rgba(15,23,42,0.22)]"
                        : "border border-slate-200 bg-white text-slate-700 hover:border-teal-400"
                    }`}
                  >
                    {section.name}
                  </button>
                ))}
              </div>

              <div className="mt-5 rounded-[2rem] border border-slate-200 bg-white p-5 shadow-[0_25px_80px_rgba(15,23,42,0.09)] sm:p-7">
                <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.25em] text-teal-700">{t("site.academy.section")}</p>
                    <h2 className="mt-2 font-display text-4xl font-bold text-slate-950">{selectedSection?.name}</h2>
                    {selectedSection?.description && <p className="mt-3 max-w-3xl text-slate-600">{selectedSection.description}</p>}
                  </div>
                  <span className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500">
                    <FaList /> {playlists.length} {playlists.length === 1 ? t("site.academy.playlist") : t("site.academy.playlists")}
                  </span>
                </div>

                {!playlists.length ? (
                  <div className="mt-8 rounded-3xl bg-slate-50 p-8 text-center text-slate-600">
                    {t("site.academy.sectionSoon")}
                  </div>
                ) : (
                  <>
                    <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                      {playlists.map((playlist) => {
                        const count = academy.videos.filter((video) => video.playlist_id === playlist.id).length;
                        return (
                          <button
                            key={playlist.id}
                            type="button"
                            onClick={() => selectPlaylist(playlist)}
                            className={`group rounded-2xl border p-4 transition ${isArabic ? "text-right" : "text-left"} ${
                              selectedPlaylist?.id === playlist.id
                                ? "border-teal-400 bg-teal-50"
                                : "border-slate-200 bg-white hover:border-teal-300"
                            }`}
                          >
                            <div className="flex items-center justify-between gap-3">
                              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-teal-500 text-white"><FaPlay /></span>
                              <span className="text-xs font-semibold text-slate-500">{count} {t("site.academy.videos")}</span>
                            </div>
                            <h3 className="mt-4 font-display text-xl font-bold text-slate-950">{playlist.title}</h3>
                            {playlist.description && <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-600">{playlist.description}</p>}
                          </button>
                        );
                      })}
                    </div>

                    {selectedPlaylist && (
                      <div className="mt-8 grid gap-6 xl:grid-cols-[minmax(0,1.45fr)_minmax(19rem,0.55fr)]">
                        <div>
                          {selectedVideo ? (
                            <>
                              <div className="aspect-video overflow-hidden rounded-3xl bg-slate-950 shadow-[0_22px_55px_rgba(15,23,42,0.22)]">
                                <iframe
                                  key={selectedVideo.youtube_video_id}
                                  className="h-full w-full"
                                  src={`https://www.youtube-nocookie.com/embed/${selectedVideo.youtube_video_id}?rel=0&modestbranding=1`}
                                  title={selectedVideo.title}
                                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                  referrerPolicy="strict-origin-when-cross-origin"
                                  allowFullScreen
                                />
                              </div>
                              <div className="mt-6">
                                <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500">
                                  <span className="inline-flex items-center gap-2 text-red-600"><FaYoutube /> YouTube</span>
                                  {selectedVideo.duration_label && <span className="inline-flex items-center gap-2"><FaClock /> {selectedVideo.duration_label}</span>}
                                </div>
                                <h3 className="mt-3 font-display text-3xl font-bold text-slate-950">{selectedVideo.title}</h3>
                                {selectedVideo.description && <p className="mt-4 whitespace-pre-line leading-7 text-slate-600">{selectedVideo.description}</p>}
                                {(selectedVideo.notes || attachments.length > 0) && (
                                  <div className="mt-6 grid gap-4 md:grid-cols-2">
                                    {selectedVideo.notes && (
                                      <div className="rounded-2xl border border-blue-100 bg-blue-50/70 p-5">
                                        <p className="text-sm font-bold text-slate-950">{t("site.academy.lessonNotes")}</p>
                                        <p className="mt-3 whitespace-pre-line text-sm leading-7 text-slate-600">{selectedVideo.notes}</p>
                                      </div>
                                    )}
                                    {attachments.length > 0 && (
                                      <div className="rounded-2xl border border-teal-100 bg-teal-50/70 p-5">
                                        <p className="text-sm font-bold text-slate-950">{t("site.academy.resources")}</p>
                                        <div className="mt-3 space-y-2">
                                          {attachments.map((attachment) => (
                                            <a
                                              key={attachment.id}
                                              href={attachment.url}
                                              target="_blank"
                                              rel="noopener noreferrer"
                                              className="flex items-center justify-between gap-3 rounded-xl bg-white px-4 py-3 text-sm font-semibold text-blue-700 transition hover:text-teal-700"
                                            >
                                              <span className="inline-flex items-center gap-2"><FaLink /> {attachment.title}</span>
                                              <FaArrowRight className={isArabic ? "rotate-180" : ""} />
                                            </a>
                                          ))}
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            </>
                          ) : (
                            <div className="flex aspect-video items-center justify-center rounded-3xl bg-slate-950 px-6 text-center text-slate-300">
                              {t("site.academy.videosSoon")}
                            </div>
                          )}
                        </div>

                        <aside className="overflow-hidden rounded-3xl border border-slate-200 bg-slate-50 xl:max-h-[42rem]">
                          <div className="border-b border-slate-200 bg-white p-5">
                            <p className="text-xs font-bold uppercase tracking-[0.2em] text-teal-700">{t("site.academy.nowLearning")}</p>
                            <h3 className="mt-2 font-display text-xl font-bold text-slate-950">{selectedPlaylist.title}</h3>
                          </div>
                          <div className="space-y-2 overflow-y-auto p-3 xl:max-h-[35rem]">
                            {videos.map((video, index) => (
                              <button
                                key={video.id}
                                type="button"
                                onClick={() => selectVideo(video)}
                                className={`flex w-full gap-3 rounded-2xl p-3 transition ${isArabic ? "text-right" : "text-left"} ${
                                  selectedVideo?.id === video.id ? "bg-slate-950 text-white" : "bg-white text-slate-950 hover:bg-teal-50"
                                }`}
                              >
                                <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded-xl bg-slate-200">
                                  <img src={getYouTubeThumbnail(video.youtube_video_id)} alt="" className="h-full w-full object-cover" />
                                  <span className="absolute inset-0 flex items-center justify-center bg-slate-950/25 text-white"><FaCirclePlay /></span>
                                </div>
                                <div className="min-w-0 pt-1">
                                  <p className={`text-xs font-semibold ${selectedVideo?.id === video.id ? "text-teal-300" : "text-slate-500"}`}>{t("site.academy.lesson")} {index + 1}</p>
                                  <p className="mt-1 line-clamp-2 text-sm font-bold leading-5">{video.title}</p>
                                </div>
                              </button>
                            ))}
                          </div>
                        </aside>
                      </div>
                    )}
                  </>
                )}
              </div>
            </>
          )}
        </div>
      </section>
    </main>
  );
};

export default Academy;
