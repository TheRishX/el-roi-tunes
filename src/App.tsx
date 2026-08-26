import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Category, MediaItem, Song, TabType, UserSettings } from './types';
import { sqlDb } from './services/sqlDb';
import { TopAppBar } from './components/TopAppBar';
import { BottomNavBar } from './components/BottomNavBar';
import { SideDrawer } from './components/SideDrawer';
import { HomeView } from './components/HomeView';
import { SearchView } from './components/SearchView';
import { FavoritesView } from './components/FavoritesView';
import { SongDetailModal } from './components/SongDetailModal';
import { AdminGate } from './components/AdminGate';
import { AdminPanel } from './components/AdminPanel';
import { LyricsDraft, MediaLibraryView } from './components/MediaLibraryView';

type AppOverlay = 'drawer' | 'song' | 'adminGate' | 'admin';
type AppHistoryState = { app: true; tab: TabType; overlay?: AppOverlay; songId?: string; rootGuard?: boolean };

export default function App() {
  const [currentTab, setCurrentTab] = useState<TabType>('home');
  const [songs, setSongs] = useState<Song[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [settings, setSettings] = useState<UserSettings>(sqlDb.getSettings());
  const [selectedSong, setSelectedSong] = useState<Song | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [adminGateOpen, setAdminGateOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [loadError, setLoadError] = useState('');
  const routeRef = useRef<AppHistoryState>({ app: true, tab: 'home' });
  const historyBootstrapped = useRef(false);
  const songsRef = useRef(songs);
  songsRef.current = songs;

  // Keep the browser/Android/iOS back gesture inside the app. The duplicate
  // home entry is intentional: from the home screen, back once stays in the
  // app and back a second time exits to the page the user came from.
  useEffect(() => {
    if (!historyBootstrapped.current) {
      const initial: AppHistoryState = { app: true, tab: 'home' };
      window.history.replaceState(initial, '', window.location.href);
      const homeGuard: AppHistoryState = { ...initial, rootGuard: true };
      window.history.pushState(homeGuard, '', window.location.href);
      routeRef.current = homeGuard;
      historyBootstrapped.current = true;
    }

    const onPopState = (event: PopStateEvent) => {
      const next = event.state as AppHistoryState | null;
      if (!next?.app) return;
      routeRef.current = next;
      setCurrentTab(next.tab);
      setDrawerOpen(next.overlay === 'drawer');
      setAdminGateOpen(next.overlay === 'adminGate');
      setAdminOpen(next.overlay === 'admin');
      setSelectedSong(next.overlay === 'song' && next.songId
        ? songsRef.current.find((song) => song.id === next.songId) || null
        : null);
    };

    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  useEffect(() => {
    let stopSync = () => undefined;
    sqlDb.ready.then(() => {
      setSongs(sqlDb.getSongs()); setCategories(sqlDb.getCategories()); setMediaItems(sqlDb.getMediaItems()); setSettings(sqlDb.getSettings());
      stopSync = sqlDb.startAutoSync(() => { setSongs(sqlDb.getSongs()); setCategories(sqlDb.getCategories()); setMediaItems(sqlDb.getMediaItems()); setSettings(sqlDb.getSettings()); });
    }).catch((error: Error) => setLoadError(error.message || 'Unable to connect to the song database.'));
    return () => stopSync();
  }, []);

  const refreshSongs = () => setSongs(sqlDb.getSongs());
  const updateSettings = (changes: Partial<UserSettings>) => { void sqlDb.updateSettings(changes).then(setSettings); };
  const refreshData = () => { setSongs(sqlDb.getSongs()); setCategories(sqlDb.getCategories()); };
  const addMedia = async (url: string) => { await sqlDb.addMedia(url); setMediaItems(sqlDb.getMediaItems()); };
  const deleteMedia = async (id: string) => { await sqlDb.deleteMedia(id); setMediaItems(sqlDb.getMediaItems()); };
  const removeSongVideo = async (song: Song) => {
    const remainingLinks = (song.mediaLinks?.length ? song.mediaLinks : [song.videoUrl, song.audioUrl].filter((link): link is string => Boolean(link))).filter((link) => !/youtube\.com|youtu\.be/i.test(link));
    const audioUrl = remainingLinks.find((link) => /audio|\.mp3(?:$|\?)/i.test(link)) || '';
    await sqlDb.deleteSongVideo(song.id, remainingLinks, audioUrl);
    setSongs(sqlDb.getSongs());
  };
  const addLyrics = async (item: MediaItem, draft: LyricsDraft) => {
    const normalizeLyrics = (value: string) => value.toLocaleLowerCase().replace(/[\u200b\s\p{P}\p{S}]+/gu, '');
    const incomingLyrics = [draft.lyricsHindi, draft.lyricsHinglish].map((value) => normalizeLyrics(value.trim())).filter(Boolean);
    const duplicate = songs.find((song) => incomingLyrics.some((lyrics) => [song.lyricsHindi, song.lyricsHinglish, song.lyrics].map((value) => normalizeLyrics(value || '')).includes(lyrics)));
    let songTitle = draft.title.trim();
    let allowDuplicate = false;
    if (duplicate) {
      const requestedTitle = window.prompt(`These lyrics already exist as “${duplicate.title}”. Enter a new title to save another version, or cancel.`, `${songTitle} (Version 2)`);
      if (!requestedTitle?.trim()) return false;
      songTitle = requestedTitle.trim();
      allowDuplicate = true;
    }
    await sqlDb.addSong({ title: songTitle, artist: draft.artist.trim(), category: categories[0]?.name || 'Worship', language: draft.language, coverImage: item.thumbnailUrl || '', lyrics: draft.lyricsHindi.trim() || draft.lyricsHinglish.trim(), lyricsHindi: draft.lyricsHindi.trim(), lyricsHinglish: draft.lyricsHinglish.trim(), chordsLyrics: '', defaultKey: 'C', bpm: 72, tempo: '4/4', videoUrl: item.url, audioUrl: '', mediaLinks: [item.url], isPinned: false, isFavorite: false, year: new Date().getFullYear(), status: 'Approved', uploadedBy: 'Admin', timestamps: [], allowDuplicate });
    await sqlDb.deleteMedia(item.id);
    setSongs(sqlDb.getSongs()); setMediaItems(sqlDb.getMediaItems());
    return true;
  };
  const navigateTab = (tab: TabType) => {
    const current = routeRef.current;
    if (current.tab === tab && !current.overlay) return;
    const next: AppHistoryState = { app: true, tab };
    // Replace the startup guard when leaving home so that tab back-stack
    // entries behave like normal native app screens.
    if (current.overlay || current.rootGuard) window.history.replaceState(next, '', window.location.href);
    else window.history.pushState(next, '', window.location.href);
    routeRef.current = next;
    setCurrentTab(tab);
    setDrawerOpen(false);
    setAdminGateOpen(false);
    setAdminOpen(false);
  };
  const openOverlay = (overlay: AppOverlay, songId?: string) => {
    const next: AppHistoryState = { app: true, tab: routeRef.current.tab, overlay, ...(songId ? { songId } : {}) };
    window.history.pushState(next, '', window.location.href);
    routeRef.current = next;
  };
  const closeOverlay = (overlay: AppOverlay) => {
    if (routeRef.current.overlay === overlay) window.history.back();
    else if (overlay === 'drawer') setDrawerOpen(false);
    else if (overlay === 'song') setSelectedSong(null);
    else if (overlay === 'adminGate') setAdminGateOpen(false);
    else setAdminOpen(false);
  };
  const selectSong = (song: Song) => {
    setSelectedSong(song);
    openOverlay('song', song.id);
  };
  const togglePin = (id: string) => {
    void sqlDb.togglePin(id).then(() => { refreshSongs(); if (selectedSong?.id === id) setSelectedSong(sqlDb.getSongById(id) || null); });
  };
  const toggleFavorite = (id: string) => {
    void sqlDb.toggleFavorite(id).then(() => { refreshSongs(); if (selectedSong?.id === id) setSelectedSong(sqlDb.getSongById(id) || null); });
  };
  const browseCategory = (id: string) => {
    const category = categories.find((item) => item.id === id);
    setCategoryFilter(category?.name || 'All');
    navigateTab('search');
  };
  const openAdminGate = () => {
    const next: AppHistoryState = { app: true, tab: routeRef.current.tab, overlay: 'adminGate' };
    if (routeRef.current.overlay === 'drawer') window.history.replaceState(next, '', window.location.href);
    else window.history.pushState(next, '', window.location.href);
    routeRef.current = next;
    setDrawerOpen(false);
    setAdminGateOpen(true);
  };
  const saveSong = (data: Omit<Song, 'id' | 'createdAt' | 'views'>, id?: string) => {
    if (!id) {
      const normalizeLyrics = (value: string) => value.toLocaleLowerCase().replace(/[\u200b\s\p{P}\p{S}]+/gu, '');
      const incomingLyrics = [data.lyricsHindi, data.lyricsHinglish, data.lyrics].map((value) => normalizeLyrics(value || '')).filter(Boolean);
      const duplicate = songs.find((song) => incomingLyrics.some((lyrics) => [song.lyricsHindi, song.lyricsHinglish, song.lyrics].map((value) => normalizeLyrics(value || '')).includes(lyrics)));
      if (duplicate) {
        const requestedTitle = window.prompt(`These lyrics already exist as “${duplicate.title}”. Enter a new title to save another version, or cancel.`, `${data.title} (Version 2)`);
        if (!requestedTitle?.trim()) return;
        data = { ...data, title: requestedTitle.trim(), allowDuplicate: true } as typeof data & { allowDuplicate: boolean };
      }
    }
    void (id ? sqlDb.updateSong(id, data) : sqlDb.addSong(data)).then(refreshData);
  };

  if (loadError) return <div className="flex min-h-screen items-center justify-center bg-[#fbfaf7] px-6 text-center"><div><h1 className="font-serif text-3xl text-[#29402a]">Song library unavailable</h1><p className="mt-3 max-w-md text-sm text-[#718073]">The app could not reach the SQL database. No browser copy was loaded, so your library cannot drift between browsers.</p><button onClick={() => window.location.reload()} className="mt-6 rounded-xl bg-[#29402a] px-5 py-3 text-sm font-semibold text-white">Try again</button></div></div>;

  return (
    <div className="min-h-screen bg-[#fbfaf7] text-[#1c2a1f] relative overflow-x-hidden font-sans selection:bg-[#dce7d5] selection:text-[#29402a]">
      <div className="fixed inset-0 bg-sacred-pattern pointer-events-none z-0" />
      <TopAppBar currentTab={currentTab} onTabChange={navigateTab} onOpenDrawer={() => { setDrawerOpen(true); openOverlay('drawer'); }} onOpenSettings={openAdminGate} />
      <main className="pt-20 md:pt-24 pb-24 md:pb-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 min-h-[calc(100vh-80px)]">
        <AnimatePresence mode="wait">
          {currentTab === 'home' && <motion.div key="home" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}><HomeView songs={songs} categories={categories} onSelectSong={selectSong} onSelectCategory={browseCategory} onTabChange={navigateTab} onTogglePin={togglePin} /></motion.div>}
          {currentTab === 'search' && <motion.div key="search" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}><SearchView songs={songs} categories={categories} onSelectSong={selectSong} onTogglePin={togglePin} selectedCategory={categoryFilter} onSelectCategory={setCategoryFilter} /></motion.div>}
          {currentTab === 'favorites' && <motion.div key="favorites" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}><FavoritesView songs={songs} onSelectSong={selectSong} onTogglePin={togglePin} onToggleFavorite={toggleFavorite} onTabChange={navigateTab} /></motion.div>}
          {currentTab === 'media' && <motion.div key="media" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}><MediaLibraryView songs={songs} mediaItems={mediaItems} onSelectSong={selectSong} onAddMedia={addMedia} onDeleteMedia={deleteMedia} onRemoveSongVideo={removeSongVideo} onAddLyrics={addLyrics} /></motion.div>}
        </AnimatePresence>
      </main>
      <BottomNavBar currentTab={currentTab} onTabChange={navigateTab} favoritesCount={songs.filter((song) => song.isPinned || song.isFavorite).length} />
      <SideDrawer isOpen={drawerOpen} onClose={() => closeOverlay('drawer')} currentTab={currentTab} onTabChange={navigateTab} onOpenSettings={openAdminGate} />
      <AnimatePresence>{selectedSong && <SongDetailModal song={selectedSong} onClose={() => closeOverlay('song')} onTogglePin={togglePin} onToggleFavorite={toggleFavorite} userSettings={settings} onUpdateSettings={updateSettings} />}</AnimatePresence>
      {adminGateOpen && <AdminGate onClose={() => closeOverlay('adminGate')} onSuccess={() => { const next: AppHistoryState = { app: true, tab: routeRef.current.tab, overlay: 'admin' }; window.history.replaceState(next, '', window.location.href); routeRef.current = next; setAdminGateOpen(false); setAdminOpen(true); }} />}
      {adminOpen && <AdminPanel songs={songs} categories={categories} onClose={() => closeOverlay('admin')} onSaveSong={saveSong} onDeleteSong={(id) => { void sqlDb.deleteSong(id).then(refreshData); }} onAddCategory={(data) => { void sqlDb.addCategory(data).then(refreshData); }} onDeleteCategory={(id) => { void sqlDb.deleteCategory(id).then(refreshData); }} />}
    </div>
  );
}
