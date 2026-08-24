import React, { useState } from 'react';
import { Category, Song } from '../types';
import {
  Church,
  Edit2,
  FolderTree,
  Headphones,
  Library,
  MoreVertical,
  Music,
  Plus,
  Radio,
  Trash2,
  X,
  Zap,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface CategoryManagementProps {
  categories: Category[];
  songs: Song[];
  onAddCategory: (category: Omit<Category, 'id' | 'trackCount'>) => void;
  onDeleteCategory: (categoryId: string) => void;
  onSelectCategory: (categoryId: string) => void;
}

export const CategoryManagement: React.FC<CategoryManagementProps> = ({
  categories,
  songs,
  onAddCategory,
  onDeleteCategory,
  onSelectCategory,
}) => {
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  // New Category Form State
  const [newCatName, setNewCatName] = useState('');
  const [newCatDescription, setNewCatDescription] = useState('');
  const [newCatIcon, setNewCatIcon] = useState('church');
  const [newCatLanguages, setNewCatLanguages] = useState('EN, HI, ES');
  const [newCatCover, setNewCatCover] = useState('');

  const getCategoryIcon = (iconName: string) => {
    switch (iconName.toLowerCase()) {
      case 'church':
        return <Church className="w-6 h-6" />;
      case 'rock':
      case 'new_window':
      case 'electric_guitar':
        return <Zap className="w-6 h-6" />;
      case 'traditional':
      case 'library_music':
        return <Library className="w-6 h-6" />;
      case 'instrumental':
      case 'queue_music':
        return <Headphones className="w-6 h-6" />;
      case 'pop':
      case 'graphic_eq':
        return <Radio className="w-6 h-6" />;
      default:
        return <Music className="w-6 h-6" />;
    }
  };

  const handleCreateCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;

    const langs = newCatLanguages
      .split(',')
      .map((l) => l.trim().toUpperCase())
      .filter(Boolean);

    onAddCategory({
      name: newCatName.trim(),
      description: newCatDescription.trim() || 'Curated classification for song library',
      icon: newCatIcon,
      languages: langs.length > 0 ? langs : ['EN'],
      coverImage:
        newCatCover.trim() ||
        'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80',
    });

    setNewCatName('');
    setNewCatDescription('');
    setNewCatCover('');
    setShowAddModal(false);
  };

  return (
    <div id="category-management-view" className="space-y-10 max-w-6xl mx-auto pb-20">
      {/* Header & Action (matching Image 9.png) */}
      <section className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#1c1b1b] tracking-tight">
            Category Management
          </h2>
          <p className="text-sm text-[#5d5f5f] mt-1">
            Manage genres and classifications for the media library.
          </p>
        </div>

        <button
          id="btn-new-category"
          onClick={() => setShowAddModal(true)}
          className="bg-[#3e5219] text-white font-semibold text-xs px-5 py-3 rounded-xl hover:bg-[#2c3c0f] active:translate-y-0.5 transition-all flex items-center gap-2 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>New Category</span>
        </button>
      </section>

      {/* Categories Bento Grid (matching Image 9.png) */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat) => {
          const actualSongCount = songs.filter(
            (s) => s.category.toLowerCase() === cat.name.toLowerCase()
          ).length;

          return (
            <motion.article
              key={cat.id}
              whileHover={{ y: -4 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-2xl p-6 soft-card border border-[#e5e7eb] flex flex-col justify-between group hover:shadow-lg relative"
            >
              <div className="flex justify-between items-start mb-8">
                {/* Icon avatar */}
                <div
                  onClick={() => onSelectCategory(cat.id)}
                  className="w-13 h-13 rounded-2xl bg-[#3e5219]/10 flex items-center justify-center text-[#3e5219] group-hover:bg-[#3e5219] group-hover:text-white transition-colors cursor-pointer"
                >
                  {getCategoryIcon(cat.icon || cat.name)}
                </div>

                {/* More options menu */}
                <div className="relative">
                  <button
                    onClick={() =>
                      setActiveMenuId(activeMenuId === cat.id ? null : cat.id)
                    }
                    className="p-1.5 rounded-lg text-[#5d5f5f] hover:text-[#3e5219] hover:bg-[#f0eded] transition-colors"
                  >
                    <MoreVertical className="w-5 h-5" />
                  </button>

                  {activeMenuId === cat.id && (
                    <div className="absolute right-0 top-8 z-20 bg-white border border-[#e5e2e1] rounded-xl shadow-lg p-1 w-36 space-y-1">
                      <button
                        onClick={() => {
                          setActiveMenuId(null);
                          onSelectCategory(cat.id);
                        }}
                        className="w-full text-left px-3 py-1.5 text-xs text-[#1c1b1b] hover:bg-[#f0eded] rounded-lg"
                      >
                        View Songs
                      </button>
                      <button
                        onClick={() => {
                          setActiveMenuId(null);
                          if (confirm(`Delete category "${cat.name}"?`)) {
                            onDeleteCategory(cat.id);
                          }
                        }}
                        className="w-full text-left px-3 py-1.5 text-xs text-red-600 hover:bg-red-50 rounded-lg flex items-center gap-1.5"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h3
                  onClick={() => onSelectCategory(cat.id)}
                  className="font-serif text-2xl font-bold text-[#1c1b1b] mb-1 group-hover:text-[#3e5219] transition-colors cursor-pointer"
                >
                  {cat.name}
                </h3>
                <p className="text-xs text-[#5d5f5f] mb-4">
                  {cat.trackCount || actualSongCount} Tracks • {actualSongCount} Live
                </p>

                {/* Language tags */}
                <div className="flex flex-wrap gap-1.5">
                  {cat.languages.map((lang, idx) => (
                    <span
                      key={idx}
                      className="bg-[#3e5219]/10 text-[#3e5219] text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider"
                    >
                      {lang}
                    </span>
                  ))}
                </div>
              </div>
            </motion.article>
          );
        })}
      </section>

      {/* Add Category Modal Sheet */}
      <AnimatePresence>
        {showAddModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddModal(false)}
              className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-[90vw] shadow-2xl border border-[#e5e2e1] space-y-5"
            >
              <div className="flex items-center justify-between border-b border-[#e5e2e1] pb-3">
                <div className="flex items-center gap-2">
                  <FolderTree className="w-5 h-5 text-[#3e5219]" />
                  <h3 className="font-serif text-xl font-bold text-[#1c1b1b]">
                    Create New Category
                  </h3>
                </div>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="p-1 text-[#5d5f5f] hover:text-[#1c1b1b]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateCategory} className="space-y-4 text-xs font-semibold">
                <div>
                  <label className="block text-[#1c1b1b] mb-1">Category Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Choral Anthems, Youth Praise, Devotional"
                    value={newCatName}
                    onChange={(e) => setNewCatName(e.target.value)}
                    className="w-full bg-[#f6f3f2] rounded-xl px-4 py-2.5 text-sm font-sans text-[#1c1b1b] border border-[#e5e2e1] focus:ring-1 focus:ring-[#3e5219]"
                  />
                </div>

                <div>
                  <label className="block text-[#1c1b1b] mb-1">Description</label>
                  <input
                    type="text"
                    placeholder="Short description of this category..."
                    value={newCatDescription}
                    onChange={(e) => setNewCatDescription(e.target.value)}
                    className="w-full bg-[#f6f3f2] rounded-xl px-4 py-2.5 text-sm font-sans text-[#1c1b1b] border border-[#e5e2e1] focus:ring-1 focus:ring-[#3e5219]"
                  />
                </div>

                <div>
                  <label className="block text-[#1c1b1b] mb-1">Icon Type</label>
                  <select
                    value={newCatIcon}
                    onChange={(e) => setNewCatIcon(e.target.value)}
                    className="w-full bg-[#f6f3f2] rounded-xl px-4 py-2.5 text-sm font-sans text-[#1c1b1b] border border-[#e5e2e1] focus:ring-1 focus:ring-[#3e5219]"
                  >
                    <option value="church">Church / Worship</option>
                    <option value="pop">Pop / Radio</option>
                    <option value="rock">Rock / Guitar</option>
                    <option value="traditional">Traditional / Organ</option>
                    <option value="instrumental">Instrumental / Piano</option>
                    <option value="music">General Music</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#1c1b1b] mb-1">Supported Languages (comma separated)</label>
                  <input
                    type="text"
                    placeholder="EN, HI, NE, ES, PT"
                    value={newCatLanguages}
                    onChange={(e) => setNewCatLanguages(e.target.value)}
                    className="w-full bg-[#f6f3f2] rounded-xl px-4 py-2.5 text-sm font-sans text-[#1c1b1b] border border-[#e5e2e1] focus:ring-1 focus:ring-[#3e5219]"
                  />
                </div>

                <div>
                  <label className="block text-[#1c1b1b] mb-1">Cover Image URL (Optional)</label>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={newCatCover}
                    onChange={(e) => setNewCatCover(e.target.value)}
                    className="w-full bg-[#f6f3f2] rounded-xl px-4 py-2.5 text-sm font-sans text-[#1c1b1b] border border-[#e5e2e1] focus:ring-1 focus:ring-[#3e5219]"
                  />
                </div>

                <div className="pt-3 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2.5 rounded-xl border border-[#e5e2e1] text-[#5d5f5f] hover:bg-[#f0eded]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-[#3e5219] text-white hover:bg-[#2c3c0f] shadow-sm"
                  >
                    Save Category
                  </button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
