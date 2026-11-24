import React from 'react';
import { BrainColor, LanguageMode, QuizQuestion } from '../data/quizData';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

interface QuestionCardProps {
  question: QuizQuestion;
  selectedColor?: BrainColor;
  isUnansweredHighlighted: boolean;
  languageMode: LanguageMode;
  onSelect: (questionId: number, color: BrainColor) => void;
}

const OPTION_LETTERS = ['A', 'B', 'C', 'D'] as const;

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  selectedColor,
  isUnansweredHighlighted,
  languageMode,
  onSelect,
}) => {
  const showMs = languageMode === 'both' || languageMode === 'ms';
  const showEn = languageMode === 'both' || languageMode === 'en';
  const isAnswered = Boolean(selectedColor);

  return (
    <article
      id={`question-block-${question.id}`}
      className={`p-5 sm:p-7 bg-white rounded-xl border transition-colors duration-150 ${
        isUnansweredHighlighted
          ? 'border-red-500 ring-2 ring-red-500/20 bg-red-50/15'
          : isAnswered
            ? 'border-slate-300'
            : 'border-slate-200'
      }`}
    >
      <div className="flex items-start justify-between gap-4 pb-4 mb-4 border-b border-slate-100">
        <div className="min-w-0">
          {showMs && (
            <h3 className="font-display text-base sm:text-lg font-bold text-slate-900 leading-snug">
              <span className="font-mono-num text-blue-700 mr-2">
                {String(question.id).padStart(2, '0')}.
              </span>
              {question.ms}
            </h3>
          )}
          {showEn && (
            <p
              className={`${
                showMs
                  ? 'text-xs sm:text-sm text-slate-500 mt-1.5 leading-relaxed'
                  : 'font-display text-base sm:text-lg font-bold text-slate-900 leading-snug'
              }`}
            >
              {!showMs && (
                <span className="font-mono-num text-blue-700 mr-2">
                  {String(question.id).padStart(2, '0')}.
                </span>
              )}
              {question.en}
            </p>
          )}
        </div>

        {isUnansweredHighlighted ? (
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-red-700 shrink-0 pt-0.5">
            <AlertCircle className="w-4 h-4" aria-hidden="true" />
            <span>Perlu dijawab</span>
          </span>
        ) : isAnswered ? (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 shrink-0 pt-0.5">
            <CheckCircle2 className="w-4 h-4" aria-hidden="true" />
            <span className="hidden sm:inline">Dijawab</span>
          </span>
        ) : null}
      </div>

      <div
        className="space-y-2.5"
        role="radiogroup"
        aria-label={`Soalan ${question.id}`}
      >
        {question.options.map((opt, idx) => {
          const isChecked = selectedColor === opt.color;
          const inputId = `q${question.id}-${opt.color}`;
          return (
            <label
              key={opt.color}
              htmlFor={inputId}
              className={`group flex items-start gap-3.5 p-3.5 sm:p-4 rounded-xl border cursor-pointer transition-all duration-150 min-h-[52px] focus-within:ring-2 focus-within:ring-blue-600 focus-within:ring-offset-1 ${
                isChecked
                  ? 'border-blue-600 bg-blue-50/75'
                  : 'border-slate-200 bg-slate-50/40 hover:bg-white hover:border-slate-300'
              }`}
            >
              <input
                id={inputId}
                type="radio"
                name={`q${question.id}`}
                value={opt.color}
                checked={isChecked}
                onChange={() => onSelect(question.id, opt.color)}
                className="sr-only"
              />
              <span
                aria-hidden="true"
                className={`mt-0.5 w-6 h-6 rounded-full border text-[11px] font-bold flex items-center justify-center shrink-0 transition-colors duration-150 ${
                  isChecked
                    ? 'border-blue-600 bg-blue-600 text-white'
                    : 'border-slate-300 bg-white text-slate-500 group-hover:border-slate-400 group-hover:text-slate-700'
                }`}
              >
                {OPTION_LETTERS[idx]}
              </span>
              <div className="flex-1 min-w-0">
                {showMs && (
                  <p
                    className={`text-sm sm:text-[15px] leading-snug ${
                      isChecked
                        ? 'font-semibold text-slate-900'
                        : 'font-medium text-slate-800'
                    }`}
                  >
                    {opt.ms}
                  </p>
                )}
                {showEn && (
                  <p
                    className={`${
                      showMs
                        ? 'text-xs text-slate-500 mt-1 leading-relaxed'
                        : isChecked
                          ? 'text-sm sm:text-[15px] font-semibold text-slate-900 leading-snug'
                          : 'text-sm sm:text-[15px] font-medium text-slate-800 leading-snug'
                    }`}
                  >
                    {opt.en}
                  </p>
                )}
              </div>
            </label>
          );
        })}
      </div>
    </article>
  );
};
