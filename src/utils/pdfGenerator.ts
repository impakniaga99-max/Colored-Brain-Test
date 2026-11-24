import { jsPDF } from 'jspdf';
import {
  BrainColor,
  COLOR_ORDER,
  COLOR_PROFILES,
} from '../data/quizData';

interface ReportPdfParams {
  userName: string;
  organization?: string;
  dateLabel: string;
  finalScores: Record<BrainColor, number>;
  scores1a: Record<BrainColor, number>;
  scores1b: Record<BrainColor, number>;
}

const COLOR_RGB: Record<BrainColor, [number, number, number]> = {
  G: [5, 150, 105],   // Emerald 600
  R: [220, 38, 38],   // Red 600
  P: [124, 58, 237],  // Violet 600
  B: [37, 99, 235],   // Blue 600
};

const COLOR_SOFT_RGB: Record<BrainColor, [number, number, number]> = {
  G: [236, 253, 245],
  R: [254, 242, 242],
  P: [245, 243, 255],
  B: [239, 246, 255],
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

export function generateAssessmentReportPdf({
  userName,
  organization,
  dateLabel,
  finalScores,
  scores1a,
  scores1b,
}: ReportPdfParams): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = 210;
  const pageHeight = 297;
  const margin = 16;
  const contentWidth = pageWidth - margin * 2;

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
  const dominantRgb = isFlexibleOrTied
    ? ([37, 99, 235] as [number, number, number])
    : COLOR_RGB[dominantProfile.key];

  // ========================
  // PAGE 1: EXECUTIVE SUMMARY & RADAR SPECTRUM
  // ========================

  // Top Header Banner
  doc.setFillColor(15, 23, 42); // Slate 900
  doc.rect(0, 0, pageWidth, 38, 'F');

  // Four subtle accent segments at the top edge
  const segW = pageWidth / 4;
  COLOR_ORDER.forEach((cKey, idx) => {
    const [r, g, b] = COLOR_RGB[cKey];
    doc.setFillColor(r, g, b);
    doc.rect(idx * segW, 0, segW, 2.2, 'F');
  });

  doc.setTextColor(148, 163, 184);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.text('PENILAIAN GAYA PEMPROSESAN KOGNITIF  ·  ARTHUR F. CARMAZZI', margin, 12);

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(19);
  doc.text('LAPORAN PROFIL COLORED BRAIN', margin, 22);

  doc.setTextColor(203, 213, 225);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  const subtitleParts = [`Peserta: ${displayName}`];
  if (organization && organization.trim()) {
    subtitleParts.push(organization.trim());
  }
  subtitleParts.push(`Tarikh: ${dateLabel}`);
  doc.text(subtitleParts.join('   |   '), margin, 30.5);

  let y = 46;

  // Dominant Profile Summary Box
  const domTitle = isFlexibleOrTied
    ? `Fleksibiliti Tinggi (${topColors
        .map((c) => COLOR_PROFILES[c.key].shortName)
        .join(' & ')})`
    : `${dominantProfile.shortName} — ${dominantProfile.processingStyle}`;

  const domDesc = isFlexibleOrTied
    ? 'Anda menunjukkan keseimbangan dan fleksibiliti yang tinggi merentasi gaya pemprosesan yang berbeza. Anda mampu menyesuaikan cara anda berfikir, berkomunikasi, dan menyelesaikan masalah mengikut keperluan situasi semasa.'
    : dominantProfile.description;

  const domTip = isFlexibleOrTied
    ? 'Gunakan keupayaan penyesuaian anda untuk menjadi penghubung antara ahli pasukan yang mempunyai gaya pemprosesan berbeza.'
    : dominantProfile.workplaceTip;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  const wrappedDesc = doc.splitTextToSize(domDesc, contentWidth - 12);
  const wrappedTip = doc.splitTextToSize(`Cadangan Persekitaran Kerja: ${domTip}`, contentWidth - 12);

  const summaryBoxHeight = 24 + wrappedDesc.length * 4.5 + wrappedTip.length * 4.3 + 8;

  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.4);
  doc.roundedRect(margin, y, contentWidth, summaryBoxHeight, 3, 3, 'FD');

  doc.setTextColor(100, 116, 139);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.text('WARNA OTAK DOMINAN / PROFIL UTAMA', margin + 6, y + 8);

  doc.setTextColor(dominantRgb[0], dominantRgb[1], dominantRgb[2]);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text(domTitle, margin + 6, y + 16);

  doc.setTextColor(51, 65, 85);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.text(wrappedDesc, margin + 6, y + 23.5);

  const tipStartY = y + 23.5 + wrappedDesc.length * 4.5 + 3;
  doc.setTextColor(30, 41, 59);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text(wrappedTip, margin + 6, tipStartY);

  y += summaryBoxHeight + 8;

  // Radar Chart + Score Breakdown Row
  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('Spektrum Radar & Pecahan Skor Keseluruhan (150 Mata)', margin, y);
  y += 5;

  const panelHeight = 84;
  // Left Box: Vector Radar Chart
  const radarBoxW = 86;
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(margin, y, radarBoxW, panelHeight, 3, 3, 'FD');

  const cx = margin + radarBoxW / 2;
  const cy = y + panelHeight / 2 + 1;
  const maxR = 26;

  // Draw 3 diamond grid rings
  [0.33, 0.66, 1].forEach((ratio) => {
    const r = maxR * ratio;
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.25);
    doc.line(cx, cy - r, cx + r, cy);
    doc.line(cx + r, cy, cx, cy + r);
    doc.line(cx, cy + r, cx - r, cy);
    doc.line(cx - r, cy, cx, cy - r);
  });

  // Crosshair axes
  doc.setDrawColor(203, 213, 225);
  doc.line(cx, cy - maxR, cx, cy + maxR);
  doc.line(cx - maxR, cy, cx + maxR, cy);

  // Compute Radar Polygon coordinates (G=top, R=right, P=bottom, B=left)
  const scaleR = (val: number) => (Math.max(10, Math.min(val, 150)) / 150) * maxR;
  const ptG: [number, number] = [cx, cy - scaleR(finalScores.G)];
  const ptR: [number, number] = [cx + scaleR(finalScores.R), cy];
  const ptP: [number, number] = [cx, cy + scaleR(finalScores.P)];
  const ptB: [number, number] = [cx - scaleR(finalScores.B), cy];

  // Fill + Stroke polygon
  doc.setFillColor(dominantRgb[0], dominantRgb[1], dominantRgb[2]);
  doc.setDrawColor(dominantRgb[0], dominantRgb[1], dominantRgb[2]);
  doc.setLineWidth(0.7);
  // Subtle translucent fill via GState
  const gState = doc.GState({ opacity: 0.2 });
  doc.saveGraphicsState();
  doc.setGState(gState);
  doc.triangle(cx, cy, ptG[0], ptG[1], ptR[0], ptR[1], 'F');
  doc.triangle(cx, cy, ptR[0], ptR[1], ptP[0], ptP[1], 'F');
  doc.triangle(cx, cy, ptP[0], ptP[1], ptB[0], ptB[1], 'F');
  doc.triangle(cx, cy, ptB[0], ptB[1], ptG[0], ptG[1], 'F');
  doc.restoreGraphicsState();

  doc.line(ptG[0], ptG[1], ptR[0], ptR[1]);
  doc.line(ptR[0], ptR[1], ptP[0], ptP[1]);
  doc.line(ptP[0], ptP[1], ptB[0], ptB[1]);
  doc.line(ptB[0], ptB[1], ptG[0], ptG[1]);

  // Vertex circles
  const vertexPts: Array<{ c: BrainColor; pt: [number, number] }> = [
    { c: 'G', pt: ptG },
    { c: 'R', pt: ptR },
    { c: 'P', pt: ptP },
    { c: 'B', pt: ptB },
  ];
  vertexPts.forEach(({ c, pt }) => {
    const [r, g, b] = COLOR_RGB[c];
    doc.setFillColor(r, g, b);
    doc.circle(pt[0], pt[1], 1.3, 'F');
  });

  // Radar Axis Labels
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(...COLOR_RGB.G);
  doc.text(`HIJAU (${finalScores.G})`, cx, cy - maxR - 4, { align: 'center' });
  doc.setTextColor(...COLOR_RGB.R);
  doc.text(`MERAH (${finalScores.R})`, cx + maxR + 3, cy + 1, { align: 'left' });
  doc.setTextColor(...COLOR_RGB.P);
  doc.text(`UNGU (${finalScores.P})`, cx, cy + maxR + 6.5, { align: 'center' });
  doc.setTextColor(...COLOR_RGB.B);
  doc.text(`BIRU (${finalScores.B})`, cx - maxR - 3, cy + 1, { align: 'right' });

  // Right Box: Structured Score Breakdown Table
  const tableX = margin + radarBoxW + 6;
  const tableW = contentWidth - radarBoxW - 6;
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(tableX, y, tableW, panelHeight, 3, 3, 'FD');

  // Table Header
  doc.setFillColor(248, 250, 252);
  doc.rect(tableX + 0.5, y + 0.5, tableW - 1, 10, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(71, 85, 105);
  doc.text('GAYA KOGNITIF', tableX + 4, y + 6.8);
  doc.text('1A', tableX + 44, y + 6.8, { align: 'right' });
  doc.text('1B', tableX + 56, y + 6.8, { align: 'right' });
  doc.text('JUMLAH', tableX + 74, y + 6.8, { align: 'right' });
  doc.text('%', tableX + tableW - 4, y + 6.8, { align: 'right' });

  let rowY = y + 17;
  COLOR_ORDER.forEach((cKey, idx) => {
    const profile = COLOR_PROFILES[cKey];
    const score = finalScores[cKey];
    const pct = Math.round((score / 150) * 100);
    const [r, g, b] = COLOR_RGB[cKey];

    if (idx > 0) {
      doc.setDrawColor(241, 245, 249);
      doc.line(tableX + 4, rowY - 5, tableX + tableW - 4, rowY - 5);
    }

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(r, g, b);
    doc.text(profile.shortName, tableX + 4, rowY);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(100, 116, 139);
    doc.text(profile.processingStyle.replace(' Processing', ''), tableX + 4, rowY + 4);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(51, 65, 85);
    doc.text(String(scores1a[cKey]), tableX + 44, rowY + 1, { align: 'right' });
    doc.text(String(scores1b[cKey]), tableX + 56, rowY + 1, { align: 'right' });

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(15, 23, 42);
    doc.text(`${score}`, tableX + 74, rowY + 1, { align: 'right' });
    doc.text(`${pct}%`, tableX + tableW - 4, rowY + 1, { align: 'right' });

    // Progress bar below row
    const barW = tableW - 8;
    doc.setFillColor(241, 245, 249);
    doc.rect(tableX + 4, rowY + 6.2, barW, 1.8, 'F');
    doc.setFillColor(r, g, b);
    doc.rect(tableX + 4, rowY + 6.2, (barW * pct) / 100, 1.8, 'F');

    rowY += 16.2;
  });

  y += panelHeight + 10;

  // Quick Key Takeaways Box at bottom of Page 1
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(margin, y, contentWidth, 34, 3, 3, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(15, 23, 42);
  doc.text('Ringkasan Metodologi Pemarkahan (Skala 150 Mata)', margin + 6, y + 8);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(71, 85, 105);
  const methodText = doc.splitTextToSize(
    `Penilaian ini terdiri daripada Bahagian 1 (A) sebanyak 10 soalan asas (100 mata) dan Bahagian 1 (B) sebanyak 5 soalan fleksibiliti pemprosesan (50 mata). Jumlah keseluruhan ialah ${totalPoints} daripada 150 mata. Sekiranya skor tertinggi adalah seri atau di bawah 40 mata, profil diklasifikasikan sebagai Fleksibiliti Tinggi merentasi gaya kognitif.`,
    contentWidth - 12
  );
  doc.text(methodText, margin + 6, y + 14.5);

  // Page 1 Footer
  doc.setDrawColor(226, 232, 240);
  doc.line(margin, pageHeight - 16, pageWidth - margin, pageHeight - 16);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text('Ujian Colored Brain — Arthur F. Carmazzi', margin, pageHeight - 10);
  doc.text('Halaman 1 daripada 2', pageWidth - margin, pageHeight - 10, { align: 'right' });

  // ========================
  // PAGE 2: DETAILED RANKED ANALYSIS
  // ========================
  doc.addPage();

  // Top Header Strip on Page 2
  doc.setFillColor(15, 23, 42);
  doc.rect(0, 0, pageWidth, 20, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('ANALISIS TERPERINCI GAYA PEMPROSESAN MAKLUMAT', margin, 12.5);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(203, 213, 225);
  doc.text(displayName, pageWidth - margin, 12.5, { align: 'right' });

  let y2 = 28;

  sortedResults.forEach((item, idx) => {
    const profile = COLOR_PROFILES[item.key];
    const [r, g, b] = COLOR_RGB[item.key];
    const [sr, sg, sb] = COLOR_SOFT_RGB[item.key];
    const pct = Math.round((item.score / 150) * 100);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    const wrappedProfileDesc = doc.splitTextToSize(profile.description, contentWidth - 12);

    const cardHeight = 36 + wrappedProfileDesc.length * 4 + 8;

    // Safety page break if needed
    if (y2 + cardHeight > pageHeight - 20) {
      doc.addPage();
      y2 = 20;
    }

    // Card Background
    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(idx === 0 ? r : 226, idx === 0 ? g : 232, idx === 0 ? b : 240);
    doc.setLineWidth(idx === 0 ? 0.6 : 0.35);
    doc.roundedRect(margin, y2, contentWidth, cardHeight, 3, 3, 'FD');

    // Header band inside card
    doc.setFillColor(sr, sg, sb);
    doc.rect(margin + 0.4, y2 + 0.4, contentWidth - 0.8, 10.5, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10.5);
    doc.setTextColor(r, g, b);
    doc.text(`0${idx + 1}. ${profile.title}`, margin + 5, y2 + 7.2);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(15, 23, 42);
    doc.text(`${item.score} / 150 Mata (${pct}%)`, pageWidth - margin - 5, y2 + 7.2, {
      align: 'right',
    });

    // 5 Core Traits in 2 columns
    let traitY = y2 + 16.5;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.2);
    doc.setTextColor(51, 65, 85);

    profile.traits.forEach((trait, tIdx) => {
      const col = tIdx % 2;
      const row = Math.floor(tIdx / 2);
      const tx = margin + 5 + col * (contentWidth / 2 - 2);
      const ty = traitY + row * 4.8;
      doc.text(`• ${trait}`, tx, ty);
    });

    const descY = traitY + Math.ceil(profile.traits.length / 2) * 4.8 + 2.5;
    doc.setDrawColor(241, 245, 249);
    doc.line(margin + 5, descY - 2, pageWidth - margin - 5, descY - 2);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(71, 85, 105);
    doc.text(wrappedProfileDesc, margin + 5, descY + 2);

    y2 += cardHeight + 5.5;
  });

  // Page 2 Footer
  doc.setDrawColor(226, 232, 240);
  doc.line(margin, pageHeight - 16, pageWidth - margin, pageHeight - 16);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text('Laporan Rasmi Penilaian Kognitif · Arthur F. Carmazzi Colored Brain', margin, pageHeight - 10);
  doc.text('Halaman 2 daripada 2', pageWidth - margin, pageHeight - 10, { align: 'right' });

  doc.save(`Laporan-Colored-Brain-${sanitizeFilename(displayName)}.pdf`);
}
