---
name: openlibrary
description: "Fetch book metadata from Open Library by title. Use when you need ISBN, author, cover image, subjects, or publication year for a book. Use for looking book entries, looking up ISBNs, or downloading cover art. Use when tool `openlibrary` is explicitly invoked or when you need to fill metadata for a new book entry."
argument-hint: "Book title to search for"
compatibility: "Requires network access. Uses fetch_webpage for API calls and cover downloads; falls back to curl + magick (ImageMagick) only when fetch_webpage cannot retrieve binary image data."
---

# Open Library Book Lookup

## When to Use

- Looking up a book's ISBN, author, or publication year by title.
- Fetching a cover image for a book entry.
- Gathering metadata to create a new `src/i-like/libros/` entry.
- Verifying book details (author spelling, original title, etc.).

## Inputs

- A book title (required). Can be partial or in any language.
- An optional language preference (default: `spa` for Spanish editions).

## Rate-Limit Guidelines

Open Library is a free community service. Respect their infrastructure:

1. **Search API**: Always use the `fields` parameter to request only the fields you need. Always set `limit=3` or lower.
2. **Covers API**: Rate-limited to **100 requests per IP per 5 minutes** when accessed by ISBN. Prefer using Cover ID (`cover_i` field) over ISBN to avoid this limit.
3. **One request at a time**: Never fire parallel requests to Open Library.
4. **Cache results**: If you already fetched data for a book in this session, do not fetch again.

## Procedure

### Step 1 — Search by title

Use the `fetch_webpage` tool to query the Search API. This avoids terminal confirmation prompts.

- **URL**: `https://openlibrary.org/search.json?title=TITLE_URL_ENCODED&fields=key,title,author_name,first_publish_year,isbn,cover_i,number_of_pages_median,subject,edition_count&limit=3&lang=es`
- **query**: `title author isbn cover`

Replace `TITLE_URL_ENCODED` with the URL-encoded book title.

Parse the JSON response. Each doc in `docs[]` contains:

| Field | Description |
|---|---|
| `key` | Work key, e.g. `/works/OL12345W` |
| `title` | Canonical title |
| `author_name` | Array of author names |
| `first_publish_year` | Year first published |
| `isbn` | Array of all known ISBNs |
| `cover_i` | Internal cover ID (use for cover URL) |
| `number_of_pages_median` | Median page count across editions |
| `subject` | Array of subjects/tags |
| `edition_count` | Number of editions |

### Step 2 — Select the best match

- If only one result, use it.
- If multiple results, prefer the one whose title is closest to the query.
- If ambiguous, present the top results to the user and ask which one.
- For a single clear match, proceed without asking (per repo conventions).

### Step 3 — Pick the best ISBN

The `isbn` array contains many ISBNs across editions. Prefer a 13-digit ISBN (starts with `978` or `979`).

To verify a candidate ISBN belongs to the desired language/edition, use the `fetch_webpage` tool:

- **URL**: `https://openlibrary.org/isbn/{isbn}.json`
- **query**: `languages title`

Check the `languages` field (array of `{"key": "/languages/spa"}` objects) and `title` to confirm it matches. If it does not, try another ISBN-13 from the list. Do **not** check more than 3 ISBNs — if none match, ask the user to choose.

### Step 4 — Build the cover URL

Use the `cover_i` value to build a cover URL that avoids the per-ISBN rate limit:

```
https://covers.openlibrary.org/b/id/{cover_i}-M.jpg
```

Sizes: `S` (small), `M` (medium), `L` (large).

If `cover_i` is missing, fall back to ISBN-based URL:

```
https://covers.openlibrary.org/b/isbn/{isbn}-M.jpg
```

Append `?default=false` to get a 404 instead of a blank image if no cover exists.

### Step 5 — Download and optimize the cover image (only if requested)

Only download the cover when the user explicitly asks for it. Skip this step otherwise.

Use the following priority to download the cover:

1. **Preferred — internal fetch tool**: Use the `fetch_webpage` tool with the cover URL. If it returns usable binary image content, save it to a temporary file (e.g. `/tmp/<slug>-cover.jpg`).
2. **Fallback — curl**: Only if the internal fetch tool cannot retrieve binary image data, use `curl` in the terminal:
   ```bash
   curl -sfL -o /tmp/<slug>-cover.jpg 'https://covers.openlibrary.org/b/id/{cover_i}-M.jpg?default=false'
   ```

A 404 or empty response means no cover is available.
If no cover is found, note it and suggest the user find one manually from a publisher or bookstore page.

After a successful download, invoke the `optimize-web-image` skill to convert the image to WebP and resize it to the target dimensions required by the caller.

### Step 6 — Present results

Report to the user:

- **Title** (original and/or translated)
- **Author(s)**
- **First published**: year
- **ISBN-13**: the selected ISBN
- **Cover**: URL or downloaded path
- **Subjects**: first 5–8 relevant subjects
- **Open Library link**: `https://openlibrary.org{key}` (from the `key` field)

## API Reference

See [./references/api-quick-ref.md](./references/api-quick-ref.md) for endpoint details, full field list, and rate-limit specifics.

## Completion Check

- The user received the metadata they requested.
- No more than 3 search requests were made to Open Library in this task.
- Cover image was downloaded only if requested and validated to be non-empty.
