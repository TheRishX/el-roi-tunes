import React from 'react';
import { TabType, UserSettings } from '../types';
import { Eye, Menu, Sparkles, User } from 'lucide-react';

interface TopAppBarProps {
  currentTab: TabType;
  onTabChange: (tab: TabType) => void;
  onOpenDrawer: () => void;
  onOpenSettings: () => void;
  userSettings: UserSettings;
  onToggleSeniorMode: () => void;
}

export const TopAppBar: React.FC<TopAppBarProps> = ({
  currentTab,
  onTabChange,
  onOpenDrawer,
  onOpenSettings,
  userSettings,
  onToggleSeniorMode,
}) => {
  return (
    <header
      id="top-app-bar"
      className="fixed top-0 left-0 right-0 z-40 bg-[#fcf9f8]/95 backdrop-blur-md border-b border-[#e5e2e1] shadow-[0_4px_16px_-4px_rgba(85,107,47,0.04)] transition-all duration-300"
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
            className="text-left group cursor-pointer focus:outline-none"
          >
            <h1 className="font-serif text-2xl sm:text-3xl font-semibold tracking-tight text-[#3e5219] group-hover:opacity-90 transition-opacity">
              El Roi Tunes
            </h1>
          </button>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-7">
          <button
            id="nav-link-home"
            onClick={() => onTabChange('home')}
            className={`font-sans text-sm font-medium transition-colors ${
              currentTab === 'home'
                ? 'text-[#3e5219] font-semibold border-b-2 border-[#3e5219] pb-0.5'
                : 'text-[#5d5f5f] hover:text-[#3e5219]'
            }`}
          >
            Home
          </button>
          <button
            id="nav-link-search"
            onClick={() => onTabChange('search')}
            className={`font-sans text-sm font-medium transition-colors ${
              currentTab === 'search'
                ? 'text-[#3e5219] font-semibold border-b-2 border-[#3e5219] pb-0.5'
                : 'text-[#5d5f5f] hover:text-[#3e5219]'
            }`}
          >
            Search
          </button>
          <button
            id="nav-link-favorites"
            onClick={() => onTabChange('favorites')}
            className={`font-sans text-sm font-medium transition-colors ${
              currentTab === 'favorites'
                ? 'text-[#3e5219] font-semibold border-b-2 border-[#3e5219] pb-0.5'
                : 'text-[#5d5f5f] hover:text-[#3e5219]'
            }`}
          >
            Favorites
          </button>
          <button
            id="nav-link-categories"
            onClick={() => onTabChange('categories')}
            className={`font-sans text-sm font-medium transition-colors ${
              currentTab === 'categories'
                ? 'text-[#3e5219] font-semibold border-b-2 border-[#3e5219] pb-0.5'
                : 'text-[#5d5f5f] hover:text-[#3e5219]'
            }`}
          >
            Categories
          </button>
          <button
            id="nav-link-admin"
            onClick={() => onTabChange('admin')}
            className={`font-sans text-sm font-medium transition-colors ${
              currentTab === 'admin'
                ? 'text-[#3e5219] font-semibold border-b-2 border-[#3e5219] pb-0.5'
                : 'text-[#5d5f5f] hover:text-[#3e5219]'
            }`}
          >
            Admin
          </button>
        </nav>

        {/* Right: Senior Mode Quick Switch & User Avatar */}
        <div className="flex items-center gap-2">
          {/* Senior Accessibility Quick Toggle */}
          <button
            id="btn-senior-mode-toggle"
            onClick={onToggleSeniorMode}
            title={userSettings.seniorMode ? 'Senior Mode Active (Large Text)' : 'Enable Senior Friendly Mode (Large Text & Easy Read)'}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all duration-200 border ${
              userSettings.seniorMode
                ? 'bg-[#3e5219] text-white border-[#3e5219] shadow-sm'
                : 'bg-[#3e5219]/10 text-[#3e5219] border-transparent hover:bg-[#3e5219]/20'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">
              {userSettings.seniorMode ? 'Senior Mode: ON' : 'Senior Mode'}
            </span>
            <span className="sm:hidden font-bold">Aa+</span>
          </button>

          {/* User / Settings button */}
          <button
            id="btn-user-settings"
            onClick={onOpenSettings}
            aria-label="User Settings and Accessibility"
            className="w-10 h-10 rounded-full flex items-center justify-center text-[#3e5219] hover:bg-[#3e5219]/10 active:scale-95 transition-all duration-200"
          >
            <User className="w-6 h-6" />
          </button>
        </div>
      </div>
    </header>
  );
};
