import { INITIAL_CATEGORIES, INITIAL_SONGS } from '../data/initialData';
import { Category, Song, UserSettings } from '../types';

const STORAGE_KEYS = {
  SONGS: 'el_roi_tunes_songs_v1',
  CATEGORIES: 'el_roi_tunes_categories_v1',
  SETTINGS: 'el_roi_tunes_settings_v1',
};

export const DEFAULT_USER_SETTINGS: UserSettings = {
  fontSize: 18,
  fontFamily: 'serif',
  themeMode: 'light',
  lineSpacing: 'relaxed',
  autoScrollSpeed: 3,
  showChordDiagrams: true,
  hapticFeedback: true,
};

class SqlDatabaseService {
  private songs: Song[] = [];
  private categories: Category[] = [];
  private settings: UserSettings = DEFAULT_USER_SETTINGS;

  constructor() {
    this.init();
  }

  private init() {
    try {
      const storedSongs = localStorage.getItem(STORAGE_KEYS.SONGS);
      if (storedSongs) {
        this.songs = JSON.parse(storedSongs);
      } else {
        this.songs = INITIAL_SONGS;
        this.saveSongsToStorage();
      }

      const storedCategories = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
      if (storedCategories) {
        this.categories = JSON.parse(storedCategories);
      } else {
        this.categories = INITIAL_CATEGORIES;
        this.saveCategoriesToStorage();
      }

      const storedSettings = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (storedSettings) {
        this.settings = { ...DEFAULT_USER_SETTINGS, ...JSON.parse(storedSettings) };
      }
    } catch {
      this.songs = INITIAL_SONGS;
      this.categories = INITIAL_CATEGORIES;
      this.settings = DEFAULT_USER_SETTINGS;
    }
  }

  private saveSongsToStorage() {
    try {
      localStorage.setItem(STORAGE_KEYS.SONGS, JSON.stringify(this.songs));
    } catch {
      // ignore
    }
  }

  private saveCategoriesToStorage() {
    try {
      localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(this.categories));
    } catch {
      // ignore
    }
  }

  public getSongs(): Song[] {
    return [...this.songs];
  }

  public getCategories(): Category[] {
    return [...this.categories];
  }

  public getSettings(): UserSettings {
    return { ...this.settings };
  }

  public updateSettings(newSettings: Partial<UserSettings>): UserSettings {
    this.settings = { ...this.settings, ...newSettings };
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(this.settings));
    } catch {
      // ignore
    }
    return { ...this.settings };
  }

  public getSongById(id: string): Song | undefined {
    return this.songs.find((s) => s.id === id);
  }

  public togglePin(id: string): Song | undefined {
    const song = this.songs.find((s) => s.id === id);
    if (song) {
      song.isPinned = !song.isPinned;
      this.saveSongsToStorage();
    }
    return song;
  }

  public toggleFavorite(id: string): Song | undefined {
    const song = this.songs.find((s) => s.id === id);
    if (song) {
      song.isFavorite = !song.isFavorite;
      this.saveSongsToStorage();
    }
    return song;
  }

  public addSong(songData: Omit<Song, 'id' | 'createdAt' | 'views'>): Song {
    const song: Song = { ...songData, id: `song-${Date.now()}`, views: 0, createdAt: new Date().toISOString().slice(0, 10) };
    this.songs.unshift(song);
    this.saveSongsToStorage();
    return song;
  }

  public updateSong(id: string, updates: Partial<Song>): Song | undefined {
    const index = this.songs.findIndex((song) => song.id === id);
    if (index === -1) return undefined;
    this.songs[index] = { ...this.songs[index], ...updates };
    this.saveSongsToStorage();
    return this.songs[index];
  }

  public deleteSong(id: string): boolean {
    const next = this.songs.filter((song) => song.id !== id);
    if (next.length === this.songs.length) return false;
    this.songs = next;
    this.saveSongsToStorage();
    return true;
  }

  public addCategory(category: Omit<Category, 'id' | 'trackCount'>): Category {
    const newCategory = { ...category, id: `${category.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now()}`, trackCount: 0 };
    this.categories.push(newCategory);
    this.saveCategoriesToStorage();
    return newCategory;
  }

  public deleteCategory(id: string): void {
    this.categories = this.categories.filter((category) => category.id !== id);
    this.saveCategoriesToStorage();
  }

}

export const sqlDb = new SqlDatabaseService();
