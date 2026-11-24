import React from 'react';

const BRAIN_LETTER_CLASSES = [
  'text-emerald-700', // Hijau
  'text-red-600',     // Merah
  'text-violet-600',  // Ungu
  'text-blue-600',    // Biru
];

interface ColoredBrainTextProps {
  prefix?: string;
  suffix?: string;
}

export const ColoredBrainText: React.FC<ColoredBrainTextProps> = ({
  prefix = 'Ujian ',
  suffix = ' Brain',
}) => {
  const coloredWord = 'Colored';
  const fullLabel = `${prefix}${coloredWord}${suffix}`;

  return (
    <span aria-label={fullLabel}>
      {prefix && (
        <span aria-hidden="true" className="text-slate-900">
          {prefix}
        </span>
      )}
      <span aria-hidden="true">
        {coloredWord.split('').map((char, index) => (
          <span
            key={index}
            className={BRAIN_LETTER_CLASSES[index % BRAIN_LETTER_CLASSES.length]}
          >
            {char}
          </span>
        ))}
      </span>
      {suffix && (
        <span aria-hidden="true" className="text-blue-600">
          {suffix}
        </span>
      )}
    </span>
  );
};
