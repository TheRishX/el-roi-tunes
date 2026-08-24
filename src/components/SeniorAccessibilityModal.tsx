import React from 'react';
import { UserSettings } from '../types';
import {
  Eye,
  Headphones,
  Sliders,
  Sparkles,
  Type,
  User,
  Volume2,
  X,
} from 'lucide-react';
import { motion } from 'motion/react';

interface SeniorAccessibilityModalProps {
  onClose: () => void;
  userSettings: UserSettings;
  onUpdateSettings: (settings: Partial<UserSettings>) => void;
}

export const SeniorAccessibilityModal: React.FC<SeniorAccessibilityModalProps> = ({
  onClose,
  userSettings,
  onUpdateSettings,
}) => {
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-[#e5e2e1] my-8 space-y-6"
      >
        <div className="flex items-center justify-between border-b border-[#e5e2e1] pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#3e5219] text-white flex items-center justify-center shadow-sm">
              <Eye className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-xl font-bold text-[#1c1b1b]">
                Accessibility & Senior Mode
              </h3>
              <p className="text-xs text-[#5d5f5f]">
                Tailored for effortless reading, singing, and worship
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

        {/* Big One-Tap Toggle Card */}
        <div className="bg-[#3e5219]/10 border-2 border-[#3e5219] rounded-2xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Sparkles className="w-5 h-5 text-[#3e5219]" />
              <h4 className="font-serif font-bold text-base text-[#1c1b1b]">
                Senior-Friendly Reader
              </h4>
            </div>
            <button
              onClick={() => {
                const next = !userSettings.seniorMode;
                onUpdateSettings({
                  seniorMode: next,
                  fontSize: next ? 26 : 18,
                  lineSpacing: next ? 'spacious' : 'relaxed',
                });
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                userSettings.seniorMode
                  ? 'bg-[#3e5219] text-white shadow-sm'
                  : 'bg-white text-[#3e5219] border border-[#3e5219]'
              }`}
            >
              {userSettings.seniorMode ? 'Active (ON)' : 'Turn On'}
            </button>
          </div>
          <p className="text-xs text-[#45483c] leading-relaxed">
            Automatically expands lyrics to 26px+, increases line spacing, enhances color contrast, and activates easy text-to-speech audio reading for every hymn.
          </p>
        </div>

        {/* Quick Features List */}
        <div className="space-y-3 text-xs">
          <div className="flex items-start gap-3 p-3 bg-[#f6f3f2] rounded-xl">
            <Type className="w-4 h-4 text-[#3e5219] shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-[#1c1b1b]">High Legibility Serif & Sans</p>
              <p className="text-[#5d5f5f]">
                Carefully crafted with Source Serif 4 and Inter to prevent eye fatigue.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 bg-[#f6f3f2] rounded-xl">
            <Volume2 className="w-4 h-4 text-[#3e5219] shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-[#1c1b1b]">Voice Reader (Text-to-Speech)</p>
              <p className="text-[#5d5f5f]">
                Tap the speaker icon on any hymn to hear the lyrics read aloud in a gentle cadence.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 bg-[#f6f3f2] rounded-xl">
            <Sliders className="w-4 h-4 text-[#3e5219] shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-[#1c1b1b]">Hands-Free Auto-Scroll</p>
              <p className="text-[#5d5f5f]">
                Let lyrics automatically glide down while you play the piano, guitar, or sing.
              </p>
            </div>
          </div>
        </div>

        <div className="pt-2 text-right">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-[#3e5219] text-white font-bold text-xs hover:bg-[#2c3c0f] transition-colors"
          >
            Done
          </button>
        </div>
      </motion.div>
    </div>
  );
};
