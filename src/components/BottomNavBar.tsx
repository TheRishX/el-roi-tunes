import React from 'react';
import { TabType } from '../types';
import { Bookmark, Home, Search } from 'lucide-react';
import { motion } from 'motion/react';

interface BottomNavBarProps {
  currentTab: TabType;
  onTabChange: (tab: TabType) => void;
  favoritesCount?: number;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({
  currentTab,
  onTabChange,
  favoritesCount = 0,
}) => {
  const tabs: { id: TabType; label: string; icon: React.ReactNode; badge?: number }[] = [
    { id: 'home', label: 'Home', icon: <Home className="w-5 h-5" /> },
    { id: 'search', label: 'Search', icon: <Search className="w-5 h-5" /> },
    {
      id: 'favorites',
      label: 'Favorites',
      icon: <Bookmark className="w-5 h-5" />,
      badge: favoritesCount > 0 ? favoritesCount : undefined,
    },
  ];

  return (
    <nav
      id="bottom-nav-bar"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#fcf9f8]/95 backdrop-blur-xl border-t border-[#e5e2e1] shadow-[0_-4px_20px_rgba(85,107,47,0.06)] pb-safe"
    >
      <div className="flex items-center justify-around px-2 py-2">
        {tabs.map((tab) => {
          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              id={`tab-btn-${tab.id}`}
              onClick={() => onTabChange(tab.id)}
              className={`relative flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all duration-200 active:scale-90 ${
                isActive
                  ? 'text-[#3e5219]'
                  : 'text-[#5d5f5f] hover:text-[#3e5219]'
              }`}
            >
              {/* Active Pill Highlight */}
              {isActive && (
                <motion.div
                  layoutId="activeTabPill"
                  transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                  className="absolute inset-0 bg-[#3e5219]/10 rounded-2xl"
                />
              )}

              <div className="relative z-10 flex flex-col items-center">
                <div className="relative">
                  {tab.icon}
                  {tab.badge !== undefined && (
                    <span className="absolute -top-1 -right-2 bg-[#3e5219] text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                      {tab.badge}
                    </span>
                  )}
                </div>
                <span
                  className={`text-[11px] mt-0.5 tracking-tight ${
                    isActive ? 'font-semibold' : 'font-normal'
                  }`}
                >
                  {tab.label}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
