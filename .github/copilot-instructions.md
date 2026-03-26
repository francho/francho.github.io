# Copilot instructions for `francho.github.io`

## Project purpose and architecture
- This is a Gatsby 5 + React + TypeScript personal site where most pages are authored as MDX content.
- Runtime page creation is centralized in `gatsby-node.ts` (`createPages` over `allMdx`).
- Templates are split by content type:
  - `src/templates/PageTemplate.tsx` for general pages/posts.
  - `src/templates/ILikeTemplate.tsx` for "me gusta" item pages (books/podcasts/series/películas/documentales).
- Template selection is slug-based in `gatsby-node.ts`: slugs starting with `libros|podcasts|series|peliculas|documentales` use `ILikeTemplate`.

## Content model and routing conventions
- MDX sources are loaded from `src/content/`, `src/i-like/`, and `src/pages/` via `gatsby-source-filesystem` in `gatsby-config.ts`.
- Slugs are resolved in this order:
  1) `frontmatter.path` (if present), else
  2) derived from `internal.contentFilePath` (lowercased, `.mdx` removed).
- `frontmatter.path` is used for explicit routes (example: `src/content/index.mdx` uses `path: /`).
- For "i-like" entries, route comes from file location under `src/i-like/**` (see `getPath` in `src/components/Showcase/Showcase.tsx`).

## MDX component patterns
- MDX shortcodes are registered through `MDXProvider` in templates; keep additions there:
  - `PageTemplate`: `Link`, `Section`, `Showcase`, `PagesList`.
  - `ILikeTemplate`: `Link`, `Section`.
- Common authoring pattern: wrap sections in `<Section>` (see `src/content/index.mdx`, `src/content/me-gusta.mdx`).
- `PagesList` reads `allSitePage.pageContext.frontmatter`; list pages by tags (example: `src/content/proyectos.mdx`).

## Frontmatter conventions used by templates/components
- General pages/posts: `title`, `date`, `tags`, optional `path`.
- Project list behavior depends on `tags` containing `proyectos` (see `PageTemplate.tsx` back link + section).
- I-like template expects: `title`, `tags`, optional `author`, optional `isbn`, optional `url`, optional `image`.
  - If `isbn` exists, outbound link is `https://openlibrary.org/isbn/{isbn}`.

## Styling and UI conventions
- Use CSS Modules for component styles (`*.module.css`) and keep styles colocated with components.
- Site-wide tokens and base styles live in `src/styles/global.css` (CSS variables, typography, view transitions).
- SVG icons are imported as React components from `src/images/icons/*.svg` via `gatsby-plugin-react-svg`.
- Content (MDX text, UI copy, titles, labels) is written in Spanish/Castellano.
- Source code identifiers and code comments should be written in English.

## Data/query conventions
- Prefer Gatsby data hooks per component responsibility:
  - `useStaticQuery` for local reusable UI data (`Showcase`, `PagesList`).
  - Page template GraphQL query with `$id` for per-page frontmatter.
- GraphQL types come from Gatsby typegen (`graphqlTypegen: true`); use `Queries.*` types as in existing code.

## Dev workflows
- Install deps: `pnpm install`
- Local dev server (LAN-accessible): `pnpm develop` (binds `0.0.0.0`).
- Standard dev alias: `pnpm start`.
- Production build: `pnpm build`
- Serve built site: `pnpm serve`
- Clean Gatsby cache/artifacts: `pnpm clean`
- Type-check only: `pnpm typecheck`
- Commit messages follow Conventional Commits format (for example: `feat: add podcast card`, `fix: resolve menu toggle state`).

## Practical guardrails for AI edits
- For new content pages, prefer adding MDX in `src/content/` or `src/i-like/` instead of adding React routes.
- If changing slug or template behavior, update both `gatsby-node.ts` and any component logic that derives paths (`Showcase`).
- Keep GraphQL fields aligned with template/component usage; avoid querying unused fields.
- Do not introduce new styling systems; follow existing CSS Modules + `global.css` token usage.
