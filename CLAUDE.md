# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start dev server (Vite)
npm run build     # Type-check then build for production
npm run lint      # Run ESLint
npm run preview   # Preview production build
```

No test runner is configured.

## Architecture

All state lives in `useTodos` (`src/hooks/useTodos.ts`), which combines three `useLocalStorage` hooks (`todos-v1`, `filters-v1`, `darkMode`) and exposes CRUD, subtask, filter/sort, reorder, and stats. `App.tsx` consumes this hook and passes slices down as props — there is no global state library.

**Data flow:** `useTodos` → `App.tsx` → individual components via props. No context is used.

**DnD reordering** (`@dnd-kit`) operates on the raw `todos` array index and calls `reorderTodos(fromIndex, toIndex)`. `TodoList` wraps items in `DndContext` + `SortableContext`; `TodoItem` uses `useSortable`.

**Filtering/sorting** is computed in `useMemo` inside `useTodos` — `filteredTodos` is derived from `todos` + `filters`. When sort mode is `manual` (i.e., `createdAt` default), drag-and-drop ordering is preserved because the array order is the source of truth.

**Categories** are derived dynamically from the `category` field of existing todos (no predefined list).

## Tailwind v4 Notes

- CSS-first config: `@import "tailwindcss"` in `index.css` — no `tailwind.config.js`.
- Dark mode variant: `@custom-variant dark (&:where(.dark, .dark *))` — toggled by `.dark` on `<html>`.
- Vite plugin: `tailwindcss()` must come **before** `react()` in `vite.config.ts`.
- Do **not** use PostCSS plugin or `@tailwind` directives (those are v3 patterns).

## Key Conventions

- `button { all: unset; cursor: pointer; }` is set globally — buttons have no default styles.
- IDs use `crypto.randomUUID()`.
- Dates are stored as ISO strings (`createdAt`) or `YYYY-MM-DD` strings (`dueDate`).
- `updateTodo` accepts `Partial<Omit<Todo, 'id' | 'createdAt' | 'subtasks'>>` — subtasks have their own dedicated handlers.
