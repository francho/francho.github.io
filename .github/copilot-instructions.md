# Copilot instructions for `francho.github.io`

## Project overview
- This repository is a personal site with content, notes, project pages, and curated recommendations.
- Prefer content-first solutions, small focused edits, and reusable UI over one-off implementations.
- Framework-specific implementation guidance lives in `.github/instructions/gastby.instructions.md`.

## Repository conventions
- Main authored content lives in `src/content/`.
- Curated recommendation entries live in `src/i-like/`.
- Reusable UI belongs in `src/components/`.
- Shared assets live in `src/images/`.
- Global design tokens and base styles live in `src/styles/global.css`.
- Component styles should stay colocated with the component they belong to.

## Writing and language conventions
- Never generate page content from scratch.
- Page content must be 100% authored by humans.
- Copilot should only help with code, orthographic corrections, or content changes when the user explicitly asks for them.
- Content, UI copy, headings, and labels must be written in Spanish/Castellano.
- Source code identifiers and code comments must be written in English.
- Preserve the existing tone: clear, concise, personal, and simple.

## UI and accessibility conventions
- This is a mobile-first site: prioritize small screens first and scale layouts progressively for larger breakpoints.
- All UI changes must meet WCAG 2.1 AA accessibility standards.
- Reuse existing design tokens, spacing, and typography patterns before adding new ones.
- Do not introduce a new styling system unless the task explicitly requires it.

## Delivery workflow
- Install deps: `pnpm install`
- Local dev server (LAN-accessible): `pnpm develop`
- Standard dev alias: `pnpm start`
- Production build: `pnpm build`
- Serve built site: `pnpm serve`
- Clean generated artifacts: `pnpm clean`
- Type-check only: `pnpm typecheck`
- Commit messages should follow Conventional Commits.

## Definition of done
- Prefer the smallest change that fully solves the task.
- If dependencies are added, removed, or changed, run `pnpm install` first and ensure it succeeds.
- Do not consider any task complete until the site build has been verified to succeed without errors.
