import React from 'react';
import { ColoredBrainText } from './ColoredBrainText';

interface TopBarProps {
  showResults: boolean;
  answeredCount: number;
  totalQuestions: number;
  onJumpSection: (sectionId: string) => void;
  onPrimaryAction: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  showResults,
  answeredCount,
  totalQuestions,
  onJumpSection,
  onPrimaryAction,
}) => {
  return (
    <header className="sticky top-0 z-40 h-14 bg-white/95 backdrop-blur-sm border-b border-slate-200 print:hidden">
      <div className="max-w-6xl mx-auto h-full px-4 sm:px-6 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Title */}
        <a
          href="#top"
          className="font-display text-base sm:text-lg font-bold tracking-tight whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 rounded"
        >
          <ColoredBrainText />
        </a>

        {/* Zone 2: Concise Navigation Links */}
        <nav
          aria-label="Navigasi Bahagian"
          className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600"
        >
          {!showResults ? (
            <>
              <button
                type="button"
                onClick={() => onJumpSection('bahagian-1a')}
                className="hover:text-slate-900 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                Bahagian 1A
              </button>
              <button
                type="button"
                onClick={() => onJumpSection('bahagian-1b')}
                className="hover:text-slate-900 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                Bahagian 1B
              </button>
              <span className="text-slate-300 select-none" aria-hidden="true">
                /
              </span>
              <span className="font-mono-num text-xs text-slate-500 whitespace-nowrap shrink-0">
                Dijawab {answeredCount}/{totalQuestions}
              </span>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => onJumpSection('ringkasan-dominan')}
                className="hover:text-slate-900 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                Profil Dominan
              </button>
              <button
                type="button"
                onClick={() => onJumpSection('spektrum-skor')}
                className="hover:text-slate-900 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                Spektrum Skor
              </button>
              <button
                type="button"
                onClick={() => onJumpSection('sijil-digital')}
                className="hover:text-slate-900 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                Sijil Digital
              </button>
              <button
                type="button"
                onClick={() => onJumpSection('analisis-terperinci')}
                className="hover:text-slate-900 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                Analisis Terperinci
              </button>
            </>
          )}
        </nav>

        {/* Zone 3: Primary Action */}
        <div className="flex items-center gap-3 shrink-0">
          {!showResults && (
            <span className="md:hidden font-mono-num text-xs font-semibold text-slate-500 whitespace-nowrap">
              {answeredCount}/{totalQuestions}
            </span>
          )}
          <button
            type="button"
            onClick={onPrimaryAction}
            className="px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 active:scale-[0.99] transition-all whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
          >
            {showResults ? 'Ambil Semula' : 'Kira Keputusan'}
          </button>
        </div>
      </div>
    </header>
  );
};
