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

  useEffect(() => {
    setSongs(sqlDb.getSongs());
    setCategories(sqlDb.getCategories());
  }, []);

  const refreshSongs = () => setSongs(sqlDb.getSongs());
  const updateSettings = (changes: Partial<UserSettings>) => setSettings(sqlDb.updateSettings(changes));
  const refreshData = () => { setSongs(sqlDb.getSongs()); setCategories(sqlDb.getCategories()); };
  const selectSong = (song: Song) => {
    setSelectedSong(song);
  };
  const togglePin = (id: string) => {
    sqlDb.togglePin(id); refreshSongs();
    if (selectedSong?.id === id) setSelectedSong(sqlDb.getSongById(id) || null);
  };
  const toggleFavorite = (id: string) => {
    sqlDb.toggleFavorite(id); refreshSongs();
    if (selectedSong?.id === id) setSelectedSong(sqlDb.getSongById(id) || null);
  };
  const browseCategory = (id: string) => {
    const category = categories.find((item) => item.id === id);
    setCategoryFilter(category?.name || 'All');
    setCurrentTab('search');
  };
  const openAdminGate = () => setAdminGateOpen(true);
  const saveSong = (data: Omit<Song, 'id' | 'createdAt' | 'views'>, id?: string) => { if (id) sqlDb.updateSong(id, data); else sqlDb.addSong(data); refreshData(); };

  return (
    <div className="min-h-screen bg-[#fbfaf7] text-[#1c2a1f] relative overflow-x-hidden font-sans selection:bg-[#dce7d5] selection:text-[#29402a]">
      <div className="fixed inset-0 bg-sacred-pattern pointer-events-none z-0" />
      <TopAppBar currentTab={currentTab} onTabChange={setCurrentTab} onOpenDrawer={() => setDrawerOpen(true)} onOpenSettings={openAdminGate} />
      <main className="pt-20 md:pt-24 pb-24 md:pb-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 min-h-[calc(100vh-80px)]">
        <AnimatePresence mode="wait">
          {currentTab === 'home' && <motion.div key="home" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}><HomeView songs={songs} categories={categories} onSelectSong={selectSong} onSelectCategory={browseCategory} onTabChange={setCurrentTab} onTogglePin={togglePin} /></motion.div>}
          {currentTab === 'search' && <motion.div key="search" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}><SearchView songs={songs} categories={categories} onSelectSong={selectSong} onTogglePin={togglePin} selectedCategory={categoryFilter} onSelectCategory={setCategoryFilter} /></motion.div>}
          {currentTab === 'favorites' && <motion.div key="favorites" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}><FavoritesView songs={songs} onSelectSong={selectSong} onTogglePin={togglePin} onToggleFavorite={toggleFavorite} onTabChange={setCurrentTab} /></motion.div>}
        </AnimatePresence>
      </main>
      <BottomNavBar currentTab={currentTab} onTabChange={setCurrentTab} favoritesCount={songs.filter((song) => song.isPinned || song.isFavorite).length} />
      <SideDrawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} currentTab={currentTab} onTabChange={setCurrentTab} onOpenSettings={openAdminGate} />
      <AnimatePresence>{selectedSong && <SongDetailModal song={selectedSong} onClose={() => setSelectedSong(null)} onTogglePin={togglePin} onToggleFavorite={toggleFavorite} userSettings={settings} onUpdateSettings={updateSettings} />}</AnimatePresence>
      {adminGateOpen && <AdminGate onClose={() => setAdminGateOpen(false)} onSuccess={() => { setAdminGateOpen(false); setAdminOpen(true); }} />}
      {adminOpen && <AdminPanel songs={songs} categories={categories} onClose={() => setAdminOpen(false)} onSaveSong={saveSong} onDeleteSong={(id) => { sqlDb.deleteSong(id); refreshData(); }} onAddCategory={(data) => { sqlDb.addCategory(data); refreshData(); }} onDeleteCategory={(id) => { sqlDb.deleteCategory(id); refreshData(); }} />}
    </div>
  );
}
