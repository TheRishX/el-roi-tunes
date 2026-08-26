import React from 'react';
import { TabType } from '../types';
import { Menu, Settings } from 'lucide-react';

interface TopAppBarProps {
  currentTab: TabType;
  onTabChange: (tab: TabType) => void;
  onOpenDrawer: () => void;
  onOpenSettings: () => void;
}

export const TopAppBar: React.FC<TopAppBarProps> = ({
  currentTab,
  onTabChange,
  onOpenDrawer,
  onOpenSettings,
}) => {
  return (
    <header
      id="top-app-bar"
      className="fixed top-0 left-0 right-0 z-40 bg-[#fbfaf7]/92 backdrop-blur-xl border-b border-[#e8e5dc] transition-all duration-300"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Left: Drawer Toggle */}
        <div className="flex items-center gap-3">
          <button
            id="btn-open-drawer"
            onClick={onOpenDrawer}
            aria-label="Open Navigation Menu"
            className="w-10 h-10 rounded-full flex items-center justify-center text-[#3e5219] hover:bg-[#3e5219]/10 active:scale-95 transition-all duration-200"
          >
            <Menu className="w-6 h-6" />
          </button>

          {/* Brand Title */}
          <button
            id="brand-logo-btn"
            onClick={() => onTabChange('home')}
            className="text-left group cursor-pointer focus:outline-none flex items-center gap-2.5"
          >
            <img src="/app-icon.png?v=3" alt="" aria-hidden="true" className="w-9 h-9 object-contain" />
            <h1 className="font-serif text-[22px] sm:text-2xl font-semibold tracking-tight text-[#29402a] group-hover:opacity-90 transition-opacity">
              El Roi <span className="text-[#a26b3d]">Tunes</span>
            </h1>
          </button>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-2 bg-[#f1f0e9] rounded-full p-1">
          <button
            id="nav-link-home"
            onClick={() => onTabChange('home')}
            className={`font-sans text-sm font-medium px-4 py-2 rounded-full transition-colors ${
              currentTab === 'home'
                ? 'text-[#29402a] font-semibold bg-white shadow-sm'
                : 'text-[#687166] hover:text-[#29402a]'
            }`}
          >
            Home
          </button>
          <button
            id="nav-link-search"
            onClick={() => onTabChange('search')}
            className={`font-sans text-sm font-medium px-4 py-2 rounded-full transition-colors ${
              currentTab === 'search'
                ? 'text-[#29402a] font-semibold bg-white shadow-sm'
                : 'text-[#687166] hover:text-[#29402a]'
            }`}
          >
            Search
          </button>
          <button
            id="nav-link-favorites"
            onClick={() => onTabChange('favorites')}
            className={`font-sans text-sm font-medium px-4 py-2 rounded-full transition-colors ${
              currentTab === 'favorites'
                ? 'text-[#29402a] font-semibold bg-white shadow-sm'
                : 'text-[#687166] hover:text-[#29402a]'
            }`}
          >
            Favorites
          </button>
          <button
            id="nav-link-media"
            onClick={() => onTabChange('media')}
            className={`font-sans text-sm font-medium px-4 py-2 rounded-full transition-colors ${
              currentTab === 'media'
                ? 'text-[#29402a] font-semibold bg-white shadow-sm'
                : 'text-[#687166] hover:text-[#29402a]'
            }`}
          >
            Watch & listen
          </button>
        </nav>

        {/* Private admin entry */}
        <div className="flex items-center gap-2">
          <button
            id="btn-user-settings"
            onClick={onOpenSettings}
            aria-label="Open admin panel"
            className="w-10 h-10 rounded-full flex items-center justify-center text-[#3e5219] hover:bg-[#3e5219]/10 active:scale-95 transition-all duration-200"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
};
