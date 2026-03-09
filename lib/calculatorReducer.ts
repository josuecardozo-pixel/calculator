import { CalculatorAction, CalculatorState, Operator } from '@/types/calculator';

export const initialState: CalculatorState = {
  display: '0',
  operand: null,
  operator: null,
  waitingForOperand: false,
  expression: '',
};

const MAX_DISPLAY_LENGTH = 12;

/** Format a raw numeric string for display, capping length and removing
 *  unnecessary trailing zeros after a decimal point. */
function formatDisplay(value: string): string {
  const num = parseFloat(value);
  if (isNaN(num)) return 'Error';

  // If the absolute value is too large or too small use exponential notation
  if (Math.abs(num) >= 1e12 || (Math.abs(num) < 1e-6 && num !== 0)) {
    return num.toPrecision(6);
  }

  // Keep the decimal point if the raw value ends with it (mid-typing)
  if (value.endsWith('.')) return value;

  const str = String(num);
  if (str.length > MAX_DISPLAY_LENGTH) {
    return num.toPrecision(MAX_DISPLAY_LENGTH - 4);
  }
  return str;
}

function applyOperator(
  left: string,
  right: string,
  operator: Operator,
): string {
  const a = parseFloat(left);
  const b = parseFloat(right);

  switch (operator) {
    case '+':
      return String(a + b);
    case '-':
      return String(a - b);
    case '×':
      return String(a * b);
    case '÷':
      if (b === 0) return 'Error';
      return String(a / b);
  }
}

export function calculatorReducer(
  state: CalculatorState,
  action: CalculatorAction,
): CalculatorState {
  switch (action.type) {
    case 'DIGIT': {
      const { payload: digit } = action;

      if (state.display === 'Error') {
        return { ...initialState, display: digit, waitingForOperand: false };
      }

      if (state.waitingForOperand) {
        return {
          ...state,
          display: digit,
          waitingForOperand: false,
        };
      }

      // Prevent leading zeros (e.g. "007")
      if (state.display === '0' && digit !== '.') {
        return { ...state, display: digit };
      }

      if (state.display.replace('.', '').replace('-', '').length >= MAX_DISPLAY_LENGTH) {
        return state;
      }

      return { ...state, display: state.display + digit };
    }

    case 'DECIMAL': {
      if (state.waitingForOperand) {
        return { ...state, display: '0.', waitingForOperand: false };
      }
      if (state.display.includes('.')) return state;
      return { ...state, display: state.display + '.' };
    }

    case 'OPERATOR': {
      const { payload: operator } = action;

      if (state.display === 'Error') return state;

      // Chain: if there's already a pending operator and we haven't started a
      // new operand yet, just swap the operator.
      if (state.operand !== null && state.waitingForOperand) {
        return {
          ...state,
          operator,
          expression: `${formatDisplay(state.operand)} ${operator}`,
        };
      }

      // If there's a pending operator, resolve it first (chained ops).
      if (state.operand !== null && state.operator !== null && !state.waitingForOperand) {
        const result = applyOperator(state.operand, state.display, state.operator);
        return {
          ...state,
          display: formatDisplay(result),
          operand: result,
          operator,
          waitingForOperand: true,
          expression: `${formatDisplay(result)} ${operator}`,
        };
      }

      return {
        ...state,
        operand: state.display,
        operator,
        waitingForOperand: true,
        expression: `${formatDisplay(state.display)} ${operator}`,
      };
    }

    case 'EQUALS': {
      if (
        state.operand === null ||
        state.operator === null ||
        state.display === 'Error'
      ) {
        // Nothing to resolve — clear expression line only
        return { ...state, expression: '' };
      }

      const result = applyOperator(state.operand, state.display, state.operator);
      const formatted = formatDisplay(result);
      return {
        ...initialState,
        display: formatted,
        expression: `${formatDisplay(state.operand)} ${state.operator} ${formatDisplay(state.display)} =`,
      };
    }

    case 'CLEAR': {
      return { ...initialState };
    }

    case 'TOGGLE_SIGN': {
      if (state.display === '0' || state.display === 'Error') return state;
      const toggled = state.display.startsWith('-')
        ? state.display.slice(1)
        : '-' + state.display;
      return { ...state, display: toggled };
    }

    case 'PERCENT': {
      if (state.display === 'Error') return state;
      const num = parseFloat(state.display);
      const result = num / 100;
      return { ...state, display: formatDisplay(String(result)) };
    }

    default:
      return state;
  }
}
