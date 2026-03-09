'use client';

import { ButtonKind } from '@/types/calculator';

interface CalcButtonProps {
  label: string;
  kind: ButtonKind;
  wide?: boolean;
  active?: boolean;
  onClick: () => void;
}

const baseStyles =
  'flex items-center justify-center rounded-full text-white text-3xl font-light select-none cursor-pointer transition-opacity active:opacity-70 h-20';

const kindStyles: Record<ButtonKind, string> = {
  function: 'bg-[#a5a5a5] text-black',
  operator: 'bg-[#ff9f0a]',
  number: 'bg-[#333333]',
  equals: 'bg-[#ff9f0a]',
};

const activeOperatorStyle = 'bg-white text-[#ff9f0a]';

export default function CalcButton({
  label,
  kind,
  wide = false,
  active = false,
  onClick,
}: CalcButtonProps) {
  const colorClass =
    kind === 'operator' && active
      ? activeOperatorStyle
      : kindStyles[kind];

  return (
    <button
      onClick={onClick}
      className={`${baseStyles} ${colorClass} ${wide ? 'col-span-2 w-full rounded-[40px] justify-start pl-7' : 'w-20'}`}
      aria-label={label}
    >
      {label}
    </button>
  );
}
