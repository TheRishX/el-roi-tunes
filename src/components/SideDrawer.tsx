import React from 'react';
import { Bookmark, Home, Search, Settings, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { TabType } from '../types';

interface SideDrawerProps {
  isOpen: boolean; onClose: () => void; currentTab: TabType; onTabChange: (tab: TabType) => void;
  onOpenSettings: () => void;
}

export const SideDrawer: React.FC<SideDrawerProps> = ({ isOpen, onClose, currentTab, onTabChange, onOpenSettings }) => {
  const navigate = (tab: TabType) => { onTabChange(tab); onClose(); };
  const links = [
    { id: 'home' as TabType, label: 'Home', icon: <Home className="w-5 h-5" /> },
    { id: 'search' as TabType, label: 'Find a song', icon: <Search className="w-5 h-5" /> },
    { id: 'favorites' as TabType, label: 'Saved songs', icon: <Bookmark className="w-5 h-5" /> },
  ];
  return <AnimatePresence>{isOpen && <><motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 z-50 bg-[#1d2c20]/35 backdrop-blur-sm" /><motion.aside initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }} transition={{ type: 'spring', damping: 28, stiffness: 300 }} className="fixed top-0 bottom-0 left-0 z-50 w-80 max-w-[88vw] bg-[#fbfaf7] shadow-2xl flex flex-col">
    <div className="p-6 border-b border-[#e8e5dc]"><div className="flex items-center justify-between"><div><p className="font-serif text-2xl text-[#29402a]">El Roi <span className="text-[#a26b3d]">Tunes</span></p><p className="text-sm text-[#7c8479] mt-1">Your Christian songbook</p></div><button onClick={onClose} aria-label="Close menu" className="p-2 rounded-full hover:bg-[#e8eee1]"><X className="w-5 h-5" /></button></div></div>
    <div className="p-4 space-y-1 flex-1">{links.map((link) => <button key={link.id} onClick={() => navigate(link.id)} className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl text-left font-medium ${currentTab === link.id ? 'bg-[#e8eee1] text-[#29402a]' : 'text-[#566158] hover:bg-[#f1f0e9]'}`}>{link.icon}<span>{link.label}</span></button>)}<div className="pt-5 mt-4 border-t border-[#e8e5dc]"><button onClick={() => { onClose(); onOpenSettings(); }} className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-left font-medium text-[#566158] hover:bg-[#f1f0e9]"><Settings className="w-5 h-5" /><span>Admin panel</span></button></div></div>
    <div className="p-6 border-t border-[#e8e5dc] text-sm text-[#7c8479]">No account needed. Your saved songs stay on this device.</div>
  </motion.aside></>}</AnimatePresence>;
};
