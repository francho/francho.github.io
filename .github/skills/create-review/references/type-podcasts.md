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

**Keep original format (jpg or png) — do NOT convert to WebP for podcasts.**

If cover image URL is available:

1. Download using curl:
   ```bash
   curl -L -o /tmp/<slug>-cover "<image-url>"
   ```

2. Detect format:
   ```bash
   file /tmp/<slug>-cover
   ```

3. Copy with appropriate extension (keep original format):
   ```bash
   # If JPEG:
   cp /tmp/<slug>-cover src/i-like/podcasts/<slug>.jpg
   
   # If PNG:
   cp /tmp/<slug>-cover src/i-like/podcasts/<slug>.png
   ```

If no image URL provided, inform user they need to add it manually later.

## Frontmatter

```yaml
---
title: <podcast title>
tags:
  - podcasts
  - <optional existing category tags>
image: ./<slug>.jpg  # or .png depending on source
url: <official podcast website URL>
---
```

## Metadata Rules

- Always include the official website `url`.
- If URL cannot be automatically determined, stop and ask the user.
- Do not invent or guess URLs or images.
- Image format is `.jpg` or `.png` (not `.webp`).
