# Películas Configuration

## Directory

`src/i-like/peliculas/`

## Primary Tag

`películas`

## Metadata Source

See **[tmdb.md](tmdb.md)** for TMDB search instructions.

Search TMDB for movies:
- URL: `https://www.themoviedb.org/search/movie?query=TITLE_URL_ENCODED`
- Query: `film title year overview`

Extract:
- Canonical title
- Year
- TMDB URL (e.g., `https://www.themoviedb.org/movie/TMDB_ID`)
- Poster URL

## Cover Image

1. Download poster - see **[tmdb.md](tmdb.md)** for instructions
2. Optimize with tool: `optimize-web-image` to convert to WebP at 180px width
3. Save as: `src/i-like/peliculas/<slug>.webp`

## Frontmatter

```yaml
---
title: <film title>
tags:
  - películas
  - <optional existing category tags>
image: ./<slug>.webp
url: <TMDB film URL>
---
```

## Metadata Rules

- Always include the TMDB `url` in the frontmatter.
- Do not add fields not present in existing entries (no `author`, no `isbn`).
