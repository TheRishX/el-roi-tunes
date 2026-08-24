import React from 'react';
import { TabType, UserSettings } from '../types';
import {
  BookOpen,
  Database,
  Eye,
  FileCode,
  FolderTree,
  Heart,
  Home,
  Music,
  PlusCircle,
  RefreshCw,
  Search,
  Settings,
  ShieldCheck,
  Volume2,
  X,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface SideDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentTab: TabType;
  onTabChange: (tab: TabType) => void;
  onOpenSqlModal: () => void;
  onOpenAddSong: () => void;
  onOpenSettings: () => void;
  userSettings: UserSettings;
  onToggleSeniorMode: () => void;
  onResetDatabase: () => void;
}

export const SideDrawer: React.FC<SideDrawerProps> = ({
  isOpen,
  onClose,
  currentTab,
  onTabChange,
  onOpenSqlModal,
  onOpenAddSong,
  onOpenSettings,
  userSettings,
  onToggleSeniorMode,
  onResetDatabase,
}) => {
  const handleNav = (tab: TabType) => {
    onTabChange(tab);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
          />

          {/* Drawer Sheet */}
          <motion.aside
            id="side-drawer"
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="fixed top-0 bottom-0 left-0 z-50 w-80 max-w-[85vw] bg-white border-r border-[#e5e2e1] shadow-2xl flex flex-col justify-between overflow-y-auto hide-scrollbar"
          >
            {/* Header */}
            <div className="p-6 border-b border-[#e5e2e1]/80">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-[#3e5219] flex items-center justify-center text-white shadow-md">
                    <Music className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="font-serif text-xl font-bold text-[#3e5219] leading-tight">
                      El Roi Tunes
                    </h2>
                    <p className="text-xs text-[#5d5f5f]">Sacred Hymns & Melodies</p>
                  </div>
                </div>
                <button
                  id="btn-close-drawer"
                  onClick={onClose}
                  className="p-2 rounded-full text-[#5d5f5f] hover:bg-[#3e5219]/10 hover:text-[#3e5219] transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Senior Accessibility Quick Box */}
              <div className="bg-[#3e5219]/5 border border-[#3e5219]/20 rounded-xl p-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4 text-[#3e5219]" />
                  <div>
                    <p className="text-xs font-semibold text-[#1c1b1b]">Senior Large Text</p>
                    <p className="text-[11px] text-[#5d5f5f]">Extra clear typography</p>
                  </div>
                </div>
                <button
                  id="btn-drawer-senior-toggle"
                  onClick={onToggleSeniorMode}
                  className={`w-11 h-6 rounded-full transition-colors relative flex items-center p-0.5 ${
                    userSettings.seniorMode ? 'bg-[#3e5219]' : 'bg-[#e5e2e1]'
                  }`}
                >
                  <motion.div
                    animate={{ x: userSettings.seniorMode ? 20 : 0 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    className="w-5 h-5 rounded-full bg-white shadow-sm"
                  />
                </button>
              </div>
            </div>

            {/* Navigation Menu */}
            <div className="p-4 space-y-1 flex-1">
              <p className="px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-[#75796b]">
                Navigation
              </p>

              <button
                id="drawer-link-home"
                onClick={() => handleNav('home')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-all ${
                  currentTab === 'home'
                    ? 'bg-[#3e5219] text-white shadow-sm'
                    : 'text-[#1c1b1b] hover:bg-[#3e5219]/10 hover:text-[#3e5219]'
                }`}
              >
                <Home className="w-4 h-4" />
                <span>Home Library</span>
              </button>

              <button
                id="drawer-link-search"
                onClick={() => handleNav('search')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-all ${
                  currentTab === 'search'
                    ? 'bg-[#3e5219] text-white shadow-sm'
                    : 'text-[#1c1b1b] hover:bg-[#3e5219]/10 hover:text-[#3e5219]'
                }`}
              >
                <Search className="w-4 h-4" />
                <span>Search & Filters</span>
              </button>

              <button
                id="drawer-link-favorites"
                onClick={() => handleNav('favorites')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-all ${
                  currentTab === 'favorites'
                    ? 'bg-[#3e5219] text-white shadow-sm'
                    : 'text-[#1c1b1b] hover:bg-[#3e5219]/10 hover:text-[#3e5219]'
                }`}
              >
                <Heart className="w-4 h-4" />
                <span>Pinned & Favorites</span>
              </button>

              <button
                id="drawer-link-categories"
                onClick={() => handleNav('categories')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-all ${
                  currentTab === 'categories'
                    ? 'bg-[#3e5219] text-white shadow-sm'
                    : 'text-[#1c1b1b] hover:bg-[#3e5219]/10 hover:text-[#3e5219]'
                }`}
              >
                <FolderTree className="w-4 h-4" />
                <span>Categories & Taxonomy</span>
              </button>

              <button
                id="drawer-link-admin"
                onClick={() => handleNav('admin')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-all ${
                  currentTab === 'admin'
                    ? 'bg-[#3e5219] text-white shadow-sm'
                    : 'text-[#1c1b1b] hover:bg-[#3e5219]/10 hover:text-[#3e5219]'
                }`}
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Admin Ecosystem</span>
              </button>

              <div className="pt-4">
                <p className="px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-[#75796b]">
                  Database & Tools
                </p>

                <button
                  id="drawer-btn-add-song"
                  onClick={() => {
                    onClose();
                    onOpenAddSong();
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm text-[#1c1b1b] hover:bg-[#3e5219]/10 hover:text-[#3e5219] transition-all"
                >
                  <PlusCircle className="w-4 h-4 text-[#3e5219]" />
                  <span>+ Add New Song</span>
                </button>

                <button
                  id="drawer-btn-sql-schema"
                  onClick={() => {
                    onClose();
                    onOpenSqlModal();
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm text-[#1c1b1b] hover:bg-[#3e5219]/10 hover:text-[#3e5219] transition-all"
                >
                  <Database className="w-4 h-4 text-[#3e5219]" />
                  <span>SQL Database DDL & Schema</span>
                </button>

                <button
                  id="drawer-btn-settings"
                  onClick={() => {
                    onClose();
                    onOpenSettings();
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm text-[#1c1b1b] hover:bg-[#3e5219]/10 hover:text-[#3e5219] transition-all"
                >
                  <Settings className="w-4 h-4 text-[#5d5f5f]" />
                  <span>Accessibility & Typography</span>
                </button>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-[#e5e2e1]/80 space-y-2 bg-[#f6f3f2]/60">
              <button
                id="drawer-btn-reset-db"
                onClick={() => {
                  if (confirm('Reset database to original default hymns & songs?')) {
                    onResetDatabase();
                    onClose();
                  }
                }}
                className="w-full flex items-center justify-center gap-2 py-2 px-3 text-xs text-[#5d5f5f] hover:text-[#ba1a1a] hover:bg-white rounded-lg transition-colors border border-transparent hover:border-[#e5e2e1]"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reset Seed Database</span>
              </button>

              <div className="text-center pt-1">
                <p className="text-[11px] text-[#75796b]">
                  El Roi Tunes v2.4 • Sacred Minimalist
                </p>
                <p className="text-[10px] text-[#75796b]/80">
                  White & Olive Green UI • SQL Ready
                </p>
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};
