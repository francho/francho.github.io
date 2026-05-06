# Podcasts Configuration

## Directory

`src/i-like/podcasts/`

## Primary Tag

`podcasts`

## Metadata Source

**No automated metadata source available.**

Use fetch_webpage to try to find the official podcast page.

Look for:
- Official website URL
- Cover art URL

**Do not invent or guess URLs or images.**

If URL or cover image cannot be confidently determined:
- **Stop and ask the user** to provide:
  - Official podcast URL (required)
  - Cover image URL (optional)

## Cover Image

1. Download using curl to temporary location:
   ```bash
   curl -L -o /tmp/<slug>-cover "<image-url>"
   ```

2. Optimize with tool: `optimize-web-image` to convert to WebP at 180px width
3. Save as: `src/i-like/podcasts/<slug>.webp`

If no image URL provided, inform user they need to add it manually later.

## Frontmatter

```yaml
---
title: <podcast title>
tags:
  - podcasts
  - <optional existing category tags>
image: ./<slug>.webp
url: <official podcast website URL>
---
```

## Metadata Rules

- Always include the official website `url`.
- If URL cannot be automatically determined, stop and ask the user.
- Do not invent or guess URLs or images.
- Image format is `.webp` at 180px width.
