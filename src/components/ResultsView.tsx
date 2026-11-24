import React from 'react';
import {
  BrainColor,
  COLOR_ORDER,
  COLOR_PROFILES,
} from '../data/quizData';
import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import { CheckCircle2, FileDown, Printer, RotateCcw } from 'lucide-react';
import { generateAssessmentReportPdf } from '../utils/pdfGenerator';
import { DigitalCertificatePanel } from './DigitalCertificatePanel';

interface ResultsViewProps {
  userName: string;
  finalScores: Record<BrainColor, number>;
  scores1a: Record<BrainColor, number>;
  scores1b: Record<BrainColor, number>;
  onReset: () => void;
}

interface RadarDatum {
  subject: string;
  fullName: string;
  score: number;
  part1a: number;
  part1b: number;
  fullMark: number;
}

export const ResultsView: React.FC<ResultsViewProps> = ({
  userName,
  finalScores,
  scores1a,
  scores1b,
  onReset,
}) => {
  const displayName = userName.trim() || 'Peserta';
  const totalPoints = Object.values(finalScores).reduce((a, b) => a + b, 0);

  const sortedResults = COLOR_ORDER.map((key) => ({
    key,
    score: finalScores[key],
  })).sort((a, b) => b.score - a.score);

  const maxScore = sortedResults[0].score;
  const topColors = sortedResults.filter((item) => item.score === maxScore);
  const isFlexibleOrTied = topColors.length > 1 || maxScore < 40;
  const dominantProfile = COLOR_PROFILES[topColors[0].key];
  const radarColor = isFlexibleOrTied ? '#2563EB' : dominantProfile.hex;

  const radarData: RadarDatum[] = COLOR_ORDER.map((key) => ({
    subject: COLOR_PROFILES[key].shortName,
    fullName: COLOR_PROFILES[key].title,
    score: finalScores[key],
    part1a: scores1a[key],
    part1b: scores1b[key],
    fullMark: 150,
  }));

  const dateLabel = new Intl.DateTimeFormat('ms-MY', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date());

  const handleDownloadReportPdf = () => {
    generateAssessmentReportPdf({
      userName: displayName,
      dateLabel,
      finalScores,
      scores1a,
      scores1b,
    });
  };

  return (
    <div className="space-y-8 print:space-y-6">
      {/* Dominant Summary Section */}
      <section
        id="ringkasan-dominan"
        className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-10"
      >
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-slate-500">
            <span>Laporan Profil Pemikiran</span>
            <span aria-hidden="true">·</span>
            <span>Arthur F. Carmazzi Colored Brain</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono-num text-slate-700 font-medium">
              {totalPoints} / 150 Mata
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 print:hidden">
            <button
              type="button"
              onClick={handleDownloadReportPdf}
              className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold flex items-center gap-2 transition-colors cursor-pointer whitespace-nowrap shrink-0"
            >
              <FileDown className="w-4 h-4" aria-hidden="true" />
              <span>Muat Turun Laporan PDF</span>
            </button>
            <button
              type="button"
              onClick={() => window.print()}
              className="px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-semibold flex items-center gap-2 transition-colors cursor-pointer whitespace-nowrap shrink-0"
            >
              <Printer className="w-4 h-4" aria-hidden="true" />
              <span>Cetak</span>
            </button>
            <button
              type="button"
              onClick={onReset}
              className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 text-xs sm:text-sm font-semibold hover:bg-slate-50 flex items-center gap-2 transition-colors cursor-pointer whitespace-nowrap shrink-0"
            >
              <RotateCcw className="w-4 h-4" aria-hidden="true" />
              <span>Ambil Ujian Semula</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-8">
          <div className="lg:col-span-7 space-y-4">
            {isFlexibleOrTied ? (
              <>
                <p className="text-sm font-medium text-slate-500">
                  Profil Pemikiran · {displayName}
                </p>
                <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight text-balance">
                  Fleksibiliti Tinggi (
                  {topColors
                    .map((c) => COLOR_PROFILES[c.key].shortName)
                    .join(' & ')}
                  )
                </h1>
                <p className="text-base text-slate-600 leading-relaxed max-w-2xl">
                  Anda menunjukkan keseimbangan dan fleksibiliti yang tinggi
                  merentasi gaya pemprosesan yang berbeza. Anda mampu
                  menyesuaikan cara anda berfikir, berkomunikasi, dan
                  menyelesaikan masalah mengikut keperluan situasi semasa.
                </p>
              </>
            ) : (
              <>
                <p className="text-sm font-medium text-slate-500">
                  {displayName} · Warna Otak Dominan Anda Ialah
                </p>
                <h1
                  className={`font-display text-4xl sm:text-5xl font-extrabold tracking-tight text-balance ${dominantProfile.textClass}`}
                >
                  {dominantProfile.shortName}{' '}
                  <span className="text-slate-900 font-bold text-2xl sm:text-3xl block sm:inline sm:ml-2">
                    ({dominantProfile.processingStyle})
                  </span>
                </h1>
                <p className="text-base text-slate-600 leading-relaxed max-w-2xl">
                  {dominantProfile.description}
                </p>
                <div className="pt-2">
                  <p className="text-xs font-semibold text-slate-500 mb-1">
                    Cadangan Persekitaran Kerja
                  </p>
                  <p className="text-sm text-slate-700 leading-relaxed">
                    {dominantProfile.workplaceTip}
                  </p>
                </div>
              </>
            )}
          </div>

          {/* Recharts Radar Chart */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center bg-slate-50/70 rounded-xl border border-slate-200 p-4 sm:p-5">
            <div className="w-full h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart
                  cx="50%"
                  cy="50%"
                  outerRadius="68%"
                  margin={{ top: 16, right: 28, bottom: 16, left: 28 }}
                  data={radarData}
                >
                  <PolarGrid stroke="#CBD5E1" />
                  <PolarAngleAxis
                    dataKey="subject"
                    tick={{
                      fill: '#0F172A',
                      fontSize: 12,
                      fontWeight: 700,
                    }}
                  />
                  <PolarRadiusAxis
                    angle={90}
                    domain={[0, 150]}
                    tickCount={4}
                    tick={{ fill: '#64748B', fontSize: 10 }}
                  />
                  <Radar
                    name="Skor Kognitif"
                    dataKey="score"
                    stroke={radarColor}
                    strokeWidth={2.5}
                    fill={radarColor}
                    fillOpacity={0.22}
                    dot={{ r: 4, fill: radarColor, strokeWidth: 0 }}
                    activeDot={{ r: 6, fill: radarColor, stroke: '#FFFFFF', strokeWidth: 2 }}
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (!active || !payload || !payload.length) return null;
                      const item = payload[0].payload as RadarDatum;
                      const pct = Math.round((item.score / 150) * 100);
                      return (
                        <div className="bg-slate-900 text-white px-3.5 py-2.5 rounded-lg shadow-lg text-xs space-y-1">
                          <p className="font-bold">{item.fullName}</p>
                          <p className="font-mono-num text-slate-200">
                            Jumlah: {item.score} / 150 ({pct}%)
                          </p>
                          <p className="font-mono-num text-slate-400">
                            1A: {item.part1a} · 1B: {item.part1b}
                          </p>
                        </div>
                      );
                    }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
            <p className="text-xs text-slate-500 mt-1 text-center">
              Carta Radar Taburan Gaya Kognitif (Skala 0–150 Mata)
            </p>
          </div>
        </div>
      </section>

      {/* Overall Score Breakdown Grid */}
      <section
        id="spektrum-skor"
        className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8"
      >
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 pb-5 border-b border-slate-100">
          <h2 className="font-display text-xl font-bold text-slate-900">
            Skor Keseluruhan (Bahagian A + B)
          </h2>
          <span className="font-mono-num text-sm font-semibold text-slate-700">
            Jumlah Mata: {totalPoints} / 150
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          {COLOR_ORDER.map((colorKey) => {
            const profile = COLOR_PROFILES[colorKey];
            const score = finalScores[colorKey];
            const pct = Math.round((score / 150) * 100);
            const isTop = score === maxScore;

            return (
              <div
                key={colorKey}
                className={`p-5 rounded-xl border transition-colors ${
                  isTop
                    ? `${profile.borderClass} ${profile.softBgClass}`
                    : 'border-slate-200 bg-slate-50/50'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-sm font-bold ${profile.textClass}`}>
                    {profile.shortName}
                  </span>
                  {isTop && (
                    <span className="text-xs font-semibold text-slate-900">
                      Tertinggi
                    </span>
                  )}
                </div>

                <div className="flex items-baseline gap-1.5 mb-3">
                  <span className="font-mono-num text-3xl font-bold text-slate-900">
                    {score}
                  </span>
                  <span className="font-mono-num text-xs text-slate-500">
                    / 150 ({pct}%)
                  </span>
                </div>

                <div className="w-full h-2 bg-white rounded-full overflow-hidden border border-slate-200/70 mb-3">
                  <div
                    className={`h-full ${profile.bgClass}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-xs text-slate-600 font-mono-num">
                  <span>1A: {scores1a[colorKey]}</span>
                  <span>1B: {scores1b[colorKey]}</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Digital Certificate & Profile Card Generator */}
      <DigitalCertificatePanel
        initialName={displayName}
        finalScores={finalScores}
      />

      {/* Detailed Profile Analysis */}
      <section id="analisis-terperinci" className="space-y-4">
        <div className="px-1">
          <h2 className="font-display text-xl font-bold text-slate-900">
            Analisis Gaya Pemprosesan Maklumat Anda
          </h2>
          <p className="text-sm text-slate-600 mt-1">
            Disusun mengikut skor tertinggi hingga terendah bagi melihat keutamaan
            kognitif anda.
          </p>
        </div>

        <div className="space-y-4">
          {sortedResults.map((item, idx) => {
            const profile = COLOR_PROFILES[item.key];
            const isHighest = idx === 0;
            const pct = Math.round((item.score / 150) * 100);

            return (
              <article
                key={item.key}
                className={`p-6 sm:p-7 rounded-2xl bg-white border ${
                  isHighest ? 'border-slate-400' : 'border-slate-200'
                }`}
              >
                <div className="flex flex-wrap items-baseline justify-between gap-3 pb-4 border-b border-slate-100">
                  <div>
                    <span className="font-mono-num text-xs font-semibold text-slate-400 mr-2">
                      0{idx + 1}.
                    </span>
                    <h3
                      className={`inline font-display text-lg sm:text-xl font-bold ${profile.textClass}`}
                    >
                      {profile.title}
                    </h3>
                  </div>
                  <div className="font-mono-num text-sm font-semibold text-slate-900">
                    {item.score} / 150 Mata ({pct}%)
                  </div>
                </div>

                <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2.5 my-5 text-sm text-slate-700">
                  {profile.traits.map((trait) => (
                    <li key={trait} className="flex items-start gap-2.5">
                      <CheckCircle2
                        className={`w-4 h-4 mt-0.5 shrink-0 ${profile.textClass}`}
                        aria-hidden="true"
                      />
                      <span>{trait}</span>
                    </li>
                  ))}
                </ul>

                <p className="text-sm sm:text-[15px] text-slate-600 leading-relaxed pt-4 border-t border-slate-100">
                  {profile.description}
                </p>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
};
