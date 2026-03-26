# Open Library API — Quick Reference

## Search API

**Endpoint**: `https://openlibrary.org/search.json`

### Key Parameters

| Param | Description |
|---|---|
| `q` | General search query |
| `title` | Search by title specifically |
| `author` | Search by author |
| `fields` | Comma-separated list of fields to return (use to reduce payload) |
| `limit` | Max results to return (default varies; keep ≤ 5) |
| `page` | Page number (1-based) |
| `sort` | Sort facet: `new`, `old`, `random`, `key`, or by relevance (default) |
| `lang` | Two-letter ISO 639-1 code; influences but does not exclude results |

### Useful Fields

```
key, title, author_name, author_key, first_publish_year,
isbn, cover_i, number_of_pages_median, subject, publisher,
edition_count, language, publish_year
```

### Example

```
https://openlibrary.org/search.json?title=klara+y+el+sol&fields=key,title,author_name,first_publish_year,isbn,cover_i,subject&limit=3&lang=es
```

## Covers API

**Endpoint**: `https://covers.openlibrary.org/b/{key_type}/{value}-{size}.jpg`

| Key type | Example value |
|---|---|
| `id` | `258027` (from `cover_i` field) |
| `isbn` | `9780385472579` |
| `olid` | `OL7440033M` |

| Size | Code |
|---|---|
| Small | `S` |
| Medium | `M` |
| Large | `L` |

### Rate Limits

- Access by **Cover ID** or **OLID**: no documented per-IP limit.
- Access by **ISBN**, **OCLC**, or **LCCN**: **100 requests per IP per 5 minutes**.
- Exceeding the limit returns **403 Forbidden**.

### Fallback Detection

Append `?default=false` to the URL to receive a **404** instead of a blank placeholder image when no cover exists.

## Works / Editions API (supplementary)

If you need more detail about a specific work:

```
https://openlibrary.org/works/OL12345W.json
```

For a specific edition by ISBN:

```
https://openlibrary.org/isbn/9780385472579.json
```

These return full metadata but should be used sparingly — one request per book maximum.
