import React, { useState, useMemo } from 'react';
import { Category, Song } from '../types';
import { Bookmark, Play, Search as SearchIcon, X, SlidersHorizontal } from 'lucide-react';
import { motion } from 'motion/react';

interface SearchViewProps {
  songs: Song[];
  categories: Category[];
  onSelectSong: (song: Song) => void;
  onTogglePin: (songId: string) => void;
  selectedCategory?: string;
  onSelectCategory?: (categoryId: string) => void;
}

export const SearchView: React.FC<SearchViewProps> = ({
  songs,
  categories,
  onSelectSong,
  onTogglePin,
  selectedCategory,
  onSelectCategory,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('All');
  const [activeCategory, setActiveCategory] = useState<string>(selectedCategory || 'All');

  const languages = ['All', 'Hindi', 'English', 'Nepali', 'Spanish', 'Portuguese'];

  const filteredSongs = useMemo(() => {
    return songs.filter((song) => {
      const matchesSearch =
        searchQuery.trim() === '' ||
        song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        song.artist.toLowerCase().includes(searchQuery.toLowerCase()) ||
        song.lyrics.toLowerCase().includes(searchQuery.toLowerCase()) ||
        song.category.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesLanguage =
        selectedLanguage === 'All' ||
        song.language.toLowerCase() === selectedLanguage.toLowerCase();

      const matchesCategory =
        activeCategory === 'All' ||
        song.category.toLowerCase() === activeCategory.toLowerCase();

      return matchesSearch && matchesLanguage && matchesCategory && song.status === 'Approved';
    });
  }, [songs, searchQuery, selectedLanguage, activeCategory]);

  return (
    <div id="search-view" className="space-y-6 pb-20 max-w-4xl mx-auto">
      {/* Search Input Section (matching Image 3.png) */}
      <section className="space-y-4">
        <div className="relative w-full">
          <SearchIcon className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-[#75796b]" />
          <input
            id="search-input-field"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search songs, artists, lyrics, hymns..."
            autoFocus
            className="w-full bg-[#f6f3f2] border-0 border-b-2 border-[#3e5219] rounded-xl pl-12 pr-12 py-4 font-sans text-base sm:text-lg text-[#1c1b1b] focus:ring-0 focus:border-[#3e5219] focus:bg-[#f0eded] transition-colors shadow-sm"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[#75796b] hover:text-[#1c1b1b] transition-colors p-1"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Language Filter Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 hide-scrollbar">
          {languages.map((lang) => {
            const isSelected = selectedLanguage === lang;
            return (
              <button
                key={lang}
                id={`filter-lang-${lang.toLowerCase()}`}
                onClick={() => setSelectedLanguage(lang)}
                className={`px-4 py-2 rounded-full font-sans text-xs font-semibold whitespace-nowrap flex-shrink-0 transition-all ${
                  isSelected
                    ? 'bg-[#3e5219] text-white shadow-sm'
                    : 'bg-white border border-[#c5c8b8] text-[#45483c] hover:bg-[#e5e2e1]'
                }`}
              >
                {lang}
              </button>
            );
          })}
        </div>

        {/* Category Filter Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 hide-scrollbar">
          <button
            onClick={() => {
              setActiveCategory('All');
              if (onSelectCategory) onSelectCategory('All');
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap shrink-0 transition-all ${
              activeCategory === 'All'
                ? 'bg-[#556b2f] text-white font-semibold'
                : 'bg-[#f0eded] text-[#5d5f5f] hover:bg-[#e5e2e1]'
            }`}
          >
            All Genres
          </button>
          {categories.map((cat) => {
            const isSelected = activeCategory.toLowerCase() === cat.name.toLowerCase() || activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  setActiveCategory(cat.name);
                  if (onSelectCategory) onSelectCategory(cat.id);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap shrink-0 transition-all ${
                  isSelected
                    ? 'bg-[#556b2f] text-white font-semibold'
                    : 'bg-[#f0eded] text-[#5d5f5f] hover:bg-[#e5e2e1]'
                }`}
              >
                {cat.name}
              </button>
            );
          })}
        </div>
      </section>

      {/* Results Header Count */}
      <div className="flex items-center justify-between text-xs text-[#5d5f5f] px-1">
        <span>Showing {filteredSongs.length} songs & hymns</span>
        {(searchQuery || selectedLanguage !== 'All' || activeCategory !== 'All') && (
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedLanguage('All');
              setActiveCategory('All');
            }}
            className="text-[#3e5219] font-semibold hover:underline"
          >
            Clear all filters
          </button>
        )}
      </div>

      {/* Results List (matching Image 3.png) */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredSongs.map((song) => (
          <motion.div
            key={song.id}
            layout
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            onClick={() => onSelectSong(song)}
            className="soft-card bg-white rounded-2xl p-4 flex items-center gap-4 hover:-translate-y-0.5 transition-all cursor-pointer group border border-[#e5e7eb]"
          >
            {/* Thumbnail */}
            <div className="w-16 h-16 rounded-xl bg-[#f0eded] flex items-center justify-center shrink-0 overflow-hidden relative shadow-sm">
              <img
                src={song.coverImage}
                alt={song.title}
                className="object-cover w-full h-full opacity-90 group-hover:opacity-100 transition-opacity group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-[#3e5219]/25 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                <Play className="w-5 h-5 text-white fill-white" />
              </div>
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <h3 className="font-serif text-lg font-semibold text-[#1c1b1b] truncate group-hover:text-[#3e5219] transition-colors">
                {song.title}
              </h3>
              <p className="font-sans text-xs sm:text-sm text-[#5d5f5f] truncate mt-0.5">
                {song.artist}
              </p>
              <div className="flex items-center gap-2 mt-1.5">
                <span className="px-2 py-0.5 rounded bg-[#3e5219]/10 text-[#3e5219] font-sans text-[10px] font-bold tracking-wider uppercase">
                  {song.language}
                </span>
                <span className="px-2 py-0.5 rounded bg-[#f0eded] text-[#5d5f5f] text-[10px] font-medium">
                  {song.category}
                </span>
                <span className="text-[10px] text-[#75796b] font-mono">
                  Key: {song.defaultKey}
                </span>
              </div>
            </div>

            {/* Pin / Bookmark Action */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onTogglePin(song.id);
              }}
              title={song.isPinned ? 'Unpin song' : 'Pin to Home'}
              className="p-2 shrink-0 text-[#75796b] hover:text-[#3e5219] transition-colors"
            >
              <Bookmark
                className={`w-5 h-5 transition-transform active:scale-90 ${
                  song.isPinned ? 'fill-[#3e5219] text-[#3e5219]' : ''
                }`}
              />
            </button>
          </motion.div>
        ))}
      </section>

      {/* Empty State */}
      {filteredSongs.length === 0 && (
        <div className="py-16 text-center space-y-3">
          <div className="w-14 h-14 rounded-full bg-[#3e5219]/10 text-[#3e5219] flex items-center justify-center mx-auto">
            <SearchIcon className="w-7 h-7" />
          </div>
          <h3 className="font-serif text-xl font-bold text-[#1c1b1b]">No songs found</h3>
          <p className="text-sm text-[#5d5f5f] max-w-sm mx-auto">
            We couldn't find any songs matching "{searchQuery}". Try adjusting your search query or language filter.
          </p>
        </div>
      )}

      {/* End of results footer */}
      {filteredSongs.length > 0 && (
        <div className="pt-8 text-center text-xs text-[#75796b]">
          <p>End of results ({filteredSongs.length} songs available)</p>
        </div>
      )}
    </div>
  );
};
