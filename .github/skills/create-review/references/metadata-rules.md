# Metadata Rules by Type

## All Types

- Use the canonical title from the metadata source (may differ from user input)
- Always include a `url` field (exception: libros when ISBN is present)
- Reuse existing repository tags for additional categories
- Only add 1-3 additional tags clearly supported by metadata or review

## Libros

**Metadata source**: Open Library (via `openlibrary` tool)

**Required fields**:
- `title` (canonical from Open Library)
- `tags` (at least `libros`)
- `image` (`./<slug>.webp`)

**Optional fields**:
- `isbn` (prioritize editions with verifiable ISBN)
- `author` (if available)
- `url` (only if no ISBN or adds context)

**Rules**:
- Prioritize editions with a verifiable ISBN
- If no ISBN but reliable Open Library page exists, use `url` and omit `isbn`
- Include `author` if available

## Películas

**Metadata source**: TMDB (movies)

**Required fields**:
- `title` (canonical from TMDB)
- `tags` (at least `películas`)
- `image` (`./<slug>.webp`, 180px width)
- `url` (TMDB movie URL: `https://www.themoviedb.org/movie/TMDB_ID`)

**Rules**:
- Always include TMDB `url`
- Do not add `author` or `isbn` fields
- Match existing entry format

## Series

**Metadata source**: TMDB (tv)

**Required fields**:
- `title` (canonical from TMDB)
- `tags` (at least `series`)
- `image` (`./<slug>.webp`, 180px width)
- `url` (TMDB series URL: `https://www.themoviedb.org/tv/TMDB_ID`)

**Rules**:
- Always include TMDB `url`
- Do not add `author` or `isbn` fields
- Match existing entry format

## Documentales

**Metadata source**: TMDB (movies - documentaries are classified as movies)

**Required fields**:
- `title` (canonical from TMDB)
- `tags` (at least `documentales`)
- `image` (`./<slug>.webp`, 180px width)
- `url` (TMDB movie URL: `https://www.themoviedb.org/movie/TMDB_ID`)

**Rules**:
- Same process as Películas
- Search TMDB movies with documentary keywords
- Always include TMDB `url`
- Do not add `author` or `isbn` fields

## Podcasts

**Metadata source**: Manual/Web (no automated source)

**Required fields**:
- `title` (from official source)
- `tags` (at least `podcasts`)
- `image` (`./<slug>.jpg` or `./<slug>.png`, original format)
- `url` (official podcast website)

**Rules**:
- Try to find official podcast page using fetch_webpage
- Look for official website URL and cover art URL
- If URL or image cannot be confidently determined:
  - **Stop and ask the user** to provide:
    - Official podcast URL (required)
    - Cover image URL (optional)
- **Do not invent or guess URLs or images**
- Keep image in original format (jpg/png), do NOT convert to WebP
