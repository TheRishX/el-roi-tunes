export interface Song {
  id: string;
  title: string;
  artist: string;
  category: string;
  language: 'English' | 'Hindi' | 'Nepali' | 'Spanish' | 'Portuguese' | string;
  coverImage: string;
  lyrics: string;
  chordsLyrics: string;
  defaultKey: string;
  bpm?: number;
  tempo?: string;
  videoUrl?: string;
  audioUrl?: string;
  isPinned: boolean;
  isFavorite: boolean;
  views: number;
  year?: number;
  status: 'Approved' | 'Pending' | 'Draft';
  uploadedBy: string;
  createdAt: string;
  timestamps?: { time: number; text: string }[];
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  trackCount: number;
  languages: string[];
  description: string;
  coverImage?: string;
  isPopular?: boolean;
}

export interface UserSettings {
  fontSize: number; // 14 to 34
  fontFamily: 'serif' | 'sans';
  themeMode: 'light' | 'sepia' | 'dark' | 'high-contrast';
  lineSpacing: 'normal' | 'relaxed' | 'spacious';
  autoScrollSpeed: number; // 1 to 10
  showChordDiagrams: boolean;
  hapticFeedback: boolean;
}

export type TabType = 'home' | 'search' | 'favorites';
export type SongViewMode = 'lyrics' | 'chords' | 'video';
