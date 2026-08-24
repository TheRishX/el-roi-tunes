import React, { useState } from 'react';
import { Category, Song, TabType, UserSettings } from '../types';
import {
  Bookmark,
  ChevronRight,
  Headphones,
  Music,
  Play,
  Plus,
  Search,
  Sparkles,
  Volume2,
} from 'lucide-react';
import { motion } from 'motion/react';
import { speechReader } from '../utils/chordUtils';

interface HomeViewProps {
  songs: Song[];
  categories: Category[];
  onSelectSong: (song: Song) => void;
  onSelectCategory: (categoryId: string) => void;
  onTabChange: (tab: TabType) => void;
  onTogglePin: (songId: string) => void;
  userSettings: UserSettings;
  onOpenAddSong: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  songs,
  categories,
  onSelectSong,
  onSelectCategory,
  onTabChange,
  onTogglePin,
  userSettings,
  onOpenAddSong,
}) => {
  const [searchInput, setSearchInput] = useState('');
  const [isReadingAloud, setIsReadingAloud] = useState(false);

  const pinnedSongs = songs.filter((s) => s.isPinned && s.status === 'Approved');
  const recentSongs = songs.filter((s) => s.status === 'Approved').slice(0, 6);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onTabChange('search');
  };

  const handleReadDailyHymn = (song: Song) => {
    if (isReadingAloud) {
      speechReader.stop();
      setIsReadingAloud(false);
    } else {
      setIsReadingAloud(true);
      speechReader.speakLyrics(
        `Reading ${song.title} by ${song.artist}. ${song.lyrics.slice(0, 300)}`,
        () => setIsReadingAloud(false)
      );
    }
  };

  return (
    <div id="home-view" className="space-y-12 pb-16">
      {/* Search Bar Section */}
      <section className="mt-2">
        <form onSubmit={handleSearchSubmit} className="relative max-w-2xl mx-auto">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-[#75796b]">
            <Search className="w-5 h-5" />
          </div>
          <input
            id="home-search-input"
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onFocus={() => onTabChange('search')}
            placeholder="Search for hymns, artists, or categories..."
            className="w-full pl-12 pr-4 py-4 bg-[#e3e3de]/80 focus:bg-white text-base text-[#1a1c19] placeholder:text-[#75796b] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3e5219] border border-[#e5e2e1] shadow-[0_12px_24px_-4px_rgba(85,107,47,0.03)] transition-all duration-200"
          />
        </form>
      </section>

      {/* Senior Mode Banner Alert (if active) */}
      {userSettings.seniorMode && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#3e5219]/10 border-2 border-[#3e5219] rounded-2xl p-4 sm:p-5 flex items-center justify-between shadow-sm"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#3e5219] text-white flex items-center justify-center shrink-0">
              <Headphones className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold text-[#1c1b1b]">
                Senior Reader Mode Active
              </h3>
              <p className="text-sm text-[#45483c]">
                Large high-contrast text and simplified one-touch audio lyrics are enabled.
              </p>
            </div>
          </div>
          <button
            onClick={() => onSelectSong(pinnedSongs[0] || songs[0])}
            className="bg-[#3e5219] text-white px-4 py-2.5 rounded-xl font-bold text-sm hover:opacity-90 active:scale-95 transition-all shrink-0"
          >
            Read Top Hymn
          </button>
        </motion.div>
      )}

      {/* Pinned Songs Carousel */}
      <section id="section-pinned-songs">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <div>
            <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-[#1c1b1b] tracking-tight">
              Pinned Songs
            </h2>
            <p className="text-xs sm:text-sm text-[#5d5f5f]">
              Hand-picked sacred hymns and featured melodies
            </p>
          </div>
          <button
            onClick={() => onTabChange('favorites')}
            className="text-xs sm:text-sm font-semibold text-[#3e5219] hover:underline flex items-center gap-1"
          >
            View All ({pinnedSongs.length})
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="flex overflow-x-auto gap-5 hide-scrollbar snap-x pb-4 -mx-4 px-4 sm:mx-0 sm:px-0">
          {pinnedSongs.map((song) => (
            <motion.article
              key={song.id}
              whileHover={{ y: -4 }}
              transition={{ duration: 0.2 }}
              className="flex-none w-[280px] sm:w-[300px] bg-white rounded-2xl soft-card snap-start overflow-hidden border border-[#e5e7eb] group cursor-pointer"
              onClick={() => onSelectSong(song)}
            >
              {/* Cover Image */}
              <div
                className="w-full h-44 bg-cover bg-center relative transition-transform duration-500 group-hover:scale-105"
                style={{ backgroundImage: `url('${song.coverImage}')` }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                <div className="absolute top-3 left-3">
                  <span className="bg-white/90 backdrop-blur-md text-[#3e5219] text-[11px] font-bold px-2.5 py-1 rounded-full shadow-sm">
                    Key: {song.defaultKey}
                  </span>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onTogglePin(song.id);
                  }}
                  aria-label="Toggle pin"
                  className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-[#3e5219] hover:bg-white shadow-sm transition-transform active:scale-90"
                >
                  <Bookmark className="w-4 h-4 fill-[#3e5219]" />
                </button>
              </div>

              {/* Card Body */}
              <div className="p-4 flex items-center justify-between">
                <div className="min-w-0 flex-1 pr-2">
                  <h3 className="font-serif text-lg font-semibold text-[#1c1b1b] truncate group-hover:text-[#3e5219] transition-colors">
                    {song.title}
                  </h3>
                  <p className="text-xs text-[#5d5f5f] truncate mt-0.5">{song.artist}</p>
                </div>
                <button
                  id={`btn-play-pinned-${song.id}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectSong(song);
                  }}
                  aria-label={`Play ${song.title}`}
                  className="w-11 h-11 bg-[#3e5219] rounded-full flex items-center justify-center text-white shadow-[3px_3px_8px_rgba(85,107,47,0.25)] hover:bg-[#2c3c0f] active:scale-90 transition-all shrink-0"
                >
                  <Play className="w-5 h-5 fill-white ml-0.5" />
                </button>
              </div>
            </motion.article>
          ))}
        </div>
      </section>

      {/* Explore Categories Bento Grid */}
      <section id="section-categories">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <div>
            <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-[#1c1b1b] tracking-tight">
              Explore Categories
            </h2>
            <p className="text-xs sm:text-sm text-[#5d5f5f]">
              Browse collections classified for worship and reflection
            </p>
          </div>
          <button
            onClick={() => onTabChange('categories')}
            className="text-xs sm:text-sm font-semibold text-[#3e5219] hover:underline flex items-center gap-1"
          >
            Manage
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Worship: Large Bento Card */}
          {categories.slice(0, 1).map((cat) => (
            <div
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className="md:col-span-2 relative h-52 sm:h-64 rounded-2xl overflow-hidden group cursor-pointer soft-card border border-[#e5e7eb]"
            >
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                style={{ backgroundImage: `url('${cat.coverImage}')` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-transparent" />
              <div className="absolute bottom-5 left-6 right-6 flex items-end justify-between">
                <div>
                  <span className="inline-block bg-[#3e5219]/90 backdrop-blur-md text-white text-xs font-semibold px-3 py-1 rounded-full mb-2">
                    Popular • {cat.trackCount} Tracks
                  </span>
                  <h3 className="font-serif text-2xl sm:text-3xl text-white font-bold">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-white/80 line-clamp-1 max-w-md mt-1">
                    {cat.description}
                  </p>
                </div>
                <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md text-white flex items-center justify-center group-hover:bg-[#3e5219] transition-colors">
                  <ChevronRight className="w-5 h-5" />
                </div>
              </div>
            </div>
          ))}

          {/* Other Categories */}
          {categories.slice(1, 4).map((cat) => (
            <div
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className="relative h-52 sm:h-64 rounded-2xl overflow-hidden group cursor-pointer soft-card border border-[#e5e7eb]"
            >
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                style={{ backgroundImage: `url('${cat.coverImage}')` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-transparent" />
              <div className="absolute bottom-5 left-6 right-6 flex items-end justify-between">
                <div>
                  <span className="inline-block bg-white/20 backdrop-blur-md text-white text-[11px] font-medium px-2.5 py-0.5 rounded-full mb-1.5">
                    {cat.trackCount} Tracks
                  </span>
                  <h3 className="font-serif text-2xl text-white font-bold">{cat.name}</h3>
                </div>
                <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md text-white flex items-center justify-center group-hover:bg-[#3e5219] transition-colors">
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Daily Devotional / Voice Hymn Card (Senior Friendly) */}
      <section className="bg-white rounded-2xl p-6 soft-card border border-[#e5e7eb] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#3e5219]/10 text-[#3e5219] flex items-center justify-center shrink-0">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#3e5219]">
              Daily Hymn Meditation
            </span>
            <h3 className="font-serif text-xl font-bold text-[#1c1b1b]">
              "{songs[0]?.title}"
            </h3>
            <p className="text-xs text-[#5d5f5f] mt-0.5">
              "Abide with me; fast falls the eventide; The darkness deepens; Lord, with me abide."
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <button
            id="btn-voice-read-hymn"
            onClick={() => handleReadDailyHymn(songs[0])}
            className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-xs transition-all ${
              isReadingAloud
                ? 'bg-[#ba1a1a] text-white animate-pulse'
                : 'bg-[#3e5219]/10 text-[#3e5219] hover:bg-[#3e5219]/20'
            }`}
          >
            <Volume2 className="w-4 h-4" />
            <span>{isReadingAloud ? 'Stop Reading' : 'Listen Read Aloud'}</span>
          </button>
          <button
            onClick={() => onSelectSong(songs[0])}
            className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-[#3e5219] text-white font-semibold text-xs hover:bg-[#2c3c0f] transition-colors"
          >
            Open Reader
          </button>
        </div>
      </section>

      {/* Recently Added Songs & Hymns */}
      <section id="section-recent-songs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-serif text-2xl font-semibold text-[#1c1b1b] tracking-tight">
              Hymn & Song Catalog
            </h2>
            <p className="text-xs text-[#5d5f5f]">
              Direct access to lyrics and chords in all languages
            </p>
          </div>
          <button
            onClick={onOpenAddSong}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#3e5219] text-white font-semibold text-xs hover:bg-[#2c3c0f] active:scale-95 transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Song</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {recentSongs.map((song) => (
            <div
              key={song.id}
              onClick={() => onSelectSong(song)}
              className="soft-card bg-white rounded-xl p-3.5 flex items-center gap-3.5 hover:-translate-y-0.5 transition-all cursor-pointer group border border-[#e5e7eb]"
            >
              <div className="w-14 h-14 rounded-lg bg-[#f0eded] overflow-hidden shrink-0 relative">
                <img
                  src={song.coverImage}
                  alt={song.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
                <div className="absolute inset-0 bg-[#3e5219]/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                  <Play className="w-5 h-5 text-white fill-white" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-serif font-semibold text-[#1c1b1b] truncate group-hover:text-[#3e5219] transition-colors text-base">
                  {song.title}
                </h4>
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
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onTogglePin(song.id);
                }}
                className="text-[#75796b] hover:text-[#3e5219] p-2 shrink-0 transition-colors"
              >
                <Bookmark
                  className={`w-4 h-4 ${song.isPinned ? 'fill-[#3e5219] text-[#3e5219]' : ''}`}
                />
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
