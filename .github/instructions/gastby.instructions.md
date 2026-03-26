---
description: Load when working on Gatsby runtime, templates, pages, MDX, GraphQL, TypeScript, or CSS Modules.
applyTo: '{gatsby-*.{js,jsx,ts,tsx},src/**/*.{js,jsx,ts,tsx,mdx,css}}' 
---
# Gatsby + TypeScript + CSS Modules instructions for `francho.github.io`

Use these instructions for any task that touches Gatsby architecture, routing, page creation, templates, MDX, GraphQL queries, Gatsby config files, or component styling.

These guidelines are aligned with the Gatsby documentation, especially the official guidance for TypeScript, CSS Modules, and the `Head` API:
- https://www.gatsbyjs.com/docs/how-to/custom-configuration/typescript/
- https://www.gatsbyjs.com/docs/how-to/styling/css-modules/
- https://www.gatsbyjs.com/docs/reference/built-in-components/gatsby-head/

## Stack and architectural expectations
- This project uses Gatsby 5, React 18, TypeScript, MDX, and CSS Modules.
- Prefer Gatsby-native patterns over ad hoc React-only solutions when both are possible.
- Keep page creation logic centralized and predictable.
- Favor static generation and build-time data whenever possible.
- Only introduce client-side state or browser-only logic when the feature truly needs it.

## Project-specific Gatsby architecture
- Runtime page creation is centralized in `gatsby-node.ts`, using `createPages` over MDX content.
- Templates are split by content type:
	- `src/templates/PageTemplate.tsx` for general pages and posts.
	- `src/templates/ILikeTemplate.tsx` for “me gusta” entries.
- Template selection is slug-based in `gatsby-node.ts`: entries whose slug starts with `libros`, `podcasts`, `series`, `peliculas`, or `documentales` use `ILikeTemplate`.

## Content sources and routing conventions
- MDX sources are loaded from `src/content/`, `src/i-like/`, and `src/pages/`.
- Resolve slugs in this order:
	1. `frontmatter.path` when present.
	2. Otherwise derive it from `internal.contentFilePath`, lowercased and without `.mdx`.
- Use `frontmatter.path` only when an explicit route is required.
- For “i-like” entries, keep route derivation consistent with the logic used by `src/components/Showcase/Showcase.tsx`.
- If routing behavior changes, update every place that derives or consumes those paths, not just `gatsby-node.ts`.

## MDX authoring and template conventions
- Prefer new content pages in `src/content/` or `src/i-like/` instead of adding React-only routes.
- Keep MDX shortcodes registered through `MDXProvider` in the templates instead of wiring ad hoc components per page.
- In this project, the expected shortcode sets are:
	- `PageTemplate`: `Link`, `Section`, `Showcase`, `PagesList`.
	- `ILikeTemplate`: `Link`, `Section`.
- Preserve the existing authoring pattern of wrapping page sections with `<Section>` when extending content.
- Keep frontmatter lean, explicit, and stable. Do not add unused frontmatter fields.

## Frontmatter expectations in this repository
- General pages/posts: `title`, `date`, `tags`, optional `path`.
- “Proyectos” list behavior depends on `tags` containing `proyectos`.
- “I like” entries expect `title`, `tags`, and optionally `author`, `isbn`, `url`, `image`.
- If an entry has an `isbn`, its outbound canonical destination should remain `https://openlibrary.org/isbn/{isbn}` unless the task explicitly changes that behavior.

## Gatsby data layer best practices
- Query only the fields a component or template actually uses.
- Keep GraphQL queries colocated with the component or template responsible for the data.
- Prefer `useStaticQuery` for reusable UI fragments with stable data requirements.
- Prefer page queries with `$id` for template-driven pages.
- Keep `pageContext` small, serializable, and limited to routing/template needs.
- If query shape changes, update the consuming TypeScript types in the same change.
- This repository uses Gatsby GraphQL type generation. Prefer generated `Queries.*` types where available.

## TypeScript best practices for Gatsby
- Use Gatsby’s exported types instead of hand-rolling framework props when possible:
	- `PageProps`
	- `HeadProps`
	- `GatsbyNode`
	- `GatsbyConfig`
	- `GatsbyBrowser`
	- `GatsbySSR`
- Strongly type page queries and page context.
- Prefer generated GraphQL result types over duplicate manual interfaces when the generated types are available.
- Keep TypeScript adoption strict and incremental: do not weaken types to `any` unless there is no reasonable alternative.
- Remember Gatsby’s documented TypeScript limitations:
	- Avoid relying on `tsconfig.json` path alias behavior that Parcel does not support.
	- In Gatsby TypeScript files, prefer `path.resolve(...)` over `require.resolve(...)`.
- When editing `gatsby-config.ts` or `gatsby-node.ts`, keep exports typed and API usage aligned with Gatsby’s official API shapes.

## Gatsby `Head` and SEO guidance
- Prefer Gatsby’s built-in `Head` export for page metadata.
- Define `Head` only in pages or templates that are used by `createPage`.
- Return only valid head elements from `Head`.
- Set page-specific metadata explicitly; do not assume previous page metadata persists after navigation.
- Use `HeadProps` typing when the head depends on `data`, `location`, or `pageContext`.
- If duplicate tags are possible, use stable `id` attributes so deduplication behaves predictably.

## CSS Modules best practices
- Gatsby supports CSS Modules out of the box; prefer them for component-scoped styling.
- Keep styles colocated using `*.module.css`.
- Use CSS Modules for local component styling and `src/styles/global.css` only for tokens, resets, typography, and truly global rules.
- Avoid leaking styling concerns through global selectors when a module class is sufficient.
- Keep class names semantic and component-oriented rather than visual-only.
- Prefer simple selectors and low specificity.
- When helpful for accessibility or user stylesheets, consider adding a stable plain class name alongside the module class.
- Do not introduce another styling framework or CSS-in-JS solution unless the task explicitly requires it.

## Component structure and testing
- Each reusable component must live in its own folder inside `src/components/`.
- The default component structure is:
	- `Componente.tsx`
	- `Componente.module.css`
	- `Componente.test.tsx`
- Keep the component, its styles, and its test colocated.
- Every component must have a unit test (`Componente.test.tsx`) that covers its expected rendering and key behavior.
- When a component changes, update or extend its tests in the same task.
- Do not consider component work finished unless the relevant tests pass.

## Responsive design and accessibility
- Treat the site as mobile-first.
- Start layouts from the smallest viewport and scale up progressively.
- Every UI change must meet WCAG 2.1 AA accessibility expectations.
- Preserve keyboard navigability, visible focus states, semantic HTML, and sufficient color contrast.
- Prefer real buttons, links, lists, headings, and landmarks over generic `div`-based interaction patterns.
- Ensure images, SVGs, and icon-only controls have appropriate accessible names or are explicitly decorative.

## Components, media, and performance
- Prefer reusable presentational components over duplicating page-specific markup.
- Keep components narrowly scoped and data-aware only when necessary.
- Use Gatsby image and asset patterns already present in the repository instead of introducing parallel media pipelines.
- Avoid unnecessary hydration-heavy behavior for static content.
- Keep bundle impact low: do not add browser-only dependencies for work that can happen at build time.

## Editing guardrails for this repository
- If you change slug generation, template selection, or page creation rules, update both the Gatsby implementation and any component logic that derives those routes.
- Keep GraphQL fields aligned with actual template and component usage.
- Do not query extra fields “just in case”.
- Do not break existing MDX authoring conventions when adding new content features.
- Keep SVG usage consistent with the existing `gatsby-plugin-react-svg` setup.

## Validation workflow
- If dependencies change, run `pnpm install` and ensure it succeeds before further validation.
- If a task adds or changes components, run the relevant tests and ensure they pass.
- Validate types when the change affects TypeScript, queries, or Gatsby APIs.
- Do not consider the work complete until `pnpm run ci` succeeds without errors.