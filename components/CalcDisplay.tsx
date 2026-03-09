'use client';

interface CalcDisplayProps {
  value: string;
  expression: string;
}

/** Shrink font size when the display string is long */
function getFontSize(value: string): string {
  const len = value.length;
  if (len <= 6) return 'text-7xl';
  if (len <= 9) return 'text-5xl';
  return 'text-4xl';
}

export default function CalcDisplay({ value, expression }: CalcDisplayProps) {
  return (
    <div className="flex flex-col items-end justify-end px-6 pb-4 pt-8 w-full">
      {/* Expression / history line */}
      <p className="text-[#a5a5a5] text-xl h-7 truncate w-full text-right">
        {expression}
      </p>
      {/* Main number display */}
      <p
        className={`text-white font-light tracking-tight w-full text-right leading-none mt-1 ${getFontSize(value)}`}
      >
        {value}
      </p>
    </div>
  );
}
