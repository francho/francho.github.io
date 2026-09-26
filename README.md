# francho.org

[![Deploy Gatsby site to Pages](https://github.com/francho/francho.github.io/actions/workflows/deploy.yml/badge.svg)](https://github.com/francho/francho.github.io/actions/workflows/deploy.yml)
[![Last commit](https://img.shields.io/github/last-commit/francho/francho.github.io)](https://github.com/francho/francho.github.io/commits/main)
[![License](https://img.shields.io/github/license/francho/francho.github.io)](https://github.com/francho/francho.github.io/blob/main/LICENSE)
[![Dependabot](https://img.shields.io/badge/Dependabot-enabled-025E8C?logo=dependabot)](https://github.com/francho/francho.github.io/security/dependabot)
[![Lighthouse Performance](https://francho.org/images/lighthouse-performance.svg)](https://francho.org)
[![Lighthouse Accessibility](https://francho.org/images/lighthouse-accessibility.svg)](https://francho.org)
[![Lighthouse Best Practices](https://francho.org/images/lighthouse-best-practices.svg)](https://francho.org)
[![Lighthouse SEO](https://francho.org/images/lighthouse-seo.svg)](https://francho.org)

[My personal web site](https://francho.org/proyectos/mi-web/) based on Gatsby.

## Development

| Command | Description |
|---|---|
| `pnpm install` | Install dependencies |
| `pnpm start` | Start dev server |
| `pnpm develop` | Start dev server (LAN-accessible) |
| `pnpm build` | Production build |
| `pnpm serve` | Serve built site locally |
| `pnpm clean` | Clean generated artifacts |
| `pnpm typecheck` | TypeScript type-check only |
| `pnpm test` | Run tests |
| `pnpm ci` | Full CI check (build + typecheck + test) |
| `pnpm audit` | Audit dependencies for vulnerabilities |

### Dependency Compatibility

- Use an up-to-date Node 22 LTS release (at least 22.12). The patched URL decoder uses synchronous ESM loading from CommonJS.
- SVG imports under `src/images` use `@svgr/webpack` in `gatsby-node.ts`. Optimization is disabled to preserve existing artwork and pattern IDs.
- Gatsby 5.16.1 pins Parcel 2.8.3. Scoped overrides keep its compiler, cache, and plugins together on 2.16.4 to fix the development-server advisory.
- `patches/query-string@6.14.1.patch` adapts the decoder import to the default export of the patched `decode-uri-component@0.5.0`. Keep this patch and its override together until Gatsby updates its URL parsing dependency.
- `gatsby-node.test.ts` covers the SVG rule and the patched query parser. After dependency changes, run `pnpm run ci` and `pnpm audit --audit-level=low`.