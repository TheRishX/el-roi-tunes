import React, { useState, useEffect } from 'react';
import { Category, Song, TabType, UserSettings } from './types';
import { sqlDb } from './services/sqlDb';
import { TopAppBar } from './components/TopAppBar';
import { BottomNavBar } from './components/BottomNavBar';
import { SideDrawer } from './components/SideDrawer';
import { HomeView } from './components/HomeView';
import { SearchView } from './components/SearchView';
import { FavoritesView } from './components/FavoritesView';
import { AdminDashboard } from './components/AdminDashboard';
import { CategoryManagement } from './components/CategoryManagement';
import { SongDetailModal } from './components/SongDetailModal';
import { SongEditorModal } from './components/SongEditorModal';
import { SqlSchemaModal } from './components/SqlSchemaModal';
import { SeniorAccessibilityModal } from './components/SeniorAccessibilityModal';
import { AnimatePresence, motion } from 'motion/react';

export default function App() {
  const [currentTab, setCurrentTab] = useState<TabType>('home');
  const [songs, setSongs] = useState<Song[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [userSettings, setUserSettings] = useState<UserSettings>(sqlDb.getSettings());

  // Modals & Navigation states
  const [selectedSong, setSelectedSong] = useState<Song | null>(null);
  const [songToEdit, setSongToEdit] = useState<Song | null>(null);
  const [showSongEditor, setShowSongEditor] = useState<boolean>(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [showSqlModal, setShowSqlModal] = useState<boolean>(false);
  const [showSettingsModal, setShowSettingsModal] = useState<boolean>(false);
  const [searchCategoryFilter, setSearchCategoryFilter] = useState<string>('All');

  // Load initial data from SQL Database service
  useEffect(() => {
    refreshData();
  }, []);

  const refreshData = () => {
    setSongs(sqlDb.getSongs());
    setCategories(sqlDb.getCategories());
    setUserSettings(sqlDb.getSettings());
  };

  const handleUpdateSettings = (newSettings: Partial<UserSettings>) => {
    const updated = sqlDb.updateSettings(newSettings);
    setUserSettings(updated);
  };

  const handleToggleSeniorMode = () => {
    const next = !userSettings.seniorMode;
    handleUpdateSettings({
      seniorMode: next,
      fontSize: next ? 26 : 18,
      lineSpacing: next ? 'spacious' : 'relaxed',
    });
  };

  const handleSelectSong = (song: Song) => {
    sqlDb.incrementViews(song.id);
    setSelectedSong(song);
  };

  const handleTogglePin = (songId: string) => {
    sqlDb.togglePin(songId);
    refreshData();
    if (selectedSong && selectedSong.id === songId) {
      setSelectedSong(sqlDb.getSongById(songId) || null);
    }
  };

  const handleToggleFavorite = (songId: string) => {
    sqlDb.toggleFavorite(songId);
    refreshData();
    if (selectedSong && selectedSong.id === songId) {
      setSelectedSong(sqlDb.getSongById(songId) || null);
    }
  };

  const handleSelectCategoryFromHome = (categoryId: string) => {
    const cat = categories.find((c) => c.id === categoryId);
    setSearchCategoryFilter(cat ? cat.name : 'All');
    setCurrentTab('search');
  };

  const handleSaveSong = (
    songData: Omit<Song, 'id' | 'createdAt' | 'views'>,
    songId?: string
  ) => {
    if (songId) {
      sqlDb.updateSong(songId, songData);
    } else {
      sqlDb.addSong(songData);
    }
    refreshData();
    setShowSongEditor(false);
    setSongToEdit(null);
  };

  const handleDeleteSong = (songId: string) => {
    sqlDb.deleteSong(songId);
    refreshData();
  };

  const handleUpdateSongStatus = (
    songId: string,
    status: 'Approved' | 'Pending' | 'Draft'
  ) => {
    sqlDb.updateSong(songId, { status });
    refreshData();
  };

  const handleAddCategory = (catData: Omit<Category, 'id' | 'trackCount'>) => {
    sqlDb.addCategory(catData);
    refreshData();
  };

  const handleDeleteCategory = (categoryId: string) => {
    sqlDb.deleteCategory(categoryId);
    refreshData();
  };

  const handleResetDatabase = () => {
    sqlDb.resetToDefault();
    refreshData();
  };

  const favoriteSongsCount = songs.filter((s) => s.isFavorite || s.isPinned).length;

  return (
    <div className="min-h-screen bg-[#fcf9f8] text-[#1c1b1b] relative overflow-x-hidden font-sans selection:bg-[#d2eca2] selection:text-[#131f00]">
      {/* 3D Soft Background Pattern (matching design guidelines) */}
      <div className="fixed inset-0 bg-sacred-pattern opacity-60 pointer-events-none z-0" />
      <div className="fixed inset-0 bg-dot-pattern opacity-40 pointer-events-none z-0" />

      {/* Top App Bar */}
      <TopAppBar
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        onOpenDrawer={() => setIsDrawerOpen(true)}
        onOpenSettings={() => setShowSettingsModal(true)}
        userSettings={userSettings}
        onToggleSeniorMode={handleToggleSeniorMode}
      />

      {/* Main Content Area */}
      <main className="pt-20 md:pt-24 pb-24 md:pb-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 min-h-[calc(100vh-80px)]">
        <AnimatePresence mode="wait">
          {currentTab === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18 }}
            >
              <HomeView
                songs={songs}
                categories={categories}
                onSelectSong={handleSelectSong}
                onSelectCategory={handleSelectCategoryFromHome}
                onTabChange={setCurrentTab}
                onTogglePin={handleTogglePin}
                userSettings={userSettings}
                onOpenAddSong={() => {
                  setSongToEdit(null);
                  setShowSongEditor(true);
                }}
              />
            </motion.div>
          )}

          {currentTab === 'search' && (
            <motion.div
              key="search"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18 }}
            >
              <SearchView
                songs={songs}
                categories={categories}
                onSelectSong={handleSelectSong}
                onTogglePin={handleTogglePin}
                selectedCategory={searchCategoryFilter}
                onSelectCategory={setSearchCategoryFilter}
              />
            </motion.div>
          )}

          {currentTab === 'favorites' && (
            <motion.div
              key="favorites"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18 }}
            >
              <FavoritesView
                songs={songs}
                onSelectSong={handleSelectSong}
                onTogglePin={handleTogglePin}
                onToggleFavorite={handleToggleFavorite}
                onTabChange={setCurrentTab}
              />
            </motion.div>
          )}

          {currentTab === 'categories' && (
            <motion.div
              key="categories"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18 }}
            >
              <CategoryManagement
                categories={categories}
                songs={songs}
                onAddCategory={handleAddCategory}
                onDeleteCategory={handleDeleteCategory}
                onSelectCategory={(catId) => {
                  const cat = categories.find((c) => c.id === catId);
                  setSearchCategoryFilter(cat ? cat.name : 'All');
                  setCurrentTab('search');
                }}
              />
            </motion.div>
          )}

          {currentTab === 'admin' && (
            <motion.div
              key="admin"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18 }}
            >
              <AdminDashboard
                songs={songs}
                categories={categories}
                onOpenAddSong={() => {
                  setSongToEdit(null);
                  setShowSongEditor(true);
                }}
                onEditSong={(song) => {
                  setSongToEdit(song);
                  setShowSongEditor(true);
                }}
                onSelectSong={handleSelectSong}
                onTabChange={setCurrentTab}
                onUpdateSongStatus={handleUpdateSongStatus}
                onDeleteSong={handleDeleteSong}
                onOpenSqlModal={() => setShowSqlModal(true)}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* iOS Floating Bottom Navigation */}
      <BottomNavBar
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        favoritesCount={favoriteSongsCount}
      />

      {/* Side Slide-Over Navigation Drawer */}
      <SideDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        onOpenSqlModal={() => setShowSqlModal(true)}
        onOpenAddSong={() => {
          setSongToEdit(null);
          setShowSongEditor(true);
        }}
        onOpenSettings={() => setShowSettingsModal(true)}
        userSettings={userSettings}
        onToggleSeniorMode={handleToggleSeniorMode}
        onResetDatabase={handleResetDatabase}
      />

      {/* Lyrics & Chords Fullscreen Reader Modal */}
      <AnimatePresence>
        {selectedSong && (
          <SongDetailModal
            song={selectedSong}
            onClose={() => setSelectedSong(null)}
            onTogglePin={handleTogglePin}
            onToggleFavorite={handleToggleFavorite}
            userSettings={userSettings}
            onUpdateSettings={handleUpdateSettings}
          />
        )}
      </AnimatePresence>

      {/* Song Add / Edit Modal */}
      <AnimatePresence>
        {showSongEditor && (
          <SongEditorModal
            songToEdit={songToEdit}
            categories={categories}
            onClose={() => {
              setShowSongEditor(false);
              setSongToEdit(null);
            }}
            onSaveSong={handleSaveSong}
          />
        )}
      </AnimatePresence>

      {/* SQL Relational Schema DDL & Dump Modal */}
      <AnimatePresence>
        {showSqlModal && (
          <SqlSchemaModal onClose={() => setShowSqlModal(false)} />
        )}
      </AnimatePresence>

      {/* Senior Accessibility & Profile Modal */}
      <AnimatePresence>
        {showSettingsModal && (
          <SeniorAccessibilityModal
            onClose={() => setShowSettingsModal(false)}
            userSettings={userSettings}
            onUpdateSettings={handleUpdateSettings}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
