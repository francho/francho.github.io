# Series Configuration

## Directory

`src/i-like/series/`

## Primary Tag

`series`

## Metadata Source

See **[tmdb.md](tmdb.md)** for TMDB search instructions.

Search TMDB for TV shows:
- URL: `https://www.themoviedb.org/search/tv?query=TITLE_URL_ENCODED`
- Query: `series title year overview`

Extract:
- Canonical title
- Year
- TMDB URL (e.g., `https://www.themoviedb.org/tv/TMDB_ID`)
- Poster URL

## Cover Image

1. Download poster - see **[tmdb.md](tmdb.md)** for instructions
2. Optimize with tool: `optimize-web-image` to convert to WebP at 180px width
3. Save as: `src/i-like/series/<slug>.webp`

## Frontmatter

```yaml
---
title: <series title>
tags:
  - series
  - <optional existing category tags>
image: ./<slug>.webp
url: <TMDB series URL>
---
```

## Metadata Rules

- Always include the TMDB `url` in the frontmatter.
- Do not add fields not present in existing entries (no `author`, no `isbn`).
