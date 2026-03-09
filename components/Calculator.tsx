'use client';

import { useReducer, useCallback, useEffect } from 'react';
import { calculatorReducer, initialState } from '@/lib/calculatorReducer';
import { Operator } from '@/types/calculator';
import CalcButton from './CalcButton';
import CalcDisplay from './CalcDisplay';

// ---------------------------------------------------------------------------
// Button grid layout definition
// ---------------------------------------------------------------------------

type GridCell =
  | { label: string; kind: 'function' | 'operator' | 'number' | 'equals'; action: () => void; wide?: boolean; isOperator?: boolean }

// We define the grid inside the component so actions close over dispatch.

export default function Calculator() {
  const [state, dispatch] = useReducer(calculatorReducer, initialState);

  // Keyboard support
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key >= '0' && e.key <= '9') {
        dispatch({ type: 'DIGIT', payload: e.key });
      } else if (e.key === '.') {
        dispatch({ type: 'DECIMAL' });
      } else if (e.key === '+') {
        dispatch({ type: 'OPERATOR', payload: '+' });
      } else if (e.key === '-') {
        dispatch({ type: 'OPERATOR', payload: '-' });
      } else if (e.key === '*') {
        dispatch({ type: 'OPERATOR', payload: '×' });
      } else if (e.key === '/') {
        e.preventDefault();
        dispatch({ type: 'OPERATOR', payload: '÷' });
      } else if (e.key === 'Enter' || e.key === '=') {
        dispatch({ type: 'EQUALS' });
      } else if (e.key === 'Escape') {
        dispatch({ type: 'CLEAR' });
      } else if (e.key === '%') {
        dispatch({ type: 'PERCENT' });
      }
    },
    [],
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Label for AC/C button: show "AC" when display is clean, "C" otherwise
  const clearLabel = state.display === '0' && !state.operand ? 'AC' : 'C';

  const rows: GridCell[][] = [
    // Row 1 — function row
    [
      {
        label: clearLabel,
        kind: 'function',
        action: () => dispatch({ type: 'CLEAR' }),
      },
      {
        label: '+/-',
        kind: 'function',
        action: () => dispatch({ type: 'TOGGLE_SIGN' }),
      },
      {
        label: '%',
        kind: 'function',
        action: () => dispatch({ type: 'PERCENT' }),
      },
      {
        label: '÷',
        kind: 'operator',
        isOperator: true,
        action: () => dispatch({ type: 'OPERATOR', payload: '÷' }),
      },
    ],
    // Row 2
    [
      { label: '7', kind: 'number', action: () => dispatch({ type: 'DIGIT', payload: '7' }) },
      { label: '8', kind: 'number', action: () => dispatch({ type: 'DIGIT', payload: '8' }) },
      { label: '9', kind: 'number', action: () => dispatch({ type: 'DIGIT', payload: '9' }) },
      {
        label: '×',
        kind: 'operator',
        isOperator: true,
        action: () => dispatch({ type: 'OPERATOR', payload: '×' }),
      },
    ],
    // Row 3
    [
      { label: '4', kind: 'number', action: () => dispatch({ type: 'DIGIT', payload: '4' }) },
      { label: '5', kind: 'number', action: () => dispatch({ type: 'DIGIT', payload: '5' }) },
      { label: '6', kind: 'number', action: () => dispatch({ type: 'DIGIT', payload: '6' }) },
      {
        label: '-',
        kind: 'operator',
        isOperator: true,
        action: () => dispatch({ type: 'OPERATOR', payload: '-' }),
      },
    ],
    // Row 4
    [
      { label: '1', kind: 'number', action: () => dispatch({ type: 'DIGIT', payload: '1' }) },
      { label: '2', kind: 'number', action: () => dispatch({ type: 'DIGIT', payload: '2' }) },
      { label: '3', kind: 'number', action: () => dispatch({ type: 'DIGIT', payload: '3' }) },
      {
        label: '+',
        kind: 'operator',
        isOperator: true,
        action: () => dispatch({ type: 'OPERATOR', payload: '+' }),
      },
    ],
    // Row 5
    [
      { label: '0', kind: 'number', wide: true, action: () => dispatch({ type: 'DIGIT', payload: '0' }) },
      { label: '.', kind: 'number', action: () => dispatch({ type: 'DECIMAL' }) },
      { label: '=', kind: 'equals', action: () => dispatch({ type: 'EQUALS' }) },
    ],
  ];

  return (
    <div className="flex min-h-screen items-center justify-center bg-black">
      {/* Calculator shell */}
      <div className="w-[320px] rounded-[40px] bg-black overflow-hidden shadow-2xl border border-[#1c1c1e]">
        {/* Display */}
        <CalcDisplay value={state.display} expression={state.expression} />

        {/* Button grid */}
        <div className="grid grid-cols-4 gap-3 p-4">
          {rows.map((row, rowIndex) =>
            row.map((cell, colIndex) => (
              <CalcButton
                key={`${rowIndex}-${colIndex}`}
                label={cell.label}
                kind={cell.kind}
                wide={cell.wide}
                active={
                  cell.isOperator === true &&
                  state.operator === (cell.label as Operator) &&
                  state.waitingForOperand
                }
                onClick={cell.action}
              />
            )),
          )}
        </div>
      </div>
    </div>
  );
}
