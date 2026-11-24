import React, { useMemo, useState } from 'react';
import {
  BrainColor,
  COLOR_ORDER,
  COLOR_PROFILES,
} from '../data/quizData';
import {
  CardFormat,
  computeProfileSummary,
  downloadCertificatePdf,
  downloadDigitalAssetPng,
} from '../utils/digitalCardGenerator';
import { Award, CreditCard, Download, FileText } from 'lucide-react';

interface DigitalCertificatePanelProps {
  initialName: string;
  finalScores: Record<BrainColor, number>;
}

export const DigitalCertificatePanel: React.FC<DigitalCertificatePanelProps> = ({
  initialName,
  finalScores,
}) => {
  const [format, setFormat] = useState<CardFormat>('certificate');
  const [certName, setCertName] = useState(initialName.trim() || 'Peserta');
  const [organization, setOrganization] = useState('');
  const [dateLabel, setDateLabel] = useState(() =>
    new Intl.DateTimeFormat('ms-MY', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(new Date())
  );

  const summary = useMemo(
    () => computeProfileSummary(finalScores),
    [finalScores]
  );

  const verificationCode = useMemo(() => {
    const scoreSig = `${finalScores.G}-${finalScores.R}-${finalScores.P}-${finalScores.B}`;
    const nameSig = (certName.trim() || 'CB')
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, '')
      .slice(0, 4)
      .padEnd(2, 'X');
    return `CB-${nameSig}-${scoreSig}`;
  }, [certName, finalScores]);

  const assetParams = {
    userName: certName,
    organization,
    dateLabel,
    verificationCode,
    finalScores,
  };

  return (
    <section
      id="sijil-digital"
      className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 print:hidden"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
        <div>
          <h2 className="font-display text-xl font-bold text-slate-900">
            Penjanaan Sijil & Kad Profil Digital
          </h2>
          <p className="text-sm text-slate-600 mt-1">
            Sesuaikan butiran anda dan muat turun sebagai imej PNG beresolusi
            tinggi atau Sijil PDF lengkap.
          </p>
        </div>

        {/* Format Segmented Control */}
        <div
          className="inline-flex items-center p-1 bg-slate-100 rounded-lg self-start md:self-auto"
          role="tablist"
          aria-label="Pilih format dokumen digital"
        >
          <button
            type="button"
            role="tab"
            aria-selected={format === 'certificate'}
            onClick={() => setFormat('certificate')}
            className={`px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-md flex items-center gap-2 transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
              format === 'certificate'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Award className="w-4 h-4" aria-hidden="true" />
            <span>Sijil Pencapaian</span>
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={format === 'profile-card'}
            onClick={() => setFormat('profile-card')}
            className={`px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-md flex items-center gap-2 transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
              format === 'profile-card'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <CreditCard className="w-4 h-4" aria-hidden="true" />
            <span>Kad Profil Digital</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-6 items-start">
        {/* Controls Column */}
        <div className="lg:col-span-4 space-y-4">
          <div>
            <label
              htmlFor="cert-name-input"
              className="block text-xs font-semibold text-slate-700 mb-1.5"
            >
              Nama pada Sijil / Kad
            </label>
            <input
              id="cert-name-input"
              type="text"
              value={certName}
              onChange={(e) => setCertName(e.target.value)}
              placeholder="Nama penuh..."
              className="w-full px-3.5 py-2.5 rounded-lg bg-slate-50 border border-slate-200 text-sm text-slate-900 font-medium focus:outline-none focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20"
            />
          </div>

          <div>
            <label
              htmlFor="cert-org-input"
              className="block text-xs font-semibold text-slate-700 mb-1.5"
            >
              Jawatan / Organisasi (Pilihan)
            </label>
            <input
              id="cert-org-input"
              type="text"
              value={organization}
              onChange={(e) => setOrganization(e.target.value)}
              placeholder="Contoh: Ketua Unit · Sektor Inovasi"
              className="w-full px-3.5 py-2.5 rounded-lg bg-slate-50 border border-slate-200 text-sm text-slate-900 font-medium focus:outline-none focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20"
            />
          </div>

          <div>
            <label
              htmlFor="cert-date-input"
              className="block text-xs font-semibold text-slate-700 mb-1.5"
            >
              Tarikh Pengesahan
            </label>
            <input
              id="cert-date-input"
              type="text"
              value={dateLabel}
              onChange={(e) => setDateLabel(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg bg-slate-50 border border-slate-200 text-sm text-slate-900 font-medium focus:outline-none focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20"
            />
          </div>

          <div className="pt-2 space-y-2.5">
            <button
              type="button"
              onClick={() => downloadDigitalAssetPng(format, assetParams)}
              className="w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer whitespace-nowrap"
            >
              <Download className="w-4 h-4" aria-hidden="true" />
              <span>
                {format === 'certificate'
                  ? 'Muat Turun Sijil (PNG)'
                  : 'Muat Turun Kad Profil (PNG)'}
              </span>
            </button>

            {format === 'certificate' && (
              <button
                type="button"
                onClick={() => downloadCertificatePdf(assetParams)}
                className="w-full py-3 px-4 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 text-sm font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer whitespace-nowrap"
              >
                <FileText className="w-4 h-4" aria-hidden="true" />
                <span>Muat Turun Sijil (PDF Landskap)</span>
              </button>
            )}
          </div>

          <p className="text-xs text-slate-500 font-mono-num">
            Kod Rujukan: {verificationCode}
          </p>
        </div>

        {/* Live Preview Column */}
        <div className="lg:col-span-8 bg-slate-100/80 rounded-xl border border-slate-200 p-4 sm:p-6 flex items-center justify-center">
          {format === 'certificate' ? (
            /* Landscape Certificate Live Preview */
            <div className="w-full max-w-2xl bg-slate-50 border-4 border-slate-900 p-1.5 shadow-sm">
              <div className="border border-slate-300 bg-slate-50 relative overflow-hidden">
                {/* Top 4-Color Strip */}
                <div className="grid grid-cols-4 h-2">
                  <div className="bg-emerald-600" />
                  <div className="bg-red-600" />
                  <div className="bg-violet-600" />
                  <div className="bg-blue-600" />
                </div>

                <div className="px-6 py-7 sm:px-10 sm:py-9 text-center space-y-4">
                  <div className="space-y-1">
                    <p className="text-[10px] sm:text-xs font-semibold tracking-wider text-slate-500">
                      PENILAIAN GAYA PEMPROSESAN KOGNITIF · ARTHUR F. CARMAZZI
                    </p>
                    <h3 className="font-display text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                      SIJIL PROFIL COLORED BRAIN
                    </h3>
                  </div>

                  <div className="w-32 h-px bg-slate-200 mx-auto" />

                  <div className="space-y-1">
                    <p className="text-xs text-slate-500">
                      Dengan ini mengesahkan bahawa
                    </p>
                    <p className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 break-words">
                      {certName.trim() || 'Peserta'}
                    </p>
                    {organization.trim() && (
                      <p className="text-xs sm:text-sm font-medium text-slate-600">
                        {organization.trim()}
                      </p>
                    )}
                  </div>

                  <p className="text-xs text-slate-600 max-w-md mx-auto">
                    telah melengkapkan Penilaian Colored Brain (150 Mata) dan
                    dikenal pasti dengan profil utama:
                  </p>

                  <div
                    className="bg-white rounded-xl border-2 px-5 py-3.5 max-w-lg mx-auto"
                    style={{ borderColor: summary.accentHex }}
                  >
                    <p
                      className="font-display text-lg sm:text-xl font-extrabold"
                      style={{ color: summary.accentHex }}
                    >
                      {summary.headline}
                    </p>
                    <p className="text-xs font-semibold text-slate-600 mt-0.5">
                      {summary.subHeadline}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2 max-w-lg mx-auto">
                    {COLOR_ORDER.map((cKey) => {
                      const prof = COLOR_PROFILES[cKey];
                      return (
                        <div
                          key={cKey}
                          className="bg-white border border-slate-200 rounded-lg py-2 px-2.5"
                        >
                          <p
                            className={`text-[10px] font-bold ${prof.textClass}`}
                          >
                            {prof.shortName}
                          </p>
                          <p className="font-mono-num text-sm font-bold text-slate-900 mt-0.5">
                            {finalScores[cKey]} / 150
                          </p>
                        </div>
                      );
                    })}
                  </div>

                  <div className="pt-4 mt-2 border-t border-slate-200 grid grid-cols-3 gap-2 text-left text-[10px] sm:text-xs">
                    <div>
                      <p className="text-slate-400">Tarikh Pengesahan</p>
                      <p className="font-semibold text-slate-900 mt-0.5">
                        {dateLabel}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-slate-400">Metodologi</p>
                      <p className="font-semibold text-slate-900 mt-0.5">
                        Colored Brain
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-slate-400">Kod Rujukan</p>
                      <p className="font-mono-num font-semibold text-slate-900 mt-0.5">
                        {verificationCode}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Portrait Digital Profile Card Preview */
            <div className="w-full max-w-sm bg-slate-900 p-4 rounded-2xl shadow-sm">
              <div className="bg-white rounded-xl overflow-hidden">
                <div className="grid grid-cols-4 h-2">
                  <div className="bg-emerald-600" />
                  <div className="bg-red-600" />
                  <div className="bg-violet-600" />
                  <div className="bg-blue-600" />
                </div>

                <div className="p-6 space-y-5">
                  <div>
                    <p className="text-[11px] font-semibold text-slate-400">
                      KAD PROFIL KOGNITIF · COLORED BRAIN
                    </p>
                    <h3 className="font-display text-2xl font-extrabold text-slate-900 mt-1 break-words">
                      {certName.trim() || 'Peserta'}
                    </h3>
                    {organization.trim() && (
                      <p className="text-xs font-medium text-slate-500 mt-0.5">
                        {organization.trim()}
                      </p>
                    )}
                  </div>

                  <div
                    className="bg-slate-50 rounded-xl border-2 p-4"
                    style={{ borderColor: summary.accentHex }}
                  >
                    <p className="text-[10px] font-semibold text-slate-500">
                      PROFIL PEMPROSESAN DOMINAN
                    </p>
                    <p
                      className="font-display text-lg font-extrabold mt-1"
                      style={{ color: summary.accentHex }}
                    >
                      {summary.headline}
                    </p>
                    <p className="text-xs font-medium text-slate-600 mt-0.5">
                      {summary.subHeadline}
                    </p>
                  </div>

                  <div className="space-y-3">
                    <p className="text-xs font-bold text-slate-900">
                      Taburan Skor (Skala 150 Mata)
                    </p>
                    {COLOR_ORDER.map((cKey) => {
                      const prof = COLOR_PROFILES[cKey];
                      const score = finalScores[cKey];
                      const pct = Math.round((score / 150) * 100);
                      return (
                        <div key={cKey} className="space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <span className={`font-bold ${prof.textClass}`}>
                              {prof.shortName}
                            </span>
                            <span className="font-mono-num font-semibold text-slate-900">
                              {score} / 150 ({pct}%)
                            </span>
                          </div>
                          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className={`h-full ${prof.bgClass}`}
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                    <span>{dateLabel}</span>
                    <span className="font-mono-num font-semibold text-slate-800">
                      {verificationCode}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
