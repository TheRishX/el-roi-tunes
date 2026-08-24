import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Category, Song, TabType, UserSettings } from './types';
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
import { MediaLibraryView } from './components/MediaLibraryView';

export default function App() {
  const [currentTab, setCurrentTab] = useState<TabType>('home');
  const [songs, setSongs] = useState<Song[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [settings, setSettings] = useState<UserSettings>(sqlDb.getSettings());
  const [selectedSong, setSelectedSong] = useState<Song | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [adminGateOpen, setAdminGateOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [loadError, setLoadError] = useState('');

  useEffect(() => { sqlDb.ready.then(() => { setSongs(sqlDb.getSongs()); setCategories(sqlDb.getCategories()); setSettings(sqlDb.getSettings()); }).catch((error: Error) => setLoadError(error.message || 'Unable to connect to the song database.')); }, []);

  const refreshSongs = () => setSongs(sqlDb.getSongs());
  const updateSettings = (changes: Partial<UserSettings>) => { void sqlDb.updateSettings(changes).then(setSettings); };
  const refreshData = () => { setSongs(sqlDb.getSongs()); setCategories(sqlDb.getCategories()); };
  const selectSong = (song: Song) => {
    setSelectedSong(song);
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
    setCurrentTab('search');
  };
  const openAdminGate = () => setAdminGateOpen(true);
  const saveSong = (data: Omit<Song, 'id' | 'createdAt' | 'views'>, id?: string) => { void (id ? sqlDb.updateSong(id, data) : sqlDb.addSong(data)).then(refreshData); };

  if (loadError) return <div className="flex min-h-screen items-center justify-center bg-[#fbfaf7] px-6 text-center"><div><h1 className="font-serif text-3xl text-[#29402a]">Song library unavailable</h1><p className="mt-3 max-w-md text-sm text-[#718073]">The app could not reach the SQL database. No browser copy was loaded, so your library cannot drift between browsers.</p><button onClick={() => window.location.reload()} className="mt-6 rounded-xl bg-[#29402a] px-5 py-3 text-sm font-semibold text-white">Try again</button></div></div>;

  return (
    <div className="min-h-screen bg-[#fbfaf7] text-[#1c2a1f] relative overflow-x-hidden font-sans selection:bg-[#dce7d5] selection:text-[#29402a]">
      <div className="fixed inset-0 bg-sacred-pattern pointer-events-none z-0" />
      <TopAppBar currentTab={currentTab} onTabChange={setCurrentTab} onOpenDrawer={() => setDrawerOpen(true)} onOpenSettings={openAdminGate} />
      <main className="pt-20 md:pt-24 pb-24 md:pb-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 min-h-[calc(100vh-80px)]">
        <AnimatePresence mode="wait">
          {currentTab === 'home' && <motion.div key="home" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}><HomeView songs={songs} categories={categories} onSelectSong={selectSong} onSelectCategory={browseCategory} onTabChange={setCurrentTab} onTogglePin={togglePin} /></motion.div>}
          {currentTab === 'search' && <motion.div key="search" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}><SearchView songs={songs} categories={categories} onSelectSong={selectSong} onTogglePin={togglePin} selectedCategory={categoryFilter} onSelectCategory={setCategoryFilter} /></motion.div>}
          {currentTab === 'favorites' && <motion.div key="favorites" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}><FavoritesView songs={songs} onSelectSong={selectSong} onTogglePin={togglePin} onToggleFavorite={toggleFavorite} onTabChange={setCurrentTab} /></motion.div>}
          {currentTab === 'media' && <motion.div key="media" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}><MediaLibraryView songs={songs} onSelectSong={selectSong} /></motion.div>}
        </AnimatePresence>
      </main>
      <BottomNavBar currentTab={currentTab} onTabChange={setCurrentTab} favoritesCount={songs.filter((song) => song.isPinned || song.isFavorite).length} />
      <SideDrawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} currentTab={currentTab} onTabChange={setCurrentTab} onOpenSettings={openAdminGate} />
      <AnimatePresence>{selectedSong && <SongDetailModal song={selectedSong} onClose={() => setSelectedSong(null)} onTogglePin={togglePin} onToggleFavorite={toggleFavorite} userSettings={settings} onUpdateSettings={updateSettings} />}</AnimatePresence>
      {adminGateOpen && <AdminGate onClose={() => setAdminGateOpen(false)} onSuccess={() => { setAdminGateOpen(false); setAdminOpen(true); }} />}
      {adminOpen && <AdminPanel songs={songs} categories={categories} onClose={() => setAdminOpen(false)} onSaveSong={saveSong} onDeleteSong={(id) => { void sqlDb.deleteSong(id).then(refreshData); }} onAddCategory={(data) => { void sqlDb.addCategory(data).then(refreshData); }} onDeleteCategory={(id) => { void sqlDb.deleteCategory(id).then(refreshData); }} />}
    </div>
  );
}
