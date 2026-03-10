# Agent Memory — salud360 project

## Project: calculator (Next.js 16 / App Router)
- Location: `/c/salud360/calculator`
- Stack: Next.js 16 (Turbopack), TypeScript strict, Tailwind CSS v4 (`@import "tailwindcss"` syntax), ESLint
- Tailwind v4 uses `@import "tailwindcss"` in globals.css — NOT `@tailwind base/components/utilities`
- `@theme inline` block used for CSS custom properties / font variables
- Path alias `@/*` maps to project root (not `./src`)

## Architecture patterns established
- Types live in `types/` (e.g., `types/calculator.ts`)
- Pure business logic lives in `lib/` (e.g., `lib/calculatorReducer.ts`)
- UI components live in `components/`
- `app/page.tsx` stays thin — just imports and renders the root component
- `'use client'` directive required on any component using hooks or event handlers

## Next.js CLI
- `npx next lint` does not work from cwd (bug) — use `npx eslint . --ext .ts,.tsx` instead
- `--yes` flag on `create-next-app` accepts all prompts including React Compiler prompt

## Tailwind notes
- Arbitrary values like `w-[320px]`, `rounded-[40px]`, `bg-[#ff9f0a]` work fine in v4
- `col-span-2` in grid works for wide buttons without extra config
