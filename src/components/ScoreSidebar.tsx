import React from 'react';
import {
  BrainColor,
  COLOR_ORDER,
  COLOR_PROFILES,
  QUIZ_DATA,
} from '../data/quizData';
import { ArrowRight, Check, RotateCcw } from 'lucide-react';

interface ScoreSidebarProps {
  answers: Partial<Record<number, BrainColor>>;
  unansweredIds: number[];
  activeQuestionId?: number;
  scores1a: Record<BrainColor, number>;
  scores1b: Record<BrainColor, number>;
  onJumpQuestion: (id: number) => void;
  onJumpNextUnanswered: () => void;
  onResetAnswers: () => void;
  onCalculate: () => void;
}

export const ScoreSidebar: React.FC<ScoreSidebarProps> = ({
  answers,
  unansweredIds,
  activeQuestionId,
  scores1a,
  scores1b,
  onJumpQuestion,
  onJumpNextUnanswered,
  onResetAnswers,
  onCalculate,
}) => {
  const answeredCount = Object.keys(answers).length;
  const totalQuestions = QUIZ_DATA.length;
  const percentage = Math.round((answeredCount / totalQuestions) * 100);
  const total1a = Object.values(scores1a).reduce((a, b) => a + b, 0);
  const total1b = Object.values(scores1b).reduce((a, b) => a + b, 0);

  return (
    <aside className="lg:sticky lg:top-20 space-y-4">
      <div className="bg-white rounded-xl border border-slate-200 p-5 sm:p-6 space-y-5">
        {/* Progress Header */}
        <div>
          <div className="flex items-baseline justify-between mb-2">
            <h2 className="font-display text-sm font-bold text-slate-900">
              Kemajuan Penilaian
            </h2>
            <span className="font-mono-num text-sm font-bold text-blue-700">
              {answeredCount} / {totalQuestions} ({percentage}%)
            </span>
          </div>
          <div
            className="w-full h-2 bg-slate-100 rounded-full overflow-hidden"
            role="progressbar"
            aria-valuenow={percentage}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div
              className="h-full bg-blue-600 transition-all duration-200"
              style={{ width: `${percentage}%` }}
            />
          </div>
          {answeredCount > 0 && answeredCount < totalQuestions && (
            <button
              type="button"
              onClick={onJumpNextUnanswered}
              className="mt-2.5 text-xs font-semibold text-blue-700 hover:text-blue-800 hover:underline underline-offset-2 cursor-pointer"
            >
              Pergi ke soalan belum dijawab seterusnya
            </button>
          )}
        </div>

        {/* Question Quick Navigator */}
        <div className="pt-4 border-t border-slate-100">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-medium text-slate-500">
              Navigasi Soalan (1–15)
            </p>
            {answeredCount > 0 && (
              <button
                type="button"
                onClick={onResetAnswers}
                className="inline-flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-slate-900 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" aria-hidden="true" />
                <span>Set semula</span>
              </button>
            )}
          </div>
          <div className="grid grid-cols-5 gap-2">
            {QUIZ_DATA.map((q) => {
              const isAnswered = Boolean(answers[q.id]);
              const isMissing = unansweredIds.includes(q.id);
              const isActive = activeQuestionId === q.id;
              return (
                <button
                  key={q.id}
                  type="button"
                  onClick={() => onJumpQuestion(q.id)}
                  aria-label={`Pergi ke soalan ${q.id} (${
                    isAnswered ? 'Sudah dijawab' : 'Belum dijawab'
                  })`}
                  className={`h-9 rounded-lg font-mono-num text-xs font-semibold flex items-center justify-center gap-0.5 border transition-colors duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 ${
                    isMissing
                      ? 'border-red-500 bg-red-50 text-red-700'
                      : isActive
                        ? 'border-blue-600 bg-blue-50 text-blue-700 ring-1 ring-blue-600'
                        : isAnswered
                          ? 'border-slate-900 bg-slate-900 text-white'
                          : 'border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300 hover:text-slate-900'
                  }`}
                >
                  <span>{q.id}</span>
                  {isAnswered && !isActive && (
                    <Check className="w-3 h-3" aria-hidden="true" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Section 1A Live Scores — Clean Hairline Grid */}
        <div className="pt-4 border-t border-slate-100 space-y-2.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-700">
              Bahagian 1 (A) · Asas
            </span>
            <span className="font-mono-num text-slate-500">
              {total1a} / 100 mata
            </span>
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-2">
            {COLOR_ORDER.map((key) => {
              const profile = COLOR_PROFILES[key];
              return (
                <div
                  key={key}
                  className="py-1.5 border-b border-slate-100 flex items-center justify-between"
                >
                  <span className={`text-xs font-bold ${profile.textClass}`}>
                    {profile.shortName}
                  </span>
                  <span className="font-mono-num text-sm font-semibold text-slate-900">
                    {scores1a[key]}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Section 1B Live Scores — Clean Hairline Grid */}
        <div className="pt-4 border-t border-slate-100 space-y-2.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-700">
              Bahagian 1 (B) · Fleksibiliti
            </span>
            <span className="font-mono-num text-slate-500">
              {total1b} / 50 mata
            </span>
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-2">
            {COLOR_ORDER.map((key) => {
              const profile = COLOR_PROFILES[key];
              return (
                <div
                  key={key}
                  className="py-1.5 border-b border-slate-100 flex items-center justify-between"
                >
                  <span className={`text-xs font-bold ${profile.textClass}`}>
                    {profile.shortName}
                  </span>
                  <span className="font-mono-num text-sm font-semibold text-slate-900">
                    {scores1b[key]}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Calculate CTA */}
        <div className="pt-3">
          <button
            type="button"
            onClick={onCalculate}
            className="w-full py-3 px-5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm flex items-center justify-center gap-2 transition-colors duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
          >
            <span>Kira Keputusan Ujian</span>
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    </aside>
  );
};
