# QA Engineer Agent Memory

## Project: salud360

### Calculator App (`/calculator`)
- iOS-style calculator built with Next.js, React useReducer pattern
- Pure reducer in `lib/calculatorReducer.ts` -- good testability
- Key files: types/calculator.ts, lib/calculatorReducer.ts, components/Calculator.tsx, CalcButton.tsx, CalcDisplay.tsx
- Known critical bug: `formatDisplay` calls `toPrecision()` on Infinity, which throws RangeError
- Known high bug: DECIMAL action has no Error-state guard, produces "Error."
- Pattern: reducer uses `...initialState` spread in EQUALS, which loses operand/operator context for repeat-equals
- MAX_DISPLAY_LENGTH = 12

### Common Patterns Found
- Reducer does not validate action payloads (DIGIT accepts any string)
- Error state recovery is inconsistent across action types (DIGIT handles it, DECIMAL/OPERATOR do not fully)
- `toPrecision` is dangerous on non-finite numbers -- always guard with `isFinite()` first
- Floating-point display: `String(0.1 + 0.2)` produces trailing noise; consider rounding to ~10 significant digits

### Testing Conventions
- Report format: Issue #N with Test Case, Expected, Actual, Severity
- Severity scale: CRITICAL > HIGH > MEDIUM > LOW
- Verdict: PASSED (no critical/high) or FAILED (any critical/high)
