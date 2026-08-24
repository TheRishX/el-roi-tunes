import { INITIAL_CATEGORIES, INITIAL_SONGS } from '../data/initialData';
import { Category, Song, UserSettings } from '../types';

const STORAGE_KEYS = { SONGS: 'el_roi_tunes_songs_v1', CATEGORIES: 'el_roi_tunes_categories_v1', SETTINGS: 'el_roi_tunes_settings_v1' };
export const DEFAULT_USER_SETTINGS: UserSettings = { fontSize: 18, fontFamily: 'serif', themeMode: 'light', lineSpacing: 'relaxed', autoScrollSpeed: 3, showChordDiagrams: true, hapticFeedback: true };
const API_URL = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');
const api = (path: string) => `${API_URL}/api${path}`;

class SqlDatabaseService {
  private songs: Song[] = [];
  private categories: Category[] = [];
  private settings: UserSettings = DEFAULT_USER_SETTINGS;
  private remote = true;
  public readonly ready: Promise<void>;
  constructor() { this.ready = this.init(); }

  private async init() {
    try {
      const response = await fetch(api('/bootstrap'));
      if (!response.ok) throw new Error('API unavailable');
      const data = await response.json();
      this.songs = data.songs || []; this.categories = data.categories || [];
      this.settings = { ...DEFAULT_USER_SETTINGS, ...(data.settings || {}) };
    } catch {
      this.remote = false;
      try {
        this.songs = JSON.parse(localStorage.getItem(STORAGE_KEYS.SONGS) || 'null') || INITIAL_SONGS;
        this.categories = JSON.parse(localStorage.getItem(STORAGE_KEYS.CATEGORIES) || 'null') || INITIAL_CATEGORIES;
        this.settings = { ...DEFAULT_USER_SETTINGS, ...JSON.parse(localStorage.getItem(STORAGE_KEYS.SETTINGS) || '{}') };
      } catch { this.songs = INITIAL_SONGS; this.categories = INITIAL_CATEGORIES; }
    }
  }

  private async request(path: string, options: RequestInit = {}) {
    const response = await fetch(api(path), { ...options, headers: { 'Content-Type': 'application/json', ...(options.headers || {}) } });
    if (!response.ok) throw new Error((await response.text()) || `Request failed (${response.status})`);
    return response.status === 204 ? null : response.json();
  }
  public getSongs() { return [...this.songs]; }
  public getCategories() { return [...this.categories]; }
  public getSettings() { return { ...this.settings }; }
  public getSongById(id: string) { return this.songs.find((song) => song.id === id); }
  public async updateSettings(changes: Partial<UserSettings>) { this.settings = { ...this.settings, ...changes }; if (this.remote) await this.request('/settings', { method: 'PUT', body: JSON.stringify(this.settings) }); else localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(this.settings)); return this.getSettings(); }
  public async togglePin(id: string) { return this.updateSong(id, { isPinned: !this.getSongById(id)?.isPinned }); }
  public async toggleFavorite(id: string) { return this.updateSong(id, { isFavorite: !this.getSongById(id)?.isFavorite }); }
  public async addSong(songData: Omit<Song, 'id' | 'createdAt' | 'views'>) { const song: Song = this.remote ? await this.request('/songs', { method: 'POST', body: JSON.stringify(songData) }) : { ...songData, id: `song-${Date.now()}`, views: 0, createdAt: new Date().toISOString().slice(0, 10) }; this.songs = [song, ...this.songs.filter((item) => item.id !== song.id)]; this.persistLocal(); return song; }
  public async updateSong(id: string, updates: Partial<Song>) { const song = this.remote ? await this.request(`/songs/${encodeURIComponent(id)}`, { method: 'PUT', body: JSON.stringify(updates) }) : { ...this.getSongById(id), ...updates }; if (!song || !this.getSongById(id)) return undefined; this.songs = this.songs.map((item) => item.id === id ? song : item); this.persistLocal(); return song; }
  public async deleteSong(id: string) { if (this.remote) await this.request(`/songs/${encodeURIComponent(id)}`, { method: 'DELETE' }); const before = this.songs.length; this.songs = this.songs.filter((song) => song.id !== id); this.persistLocal(); return before !== this.songs.length; }
  public async addCategory(category: Omit<Category, 'id' | 'trackCount'>) { const created = this.remote ? await this.request('/categories', { method: 'POST', body: JSON.stringify(category) }) : { ...category, id: `${category.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now()}`, trackCount: 0 }; this.categories = [...this.categories.filter((item) => item.id !== created.id), created]; this.persistLocal(); return created; }
  public async deleteCategory(id: string) { if (this.remote) await this.request(`/categories/${encodeURIComponent(id)}`, { method: 'DELETE' }); this.categories = this.categories.filter((category) => category.id !== id); this.persistLocal(); }
  private persistLocal() { if (this.remote) return; localStorage.setItem(STORAGE_KEYS.SONGS, JSON.stringify(this.songs)); localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(this.categories)); }
}
export const sqlDb = new SqlDatabaseService();
