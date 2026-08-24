// Music chord transposition and chord parsing engine

const SCALE_SHARPS = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const SCALE_FLATS  = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];

const CHORD_REGEX = /^([A-G][b#]?)(.*)$/;

export function transposeNote(note: string, semitones: number, preferFlats = false): string {
  const match = note.match(/^([A-G][b#]?)/);
  if (!match) return note;

  const root = match[1];
  let index = SCALE_SHARPS.indexOf(root);
  if (index === -1) {
    index = SCALE_FLATS.indexOf(root);
  }
  if (index === -1) return note;

  let newIndex = (index + semitones) % 12;
  if (newIndex < 0) newIndex += 12;

  const scale = preferFlats ? SCALE_FLATS : SCALE_SHARPS;
  return scale[newIndex] + note.slice(root.length);
}

export function transposeChord(chord: string, semitones: number): string {
  if (semitones === 0) return chord;
  
  // Handle slash chords like D/F# or G/B
  if (chord.includes('/')) {
    const [top, bottom] = chord.split('/');
    return `${transposeChord(top, semitones)}/${transposeChord(bottom, semitones)}`;
  }

  const match = chord.match(CHORD_REGEX);
  if (!match) return chord;

  const [, root, suffix] = match;
  let index = SCALE_SHARPS.indexOf(root);
  let isFlat = false;
  if (index === -1) {
    index = SCALE_FLATS.indexOf(root);
    isFlat = true;
  }
  if (index === -1) return chord;

  let newIndex = (index + semitones) % 12;
  if (newIndex < 0) newIndex += 12;

  const scale = isFlat ? SCALE_FLATS : SCALE_SHARPS;
  return scale[newIndex] + suffix;
}

export function transposeChordsText(text: string, semitones: number): string {
  if (semitones === 0) return text;
  return text.replace(/\[([A-Ga-g][b#]?[^\]]*)\]/g, (_, chord) => {
    return `[${transposeChord(chord, semitones)}]`;
  });
}

// Convert [Chord]word text into parsed line tokens for crisp display
export interface ChordLyricToken {
  chord?: string;
  lyric: string;
}

export interface ParsedLine {
  isSectionHeader: boolean;
  tokens: ChordLyricToken[];
  rawText: string;
}

export function parseChordLyrics(text: string): ParsedLine[] {
  const lines = text.split('\n');
  return lines.map((line) => {
    const trimmed = line.trim();
    if (trimmed.startsWith('[Chorus]') || trimmed.startsWith('[Verse') || trimmed.startsWith('[Bridge]') || trimmed.startsWith('[Intro]') || trimmed.startsWith('[Outro]')) {
      return {
        isSectionHeader: true,
        tokens: [],
        rawText: trimmed,
      };
    }

    const tokens: ChordLyricToken[] = [];
    const regex = /\[([^\]]+)\]([^\[]*)/g;
    let match: RegExpExecArray | null;
    let lastIndex = 0;

    // Check if line contains any brackets
    if (!line.includes('[')) {
      return {
        isSectionHeader: false,
        tokens: [{ lyric: line }],
        rawText: line,
      };
    }

    // Leading text before first chord
    const firstBracket = line.indexOf('[');
    if (firstBracket > 0) {
      tokens.push({
        lyric: line.slice(0, firstBracket),
      });
      lastIndex = firstBracket;
    }

    while ((match = regex.exec(line)) !== null) {
      tokens.push({
        chord: match[1],
        lyric: match[2] || '',
      });
      lastIndex = regex.lastIndex;
    }

    if (lastIndex < line.length && tokens.length === 0) {
      tokens.push({ lyric: line.slice(lastIndex) });
    }

    return {
      isSectionHeader: false,
      tokens,
      rawText: line,
    };
  });
}

// Web Audio API Gentle Chord Tone Player
class AudioSynthService {
  private ctx: AudioContext | null = null;

  private getContext(): AudioContext {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  playChordTone(chordName: string) {
    try {
      const ctx = this.getContext();
      const freqMap: Record<string, number> = {
        'C': 261.63, 'C#': 277.18, 'Db': 277.18,
        'D': 293.66, 'D#': 311.13, 'Eb': 311.13,
        'E': 329.63, 'F': 349.23, 'F#': 369.99, 'Gb': 369.99,
        'G': 392.00, 'G#': 415.30, 'Ab': 415.30,
        'A': 440.00, 'A#': 466.16, 'Bb': 466.16,
        'B': 493.88
      };

      const match = chordName.match(/^([A-G][b#]?)/);
      const root = match ? match[1] : 'C';
      const baseFreq = freqMap[root] || 261.63;

      // Play soft harmonized triad
      const intervals = chordName.includes('m') && !chordName.includes('maj') ? [1, 1.189, 1.498] : [1, 1.259, 1.498];
      
      intervals.forEach((interval, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(baseFreq * interval, ctx.currentTime);
        
        gain.gain.setValueAtTime(0, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.08 / (i + 1), ctx.currentTime + 0.05 + i * 0.04);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1.2);
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        osc.start(ctx.currentTime + i * 0.04);
        osc.stop(ctx.currentTime + 1.3);
      });
    } catch {
      // Audio context might be restricted before user interaction
    }
  }

  playMetronomeClick() {
    try {
      const ctx = this.getContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.06);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.07);
    } catch {
      // ignore
    }
  }
}

export const audioSynth = new AudioSynthService();

// Web Speech API voice reader
export class SpeechReaderService {
  private utterance: SpeechSynthesisUtterance | null = null;

  speakLyrics(text: string, onEnd?: () => void) {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();

    // Clean brackets from lyrics
    const cleanText = text.replace(/\[[^\]]+\]/g, '').replace(/\n+/g, '. ');
    this.utterance = new SpeechSynthesisUtterance(cleanText);
    this.utterance.rate = 0.88; // Slower, clearer cadence for older persons
    this.utterance.pitch = 1.0;
    
    if (onEnd) {
      this.utterance.onend = onEnd;
    }

    window.speechSynthesis.speak(this.utterance);
  }

  stop() {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }

  isSpeaking(): boolean {
    if ('speechSynthesis' in window) {
      return window.speechSynthesis.speaking;
    }
    return false;
  }
}

export const speechReader = new SpeechReaderService();
