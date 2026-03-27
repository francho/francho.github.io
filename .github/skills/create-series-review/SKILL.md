---
name: create-series-review
description: "Create a new TV series review entry under src/i-like/series. Use when asked to add, create, or write a series review (reseña de serie). Fetches metadata and cover art from The Movie Database (TMDB), downloads and optimizes the poster to WebP, applies minimal orthographic corrections to the Spanish review text, and creates the MDX file with correct frontmatter."
argument-hint: "Series title [review text in Spanish]"
user-invocable: true
---

# Create Series Review

## When to Use

- Adding a new TV series review to `src/i-like/series/`.
- Creating a new series entry with cover image and TMDB metadata.
- The user provides a series title and a review written in Spanish.

## Inputs

- Series title (required if not already provided).
- Full review text in Spanish (required if not already provided).

## Step-by-Step Workflow

Parallelization guidance:

- Parallelize independent read-only work aggressively once the title and review text are available.
- Prefer subagents for isolated read-only exploration, especially repository analysis that can run independently from the main flow.
- Keep user-decision checkpoints sequential: stop and ask before overwriting an existing file, and before proceeding if TMDB returns multiple plausible matches.
- Do not run cover download before the TMDB match is confirmed.
- Do not create the MDX file until metadata, final tags, and the cover file are all resolved.

**Steps:**

1. Ask only for missing information.
   - If the user already provided the series title, do not ask for it again.
   - If the user already provided the review text, do not ask for it again.
2. Collect the series title and the full review text before creating files.
3. After the title and review text are available, start these independent tasks in parallel:
   - Apply only minimal orthographic and punctuation corrections to the review text.
     - Preserve the user's meaning, tone, and structure.
     - Do not expand, summarize, or rewrite the review.
   - Generate the filename slug by sanitizing the title:
     - lowercase
     - remove accents and special characters
     - replace spaces with `-`
     - collapse repeated dashes
     - trim leading and trailing dashes
   - Search TMDB for the best matching series using the fetch_webpage tool:
     - **URL**: `https://www.themoviedb.org/search/tv?query=TITLE_URL_ENCODED`
     - **query**: `series title year overview`
     - Parse the page to extract the canonical title, year, TMDB series URL (e.g. `https://www.themoviedb.org/tv/TMDB_ID`), and the poster image URL.
     - Poster URL pattern: `https://www.themoviedb.org/t/p/w300_and_h450_bestv2/POSTER_PATH`
   - Use a read-only subagent to inspect `src/i-like/series/*.mdx` and collect the existing tag vocabulary and any formatting details that matter for consistency.
4. As soon as the slug is known, check whether `src/i-like/series/<slug>.mdx` already exists.
   - If it exists, stop and ask for confirmation before overwriting.
5. Once the TMDB search completes:
   - If it returns exactly one clearly plausible match, proceed without asking for confirmation.
   - If it returns multiple plausible matches, stop and ask the user which one to use.
6. Once the series match is confirmed, run these tasks in parallel:
   - Download the poster image and convert it to WebP at 180px width:
     a. Use the fetch_webpage tool with the poster URL. If it returns usable binary image content, save temporarily (e.g., `/tmp/<slug>-poster.jpg`).
     b. Fall back to curl only if the internal tool cannot retrieve binary data:
        ```bash
        curl -L -o /tmp/<slug>-poster.jpg "<poster-url>"
        ```
     c. Convert and validate with ImageMagick:
        ```bash
        magick /tmp/<slug>-poster.jpg -resize 180x -quality 88 src/i-like/series/<slug>.webp
        file src/i-like/series/<slug>.webp
        magick identify -format '%m %w %h' src/i-like/series/<slug>.webp
        ```
     d. Accept only if format is WEBP and width is 180 px.
   - Using the confirmed TMDB metadata and the previously collected repository tag vocabulary, propose 1 to 3 additional categories besides `series`.
     - Reuse existing tag vocabulary from the repository.
     - Choose only tags that are clearly supported by the series metadata or the review.
     - If no additional category is clearly justified, keep only `series`.
7. Wait for the cover task to finish and confirm that `src/i-like/series/<slug>.webp` exists.
8. Create the MDX file at `src/i-like/series/<slug>.mdx` once the metadata, cover, and tags are resolved.

## Expected Frontmatter

```yaml
---
title: <series title>
tags:
  - series
  - <optional existing category tags if clearly applicable>
image: ./<slug>.webp
url: <TMDB series URL>
---
```

## Metadata Rules

- Always include the TMDB `url` in the frontmatter.
- Use the canonical title as it appears on TMDB (may differ from the user's input).
- Do not add fields not present in the existing entries (no `author`, no `isbn`).

## Repository Editing Rules

- The review content must remain in Spanish.
- The review text must stay 100% human-authored; only apply minimal orthographic and punctuation corrections.
- Make the smallest change that solves the task.
- At the end, verify that the image reference and frontmatter match the existing project format.
- A local relative image such as `./<slug>.webp` is the correct format for series entries.
- When adding categories, reuse the existing series tags already present in the repository instead of inventing new taxonomy unless there is a strong reason.

## Expected Outcome

1. A new MDX file exists in `src/i-like/series/`.
2. A WebP cover exists in the same folder with the same base name.
3. The frontmatter contains at least `title`, `tags` with `series`, `image`, and `url`.
4. The user is told the final filename created, the TMDB source used for metadata and cover, the orthographic corrections applied to the review, the additional categories chosen, and any fields that could not be completed.
