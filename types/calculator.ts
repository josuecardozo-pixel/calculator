export type Operator = '+' | '-' | '×' | '÷';

export type ButtonKind = 'number' | 'operator' | 'function' | 'equals';

export interface CalcButton {
  label: string;
  kind: ButtonKind;
  value: string;
  wide?: boolean;
}

export interface CalculatorState {
  /** The number currently displayed */
  display: string;
  /** The left-hand operand stored for a pending operation */
  operand: string | null;
  /** The operator waiting to be applied */
  operator: Operator | null;
  /** When true the next digit press starts a fresh number */
  waitingForOperand: boolean;
  /** The expression line shown above the display (e.g. "12 +") */
  expression: string;
}

export type CalculatorAction =
  | { type: 'DIGIT'; payload: string }
  | { type: 'DECIMAL' }
  | { type: 'OPERATOR'; payload: Operator }
  | { type: 'EQUALS' }
  | { type: 'CLEAR' }
  | { type: 'TOGGLE_SIGN' }
  | { type: 'PERCENT' };
