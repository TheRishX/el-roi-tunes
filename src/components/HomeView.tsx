import React, { useState } from 'react';
import { Bookmark, ChevronRight, Heart, Languages, Play, Search, Volume2 } from 'lucide-react';
import { Category, Song, TabType } from '../types';
import { motion } from 'motion/react';
import { speechReader } from '../utils/chordUtils';

interface HomeViewProps {
  songs: Song[]; categories: Category[]; onSelectSong: (song: Song) => void;
  onSelectCategory: (categoryId: string) => void; onTabChange: (tab: TabType) => void;
  onTogglePin: (songId: string) => void;
}

const languageOptions = [
  { label: 'हिंदी', value: 'Hindi', mark: 'हि' },
  { label: 'English', value: 'English', mark: 'EN' },
  { label: 'नेपाली', value: 'Nepali', mark: 'ने' },
];

export const HomeView: React.FC<HomeViewProps> = ({ songs, categories, onSelectSong, onSelectCategory, onTabChange, onTogglePin }) => {
  const [query, setQuery] = useState('');
  const [isReading, setIsReading] = useState(false);
  const approved = songs.filter((song) => song.status === 'Approved');
  const pinned = approved.filter((song) => song.isPinned);
  const featured = pinned[0] || approved[0];
  const recent = approved.slice(0, 5);
  const submitSearch = (event: React.FormEvent) => { event.preventDefault(); onTabChange('search'); };
  const readFeatured = () => {
    if (!featured) return;
    if (isReading) { speechReader.stop(); setIsReading(false); return; }
    setIsReading(true); speechReader.speakLyrics(featured.lyrics, () => setIsReading(false));
  };

  return (
    <div id="home-view" className="max-w-5xl mx-auto space-y-10 pb-10">
      <section className="pt-4 sm:pt-8 text-center">
        <p className="text-sm font-semibold tracking-[0.16em] uppercase text-[#a26b3d]">Your songbook</p>
        <h2 className="font-serif text-4xl sm:text-6xl leading-[1.02] text-[#29402a] mt-3">Sing from the heart.</h2>
        <p className="text-[#687166] mt-4 max-w-md mx-auto text-base sm:text-lg">Find Christian lyrics in the language that feels like home.</p>
        <form onSubmit={submitSearch} className="relative max-w-xl mx-auto mt-7">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-[#7c8479]" />
          <input id="home-search-input" value={query} onChange={(event) => setQuery(event.target.value)} onFocus={() => onTabChange('search')} placeholder="Search a song or hymn" aria-label="Search a song or hymn" className="w-full rounded-2xl border border-[#deddd3] bg-white pl-12 pr-4 py-4 text-base text-[#29402a] shadow-[0_12px_30px_-18px_rgba(41,64,42,.5)] outline-none focus:border-[#557b55] focus:ring-4 focus:ring-[#557b55]/10" />
        </form>
      </section>

      <section aria-labelledby="language-heading">
        <div className="flex items-end justify-between mb-4"><div><h3 id="language-heading" className="font-serif text-2xl text-[#29402a]">Choose a language</h3><p className="text-sm text-[#7c8479] mt-1">Start with what you know</p></div><Languages className="w-5 h-5 text-[#a26b3d]" /></div>
        <div className="grid grid-cols-3 gap-3 sm:gap-4">
          {languageOptions.map((language) => <button key={language.value} onClick={() => onTabChange('search')} className="group min-h-[92px] sm:min-h-[108px] rounded-2xl bg-[#e8eee1] hover:bg-[#dce7d5] text-left p-4 sm:p-5 transition-colors"><span className="flex items-center justify-center w-10 h-10 rounded-full bg-white text-[#29402a] font-semibold text-sm group-hover:scale-105 transition-transform">{language.mark}</span><span className="block mt-3 text-sm sm:text-base font-semibold text-[#29402a]">{language.label}</span></button>)}
        </div>
      </section>

      {featured && <section className="relative overflow-hidden rounded-3xl bg-[#29402a] text-white p-6 sm:p-9 min-h-[210px] flex items-end"><div className="absolute inset-0 opacity-30 bg-cover bg-center" style={{ backgroundImage: `url('${featured.coverImage}')` }} /><div className="absolute inset-0 bg-gradient-to-r from-[#29402a] via-[#29402a]/90 to-transparent" /><div className="relative max-w-lg"><p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#e5b887]">Continue singing</p><h3 className="font-serif text-3xl sm:text-4xl mt-2">{featured.title}</h3><p className="text-white/70 text-sm mt-1">{featured.artist} · {featured.language}</p><div className="flex flex-wrap gap-3 mt-6"><button onClick={() => onSelectSong(featured)} className="inline-flex items-center gap-2 rounded-full bg-white text-[#29402a] px-5 py-2.5 text-sm font-semibold hover:bg-[#f4f1e8]"><Play className="w-4 h-4 fill-current" /> Open lyrics</button><button onClick={readFeatured} className="inline-flex items-center gap-2 rounded-full bg-white/15 text-white px-4 py-2.5 text-sm font-semibold hover:bg-white/25"><Volume2 className="w-4 h-4" /> {isReading ? 'Stop reading' : 'Listen'}</button></div></div></section>}

      <section><div className="flex items-center justify-between mb-4"><div><h3 className="font-serif text-2xl text-[#29402a]">Browse the songbook</h3><p className="text-sm text-[#7c8479] mt-1">Simple, searchable, and ready for worship</p></div><button onClick={() => onTabChange('search')} className="text-sm font-semibold text-[#557b55] inline-flex items-center gap-1">See all <ChevronRight className="w-4 h-4" /></button></div><div className="divide-y divide-[#e8e5dc] rounded-2xl bg-white border border-[#e8e5dc] overflow-hidden">{recent.map((song) => <motion.div key={song.id} layout onClick={() => onSelectSong(song)} className="flex items-center gap-3 p-3 sm:p-4 cursor-pointer hover:bg-[#f8f8f3] transition-colors"><img src={song.coverImage} alt="" className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl object-cover" /><div className="min-w-0 flex-1"><h4 className="font-semibold text-[#29402a] truncate">{song.title}</h4><p className="text-sm text-[#7c8479] truncate mt-0.5">{song.artist}</p><span className="text-[11px] text-[#a26b3d] font-semibold">{song.language}</span></div><button aria-label={song.isPinned ? `Remove ${song.title} from saved` : `Save ${song.title}`} onClick={(event) => { event.stopPropagation(); onTogglePin(song.id); }} className="p-2 text-[#7c8479] hover:text-[#a26b3d] rounded-full">{song.isPinned ? <Bookmark className="w-5 h-5 fill-current text-[#a26b3d]" /> : <Heart className="w-5 h-5" />}</button><ChevronRight className="w-4 h-4 text-[#b3b7ae]" /></motion.div>)}</div></section>

      <section className="flex flex-wrap gap-2 items-center text-sm text-[#7c8479]"><span>Browse by collection:</span>{categories.slice(0, 4).map((category) => <button key={category.id} onClick={() => onSelectCategory(category.id)} className="rounded-full bg-[#f1f0e9] px-3 py-1.5 text-[#557b55] font-medium hover:bg-[#e8eee1]">{category.name}</button>)}</section>
    </div>
  );
};
