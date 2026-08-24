import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Clapperboard, ExternalLink, Headphones, Play, Youtube } from 'lucide-react';
import { Song } from '../types';

interface MediaLibraryViewProps { songs: Song[]; onSelectSong: (song: Song) => void; }

const linksFor = (song: Song) => song.mediaLinks?.length ? song.mediaLinks : [song.videoUrl, song.audioUrl].filter((link): link is string => Boolean(link));
const isYoutube = (url: string) => /youtube\.com|youtu\.be/i.test(url);
const isAudio = (url: string) => /audio|\.mp3(?:$|\?)/i.test(url) && !isYoutube(url);
const embedUrl = (url: string) => url.includes('watch?v=') ? url.replace('watch?v=', 'embed/') : url;

export const MediaLibraryView: React.FC<MediaLibraryViewProps> = ({ songs, onSelectSong }) => {
  const [visibleCount, setVisibleCount] = useState(6);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const mediaSongs = useMemo(() => songs.filter((song) => song.status === 'Approved' && linksFor(song).length > 0).sort((a, b) => b.createdAt.localeCompare(a.createdAt)), [songs]);
  const visibleSongs = mediaSongs.slice(0, visibleCount);

  useEffect(() => setVisibleCount(6), [songs.length]);
  useEffect(() => {
    const target = loadMoreRef.current;
    if (!target || visibleCount >= mediaSongs.length) return;
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) setVisibleCount((count) => Math.min(count + 6, mediaSongs.length)); }, { rootMargin: '320px' });
    observer.observe(target);
    return () => observer.disconnect();
  }, [visibleCount, mediaSongs.length]);

  return <div className="mx-auto max-w-5xl space-y-7 pb-10"><section><div className="flex items-start gap-3"><div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#e8eee1] text-[#557b55]"><Clapperboard className="h-6 w-6" /></div><div><p className="text-sm font-semibold uppercase tracking-[0.14em] text-[#a26b3d]">Media library</p><h2 className="font-serif text-3xl text-[#29402a]">Watch & listen</h2><p className="mt-1 text-sm text-[#718073]">Songs with video and audio, newest first.</p></div></div></section><div className="grid gap-5 md:grid-cols-2">{visibleSongs.map((song) => <MediaCard key={song.id} song={song} onSelectSong={onSelectSong} />)}</div>{mediaSongs.length === 0 && <div className="rounded-3xl border border-dashed border-[#cfd8ca] p-12 text-center"><Headphones className="mx-auto h-8 w-8 text-[#a26b3d]" /><h3 className="mt-3 font-serif text-xl text-[#29402a]">No media yet</h3><p className="mt-1 text-sm text-[#718073]">Videos and audio added by the admin will appear here.</p></div>}<div ref={loadMoreRef} className="h-8 text-center text-xs text-[#718073]">{visibleCount < mediaSongs.length ? 'Loading more…' : mediaSongs.length > 0 ? `Showing all ${mediaSongs.length} media songs` : ''}</div></div>;
};

const MediaCard: React.FC<{ song: Song; onSelectSong: (song: Song) => void }> = ({ song, onSelectSong }) => {
  const links = linksFor(song);
  const video = links.find(isYoutube);
  const audio = links.find(isAudio);
  return <article className="overflow-hidden rounded-3xl border border-[#dfe5da] bg-white shadow-[0_12px_28px_-20px_rgba(41,64,42,.45)]"><div className="aspect-video bg-[#1d2b20]">{video ? <iframe src={embedUrl(video)} title={`${song.title} video`} className="h-full w-full border-0" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen /> : audio ? <div className="flex h-full flex-col items-center justify-center gap-4 px-5 text-white"><Headphones className="h-10 w-10 text-[#e7b485]" /><audio controls preload="none" src={audio} className="w-full" /></div> : <div className="flex h-full items-center justify-center text-white/65"><Youtube className="h-8 w-8" /></div>}</div><div className="p-4"><div className="flex items-start gap-3"><div className="min-w-0 flex-1"><h3 className="truncate font-serif text-xl text-[#29402a]">{song.title}</h3><p className="mt-1 truncate text-sm text-[#718073]">{song.artist}</p><p className="mt-2 text-xs font-semibold text-[#a26b3d]">{song.language} · {new Date(song.createdAt).toLocaleDateString()}</p></div><button onClick={() => onSelectSong(song)} aria-label={`Open ${song.title} lyrics`} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#e8eee1] text-[#557b55] hover:bg-[#dce7d5]"><Play className="ml-0.5 h-4 w-4 fill-current" /></button></div>{links.length > 1 && <div className="mt-4 flex flex-wrap gap-2">{links.map((link, index) => <a key={`${link}-${index}`} href={link} target="_blank" rel="noreferrer" className="inline-flex min-h-9 items-center gap-1.5 rounded-full bg-[#f1f0e9] px-3 text-xs font-semibold text-[#557b55] hover:bg-[#e8eee1]"><ExternalLink className="h-3 w-3" />{/music\.youtube/i.test(link) ? 'YouTube Music' : isYoutube(link) ? `YouTube ${index + 1}` : `Audio ${index + 1}`}</a>)}</div>}</div></article>;
};
