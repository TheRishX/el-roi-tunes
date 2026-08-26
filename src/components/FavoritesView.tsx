import React, { useState } from 'react';
import { Song, TabType } from '../types';
import { Bookmark, Folder, FolderPlus, Heart, MoreHorizontal, Play, Printer, Search, Sparkles, Trash2, X } from 'lucide-react';
import { motion } from 'motion/react';

interface FavoritesViewProps {
  songs: Song[];
  onSelectSong: (song: Song) => void;
  onTogglePin: (songId: string) => void;
  onToggleFavorite: (songId: string) => void;
  onTabChange: (tab: TabType) => void;
}

interface FavoriteFolder {
  id: string;
  name: string;
  songIds: string[];
}

const FOLDERS_KEY = 'el-roi-favorite-folders';

const readFolders = (): FavoriteFolder[] => {
  try {
    const saved = localStorage.getItem(FOLDERS_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

export const FavoritesView: React.FC<FavoritesViewProps> = ({
  songs,
  onSelectSong,
  onTogglePin,
  onToggleFavorite,
  onTabChange,
}) => {
  const [activeTab, setActiveTab] = useState<'pinned' | 'favorites'>('pinned');
  const [folders, setFolders] = useState<FavoriteFolder[]>(readFolders);
  const [activeFolder, setActiveFolder] = useState('all');
  const [organizeOpen, setOrganizeOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [assigningSong, setAssigningSong] = useState<string | null>(null);

  const pinnedSongs = songs.filter((s) => s.isPinned);
  const favoriteSongs = songs.filter((s) => s.isFavorite);
  const folderSongIds = activeFolder === 'all' ? null : activeFolder === 'unsorted'
    ? new Set(favoriteSongs.filter((song) => !folders.some((folder) => folder.songIds.includes(song.id))).map((song) => song.id))
    : new Set(folders.find((folder) => folder.id === activeFolder)?.songIds || []);
  const displaySongs = activeTab === 'pinned'
    ? pinnedSongs
    : favoriteSongs.filter((song) => !folderSongIds || folderSongIds.has(song.id));

  const persistFolders = (next: FavoriteFolder[]) => {
    setFolders(next);
    localStorage.setItem(FOLDERS_KEY, JSON.stringify(next));
  };

  const createFolder = (event: React.FormEvent) => {
    event.preventDefault();
    const name = newFolderName.trim();
    if (!name || folders.some((folder) => folder.name.toLowerCase() === name.toLowerCase())) return;
    const folder = { id: `folder-${Date.now()}`, name, songIds: [] };
    persistFolders([...folders, folder]);
    setActiveFolder(folder.id);
    setNewFolderName('');
  };

  const assignSong = (songId: string, folderId: string) => {
    const next = folders.map((folder) => ({ ...folder, songIds: folder.songIds.filter((id) => id !== songId) }));
    if (folderId !== 'unsorted') {
      const target = next.find((folder) => folder.id === folderId);
      if (target) target.songIds.push(songId);
    }
    persistFolders(next);
    setAssigningSong(null);
  };

  const deleteFolder = (folderId: string) => {
    persistFolders(folders.filter((folder) => folder.id !== folderId));
    setActiveFolder('all');
  };

  const exportToSpotify = async () => {
    const trackList = favoriteSongs.map((song) => `${song.title} — ${song.artist}`).join('\n');
    try {
      await navigator.clipboard.writeText(trackList);
    } catch {
      // Opening Spotify is still useful when clipboard access is unavailable.
    }
    window.open('https://open.spotify.com/search', '_blank', 'noopener,noreferrer');
  };

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
          {activeTab === 'favorites' && (
            <button onClick={() => setOrganizeOpen((open) => !open)} className={`flex items-center gap-1.5 px-3 py-2.5 rounded-xl border text-xs font-semibold transition-colors ${organizeOpen ? 'bg-[#3e5219] text-white border-[#3e5219]' : 'bg-white text-[#3e5219] border-[#e5e2e1] hover:bg-[#f0eded]'}`}>
              <Folder className="w-4 h-4" /> Organize
            </button>
          )}
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

      {activeTab === 'favorites' && organizeOpen && (
        <motion.section initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-[#dfe4d8] bg-[#f5f7f1] p-4">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div>
              <h3 className="font-serif text-lg font-semibold text-[#1c1b1b]">Keep your favorites in order</h3>
              <p className="text-xs text-[#5d5f5f] mt-0.5">Create folders, then use the folder icon on a favorite to move it.</p>
            </div>
            <button aria-label="Close organize panel" onClick={() => setOrganizeOpen(false)} className="p-1 text-[#75796b] hover:text-[#1c1b1b]"><X className="w-4 h-4" /></button>
          </div>
          <form onSubmit={createFolder} className="flex gap-2">
            <input value={newFolderName} onChange={(event) => setNewFolderName(event.target.value)} placeholder="New folder name" className="min-w-0 flex-1 rounded-xl border border-[#d8ddd0] bg-white px-3 py-2 text-sm outline-none focus:border-[#3e5219]" />
            <button type="submit" disabled={!newFolderName.trim()} className="inline-flex items-center gap-1.5 rounded-xl bg-[#3e5219] px-3 py-2 text-xs font-semibold text-white disabled:opacity-40"><FolderPlus className="w-4 h-4" /> Create</button>
          </form>
          <button onClick={exportToSpotify} className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-[#3e5219] hover:underline"><Sparkles className="w-3.5 h-3.5" /> Export to Spotify <span className="font-normal text-[#75796b]">· copies your song list</span></button>
        </motion.section>
      )}

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

      {activeTab === 'favorites' && (folders.length > 0 || favoriteSongs.length > 0) && (
        <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar pb-1">
          {[{ id: 'all', name: 'All favorites', count: favoriteSongs.length }, { id: 'unsorted', name: 'Unsorted', count: favoriteSongs.filter((song) => !folders.some((folder) => folder.songIds.includes(song.id))).length }, ...folders.map((folder) => ({ id: folder.id, name: folder.name, count: folder.songIds.filter((id) => favoriteSongs.some((song) => song.id === id)).length }))].map((folder) => (
            <div key={folder.id} className="relative shrink-0 group">
              <button onClick={() => setActiveFolder(folder.id)} className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-2 text-xs font-semibold transition-colors ${activeFolder === folder.id ? 'border-[#3e5219] bg-[#eaf0e3] text-[#3e5219]' : 'border-[#e5e2e1] bg-white text-[#5d5f5f] hover:border-[#bfcab5]'}`}>
                <Folder className="w-3.5 h-3.5" /> {folder.name} <span className="font-mono text-[10px] opacity-70">{folder.count}</span>
              </button>
              {folder.id !== 'all' && folder.id !== 'unsorted' && <button aria-label={`Delete ${folder.name}`} onClick={() => deleteFolder(folder.id)} className="absolute -right-1 -top-1 hidden rounded-full bg-white p-0.5 text-[#ba1a1a] shadow-sm group-hover:block"><Trash2 className="w-3 h-3" /></button>}
            </div>
          ))}
        </div>
      )}

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
              {activeTab === 'favorites' && (
                <div className="relative">
                  <button aria-label="Move favorite to folder" title="Move to folder" onClick={(e) => { e.stopPropagation(); setAssigningSong(assigningSong === song.id ? null : song.id); }} className="p-2 text-[#75796b] hover:text-[#3e5219] transition-colors"><MoreHorizontal className="w-4 h-4" /></button>
                  {assigningSong === song.id && <div onClick={(e) => e.stopPropagation()} className="absolute right-0 top-10 z-20 w-44 rounded-xl border border-[#e5e2e1] bg-white p-1.5 shadow-lg"><p className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-[#75796b]">Move to folder</p><button onClick={() => assignSong(song.id, 'unsorted')} className="flex w-full items-center justify-between rounded-lg px-2 py-2 text-left text-xs hover:bg-[#f0eded]">Unsorted</button>{folders.map((folder) => <button key={folder.id} onClick={() => assignSong(song.id, folder.id)} className="flex w-full items-center justify-between rounded-lg px-2 py-2 text-left text-xs hover:bg-[#f0eded]"><span className="truncate">{folder.name}</span>{folder.songIds.includes(song.id) && <span className="text-[#3e5219]">✓</span>}</button>)}</div>}
                </div>
              )}
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
