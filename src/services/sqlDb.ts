import { INITIAL_CATEGORIES, INITIAL_SONGS } from '../data/initialData';
import { Category, Song, UserSettings } from '../types';

const STORAGE_KEYS = {
  SONGS: 'el_roi_tunes_songs_v1',
  CATEGORIES: 'el_roi_tunes_categories_v1',
  SETTINGS: 'el_roi_tunes_settings_v1',
  FAVORITES: 'el_roi_tunes_favorites_v1',
};

export const SQL_SCHEMA_DDL = `-- ==========================================
-- EL ROI TUNES - RELATIONAL DATABASE SCHEMA
-- Compatible with PostgreSQL, SQLite, Cloud SQL, MySQL
-- ==========================================

-- 1. Categories Table
CREATE TABLE IF NOT EXISTS categories (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(128) NOT NULL,
    icon VARCHAR(64) DEFAULT 'music_note',
    track_count INT DEFAULT 0,
    languages TEXT[] DEFAULT ARRAY['EN'],
    description TEXT,
    cover_image TEXT,
    is_popular BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Songs & Lyrics Table
CREATE TABLE IF NOT EXISTS songs (
    id VARCHAR(64) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    artist VARCHAR(255) NOT NULL,
    category_id VARCHAR(64) REFERENCES categories(id) ON DELETE SET NULL,
    language VARCHAR(32) DEFAULT 'English',
    cover_image TEXT,
    lyrics TEXT NOT NULL,
    chords_lyrics TEXT NOT NULL,
    default_key VARCHAR(8) DEFAULT 'C',
    bpm INT DEFAULT 70,
    tempo VARCHAR(16) DEFAULT '4/4',
    video_url TEXT,
    audio_url TEXT,
    is_pinned BOOLEAN DEFAULT FALSE,
    is_favorite BOOLEAN DEFAULT FALSE,
    views_count INT DEFAULT 0,
    release_year INT,
    status VARCHAR(16) CHECK (status IN ('Approved', 'Pending', 'Draft')) DEFAULT 'Approved',
    uploaded_by VARCHAR(128) DEFAULT 'Admin',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Synced Lyrics Timestamps (Karaoke Engine)
CREATE TABLE IF NOT EXISTS song_timestamps (
    id SERIAL PRIMARY KEY,
    song_id VARCHAR(64) REFERENCES songs(id) ON DELETE CASCADE,
    second_mark DECIMAL(6, 2) NOT NULL,
    lyric_line TEXT NOT NULL,
    line_order INT NOT NULL
);

-- 4. User Favorites & Pins
CREATE TABLE IF NOT EXISTS user_favorites (
    user_id VARCHAR(64) NOT NULL,
    song_id VARCHAR(64) REFERENCES songs(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, song_id)
);

-- Performance Indexes
CREATE INDEX IF NOT EXISTS idx_songs_title ON songs(title);
CREATE INDEX IF NOT EXISTS idx_songs_artist ON songs(artist);
CREATE INDEX IF NOT EXISTS idx_songs_language ON songs(language);
CREATE INDEX IF NOT EXISTS idx_songs_category ON songs(category_id);
CREATE INDEX IF NOT EXISTS idx_songs_is_pinned ON songs(is_pinned);
`;

export const DEFAULT_USER_SETTINGS: UserSettings = {
  seniorMode: false,
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

  public incrementViews(id: string) {
    const song = this.songs.find((s) => s.id === id);
    if (song) {
      song.views += 1;
      this.saveSongsToStorage();
    }
  }

  public addSong(songData: Omit<Song, 'id' | 'createdAt' | 'views'>): Song {
    const newSong: Song = {
      ...songData,
      id: `song-${Date.now()}`,
      views: 0,
      createdAt: new Date().toISOString().split('T')[0],
    };
    this.songs.unshift(newSong);
    this.saveSongsToStorage();

    // Update category track count
    const cat = this.categories.find((c) => c.name.toLowerCase() === songData.category.toLowerCase());
    if (cat) {
      cat.trackCount += 1;
      this.saveCategoriesToStorage();
    }

    return newSong;
  }

  public updateSong(id: string, updates: Partial<Song>): Song | undefined {
    const index = this.songs.findIndex((s) => s.id === id);
    if (index !== -1) {
      this.songs[index] = { ...this.songs[index], ...updates };
      this.saveSongsToStorage();
      return this.songs[index];
    }
    return undefined;
  }

  public deleteSong(id: string): boolean {
    const initialLen = this.songs.length;
    this.songs = this.songs.filter((s) => s.id !== id);
    if (this.songs.length !== initialLen) {
      this.saveSongsToStorage();
      return true;
    }
    return false;
  }

  public addCategory(catData: Omit<Category, 'id' | 'trackCount'>): Category {
    const newCat: Category = {
      ...catData,
      id: catData.name.toLowerCase().replace(/\s+/g, '-'),
      trackCount: 0,
    };
    this.categories.push(newCat);
    this.saveCategoriesToStorage();
    return newCat;
  }

  public deleteCategory(id: string): boolean {
    this.categories = this.categories.filter((c) => c.id !== id);
    this.saveCategoriesToStorage();
    return true;
  }

  public generateSqlDump(): string {
    let sql = SQL_SCHEMA_DDL + '\n\n-- ==========================================\n-- SEED DATA INSERT STATEMENTS\n-- ==========================================\n\n';

    // Insert Categories
    this.categories.forEach((c) => {
      const escapedDesc = c.description.replace(/'/g, "''");
      const langs = `ARRAY[${c.languages.map((l) => `'${l}'`).join(', ')}]`;
      sql += `INSERT INTO categories (id, name, icon, track_count, languages, description, cover_image, is_popular)
VALUES ('${c.id}', '${c.name.replace(/'/g, "''")}', '${c.icon}', ${c.trackCount}, ${langs}, '${escapedDesc}', '${c.coverImage || ''}', ${c.isPopular ? 'TRUE' : 'FALSE'})
ON CONFLICT (id) DO UPDATE SET track_count = EXCLUDED.track_count;\n`;
    });

    sql += '\n';

    // Insert Songs
    this.songs.forEach((s) => {
      const escTitle = s.title.replace(/'/g, "''");
      const escArtist = s.artist.replace(/'/g, "''");
      const escLyrics = s.lyrics.replace(/'/g, "''");
      const escChords = s.chordsLyrics.replace(/'/g, "''");
      const catId = s.category.toLowerCase();

      sql += `INSERT INTO songs (id, title, artist, category_id, language, cover_image, lyrics, chords_lyrics, default_key, bpm, tempo, video_url, is_pinned, is_favorite, views_count, release_year, status, uploaded_by)
VALUES ('${s.id}', '${escTitle}', '${escArtist}', '${catId}', '${s.language}', '${s.coverImage}', '${escLyrics}', '${escChords}', '${s.defaultKey}', ${s.bpm || 70}, '${s.tempo || '4/4'}', '${s.videoUrl || ''}', ${s.isPinned ? 'TRUE' : 'FALSE'}, ${s.isFavorite ? 'TRUE' : 'FALSE'}, ${s.views}, ${s.year || 2026}, '${s.status}', '${s.uploadedBy.replace(/'/g, "''")}')
ON CONFLICT (id) DO NOTHING;\n`;
    });

    return sql;
  }

  // Live SQL Query Evaluator simulation for the admin console
  public executeSimulatedQuery(query: string): { columns: string[]; rows: (string | number | boolean)[][]; error?: string } {
    const q = query.trim().toUpperCase();
    
    try {
      if (q.startsWith('SELECT') && q.includes('FROM SONGS')) {
        let filtered = [...this.songs];

        if (q.includes("WHERE LANGUAGE = 'HINDI'") || q.includes('WHERE LANGUAGE=\'HINDI\'')) {
          filtered = filtered.filter((s) => s.language.toLowerCase() === 'hindi');
        } else if (q.includes("WHERE LANGUAGE = 'ENGLISH'") || q.includes('WHERE LANGUAGE=\'ENGLISH\'')) {
          filtered = filtered.filter((s) => s.language.toLowerCase() === 'english');
        } else if (q.includes("WHERE LANGUAGE = 'NEPALI'") || q.includes('WHERE LANGUAGE=\'NEPALI\'')) {
          filtered = filtered.filter((s) => s.language.toLowerCase() === 'nepali');
        } else if (q.includes('WHERE IS_PINNED = 1') || q.includes('WHERE IS_PINNED = TRUE')) {
          filtered = filtered.filter((s) => s.isPinned);
        } else if (q.includes("WHERE STATUS = 'APPROVED'") || q.includes('WHERE STATUS=\'APPROVED\'')) {
          filtered = filtered.filter((s) => s.status === 'Approved');
        } else if (q.includes("WHERE STATUS = 'PENDING'") || q.includes('WHERE STATUS=\'PENDING\'')) {
          filtered = filtered.filter((s) => s.status === 'Pending');
        }

        const columns = ['id', 'title', 'artist', 'category', 'language', 'default_key', 'views', 'status'];
        const rows = filtered.map((s) => [s.id, s.title, s.artist, s.category, s.language, s.defaultKey, s.views, s.status]);
        return { columns, rows };
      }

      if (q.startsWith('SELECT') && q.includes('FROM CATEGORIES')) {
        const columns = ['id', 'name', 'track_count', 'languages', 'is_popular'];
        const rows = this.categories.map((c) => [c.id, c.name, c.trackCount, c.languages.join(', '), c.isPopular ? 'TRUE' : 'FALSE']);
        return { columns, rows };
      }

      // Default fallback select
      const columns = ['id', 'title', 'artist', 'language', 'status'];
      const rows = this.songs.slice(0, 5).map((s) => [s.id, s.title, s.artist, s.language, s.status]);
      return { columns, rows };
    } catch (err: unknown) {
      return { columns: [], rows: [], error: err instanceof Error ? err.message : 'Invalid SQL statement' };
    }
  }

  public resetToDefault() {
    this.songs = INITIAL_SONGS;
    this.categories = INITIAL_CATEGORIES;
    this.settings = DEFAULT_USER_SETTINGS;
    this.saveSongsToStorage();
    this.saveCategoriesToStorage();
    localStorage.removeItem(STORAGE_KEYS.SETTINGS);
  }
}

export const sqlDb = new SqlDatabaseService();
