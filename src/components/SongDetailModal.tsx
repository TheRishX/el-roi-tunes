import React, { useState, useEffect, useRef } from 'react';
import { Song, SongViewMode, UserSettings } from '../types';
import {
  ArrowLeft,
  Bookmark,
  Check,
  ChevronDown,
  Copy,
  FastForward,
  Headphones,
  Heart,
  Minus,
  Moon,
  MoveUpRight,
  Maximize2,
  Minimize2,
  Music,
  Pause,
  Play,
  Plus,
  Printer,
  RotateCcw,
  Share2,
  Sliders,
  Sun,
  Type,
  Volume2,
  VolumeX,
  X,
  Youtube,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import {
  audioSynth,
  parseChordLyrics,
  speechReader,
  transposeChordsText,
  transposeNote,
} from '../utils/chordUtils';

interface SongDetailModalProps {
  song: Song;
  onClose: () => void;
  onTogglePin: (songId: string) => void;
  onToggleFavorite: (songId: string) => void;
  userSettings: UserSettings;
  onUpdateSettings: (settings: Partial<UserSettings>) => void;
}

export const SongDetailModal: React.FC<SongDetailModalProps> = ({
  song,
  onClose,
  onTogglePin,
  onToggleFavorite,
  userSettings,
  onUpdateSettings,
}) => {
  const [viewMode, setViewMode] = useState<SongViewMode>('lyrics');
  const [semitones, setSemitones] = useState<number>(0);
  const [isAutoScrolling, setIsAutoScrolling] = useState<boolean>(false);
  const [scrollSpeed, setScrollSpeed] = useState<number>(userSettings.autoScrollSpeed || 3);
  const [showTypographySheet, setShowTypographySheet] = useState<boolean>(false);
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [isFullPage, setIsFullPage] = useState<boolean>(false);

  // Audio / Karaoke Sync state
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [activeTimestampIndex, setActiveTimestampIndex] = useState<number>(0);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const autoScrollTimerRef = useRef<number | null>(null);
  const audioIntervalRef = useRef<number | null>(null);

  // Current transposed key
  const currentKey = transposeNote(song.defaultKey, semitones);

  // Transposed lyrics & chords
  const currentChordsText = transposeChordsText(song.chordsLyrics, semitones);
  const parsedLines = parseChordLyrics(currentChordsText);
  const mediaLinks = song.mediaLinks?.length
    ? song.mediaLinks
    : [song.videoUrl, song.audioUrl].filter((link): link is string => Boolean(link));
  const playableVideoUrl = song.videoUrl || mediaLinks.find((link) => /youtube\.com|youtu\.be/i.test(link));

  // Auto-scroll loop
  useEffect(() => {
    if (isAutoScrolling) {
      const step = () => {
        if (scrollContainerRef.current) {
          scrollContainerRef.current.scrollTop += scrollSpeed * 0.7;
          // Stop if reached bottom
          if (
            scrollContainerRef.current.scrollTop + scrollContainerRef.current.clientHeight >=
            scrollContainerRef.current.scrollHeight - 5
          ) {
            setIsAutoScrolling(false);
            return;
          }
        }
        autoScrollTimerRef.current = requestAnimationFrame(step);
      };
      autoScrollTimerRef.current = requestAnimationFrame(step);
    } else {
      if (autoScrollTimerRef.current) {
        cancelAnimationFrame(autoScrollTimerRef.current);
      }
    }
    return () => {
      if (autoScrollTimerRef.current) {
        cancelAnimationFrame(autoScrollTimerRef.current);
      }
    };
  }, [isAutoScrolling, scrollSpeed]);

  // Audio / Karaoke simulation timer
  useEffect(() => {
    if (isPlayingAudio) {
      audioIntervalRef.current = window.setInterval(() => {
        setCurrentTime((prev) => {
          const next = prev + 0.5;
          if (song.timestamps && song.timestamps.length > 0) {
            const idx = song.timestamps.findIndex((t, i) => {
              const nextT = song.timestamps![i + 1];
              return next >= t.time && (!nextT || next < nextT.time);
            });
            if (idx !== -1) setActiveTimestampIndex(idx);
          }
          return next;
        });
      }, 500);
    } else {
      if (audioIntervalRef.current) clearInterval(audioIntervalRef.current);
    }
    return () => {
      if (audioIntervalRef.current) clearInterval(audioIntervalRef.current);
    };
  }, [isPlayingAudio, song.timestamps]);

  const handleCopy = () => {
    const content = viewMode === 'chords' ? currentChordsText : song.lyrics;
    navigator.clipboard.writeText(`${song.title} - ${song.artist}\n\n${content}`);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${song.title} Lyrics`,
          text: `Check out the lyrics & chords for "${song.title}" by ${song.artist} on El Roi Tunes`,
          url: window.location.href,
        });
      } catch {
        handleCopy();
      }
    } else {
      handleCopy();
    }
  };

  const handleToggleSpeech = () => {
    if (isSpeaking) {
      speechReader.stop();
      setIsSpeaking(false);
    } else {
      setIsSpeaking(true);
      speechReader.speakLyrics(song.lyrics, () => setIsSpeaking(false));
    }
  };

  const handlePrint = () => {
    window.print();
  };

  // Compute theme styles
  const getThemeClasses = () => {
    switch (userSettings.themeMode) {
      case 'sepia':
        return 'bg-[#f4ecd8] text-[#433422]';
      case 'dark':
        return 'bg-[#18181b] text-[#f4f4f5]';
      case 'high-contrast':
        return 'bg-black text-[#ffffff] font-bold';
      case 'light':
      default:
        return 'bg-[#fcf9f8] text-[#1c1b1b]';
    }
  };

  const getLineHeightClass = () => {
    switch (userSettings.lineSpacing) {
      case 'spacious':
        return 'leading-loose';
      case 'relaxed':
        return 'leading-relaxed';
      case 'normal':
      default:
        return 'leading-normal';
    }
  };

  const effectiveFontSize = userSettings.fontSize;

  return (
    <motion.div
      id="song-detail-modal"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 30 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className={`fixed inset-0 z-50 overflow-hidden flex flex-col ${getThemeClasses()}`}
    >
      {/* Top Header Bar (matching Image 5.png) */}
      <header className={`${isFullPage ? 'hidden' : 'flex'} shrink-0 h-16 px-4 sm:px-6 items-center justify-between border-b border-[#e5e2e1]/80 ios-glass z-20`}>
        <button
          id="btn-close-song-detail"
          onClick={() => {
            speechReader.stop();
            onClose();
          }}
          className="w-10 h-10 rounded-full flex items-center justify-center text-[#3e5219] hover:bg-[#3e5219]/10 active:scale-95 transition-all"
          aria-label="Back to library"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>

        <h1 className="font-serif text-xl sm:text-2xl font-bold text-[#3e5219] tracking-tight">
          El Roi Tunes
        </h1>

        <div className="flex items-center gap-1">
          {/* Pin action */}
          <button
            id="btn-modal-pin"
            onClick={() => onTogglePin(song.id)}
            title={song.isPinned ? 'Unpin' : 'Pin to Home'}
            className="w-10 h-10 rounded-full flex items-center justify-center text-[#3e5219] hover:bg-[#3e5219]/10 active:scale-90 transition-all"
          >
            <Bookmark
              className={`w-5 h-5 ${song.isPinned ? 'fill-[#3e5219]' : ''}`}
            />
          </button>

          {/* Favorite action */}
          <button
            id="btn-modal-favorite"
            onClick={() => onToggleFavorite(song.id)}
            title={song.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            className="w-10 h-10 rounded-full flex items-center justify-center text-[#ba1a1a] hover:bg-[#ba1a1a]/10 active:scale-90 transition-all"
          >
            <Heart
              className={`w-5 h-5 ${song.isFavorite ? 'fill-[#ba1a1a]' : ''}`}
            />
          </button>

          {/* Share */}
          <button
            onClick={handleShare}
            title="Share Song"
            className="w-10 h-10 rounded-full flex items-center justify-center text-[#5d5f5f] hover:bg-[#3e5219]/10 active:scale-90 transition-all"
          >
            <Share2 className="w-5 h-5" />
          </button>

          <button
            onClick={() => setIsFullPage(true)}
            title="Open full page reader"
            aria-label="Open full page reader"
            className="w-10 h-10 rounded-full flex items-center justify-center text-[#5d5f5f] hover:bg-[#3e5219]/10 active:scale-90 transition-all"
          >
            <Maximize2 className="w-5 h-5" />
          </button>
        </div>
      </header>

      {isFullPage && (
        <div className="fixed top-3 right-3 z-30">
          <button
            onClick={() => setIsFullPage(false)}
            aria-label="Exit full page reader"
            className="flex min-h-11 items-center gap-2 rounded-full bg-black/65 px-4 text-sm font-semibold text-white shadow-lg backdrop-blur-md"
          >
            <Minimize2 className="w-4 h-4" /> Exit full page
          </button>
        </div>
      )}

      {/* Main Scrollable Canvas */}
      <div
        ref={scrollContainerRef}
        className={`flex-1 overflow-y-auto hide-scrollbar w-full relative space-y-6 ${isFullPage ? 'max-w-5xl mx-auto px-4 sm:px-10 py-14' : 'max-w-3xl mx-auto px-4 sm:px-6 py-6'}`}
      >
        {isFullPage && (
          <div className="border-b border-current/10 pb-5">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] opacity-60">Full page reader</p>
            <h2 className="mt-1 font-serif text-3xl sm:text-4xl">{song.title}</h2>
            <p className="mt-1 text-sm opacity-65">{song.artist}</p>
          </div>
        )}
        {/* Song Info Header */}
        {!isFullPage && <section className="text-center pt-2 space-y-1.5">
          <h2
            className={`font-bold tracking-tight text-[#1c1b1b] ${
              userSettings.fontFamily === 'serif' ? 'font-serif' : 'font-sans'
            } text-2xl sm:text-3xl md:text-4xl`}
          >
            {song.title}
          </h2>
          <p className="text-sm sm:text-base text-[#5d5f5f] font-medium">
            {song.artist}
          </p>

          <div className="flex items-center justify-center gap-2.5 pt-1 text-xs text-[#75796b]">
            <span className="bg-[#3e5219]/10 text-[#3e5219] font-semibold px-2.5 py-0.5 rounded-full">
              {song.language}
            </span>
            <span>•</span>
            <span className="font-mono font-medium">Key: {currentKey}</span>
            {song.bpm && (
              <>
                <span>•</span>
                <span>{song.bpm} BPM</span>
              </>
            )}
            <span>•</span>
            <span>{song.category}</span>
          </div>
        </section>}

        {/* Segmented Control Tabs (matching Image 5.png: [ Lyrics ] [ Chords ] [ ▷ Video ]) */}
        {!isFullPage && <section className="flex items-center justify-center gap-3">
          <button
            id="tab-mode-lyrics"
            onClick={() => setViewMode('lyrics')}
            className={`px-6 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 shadow-sm ${
              viewMode === 'lyrics'
                ? 'bg-[#3e5219] text-white shadow-md'
                : 'bg-white border border-[#c5c8b8] text-[#45483c] hover:bg-[#e5e2e1]'
            }`}
          >
            Lyrics
          </button>

          <button
            id="tab-mode-chords"
            onClick={() => setViewMode('chords')}
            className={`px-6 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 shadow-sm ${
              viewMode === 'chords'
                ? 'bg-[#3e5219] text-white shadow-md'
                : 'bg-white border border-[#c5c8b8] text-[#45483c] hover:bg-[#e5e2e1]'
            }`}
          >
            Chords
          </button>

          <button
            id="tab-mode-video"
            onClick={() => setViewMode('video')}
            className={`px-6 py-2.5 rounded-full text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition-all duration-200 shadow-sm ${
              viewMode === 'video'
                ? 'bg-[#3e5219] text-white shadow-md'
                : 'bg-white border border-[#c5c8b8] text-[#45483c] hover:bg-[#e5e2e1]'
            }`}
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Video & Audio</span>
          </button>
        </section>}

        {/* Chords Transposer Tool Bar (When in Chords mode) */}
        {!isFullPage && viewMode === 'chords' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="bg-white rounded-2xl p-3.5 soft-card border border-[#e5e7eb] flex items-center justify-between gap-2 text-xs"
          >
            <div className="flex items-center gap-2">
              <span className="font-semibold text-[#1c1b1b]">Transpose Key:</span>
              <span className="font-mono font-bold text-sm bg-[#3e5219]/10 text-[#3e5219] px-2.5 py-1 rounded-lg">
                {currentKey} {semitones !== 0 ? `(${semitones > 0 ? `+${semitones}` : semitones})` : ''}
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setSemitones((prev) => prev - 1)}
                className="w-8 h-8 rounded-lg bg-[#f0eded] hover:bg-[#e5e2e1] active:scale-90 text-[#1c1b1b] flex items-center justify-center font-bold"
                title="Transpose Down 1 Semitone"
              >
                <Minus className="w-4 h-4" />
              </button>
              <button
                onClick={() => setSemitones(0)}
                disabled={semitones === 0}
                className="px-2.5 h-8 rounded-lg bg-[#f0eded] hover:bg-[#e5e2e1] active:scale-90 text-[#5d5f5f] disabled:opacity-40 flex items-center justify-center text-[11px] font-medium"
                title="Reset Key"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setSemitones((prev) => prev + 1)}
                className="w-8 h-8 rounded-lg bg-[#f0eded] hover:bg-[#e5e2e1] active:scale-90 text-[#1c1b1b] flex items-center justify-center font-bold"
                title="Transpose Up 1 Semitone"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}

        {/* Content Card (matching Image 5.png container style) */}
        {viewMode === 'video' ? (
          /* Video & Audio Player Tab */
          <div className="space-y-6">
            {playableVideoUrl ? (
              <div className="aspect-video w-full rounded-2xl overflow-hidden shadow-lg border border-[#e5e7eb] bg-black">
                <iframe
                  src={
                    playableVideoUrl.includes('watch?v=')
                      ? playableVideoUrl.replace('watch?v=', 'embed/')
                      : playableVideoUrl
                  }
                  title={`${song.title} video player`}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            ) : (
              <div className="p-8 text-center bg-white rounded-2xl border border-[#e5e7eb] space-y-3">
                <Youtube className="w-12 h-12 text-[#ba1a1a] mx-auto opacity-80" />
                <h4 className="font-serif text-lg font-semibold">No direct video attached</h4>
                <p className="text-xs text-[#5d5f5f]">
                  You can attach a YouTube URL for this hymn in the song editor.
                </p>
              </div>
            )}

            {mediaLinks.length > 0 && (
              <div className="rounded-2xl border border-[#e5e7eb] bg-white p-4 space-y-3">
                <h3 className="font-semibold text-[#1c1b1b]">Listen or watch</h3>
                <div className="space-y-2">
                  {mediaLinks.map((link, index) => (
                    <a
                      key={`${link}-${index}`}
                      href={link}
                      target="_blank"
                      rel="noreferrer"
                      className="flex min-h-11 items-center justify-between rounded-xl bg-[#f6f3f2] px-3 text-sm font-medium text-[#3e5219] hover:bg-[#e8eee1]"
                    >
                      <span className="truncate pr-3">{/music\.youtube/i.test(link) ? 'Open YouTube Music' : /youtube|youtu\.be/i.test(link) ? 'Open YouTube video' : `Open media link ${index + 1}`}</span>
                      <Youtube className="w-4 h-4 shrink-0" />
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Synchronized Karaoke Highlight Box */}
            {song.timestamps && song.timestamps.length > 0 && (
              <div className="bg-white rounded-2xl p-6 soft-card border border-[#e5e7eb] space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Headphones className="w-4 h-4 text-[#3e5219]" />
                    <h3 className="font-serif font-bold text-base text-[#1c1b1b]">
                      Synchronized Karaoke Lyrics
                    </h3>
                  </div>
                  <button
                    onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#3e5219] text-white text-xs font-semibold hover:bg-[#2c3c0f]"
                  >
                    {isPlayingAudio ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-white" />}
                    <span>{isPlayingAudio ? 'Pause' : 'Play Karaoke Track'}</span>
                  </button>
                </div>

                <div className="space-y-2 pt-2">
                  {song.timestamps.map((t, idx) => {
                    const isActive = idx === activeTimestampIndex && isPlayingAudio;
                    return (
                      <div
                        key={idx}
                        onClick={() => {
                          setCurrentTime(t.time);
                          setActiveTimestampIndex(idx);
                          setIsPlayingAudio(true);
                        }}
                        className={`p-3 rounded-xl cursor-pointer transition-all ${
                          isActive
                            ? 'bg-[#3e5219] text-white font-bold scale-[1.02] shadow-sm'
                            : 'hover:bg-[#f0eded] text-[#45483c]'
                        }`}
                      >
                        <p className="text-base">{t.text}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Lyrics & Chords Main Card */
          <div
            id="lyrics-content-card"
            className={`${isFullPage ? 'bg-transparent p-2 sm:p-8' : 'bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-10 soft-card-elevated border border-[#e5e7eb]'} relative ${getLineHeightClass()}`}
            style={{ fontSize: `${effectiveFontSize}px` }}
          >
            {viewMode === 'lyrics' ? (
              /* Clean Plain Lyrics */
              <div
                className={`whitespace-pre-line ${
                  userSettings.fontFamily === 'serif' ? 'font-serif' : 'font-sans'
                }`}
              >
                {song.lyrics}
              </div>
            ) : (
              /* Rich Chords & Lyrics Display */
              <div className="space-y-4 font-mono">
                {parsedLines.map((line, lineIdx) => {
                  if (line.isSectionHeader) {
                    return (
                      <div
                        key={lineIdx}
                        className="font-sans font-bold text-[#3e5219] text-sm tracking-wider uppercase pt-3 pb-1 border-b border-[#e5e2e1]"
                      >
                        {line.rawText}
                      </div>
                    );
                  }

                  return (
                    <div key={lineIdx} className="flex flex-wrap items-end gap-x-1 min-h-[2rem]">
                      {line.tokens.map((tok, tokIdx) => (
                        <div key={tokIdx} className="inline-flex flex-col">
                          {tok.chord && (
                            <button
                              onClick={() => audioSynth.playChordTone(tok.chord!)}
                              title={`Play ${tok.chord} triad tone`}
                              className="font-bold text-[#3e5219] hover:text-[#556b2f] hover:underline cursor-pointer text-[0.88em] leading-none mb-1 text-left select-none active:scale-95 transition-transform"
                            >
                              {tok.chord}
                            </button>
                          )}
                          <span
                            className={`${
                              userSettings.fontFamily === 'serif' ? 'font-serif' : 'font-sans'
                            } text-[#1c1b1b]`}
                          >
                            {tok.lyric || '\u00A0'}
                          </span>
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        <div className="h-20" />
      </div>

      {/* Floating reading controls */}
      <div className={`${isFullPage ? 'hidden' : 'block'} fixed bottom-6 right-6 z-30`}>
        <motion.button
          id="btn-floating-typography-controller"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowTypographySheet(!showTypographySheet)}
          aria-label="Adjust font size and reading settings"
          className="w-14 h-14 bg-[#3e5219] text-white rounded-full flex items-center justify-center shadow-[0_8px_20px_rgba(62,82,25,0.35)] hover:bg-[#2c3c0f] border-2 border-white/50 transition-colors"
        >
          <span className="font-serif font-bold text-lg">Aa</span>
        </motion.button>
      </div>

      {/* Typography sheet */}
      <AnimatePresence>
        {showTypographySheet && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowTypographySheet(false)}
              className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs"
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 26, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 z-50 bg-[#fcf9f8] border-t border-[#e5e2e1] rounded-t-3xl p-6 shadow-2xl max-w-2xl mx-auto pb-safe space-y-5"
            >
              <div className="flex items-center justify-between border-b border-[#e5e2e1] pb-3">
                <div className="flex items-center gap-2">
                  <Type className="w-5 h-5 text-[#3e5219]" />
                  <h3 className="font-serif text-lg font-bold text-[#1c1b1b]">
                    Reading settings
                  </h3>
                </div>
                <button
                  onClick={() => setShowTypographySheet(false)}
                  className="p-1 text-[#5d5f5f] hover:text-[#1c1b1b]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Font Size Slider */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold text-[#1c1b1b]">
                  <span>Font Size</span>
                  <span className="font-mono text-sm">{effectiveFontSize}px</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-serif text-[#75796b]">A</span>
                  <input
                    type="range"
                    min="14"
                    max="34"
                    step="1"
                    value={effectiveFontSize}
                    onChange={(e) => onUpdateSettings({ fontSize: Number(e.target.value) })}
                    className="flex-1 accent-[#3e5219] cursor-pointer"
                  />
                  <span className="text-xl font-serif font-bold text-[#1c1b1b]">A</span>
                </div>
              </div>

              {/* Font Family Selection */}
              <div className="space-y-2">
                <span className="text-xs font-semibold text-[#1c1b1b]">Font Family</span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => onUpdateSettings({ fontFamily: 'serif' })}
                    className={`py-2.5 px-3 rounded-xl border text-sm font-serif transition-all ${
                      userSettings.fontFamily === 'serif'
                        ? 'bg-[#3e5219] text-white border-[#3e5219]'
                        : 'bg-white text-[#1c1b1b] border-[#e5e2e1] hover:bg-[#f0eded]'
                    }`}
                  >
                    Source Serif 4 (Sacred)
                  </button>
                  <button
                    onClick={() => onUpdateSettings({ fontFamily: 'sans' })}
                    className={`py-2.5 px-3 rounded-xl border text-sm font-sans transition-all ${
                      userSettings.fontFamily === 'sans'
                        ? 'bg-[#3e5219] text-white border-[#3e5219]'
                        : 'bg-white text-[#1c1b1b] border-[#e5e2e1] hover:bg-[#f0eded]'
                    }`}
                  >
                    Inter (Clean Sans)
                  </button>
                </div>
              </div>

              {/* Theme Selector */}
              <div className="space-y-2">
                <span className="text-xs font-semibold text-[#1c1b1b]">Reading Color Theme</span>
                <div className="grid grid-cols-4 gap-2">
                  <button
                    onClick={() => onUpdateSettings({ themeMode: 'light' })}
                    className={`py-2 rounded-xl text-xs font-medium border ${
                      userSettings.themeMode === 'light'
                        ? 'bg-[#fcf9f8] border-[#3e5219] ring-2 ring-[#3e5219]/20 text-[#1c1b1b]'
                        : 'bg-[#fcf9f8] border-[#e5e2e1] text-[#5d5f5f]'
                    }`}
                  >
                    White
                  </button>
                  <button
                    onClick={() => onUpdateSettings({ themeMode: 'sepia' })}
                    className={`py-2 rounded-xl text-xs font-medium border ${
                      userSettings.themeMode === 'sepia'
                        ? 'bg-[#f4ecd8] border-[#8a6d3b] ring-2 ring-[#8a6d3b]/20 text-[#433422]'
                        : 'bg-[#f4ecd8] border-[#e5e2e1] text-[#433422]'
                    }`}
                  >
                    Sepia
                  </button>
                  <button
                    onClick={() => onUpdateSettings({ themeMode: 'dark' })}
                    className={`py-2 rounded-xl text-xs font-medium border ${
                      userSettings.themeMode === 'dark'
                        ? 'bg-[#18181b] border-[#3e5219] ring-2 ring-[#3e5219]/20 text-white'
                        : 'bg-[#18181b] border-transparent text-gray-300'
                    }`}
                  >
                    Night
                  </button>
                  <button
                    onClick={() => onUpdateSettings({ themeMode: 'high-contrast' })}
                    className={`py-2 rounded-xl text-xs font-bold border ${
                      userSettings.themeMode === 'high-contrast'
                        ? 'bg-black border-yellow-400 ring-2 ring-yellow-400 text-yellow-300'
                        : 'bg-black border-transparent text-white'
                    }`}
                  >
                    Contrast
                  </button>
                </div>
              </div>

              {/* Line Spacing */}
              <div className="space-y-2">
                <span className="text-xs font-semibold text-[#1c1b1b]">Line Spacing</span>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  {(['normal', 'relaxed', 'spacious'] as const).map((space) => (
                    <button
                      key={space}
                      onClick={() => onUpdateSettings({ lineSpacing: space })}
                      className={`py-2 rounded-xl capitalize border transition-all ${
                        userSettings.lineSpacing === space
                          ? 'bg-[#3e5219] text-white border-[#3e5219]'
                          : 'bg-white text-[#5d5f5f] border-[#e5e2e1]'
                      }`}
                    >
                      {space}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
