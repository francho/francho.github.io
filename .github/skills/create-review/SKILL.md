---
name: create-review
description: "Create a new review entry under src/i-like/ for books, documentaries, films, podcasts, or TV series. Use when asked to add, create, or write any type of review (reseña de libro, película, serie, documental, podcast). Automatically detects the review type, fetches metadata from appropriate sources (Open Library for books, TMDB for films/series/documentaries), downloads and optimizes cover art, applies minimal orthographic corrections to Spanish review text, and creates the MDX file with correct frontmatter."
argument-hint: "Review type (libro/película/serie/documental/podcast), title, and review text"
user-invocable: true
---

# Create Review

## When to Use

- Creating a review entry for: books (libros), films (películas), TV series (series), documentaries (documentales), or podcasts.
- The user provides a title and review text in Spanish.

## Inputs

- Review type (libro/película/serie/documental/podcast) - inferred if not explicitly provided
- Title (required)
- Full review text in Spanish (required)

## Review Type Detection

1. **Explicit mention**: User says "libro", "película", "serie", "documental", or "podcast".
2. **Context clues**: "leer"/"autor"/"capítulos" → libro; "ver"/"director" → película/serie/documental; "escuchar"/"episodio" → podcast.
3. **Ask if ambiguous**: If type cannot be confidently determined.

## Workflow

**After detecting the review type, load the appropriate type-specific reference:**

- **Libros** → Load [`references/type-libros.md`](references/type-libros.md)
- **Películas** → Load [`references/type-peliculas.md`](references/type-peliculas.md)
- **Series** → Load [`references/type-series.md`](references/type-series.md)
- **Documentales** → Load [`references/type-documentales.md`](references/type-documentales.md)
- **Podcasts** → Load [`references/type-podcasts.md`](references/type-podcasts.md)

**Then follow these steps:**

1. **Collect missing information**: Ask only for what was not provided (title, review text).

2. **Once title and review text are available, parallelize:**
   - Apply minimal orthographic/punctuation corrections (preserve user's meaning, tone, structure).
   - Generate filename slug (lowercase, no accents/special chars, spaces → `-`, collapse dashes, trim).
   - Use read-only subagent: Inspect `src/i-like/<type>/*.mdx` for existing tag vocabulary.

3. **Check if target file exists**: If yes, stop and ask for confirmation before overwriting.

4. **Fetch metadata**: Follow type-specific instructions from the loaded reference file.

5. **Download cover image**: Follow type-specific download instructions from the loaded reference file to save the image temporarily.

6. **Optimize cover image**: Use tool `optimize-web-image` to convert the downloaded image to WebP at 180px width and save to final location.

7. **Propose 1-3 additional categories** using repository tag vocabulary from step 2.

8. **Wait for cover completion** and confirm image file exists (if applicable).

9. **Create MDX file** with frontmatter following type-specific format from the loaded reference file.

## Common Repository Rules

- Review content must remain in Spanish.
- Review text must stay 100% human-authored; only apply minimal orthographic/punctuation corrections.
- Make the smallest change that solves the task.
- Verify that image reference and frontmatter match existing project format.
- Use local relative image paths: `./<slug>.<ext>`.
- Reuse existing repository tags instead of inventing new taxonomy.

## Expected Outcome

1. New MDX file in `src/i-like/<type>/` with cover image (same base name, appropriate format).
2. Frontmatter contains: `title`, `tags` (primary + optional categories), `image`, `url` (as appropriate).
3. Report to user:
   - Final filename and metadata source used
   - Orthographic corrections applied and categories chosen
   - Any incomplete fields (e.g., podcasts: URL or image need manual addition)
