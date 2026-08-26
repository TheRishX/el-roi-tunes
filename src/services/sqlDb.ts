import { Category, MediaItem, Song, UserSettings } from '../types';

export const DEFAULT_USER_SETTINGS: UserSettings = { fontSize: 18, fontFamily: 'serif', themeMode: 'light', lineSpacing: 'relaxed', autoScrollSpeed: 3, showChordDiagrams: true, hapticFeedback: true };
const API_URL = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');
export const api = (path: string) => `${API_URL}/api${path}`;

class SqlDatabaseService {
  private songs: Song[] = [];
  private categories: Category[] = [];
  private mediaItems: MediaItem[] = [];
  private settings: UserSettings = DEFAULT_USER_SETTINGS;
  public readonly ready: Promise<void>;
  constructor() { this.ready = this.init(); }

  private async init() {
    await this.reload();
  }

  private async request(path: string, options: RequestInit = {}) {
    const response = await fetch(api(path), { ...options, credentials: 'include', headers: { 'Content-Type': 'application/json', ...(options.headers || {}) } });
    if (!response.ok) { const message = await response.text(); try { throw new Error(JSON.parse(message).error || `Request failed (${response.status})`); } catch (error) { if (error instanceof Error && error.message !== message) throw error; throw new Error(message || `Request failed (${response.status})`); } }
    return response.status === 204 ? null : response.json();
  }
  public async reload() {
    const data = await this.request('/bootstrap');
    this.songs = data.songs || [];
    this.categories = data.categories || [];
    this.mediaItems = data.mediaItems || [];
    this.settings = { ...DEFAULT_USER_SETTINGS, ...(data.settings || {}) };
  }
  public getSongs() { return [...this.songs]; }
  public getCategories() { return [...this.categories]; }
  public getMediaItems() { return [...this.mediaItems]; }
  public getSettings() { return { ...this.settings }; }
  public getSongById(id: string) { return this.songs.find((song) => song.id === id); }
  public async updateSettings(changes: Partial<UserSettings>) { const settings = await this.request('/settings', { method: 'PUT', body: JSON.stringify({ ...this.settings, ...changes }) }); this.settings = { ...DEFAULT_USER_SETTINGS, ...settings }; return this.getSettings(); }
  public async togglePin(id: string) { return this.updateSong(id, { isPinned: !this.getSongById(id)?.isPinned }); }
  public async toggleFavorite(id: string) { return this.updateSong(id, { isFavorite: !this.getSongById(id)?.isFavorite }); }
  public async addSong(songData: Omit<Song, 'id' | 'createdAt' | 'views'>) { const song: Song = await this.request('/songs', { method: 'POST', body: JSON.stringify(songData) }); await this.reload(); return song; }
  public async addMedia(url: string) { const media: MediaItem = await this.request('/media', { method: 'POST', body: JSON.stringify({ url }) }); await this.reload(); return media; }
  public async deleteMedia(id: string) { await this.request(`/media/${encodeURIComponent(id)}`, { method: 'DELETE' }); await this.reload(); }
  public async deleteSongVideo(id: string, mediaLinks: string[], audioUrl: string) { await this.request(`/songs/${encodeURIComponent(id)}/media`, { method: 'DELETE', body: JSON.stringify({ mediaLinks, audioUrl }) }); await this.reload(); }
  public async updateSong(id: string, updates: Partial<Song>) { const song: Song = await this.request(`/songs/${encodeURIComponent(id)}`, { method: 'PUT', body: JSON.stringify(updates) }); await this.reload(); return song; }
  public async deleteSong(id: string) { await this.request(`/songs/${encodeURIComponent(id)}`, { method: 'DELETE' }); await this.reload(); return true; }
  public async addCategory(category: Omit<Category, 'id' | 'trackCount'>) { const created = await this.request('/categories', { method: 'POST', body: JSON.stringify(category) }); await this.reload(); return created; }
  public async deleteCategory(id: string) { await this.request(`/categories/${encodeURIComponent(id)}`, { method: 'DELETE' }); await this.reload(); }
}
export const sqlDb = new SqlDatabaseService();
