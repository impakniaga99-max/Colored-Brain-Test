import { jsPDF } from 'jspdf';
import {
  BrainColor,
  COLOR_ORDER,
  COLOR_PROFILES,
} from '../data/quizData';

export type CardFormat = 'certificate' | 'profile-card';

export interface DigitalAssetParams {
  userName: string;
  organization: string;
  dateLabel: string;
  verificationCode: string;
  finalScores: Record<BrainColor, number>;
}

const COLOR_HEX: Record<BrainColor, string> = {
  G: '#059669',
  R: '#DC2626',
  P: '#7C3AED',
  B: '#2563EB',
};

const COLOR_RGB: Record<BrainColor, [number, number, number]> = {
  G: [5, 150, 105],
  R: [220, 38, 38],
  P: [124, 58, 237],
  B: [37, 99, 235],
};

function sanitizeFilename(input: string): string {
  return (
    input
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/gi, '-')
      .replace(/^-+|-+$/g, '') || 'peserta'
  );
}

export function computeProfileSummary(finalScores: Record<BrainColor, number>) {
  const sortedResults = COLOR_ORDER.map((key) => ({
    key,
    score: finalScores[key],
  })).sort((a, b) => b.score - a.score);

  const maxScore = sortedResults[0].score;
  const topColors = sortedResults.filter((item) => item.score === maxScore);
  const isFlexibleOrTied = topColors.length > 1 || maxScore < 40;
  const dominantProfile = COLOR_PROFILES[topColors[0].key];

  const headline = isFlexibleOrTied
    ? `Fleksibiliti Tinggi (${topColors
        .map((c) => COLOR_PROFILES[c.key].shortName)
        .join(' & ')})`
    : `${dominantProfile.shortName} · ${dominantProfile.englishName}`;

  const subHeadline = isFlexibleOrTied
    ? 'Multi-Modal Cognitive Processing'
    : dominantProfile.processingStyle;

  const accentHex = isFlexibleOrTied ? '#2563EB' : COLOR_HEX[dominantProfile.key];
  const accentRgb: [number, number, number] = isFlexibleOrTied
    ? [37, 99, 235]
    : COLOR_RGB[dominantProfile.key];

  return {
    sortedResults,
    isFlexibleOrTied,
    dominantProfile,
    headline,
    subHeadline,
    accentHex,
    accentRgb,
  };
}

function wrapCanvasText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number
): string[] {
  const words = text.split(' ');
  const lines: string[] = [];
  let currentLine = '';

  words.forEach((word) => {
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    if (ctx.measureText(testLine).width > maxWidth && currentLine) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = testLine;
    }
  });
  if (currentLine) {
    lines.push(currentLine);
  }
  return lines;
}

function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

export function downloadDigitalAssetPng(
  format: CardFormat,
  params: DigitalAssetParams
): void {
  const { userName, organization, dateLabel, verificationCode, finalScores } = params;
  const displayName = userName.trim() || 'Peserta';
  const summary = computeProfileSummary(finalScores);

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  if (format === 'certificate') {
    // 1600 x 1120 Landscape Certificate
    canvas.width = 1600;
    canvas.height = 1120;

    // Crisp off-white paper canvas
    ctx.fillStyle = '#F8FAFC';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Outer double editorial border
    ctx.strokeStyle = '#0F172A';
    ctx.lineWidth = 6;
    ctx.strokeRect(42, 42, canvas.width - 84, canvas.height - 84);

    ctx.strokeStyle = '#CBD5E1';
    ctx.lineWidth = 2;
    ctx.strokeRect(58, 58, canvas.width - 116, canvas.height - 116);

    // Top 4-color cognitive bar
    const barW = (canvas.width - 116) / 4;
    COLOR_ORDER.forEach((cKey, i) => {
      ctx.fillStyle = COLOR_HEX[cKey];
      ctx.fillRect(58 + i * barW, 58, barW, 12);
    });

    // Header Title
    ctx.textAlign = 'center';
    ctx.fillStyle = '#475569';
    ctx.font = '600 22px Arial, Helvetica, sans-serif';
    ctx.fillText('PENILAIAN GAYA PEMPROSESAN KOGNITIF · ARTHUR F. CARMAZZI', canvas.width / 2, 150);

    ctx.fillStyle = '#0F172A';
    ctx.font = '800 54px Arial, Helvetica, sans-serif';
    ctx.fillText('SIJIL PROFIL COLORED BRAIN', canvas.width / 2, 222);

    // Divider line
    ctx.strokeStyle = '#E2E8F0';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(480, 260);
    ctx.lineTo(1120, 260);
    ctx.stroke();

    ctx.fillStyle = '#64748B';
    ctx.font = '500 24px Arial, Helvetica, sans-serif';
    ctx.fillText('Dengan ini mengesahkan bahawa', canvas.width / 2, 326);

    // Recipient Name
    ctx.fillStyle = '#0F172A';
    ctx.font = '800 62px Arial, Helvetica, sans-serif';
    ctx.fillText(displayName, canvas.width / 2, 412);

    if (organization.trim()) {
      ctx.fillStyle = '#475569';
      ctx.font = '500 24px Arial, Helvetica, sans-serif';
      ctx.fillText(organization.trim(), canvas.width / 2, 460);
    }

    ctx.fillStyle = '#475569';
    ctx.font = '500 23px Arial, Helvetica, sans-serif';
    ctx.fillText(
      'telah melengkapkan Penilaian Colored Brain (150 Mata) dan dikenal pasti dengan profil utama:',
      canvas.width / 2,
      organization.trim() ? 525 : 495
    );

    // Dominant Result Box
    const boxY = organization.trim() ? 565 : 540;
    drawRoundedRect(ctx, 260, boxY, 1080, 145, 16);
    ctx.fillStyle = '#FFFFFF';
    ctx.fill();
    ctx.strokeStyle = summary.accentHex;
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.fillStyle = summary.accentHex;
    ctx.font = '800 44px Arial, Helvetica, sans-serif';
    ctx.fillText(summary.headline.toUpperCase(), canvas.width / 2, boxY + 68);

    ctx.fillStyle = '#475569';
    ctx.font = '600 24px Arial, Helvetica, sans-serif';
    ctx.fillText(summary.subHeadline, canvas.width / 2, boxY + 112);

    // 4 Score Blocks
    const scoreY = boxY + 185;
    const cardW = 250;
    const gap = 26;
    const startX = (canvas.width - (cardW * 4 + gap * 3)) / 2;

    COLOR_ORDER.forEach((cKey, idx) => {
      const prof = COLOR_PROFILES[cKey];
      const x = startX + idx * (cardW + gap);
      drawRoundedRect(ctx, x, scoreY, cardW, 110, 12);
      ctx.fillStyle = '#FFFFFF';
      ctx.fill();
      ctx.strokeStyle = '#E2E8F0';
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.fillStyle = COLOR_HEX[cKey];
      ctx.font = '700 20px Arial, Helvetica, sans-serif';
      ctx.fillText(prof.shortName, x + cardW / 2, scoreY + 38);

      ctx.fillStyle = '#0F172A';
      ctx.font = '700 36px Arial, Helvetica, sans-serif';
      ctx.fillText(`${finalScores[cKey]} / 150`, x + cardW / 2, scoreY + 84);
    });

    // Footer Signature & Verification
    const footerY = 995;
    ctx.textAlign = 'left';
    ctx.fillStyle = '#64748B';
    ctx.font = '500 18px Arial, Helvetica, sans-serif';
    ctx.fillText('Tarikh Pengesahan', 120, footerY - 28);
    ctx.fillStyle = '#0F172A';
    ctx.font = '700 22px Arial, Helvetica, sans-serif';
    ctx.fillText(dateLabel, 120, footerY + 4);

    ctx.textAlign = 'center';
    ctx.fillStyle = '#64748B';
    ctx.font = '500 18px Arial, Helvetica, sans-serif';
    ctx.fillText('Metodologi Penilaian', canvas.width / 2, footerY - 28);
    ctx.fillStyle = '#0F172A';
    ctx.font = '700 22px Arial, Helvetica, sans-serif';
    ctx.fillText('Arthur F. Carmazzi Colored Brain', canvas.width / 2, footerY + 4);

    ctx.textAlign = 'right';
    ctx.fillStyle = '#64748B';
    ctx.font = '500 18px Arial, Helvetica, sans-serif';
    ctx.fillText('Kod Rujukan Digital', canvas.width - 120, footerY - 28);
    ctx.fillStyle = '#0F172A';
    ctx.font = '600 20px Arial, Helvetica, sans-serif';
    ctx.fillText(verificationCode, canvas.width - 120, footerY + 4);

    const link = document.createElement('a');
    link.download = `Sijil-Colored-Brain-${sanitizeFilename(displayName)}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
    return;
  }

  // Portrait Digital Profile Card (1080 x 1350)
  canvas.width = 1080;
  canvas.height = 1350;

  ctx.fillStyle = '#0F172A';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Inner light card container
  drawRoundedRect(ctx, 56, 56, canvas.width - 112, canvas.height - 112, 28);
  ctx.fillStyle = '#FFFFFF';
  ctx.fill();

  // Top accent strip inside card
  const innerW = canvas.width - 112;
  const segW = innerW / 4;
  COLOR_ORDER.forEach((cKey, idx) => {
    ctx.fillStyle = COLOR_HEX[cKey];
    ctx.fillRect(56 + idx * segW, 56, segW, 14);
  });

  ctx.textAlign = 'left';
  ctx.fillStyle = '#64748B';
  ctx.font = '600 22px Arial, Helvetica, sans-serif';
  ctx.fillText('KAD PROFIL KOGNITIF · COLORED BRAIN', 110, 142);

  ctx.fillStyle = '#0F172A';
  ctx.font = '800 54px Arial, Helvetica, sans-serif';
  ctx.fillText(displayName, 110, 224);

  if (organization.trim()) {
    ctx.fillStyle = '#475569';
    ctx.font = '500 26px Arial, Helvetica, sans-serif';
    ctx.fillText(organization.trim(), 110, 270);
  }

  // Dominant Profile Highlight Panel
  const panelY = organization.trim() ? 315 : 285;
  drawRoundedRect(ctx, 110, panelY, canvas.width - 220, 210, 18);
  ctx.fillStyle = '#F8FAFC';
  ctx.fill();
  ctx.strokeStyle = summary.accentHex;
  ctx.lineWidth = 3;
  ctx.stroke();

  ctx.fillStyle = '#64748B';
  ctx.font = '600 20px Arial, Helvetica, sans-serif';
  ctx.fillText('PROFIL PEMPROSESAN DOMINAN', 148, panelY + 52);

  ctx.fillStyle = summary.accentHex;
  ctx.font = '800 48px Arial, Helvetica, sans-serif';
  ctx.fillText(summary.headline, 148, panelY + 114);

  ctx.fillStyle = '#334155';
  ctx.font = '600 24px Arial, Helvetica, sans-serif';
  ctx.fillText(summary.subHeadline, 148, panelY + 164);

  // Score Spectrum Bars
  let barY = panelY + 265;
  ctx.fillStyle = '#0F172A';
  ctx.font = '700 24px Arial, Helvetica, sans-serif';
  ctx.fillText('Taburan Skor (Skala 150 Mata)', 110, barY);
  barY += 42;

  COLOR_ORDER.forEach((cKey) => {
    const prof = COLOR_PROFILES[cKey];
    const score = finalScores[cKey];
    const pct = Math.round((score / 150) * 100);
    const totalBarW = canvas.width - 220;

    ctx.textAlign = 'left';
    ctx.fillStyle = COLOR_HEX[cKey];
    ctx.font = '700 22px Arial, Helvetica, sans-serif';
    ctx.fillText(`${prof.shortName} · ${prof.processingStyle}`, 110, barY);

    ctx.textAlign = 'right';
    ctx.fillStyle = '#0F172A';
    ctx.font = '700 22px Arial, Helvetica, sans-serif';
    ctx.fillText(`${score} / 150 (${pct}%)`, canvas.width - 110, barY);

    drawRoundedRect(ctx, 110, barY + 14, totalBarW, 18, 9);
    ctx.fillStyle = '#F1F5F9';
    ctx.fill();

    const fillW = Math.max(18, (totalBarW * pct) / 100);
    drawRoundedRect(ctx, 110, barY + 14, fillW, 18, 9);
    ctx.fillStyle = COLOR_HEX[cKey];
    ctx.fill();

    barY += 74;
  });

  // Top 3 Traits
  const traitsY = barY + 20;
  ctx.textAlign = 'left';
  ctx.fillStyle = '#0F172A';
  ctx.font = '700 22px Arial, Helvetica, sans-serif';
  ctx.fillText('Ciri Utama Pemikiran', 110, traitsY);

  const traits = summary.isFlexibleOrTied
    ? [
        'Menyesuaikan gaya komunikasi mengikut keperluan pasukan',
        'Seimbang antara analisis logik, tindakan pantas, dan empati',
        'Berkebolehan menghubungkan pelbagai perspektif kerja',
      ]
    : summary.dominantProfile.traits.slice(0, 3);

  ctx.fillStyle = '#334155';
  ctx.font = '500 21px Arial, Helvetica, sans-serif';
  let tOffset = traitsY + 40;
  traits.forEach((t) => {
    const wrapped = wrapCanvasText(ctx, `• ${t}`, canvas.width - 220);
    wrapped.forEach((line) => {
      ctx.fillText(line, 110, tOffset);
      tOffset += 30;
    });
  });

  // Footer
  ctx.strokeStyle = '#E2E8F0';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(110, 1215);
  ctx.lineTo(canvas.width - 110, 1215);
  ctx.stroke();

  ctx.textAlign = 'left';
  ctx.fillStyle = '#64748B';
  ctx.font = '500 19px Arial, Helvetica, sans-serif';
  ctx.fillText(`Arthur F. Carmazzi · ${dateLabel}`, 110, 1254);

  ctx.textAlign = 'right';
  ctx.fillStyle = '#0F172A';
  ctx.font = '600 19px Arial, Helvetica, sans-serif';
  ctx.fillText(verificationCode, canvas.width - 110, 1254);

  const link = document.createElement('a');
  link.download = `Kad-Profil-Colored-Brain-${sanitizeFilename(displayName)}.png`;
  link.href = canvas.toDataURL('image/png');
  link.click();
}

export function downloadCertificatePdf(params: DigitalAssetParams): void {
  const { userName, organization, dateLabel, verificationCode, finalScores } = params;
  const displayName = userName.trim() || 'Peserta';
  const summary = computeProfileSummary(finalScores);

  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4',
  });

  const w = 297;
  const h = 210;

  // Off-white certificate background
  doc.setFillColor(248, 250, 252);
  doc.rect(0, 0, w, h, 'F');

  // Double border
  doc.setDrawColor(15, 23, 42);
  doc.setLineWidth(1.2);
  doc.rect(10, 10, w - 20, h - 20);

  doc.setDrawColor(203, 213, 225);
  doc.setLineWidth(0.4);
  doc.rect(14, 14, w - 28, h - 28);

  // 4-color top bar inside border
  const segW = (w - 28) / 4;
  COLOR_ORDER.forEach((cKey, idx) => {
    const [r, g, b] = COLOR_RGB[cKey];
    doc.setFillColor(r, g, b);
    doc.rect(14 + idx * segW, 14, segW, 2.5, 'F');
  });

  // Header
  doc.setTextColor(71, 85, 105);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text(
    'PENILAIAN GAYA PEMPROSESAN KOGNITIF  ·  ARTHUR F. CARMAZZI',
    w / 2,
    32,
    { align: 'center' }
  );

  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(26);
  doc.text('SIJIL PROFIL COLORED BRAIN', w / 2, 46, { align: 'center' });

  doc.setDrawColor(226, 232, 240);
  doc.line(95, 53, w - 95, 53);

  doc.setTextColor(100, 116, 139);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  doc.text('Dengan ini mengesahkan bahawa', w / 2, 65, { align: 'center' });

  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(28);
  doc.text(displayName, w / 2, 80, { align: 'center' });

  if (organization.trim()) {
    doc.setTextColor(71, 85, 105);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11.5);
    doc.text(organization.trim(), w / 2, 89, { align: 'center' });
  }

  doc.setTextColor(71, 85, 105);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10.5);
  doc.text(
    'telah melengkapkan Penilaian Colored Brain (150 Mata) dan dikenal pasti dengan profil utama:',
    w / 2,
    organization.trim() ? 100 : 94,
    { align: 'center' }
  );

  // Dominant Profile Frame
  const boxY = organization.trim() ? 107 : 102;
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(...summary.accentRgb);
  doc.setLineWidth(0.8);
  doc.roundedRect(50, boxY, w - 100, 28, 3, 3, 'FD');

  doc.setTextColor(...summary.accentRgb);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.text(summary.headline.toUpperCase(), w / 2, boxY + 12.5, { align: 'center' });

  doc.setTextColor(71, 85, 105);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.text(summary.subHeadline, w / 2, boxY + 21.5, { align: 'center' });

  // 4 Score Cards
  const scoreY = boxY + 35;
  const cardW = 48;
  const gap = 6;
  const startX = (w - (cardW * 4 + gap * 3)) / 2;

  COLOR_ORDER.forEach((cKey, idx) => {
    const prof = COLOR_PROFILES[cKey];
    const [r, g, b] = COLOR_RGB[cKey];
    const x = startX + idx * (cardW + gap);

    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.35);
    doc.roundedRect(x, scoreY, cardW, 21, 2, 2, 'FD');

    doc.setTextColor(r, g, b);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.text(prof.shortName, x + cardW / 2, scoreY + 7.5, { align: 'center' });

    doc.setTextColor(15, 23, 42);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.text(`${finalScores[cKey]} / 150`, x + cardW / 2, scoreY + 16, {
      align: 'center',
    });
  });

  // Footer
  const fy = 183;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(100, 116, 139);
  doc.text('Tarikh Pengesahan', 26, fy - 5);
  doc.text('Metodologi Penilaian', w / 2, fy - 5, { align: 'center' });
  doc.text('Kod Rujukan Digital', w - 26, fy - 5, { align: 'right' });

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);
  doc.text(dateLabel, 26, fy + 1.5);
  doc.text('Arthur F. Carmazzi Colored Brain', w / 2, fy + 1.5, { align: 'center' });
  doc.text(verificationCode, w - 26, fy + 1.5, { align: 'right' });

  doc.save(`Sijil-Colored-Brain-${sanitizeFilename(displayName)}.pdf`);
}
