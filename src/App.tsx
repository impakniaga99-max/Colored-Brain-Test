import { useMemo, useState } from 'react';
import {
  BrainColor,
  COLOR_ORDER,
  COLOR_PROFILES,
  LanguageMode,
  QUIZ_DATA,
} from './data/quizData';
import { TopBar } from './components/TopBar';
import { QuestionCard } from './components/QuestionCard';
import { ScoreSidebar } from './components/ScoreSidebar';
import { ResultsView } from './components/ResultsView';
import { ColoredBrainText } from './components/ColoredBrainText';
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Layers,
  List,
} from 'lucide-react';

type ViewMode = 'all' | 'focus';

const BRAIN_SUMMARY_LABELS: Record<BrainColor, string> = {
  G: 'Tindakan & Gambaran Besar',
  R: 'Logik & Struktur',
  P: 'Data & Perincian',
  B: 'Empati & Hubungan',
};

export default function App() {
  const [userName, setUserName] = useState('');
  const [answers, setAnswers] = useState<Partial<Record<number, BrainColor>>>({});
  const [unansweredIds, setUnansweredIds] = useState<number[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [languageMode, setLanguageMode] = useState<LanguageMode>('both');
  const [viewMode, setViewMode] = useState<ViewMode>('all');
  const [focusIndex, setFocusIndex] = useState(0);

  const questions1A = useMemo(
    () => QUIZ_DATA.filter((q) => q.section === '1a'),
    []
  );
  const questions1B = useMemo(
    () => QUIZ_DATA.filter((q) => q.section === '1b'),
    []
  );

  const { scores1a, scores1b, finalScores } = useMemo(() => {
    const s1a: Record<BrainColor, number> = { G: 0, R: 0, P: 0, B: 0 };
    const s1b: Record<BrainColor, number> = { G: 0, R: 0, P: 0, B: 0 };
    const total: Record<BrainColor, number> = { G: 0, R: 0, P: 0, B: 0 };

    QUIZ_DATA.forEach((q) => {
      const selected = answers[q.id];
      if (selected) {
        total[selected] += 10;
        if (q.section === '1a') {
          s1a[selected] += 10;
        } else {
          s1b[selected] += 10;
        }
      }
    });

    return { scores1a: s1a, scores1b: s1b, finalScores: total };
  }, [answers]);

  const answeredCount = Object.keys(answers).length;
  const currentFocusQuestion = QUIZ_DATA[focusIndex] ?? QUIZ_DATA[0];

  const handleSelectAnswer = (questionId: number, color: BrainColor) => {
    setAnswers((prev) => {
      const next = { ...prev, [questionId]: color };
      if (Object.keys(next).length === QUIZ_DATA.length) {
        setErrorMessage(null);
      }
      return next;
    });
    setUnansweredIds((prev) => prev.filter((id) => id !== questionId));
  };

  const scrollToElement = (elementId: string) => {
    if (viewMode === 'focus' && elementId.startsWith('question-block-')) {
      const qId = Number(elementId.replace('question-block-', ''));
      const idx = QUIZ_DATA.findIndex((q) => q.id === qId);
      if (idx >= 0) {
        setFocusIndex(idx);
        return;
      }
    }
    if (viewMode === 'focus' && elementId === 'bahagian-1a') {
      setFocusIndex(0);
      return;
    }
    if (viewMode === 'focus' && elementId === 'bahagian-1b') {
      setFocusIndex(10);
      return;
    }

    const el = document.getElementById(elementId);
    if (el) {
      const yOffset = -72;
      const y = el.getBoundingClientRect().top + window.scrollY + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const handleJumpNextUnanswered = () => {
    const nextMissing = QUIZ_DATA.find((q) => !answers[q.id]);
    if (!nextMissing) return;
    if (viewMode === 'focus') {
      const idx = QUIZ_DATA.findIndex((q) => q.id === nextMissing.id);
      if (idx >= 0) setFocusIndex(idx);
    } else {
      scrollToElement(`question-block-${nextMissing.id}`);
    }
  };

  const handleCalculateResults = () => {
    const missing = QUIZ_DATA.filter((q) => !answers[q.id]).map((q) => q.id);

    if (missing.length > 0) {
      setUnansweredIds(missing);
      setErrorMessage(
        `Sila lengkapkan semua soalan sebelum mengira keputusan. Anda telah menjawab ${answeredCount} daripada ${QUIZ_DATA.length} soalan.`
      );
      if (viewMode === 'focus') {
        const idx = QUIZ_DATA.findIndex((q) => q.id === missing[0]);
        if (idx >= 0) setFocusIndex(idx);
      } else {
        scrollToElement(`question-block-${missing[0]}`);
      }
      return;
    }

    setUnansweredIds([]);
    setErrorMessage(null);
    setShowResults(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleResetQuiz = () => {
    setAnswers({});
    setUnansweredIds([]);
    setErrorMessage(null);
    setFocusIndex(0);
    setShowResults(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleClearAnswersOnly = () => {
    setAnswers({});
    setUnansweredIds([]);
    setErrorMessage(null);
    setFocusIndex(0);
  };

  return (
    <div id="top" className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      <TopBar
        showResults={showResults}
        answeredCount={answeredCount}
        totalQuestions={QUIZ_DATA.length}
        onJumpSection={scrollToElement}
        onPrimaryAction={showResults ? handleResetQuiz : handleCalculateResults}
      />

      <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
        {!showResults ? (
          <div className="space-y-8">
            {/* Editorial Intro & Participant Setup */}
            <section className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                <div className="lg:col-span-7 space-y-4">
                  <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-slate-500">
                    <span>Penilaian Gaya Pemprosesan Kognitif</span>
                    <span aria-hidden="true">·</span>
                    <span>Arthur F. Carmazzi</span>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono-num text-slate-700 font-medium">
                      15 Soalan (150 Mata)
                    </span>
                  </div>

                  <div className="space-y-2.5">
                    <h1 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-balance">
                      <ColoredBrainText />
                    </h1>
                    <div
                      className="grid grid-cols-4 h-1 w-28 rounded-full overflow-hidden"
                      aria-hidden="true"
                    >
                      <span className="bg-emerald-600" />
                      <span className="bg-red-600" />
                      <span className="bg-violet-600" />
                      <span className="bg-blue-600" />
                    </div>
                  </div>

                  <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl">
                    Kenal pasti bagaimana otak anda memproses maklumat, membuat
                    keputusan, dan berkomunikasi merentasi empat gaya kognitif
                    utama.
                  </p>

                  {/* 4 Cognitive Color Legend Strip */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-slate-100">
                    {COLOR_ORDER.map((key) => {
                      const prof = COLOR_PROFILES[key];
                      return (
                        <div key={key} className="pt-1">
                          <p className={`text-xs font-bold ${prof.textClass}`}>
                            {prof.shortName}
                          </p>
                          <p className="text-xs text-slate-500 mt-0.5">
                            {BRAIN_SUMMARY_LABELS[key]}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="lg:col-span-5 bg-slate-50/70 rounded-xl border border-slate-200/80 p-5 space-y-4">
                  <div>
                    <label
                      htmlFor="user-name"
                      className="block text-xs font-semibold text-slate-700 mb-1.5"
                    >
                      Nama Penuh Peserta
                    </label>
                    <input
                      id="user-name"
                      type="text"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      placeholder="Masukkan nama anda untuk laporan & sijil..."
                      className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-slate-200 text-slate-900 text-sm font-medium placeholder:text-slate-400 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 transition-colors"
                    />
                  </div>

                  <div className="pt-2 border-t border-slate-200/70 space-y-3">
                    {/* Interactive Language Filter Control */}
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-xs font-medium text-slate-600">
                        Bahasa Soalan
                      </span>
                      <div
                        className="inline-flex items-center p-1 bg-slate-200/70 rounded-lg"
                        role="group"
                        aria-label="Pilihan bahasa paparan soalan"
                      >
                        {(
                          [
                            { id: 'both', label: 'Dwibahasa' },
                            { id: 'ms', label: 'BM' },
                            { id: 'en', label: 'EN' },
                          ] as const
                        ).map((mode) => (
                          <button
                            key={mode.id}
                            type="button"
                            onClick={() => setLanguageMode(mode.id)}
                            className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                              languageMode === mode.id
                                ? 'bg-white text-slate-900 shadow-sm'
                                : 'text-slate-600 hover:text-slate-900'
                            }`}
                          >
                            {mode.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Interactive View Mode Control */}
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-xs font-medium text-slate-600">
                        Mod Paparan
                      </span>
                      <div
                        className="inline-flex items-center p-1 bg-slate-200/70 rounded-lg"
                        role="group"
                        aria-label="Pilihan mod paparan soalan"
                      >
                        <button
                          type="button"
                          onClick={() => setViewMode('all')}
                          className={`px-2.5 py-1 text-xs font-semibold rounded-md inline-flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                            viewMode === 'all'
                              ? 'bg-white text-slate-900 shadow-sm'
                              : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          <List className="w-3.5 h-3.5" aria-hidden="true" />
                          <span>Semua</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setViewMode('focus')}
                          className={`px-2.5 py-1 text-xs font-semibold rounded-md inline-flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                            viewMode === 'focus'
                              ? 'bg-white text-slate-900 shadow-sm'
                              : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          <Layers className="w-3.5 h-3.5" aria-hidden="true" />
                          <span>Fokus (1-1)</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Error Alert Banner */}
            {errorMessage && (
              <div
                role="alert"
                className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-900 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="flex items-start gap-3">
                  <AlertCircle
                    className="w-5 h-5 text-red-600 shrink-0 mt-0.5"
                    aria-hidden="true"
                  />
                  <p className="text-sm font-medium">{errorMessage}</p>
                </div>
                <button
                  type="button"
                  onClick={handleJumpNextUnanswered}
                  className="text-xs font-bold text-red-800 underline underline-offset-2 hover:text-red-950 self-start sm:self-center shrink-0 cursor-pointer"
                >
                  Semak soalan belum dijawab
                </button>
              </div>
            )}

            {/* Two-Zone Assessment Stage + Live Telemetry Deck */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Main Question Flow */}
              <div className="lg:col-span-8 space-y-10">
                {viewMode === 'all' ? (
                  <>
                    {/* Section 1A */}
                    <section id="bahagian-1a" className="space-y-5">
                      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 pb-4 border-b border-slate-200">
                        <div>
                          <h2 className="font-display text-xl sm:text-2xl font-bold text-slate-900">
                            Bahagian 1 (A): Gaya Pemprosesan Asas
                          </h2>
                          <p className="text-sm text-slate-600 mt-1">
                            Soalan 1 hingga 10 · Pilih{' '}
                            <strong className="font-semibold text-slate-900">
                              SATU
                            </strong>{' '}
                            jawapan yang paling tepat menggambarkan diri anda.
                          </p>
                        </div>
                        <span className="font-mono-num text-xs sm:text-sm font-semibold text-emerald-700 shrink-0">
                          100 Mata
                        </span>
                      </div>

                      <div className="space-y-5">
                        {questions1A.map((question) => (
                          <QuestionCard
                            key={question.id}
                            question={question}
                            selectedColor={answers[question.id]}
                            isUnansweredHighlighted={unansweredIds.includes(
                              question.id
                            )}
                            languageMode={languageMode}
                            onSelect={handleSelectAnswer}
                          />
                        ))}
                      </div>
                    </section>

                    {/* Section 1B */}
                    <section id="bahagian-1b" className="space-y-5">
                      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 pb-4 border-b border-slate-200">
                        <div>
                          <h2 className="font-display text-xl sm:text-2xl font-bold text-slate-900">
                            Bahagian 1 (B): Fleksibiliti Pemprosesan
                          </h2>
                          <p className="text-sm text-slate-600 mt-1">
                            Soalan 11 hingga 15 · Pilih{' '}
                            <strong className="font-semibold text-slate-900">
                              SATU
                            </strong>{' '}
                            pilihan (10 mata) yang paling hampir dengan
                            ciri-ciri anda.
                          </p>
                        </div>
                        <span className="font-mono-num text-xs sm:text-sm font-semibold text-rose-700 shrink-0">
                          50 Mata
                        </span>
                      </div>

                      <div className="space-y-5">
                        {questions1B.map((question) => (
                          <QuestionCard
                            key={question.id}
                            question={question}
                            selectedColor={answers[question.id]}
                            isUnansweredHighlighted={unansweredIds.includes(
                              question.id
                            )}
                            languageMode={languageMode}
                            onSelect={handleSelectAnswer}
                          />
                        ))}
                      </div>
                    </section>
                  </>
                ) : (
                  /* Focus Mode: One Question at a Time */
                  <section className="space-y-5">
                    <div className="flex items-baseline justify-between gap-3 pb-4 border-b border-slate-200">
                      <div>
                        <p className="text-xs font-semibold text-slate-500">
                          {currentFocusQuestion.section === '1a'
                            ? 'Bahagian 1 (A): Gaya Pemprosesan Asas'
                            : 'Bahagian 1 (B): Fleksibiliti Pemprosesan'}
                        </p>
                        <h2 className="font-display text-xl font-bold text-slate-900 mt-0.5">
                          Soalan {currentFocusQuestion.id} daripada{' '}
                          {QUIZ_DATA.length}
                        </h2>
                      </div>
                      <button
                        type="button"
                        onClick={() => setViewMode('all')}
                        className="text-xs font-semibold text-blue-700 hover:underline underline-offset-2 cursor-pointer whitespace-nowrap shrink-0"
                      >
                        Papar semua soalan
                      </button>
                    </div>

                    <QuestionCard
                      question={currentFocusQuestion}
                      selectedColor={answers[currentFocusQuestion.id]}
                      isUnansweredHighlighted={unansweredIds.includes(
                        currentFocusQuestion.id
                      )}
                      languageMode={languageMode}
                      onSelect={handleSelectAnswer}
                    />

                    <div className="flex items-center justify-between gap-4 pt-2">
                      <button
                        type="button"
                        onClick={() =>
                          setFocusIndex((i) => Math.max(0, i - 1))
                        }
                        disabled={focusIndex === 0}
                        className="px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-700 text-sm font-semibold inline-flex items-center gap-2 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer whitespace-nowrap"
                      >
                        <ArrowLeft className="w-4 h-4" aria-hidden="true" />
                        <span>Sebelumnya</span>
                      </button>

                      {focusIndex < QUIZ_DATA.length - 1 ? (
                        <button
                          type="button"
                          onClick={() =>
                            setFocusIndex((i) =>
                              Math.min(QUIZ_DATA.length - 1, i + 1)
                            )
                          }
                          className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold inline-flex items-center gap-2 cursor-pointer whitespace-nowrap"
                        >
                          <span>Seterusnya</span>
                          <ArrowRight className="w-4 h-4" aria-hidden="true" />
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={handleCalculateResults}
                          className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold inline-flex items-center gap-2 cursor-pointer whitespace-nowrap"
                        >
                          <span>Kira Keputusan</span>
                          <ArrowRight className="w-4 h-4" aria-hidden="true" />
                        </button>
                      )}
                    </div>
                  </section>
                )}

                {/* Bottom Calculate Action */}
                <div className="pt-5 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <p className="font-mono-num text-sm text-slate-600">
                    Status jawapan: {answeredCount} / {QUIZ_DATA.length} soalan
                  </p>
                  <button
                    type="button"
                    onClick={handleCalculateResults}
                    className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-base flex items-center justify-center gap-2 transition-colors duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
                  >
                    <span>Kira Keputusan Ujian</span>
                    <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  </button>
                </div>
              </div>

              {/* Sticky Telemetry Sidebar */}
              <div className="lg:col-span-4">
                <ScoreSidebar
                  answers={answers}
                  unansweredIds={unansweredIds}
                  activeQuestionId={
                    viewMode === 'focus' ? currentFocusQuestion.id : undefined
                  }
                  scores1a={scores1a}
                  scores1b={scores1b}
                  onJumpQuestion={(id) => scrollToElement(`question-block-${id}`)}
                  onJumpNextUnanswered={handleJumpNextUnanswered}
                  onResetAnswers={handleClearAnswersOnly}
                  onCalculate={handleCalculateResults}
                />
              </div>
            </div>
          </div>
        ) : (
          <ResultsView
            userName={userName}
            finalScores={finalScores}
            scores1a={scores1a}
            scores1b={scores1b}
            onReset={handleResetQuiz}
          />
        )}
      </main>

      <footer className="border-t border-slate-200 bg-white py-5 mt-12 print:hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
          <span>Ujian Colored Brain · Arthur F. Carmazzi</span>
          <span>Penilaian Gaya Pemprosesan Kognitif Dwibahasa</span>
        </div>
      </footer>
    </div>
  );
}
