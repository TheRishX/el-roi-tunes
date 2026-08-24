import React, { useState } from 'react';
import { Song, TabType } from '../types';
import { Bookmark, Heart, Play, Printer, Search } from 'lucide-react';
import { motion } from 'motion/react';

interface FavoritesViewProps {
  songs: Song[];
  onSelectSong: (song: Song) => void;
  onTogglePin: (songId: string) => void;
  onToggleFavorite: (songId: string) => void;
  onTabChange: (tab: TabType) => void;
}

export const FavoritesView: React.FC<FavoritesViewProps> = ({
  songs,
  onSelectSong,
  onTogglePin,
  onToggleFavorite,
  onTabChange,
}) => {
  const [activeTab, setActiveTab] = useState<'pinned' | 'favorites'>('pinned');

  const pinnedSongs = songs.filter((s) => s.isPinned);
  const favoriteSongs = songs.filter((s) => s.isFavorite);
  const displaySongs = activeTab === 'pinned' ? pinnedSongs : favoriteSongs;

  const handlePrintSongbook = () => {
    window.print();
  };

  return (
    <div id="favorites-view" className="space-y-6 max-w-4xl mx-auto pb-20">
      {/* Header & Tabs */}
      <section className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-[#1c1b1b] tracking-tight">
            Saved & Pinned Library
          </h2>
          <p className="text-xs sm:text-sm text-[#5d5f5f]">
            Quick offline access to your personal hymnal and favorites
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrintSongbook}
            disabled={displaySongs.length === 0}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white border border-[#e5e2e1] text-[#3e5219] font-semibold text-xs hover:bg-[#f0eded] disabled:opacity-40 transition-colors shadow-xs"
          >
            <Printer className="w-4 h-4" />
            <span>Print Hymnal</span>
          </button>
        </div>
      </section>

      {/* Segmented Filter */}
      <div className="flex bg-[#e3e3de] p-1 rounded-2xl max-w-xs">
        <button
          onClick={() => setActiveTab('pinned')}
          className={`flex-1 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
            activeTab === 'pinned'
              ? 'bg-[#3e5219] text-white shadow-sm'
              : 'text-[#5d5f5f] hover:text-[#1c1b1b]'
          }`}
        >
          <Bookmark className="w-3.5 h-3.5" />
          <span>Pinned ({pinnedSongs.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('favorites')}
          className={`flex-1 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
            activeTab === 'favorites'
              ? 'bg-[#3e5219] text-white shadow-sm'
              : 'text-[#5d5f5f] hover:text-[#1c1b1b]'
          }`}
        >
          <Heart className="w-3.5 h-3.5" />
          <span>Favorites ({favoriteSongs.length})</span>
        </button>
      </div>

      {/* Grid of Saved Songs */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {displaySongs.map((song) => (
          <motion.div
            key={song.id}
            layout
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={() => onSelectSong(song)}
            className="soft-card bg-white rounded-2xl p-4 flex items-center gap-4 hover:-translate-y-0.5 transition-all cursor-pointer group border border-[#e5e7eb]"
          >
            <div className="w-16 h-16 rounded-xl bg-[#f0eded] shrink-0 overflow-hidden relative shadow-sm">
              <img
                src={song.coverImage}
                alt={song.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
              />
              <div className="absolute inset-0 bg-[#3e5219]/25 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                <Play className="w-5 h-5 text-white fill-white" />
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="font-serif text-lg font-semibold text-[#1c1b1b] truncate group-hover:text-[#3e5219] transition-colors">
                {song.title}
              </h3>
              <p className="text-xs text-[#5d5f5f] truncate mt-0.5">{song.artist}</p>
              <div className="flex items-center gap-2 mt-1.5">
                <span className="px-2 py-0.5 rounded bg-[#3e5219]/10 text-[#3e5219] text-[10px] font-bold uppercase tracking-wider">
                  {song.language}
                </span>
                <span className="text-[11px] text-[#75796b] font-mono">
                  Key: {song.defaultKey}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onTogglePin(song.id);
                }}
                title={song.isPinned ? 'Unpin' : 'Pin'}
                className="p-2 text-[#75796b] hover:text-[#3e5219] transition-colors"
              >
                <Bookmark
                  className={`w-4 h-4 ${song.isPinned ? 'fill-[#3e5219] text-[#3e5219]' : ''}`}
                />
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleFavorite(song.id);
                }}
                title={song.isFavorite ? 'Remove favorite' : 'Add favorite'}
                className="p-2 text-[#75796b] hover:text-[#ba1a1a] transition-colors"
              >
                <Heart
                  className={`w-4 h-4 ${song.isFavorite ? 'fill-[#ba1a1a] text-[#ba1a1a]' : ''}`}
                />
              </button>
            </div>
          </motion.div>
        ))}
      </section>

      {/* Empty State */}
      {displaySongs.length === 0 && (
        <div className="py-16 text-center space-y-3 bg-white rounded-3xl border border-[#e5e7eb] p-8">
          <div className="w-14 h-14 rounded-full bg-[#3e5219]/10 text-[#3e5219] flex items-center justify-center mx-auto">
            {activeTab === 'pinned' ? <Bookmark className="w-6 h-6" /> : <Heart className="w-6 h-6" />}
          </div>
          <h3 className="font-serif text-xl font-bold text-[#1c1b1b]">
            No {activeTab} hymns yet
          </h3>
          <p className="text-sm text-[#5d5f5f] max-w-sm mx-auto">
            Tap the bookmark or heart icon on any hymn to pin it for quick offline reading.
          </p>
          <button
            onClick={() => onTabChange('search')}
            className="mt-2 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#3e5219] text-white font-semibold text-xs hover:bg-[#2c3c0f] transition-all"
          >
            <Search className="w-4 h-4" />
            <span>Browse Hymn Library</span>
          </button>
        </div>
      )}
    </div>
  );
};
