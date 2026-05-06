# Libros Configuration

## Directory

`src/i-like/libros/`

## Primary Tag

`libros`

## Metadata Source

Use tool: `openlibrary` to search for the book.

Extract:
- Title (canonical)
- Author
- ISBN (prefer ISBN-13)
- Open Library URL

If multiple matches, ask user which one to use.

## Cover Image

Use tool: `download-book-cover` with the book title.

This will:
- Search Open Library for the book
- Download the cover
- Convert to WebP at 180px width
- Save as `src/i-like/libros/<slug>.webp`

## Frontmatter

```yaml
---
title: <book title>
isbn: <isbn if available>
author: <author if available>
tags:
  - libros
  - <optional existing category tags>
image: ./<slug>.webp
url: <Open Library URL only if no ISBN or adds context>
---
```

## Metadata Rules

- Prioritize editions with a verifiable ISBN.
- If no ISBN available but reliable Open Library page exists, use `url` and omit `isbn`.
- Include `author` if available.
- Omit `url` if ISBN is present unless it adds significant context.
