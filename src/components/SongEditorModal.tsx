import React, { useState, useEffect } from 'react';
import { Category, Song } from '../types';
import { Bookmark, FileText, Music, Play, X } from 'lucide-react';
import { motion } from 'motion/react';

interface SongEditorModalProps {
  songToEdit?: Song | null;
  categories: Category[];
  onClose: () => void;
  onSaveSong: (songData: Omit<Song, 'id' | 'createdAt' | 'views'>, songId?: string) => void;
}

export const SongEditorModal: React.FC<SongEditorModalProps> = ({
  songToEdit,
  categories,
  onClose,
  onSaveSong,
}) => {
  const [title, setTitle] = useState(songToEdit?.title || '');
  const [artist, setArtist] = useState(songToEdit?.artist || '');
  const [category, setCategory] = useState(songToEdit?.category || categories[0]?.name || 'Worship');
  const [language, setLanguage] = useState(songToEdit?.language || 'English');
  const [defaultKey, setDefaultKey] = useState(songToEdit?.defaultKey || 'C');
  const [bpm, setBpm] = useState(songToEdit?.bpm || 72);
  const [tempo, setTempo] = useState(songToEdit?.tempo || '4/4');
  const [coverImage, setCoverImage] = useState(
    songToEdit?.coverImage ||
      'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80'
  );
  const [lyrics, setLyrics] = useState(songToEdit?.lyrics || '');
  const [chordsLyrics, setChordsLyrics] = useState(
    songToEdit?.chordsLyrics || `[C]Line 1 with [G]chord\n[Am]Line 2 with [F]chord`
  );
  const [videoUrl, setVideoUrl] = useState(songToEdit?.videoUrl || '');
  const [status, setStatus] = useState<'Approved' | 'Pending' | 'Draft'>(
    songToEdit?.status || 'Approved'
  );
  const [isPinned, setIsPinned] = useState(songToEdit?.isPinned || false);
  const [isFavorite, setIsFavorite] = useState(songToEdit?.isFavorite || false);
  const [uploadedBy, setUploadedBy] = useState(songToEdit?.uploadedBy || 'Admin User');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !artist.trim() || !lyrics.trim()) return;

    onSaveSong(
      {
        title: title.trim(),
        artist: artist.trim(),
        category,
        language,
        defaultKey,
        bpm: Number(bpm) || 72,
        tempo,
        coverImage: coverImage.trim(),
        lyrics: lyrics.trim(),
        chordsLyrics: chordsLyrics.trim() || lyrics.trim(),
        videoUrl: videoUrl.trim(),
        status,
        isPinned,
        isFavorite,
        uploadedBy: uploadedBy.trim(),
      },
      songToEdit?.id
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-3xl p-6 sm:p-8 max-w-3xl w-full shadow-2xl border border-[#e5e2e1] my-8 space-y-6"
      >
        <div className="flex items-center justify-between border-b border-[#e5e2e1] pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-[#3e5219] text-white flex items-center justify-center shadow-sm">
              <Music className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-2xl font-bold text-[#1c1b1b]">
                {songToEdit ? 'Edit Song & Chords' : 'Add New Song / Hymn'}
              </h3>
              <p className="text-xs text-[#5d5f5f]">
                Fill out track information, chords brackets [G], and lyrics
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-[#5d5f5f] hover:text-[#1c1b1b] hover:bg-[#f0eded]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 text-xs font-semibold">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[#1c1b1b] mb-1">Song Title *</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Abide With Me, How Great Thou Art"
                className="w-full bg-[#f6f3f2] rounded-xl px-4 py-2.5 text-sm font-sans text-[#1c1b1b] border border-[#e5e2e1] focus:ring-1 focus:ring-[#3e5219]"
              />
            </div>

            <div>
              <label className="block text-[#1c1b1b] mb-1">Artist / Author / Hymnist *</label>
              <input
                type="text"
                required
                value={artist}
                onChange={(e) => setArtist(e.target.value)}
                placeholder="e.g. Henry Francis Lyte, Atif Aslam"
                className="w-full bg-[#f6f3f2] rounded-xl px-4 py-2.5 text-sm font-sans text-[#1c1b1b] border border-[#e5e2e1] focus:ring-1 focus:ring-[#3e5219]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-[#1c1b1b] mb-1">Category / Genre</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-[#f6f3f2] rounded-xl px-4 py-2.5 text-sm font-sans text-[#1c1b1b] border border-[#e5e2e1] focus:ring-1 focus:ring-[#3e5219]"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[#1c1b1b] mb-1">Language</label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full bg-[#f6f3f2] rounded-xl px-4 py-2.5 text-sm font-sans text-[#1c1b1b] border border-[#e5e2e1] focus:ring-1 focus:ring-[#3e5219]"
              >
                <option value="English">English</option>
                <option value="Hindi">Hindi</option>
                <option value="Nepali">Nepali</option>
                <option value="Spanish">Spanish</option>
                <option value="Portuguese">Portuguese</option>
              </select>
            </div>

            <div>
              <label className="block text-[#1c1b1b] mb-1">Default Musical Key</label>
              <input
                type="text"
                value={defaultKey}
                onChange={(e) => setDefaultKey(e.target.value)}
                placeholder="e.g. C, G, D, Eb, F#m"
                className="w-full bg-[#f6f3f2] rounded-xl px-4 py-2.5 text-sm font-sans text-[#1c1b1b] border border-[#e5e2e1] focus:ring-1 focus:ring-[#3e5219]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[#1c1b1b] mb-1">Cover Image URL</label>
              <input
                type="url"
                value={coverImage}
                onChange={(e) => setCoverImage(e.target.value)}
                placeholder="https://..."
                className="w-full bg-[#f6f3f2] rounded-xl px-4 py-2.5 text-sm font-sans text-[#1c1b1b] border border-[#e5e2e1] focus:ring-1 focus:ring-[#3e5219]"
              />
            </div>

            <div>
              <label className="block text-[#1c1b1b] mb-1">YouTube Video Link (Optional)</label>
              <input
                type="url"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=..."
                className="w-full bg-[#f6f3f2] rounded-xl px-4 py-2.5 text-sm font-sans text-[#1c1b1b] border border-[#e5e2e1] focus:ring-1 focus:ring-[#3e5219]"
              />
            </div>
          </div>

          {/* Chords + Lyrics Editor */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[#1c1b1b]">
                Lyrics with Chords (e.g. [G]Amazing [C]grace) *
              </label>
              <span className="text-[11px] text-[#3e5219]">Enclose chords in brackets []</span>
            </div>
            <textarea
              rows={5}
              required
              value={chordsLyrics}
              onChange={(e) => {
                setChordsLyrics(e.target.value);
                // Also auto generate clean plain lyrics
                setLyrics(e.target.value.replace(/\[[^\]]+\]/g, ''));
              }}
              placeholder="[G]Amazing grace! How [C]sweet the [G]sound..."
              className="w-full bg-[#f6f3f2] rounded-xl p-3 text-sm font-mono text-[#1c1b1b] border border-[#e5e2e1] focus:ring-1 focus:ring-[#3e5219]"
            />
          </div>

          {/* Plain Lyrics */}
          <div>
            <label className="block text-[#1c1b1b] mb-1">Plain Lyrics (Auto-stripped) *</label>
            <textarea
              rows={4}
              required
              value={lyrics}
              onChange={(e) => setLyrics(e.target.value)}
              placeholder="Amazing grace! How sweet the sound..."
              className="w-full bg-[#f6f3f2] rounded-xl p-3 text-sm font-sans text-[#1c1b1b] border border-[#e5e2e1] focus:ring-1 focus:ring-[#3e5219]"
            />
          </div>

          {/* Status & Options */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-[#e5e2e1]">
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isPinned}
                  onChange={(e) => setIsPinned(e.target.checked)}
                  className="rounded text-[#3e5219] focus:ring-[#3e5219] w-4 h-4"
                />
                <span className="text-xs text-[#1c1b1b]">Pin to Carousel</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isFavorite}
                  onChange={(e) => setIsFavorite(e.target.checked)}
                  className="rounded text-[#3e5219] focus:ring-[#3e5219] w-4 h-4"
                />
                <span className="text-xs text-[#1c1b1b]">Mark as Favorite</span>
              </label>
            </div>

            <div>
              <select
                value={status}
                onChange={(e) =>
                  setStatus(e.target.value as 'Approved' | 'Pending' | 'Draft')
                }
                className="bg-[#f6f3f2] rounded-xl px-3 py-1.5 text-xs text-[#1c1b1b] border border-[#e5e2e1]"
              >
                <option value="Approved">Status: Approved</option>
                <option value="Pending">Status: Pending</option>
                <option value="Draft">Status: Draft</option>
              </select>
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-2 border-t border-[#e5e2e1]">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-[#e5e2e1] text-[#5d5f5f] hover:bg-[#f0eded]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-[#3e5219] text-white hover:bg-[#2c3c0f] shadow-sm font-bold"
            >
              Save to Catalog
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};
