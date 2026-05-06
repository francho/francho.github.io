# TMDB Metadata Fetching

Used for: películas, series, documentales.

## Search URLs

**Movies** (películas, documentales):
```
https://www.themoviedb.org/search/movie?query=TITLE_URL_ENCODED
```

**TV Shows** (series):
```
https://www.themoviedb.org/search/tv?query=TITLE_URL_ENCODED
```

## Fetching with fetch_webpage

- **query**: `title year overview` (or `film title year overview` / `series title year overview`)
- Parse results to extract:
  - Canonical title
  - Year
  - TMDB URL (e.g., `https://www.themoviedb.org/movie/TMDB_ID` or `https://www.themoviedb.org/tv/TMDB_ID`)
  - Poster path

## Poster URL Pattern

```
https://www.themoviedb.org/t/p/w300_and_h450_bestv2/POSTER_PATH
```

Extract `POSTER_PATH` from search results.

## Multiple Matches

If multiple results are found, stop and ask the user which one to use.

## Download Poster

Download poster using fetch_webpage first, fallback to curl if needed:
```bash
curl -L -o /tmp/<slug>-poster.jpg "<poster-url>"
```

## Optimize Poster

Use tool: `optimize-web-image` with:
- Source: `/tmp/<slug>-poster.jpg`
- Target width: `180`
- Output: `src/i-like/<type>/<slug>.webp`
