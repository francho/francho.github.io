# Image Processing Workflows

## Convert to WebP (Películas/Series/Documentales)

Target: 180px width, WebP format, quality 88

```bash
# Download poster (try fetch_webpage first, fallback to curl)
curl -L -o /tmp/<slug>-poster.jpg "<poster-url>"

# Convert to WebP at 180px width
magick /tmp/<slug>-poster.jpg -resize 180x -quality 88 src/i-like/<type>/<slug>.webp

# Validate result
file src/i-like/<type>/<slug>.webp
magick identify -format '%m %w %h' src/i-like/<type>/<slug>.webp

# Accept only if format is WEBP and width is 180px
```

## Download Podcast Cover (Original Format)

Keep original format (jpg or png), do NOT convert to WebP.

```bash
# Download image
curl -L -o /tmp/<slug>-cover "<image-url>"

# Detect format
file /tmp/<slug>-cover

# Copy with appropriate extension (keep original format)
# If JPEG: cp /tmp/<slug>-cover src/i-like/podcasts/<slug>.jpg
# If PNG:  cp /tmp/<slug>-cover src/i-like/podcasts/<slug>.png
```

## Download Book Cover

Use the `download-book-cover` skill/tool with the book title to create `src/i-like/libros/<slug>.webp`.

This tool handles:
- Open Library search
- Cover download
- WebP conversion at 180px width
- Filename sanitization
