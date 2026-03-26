---
description: "Add a new book review under src/i-like/libros using Open Library to complete metadata and cover art"
name: "create-book-review"
agent: "agent"
model: "GPT-5.4"
argument-hint: "Create a new book review"
---

Goal: create a new book review under `src/i-like/libros` from user-provided information and complete any missing metadata with tool: `openlibrary`, using the most direct path that produces a valid entry.

Use tool: `download-book-cover` to resolve, download, convert, and place the cover asset for the book title.

Parallelization guidance:

- Parallelize independent read-only work aggressively once the title and review text are available.
- Prefer subagents for isolated read-only exploration, especially repository analysis that can run independently from the main flow.
- Keep user-decision checkpoints sequential: if an existing file would be overwritten or if Open Library returns multiple plausible matches, stop and ask the user before continuing.
- Do not run cover acquisition before the Open Library match is confirmed, because it may fetch the wrong book.
- Do not create the MDX file until metadata, final tags, and the cover file are all resolved.

Required flow:

1. Ask only for missing information.
  - If the user already provided the book title, do not ask for it again.
  - If the user already provided the review text, do not ask for it again.
2. Collect the book title and the full review text before creating files.
3. After the title and review text are available, start these independent tasks in parallel:
  - Review the user-provided review text automatically and apply only minimal orthographic and punctuation corrections.
    - Preserve the user's meaning, tone, and structure.
    - Do not expand, summarize, or rewrite the review.
  - Generate the filename by sanitizing the title:
    - lowercase
    - remove accents and special characters
    - replace spaces with `-`
    - collapse repeated dashes
    - trim leading and trailing dashes
  - Search Open Library for the best matching book and fill any missing fields with verifiable data.
  - Use a read-only subagent to inspect `src/i-like/libros/*.mdx` and collect the existing tag vocabulary and any formatting details that matter for consistency.
4. As soon as the slug is known, check whether `src/i-like/libros/<slug>.mdx` already exists.
  - If it exists, stop and ask for confirmation before overwriting.
5. Once the Open Library search completes:
  - If it returns exactly one clearly plausible match, proceed without asking for confirmation.
  - If it returns multiple plausible matches, stop and ask the user which one to use.
6. Once the book match is confirmed, run these tasks in parallel:
  - Invoke [download-book-cover](./download-book-cover.prompt.md) with the book title as a delegated subtask to create the cover file at `src/i-like/libros/<slug>.webp`.
  - Using the confirmed Open Library metadata, the corrected review text, and the previously collected repository tag vocabulary, propose 1 to 3 additional categories besides `libros`.
    - Reuse existing tag vocabulary from the repository.
    - Choose only tags that are clearly supported by the book metadata or the review.
    - If no additional category is clearly justified, keep only `libros`.
7. Wait for the cover task to finish and confirm that `src/i-like/libros/<slug>.webp` exists.
8. Add the image to the frontmatter using a relative path from the MDX file: `image: ./<slug>.webp`.
9. Create the MDX file at `src/i-like/libros/<slug>.mdx` once the metadata, cover, and tags are resolved.

Expected frontmatter:

```yaml
---
title: <book title>
isbn: <isbn if available>
author: <author if available>
tags:
  - libros
  - <optional existing category tags if clearly applicable>
image: ./<slug>.webp
url: <Open Library URL only if there is no isbn or if it adds useful context>
---
```

Metadata rules:

- Prioritize editions with a verifiable ISBN.
- If no ISBN is available but there is a reliable Open Library page, use `url` and omit `isbn`.
- Cover acquisition and placement must follow [download-book-cover](./download-book-cover.prompt.md).

Repository editing rules:

- The review content must remain in Spanish.
- The review text must stay 100% human-authored; only apply minimal orthographic and punctuation corrections.
- Make the smallest change that solves the task.
- At the end, verify that the image reference and frontmatter match the existing project format.
- For this repository, a local relative image such as `./<slug>.webp` is valid for book entries.
- Validate the result after editing by running the project checks required by the repository instructions.
- When adding categories, reuse the existing book tags already present in the repository instead of inventing new taxonomy unless there is a strong reason.

Expected outcome:

1. A new MDX file exists in `src/i-like/libros/`.
2. A WebP cover exists in the same folder with the same base name.
3. The frontmatter contains at least `title`, `tags` with `libros`, and `image`.
4. The user is told the final filename that was created, the source used for metadata and cover, the orthographic corrections applied to the review, the additional categories chosen, and any fields that could not be completed.