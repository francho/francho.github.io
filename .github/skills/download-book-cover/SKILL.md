---
name: download-book-cover
description: "Download and place a book cover under src/i-like/libros from a book title, optionally using a provided image URL first. Use when asked to fetch, download, or update a book cover image for a libros entry. Searches Open Library, downloads the cover, converts it to WebP at 180px width, and saves it with the sanitized book-title filename."
argument-hint: "Book title [image URL]"
user-invocable: true
---

# Download Book Cover

## When to Use

- Fetching and placing a cover image for a new or existing book entry in `src/i-like/libros/`.
- Converting a downloaded cover to WebP at the correct size for the site.
- The user provides a book title and optionally an explicit image URL to use as the cover source.

## Inputs

- Book title (required).
- Image URL (optional): if provided, try this source first before any lookup.

## Step-by-Step Workflow

Use tool: `optimize-web-image` for the resize, conversion, and validation steps after the image has been obtained.

1. Use the provided book title as the primary input.
2. If a second argument with an image URL is provided, try that URL first.
   - Validate that the URL returns a usable image.
   - If the download, resize, or conversion fails, report that failure and continue with the standard lookup flow.
3. Generate the output filename by sanitizing the title:
   - lowercase
   - remove accents and special characters
   - replace spaces with `-`
   - collapse repeated dashes
   - trim leading and trailing dashes
4. Resolve the output path as `src/i-like/libros/<slug>.webp`.
5. If the target file already exists, stop and ask for confirmation before overwriting.
6. If no explicit image URL was provided, or if it failed, search Open Library first for the best matching edition or work.
7. If Open Library returns exactly one clearly plausible match, proceed without asking for confirmation.
8. If Open Library returns multiple plausible matches, stop and ask the user which one to use.
9. Try to obtain a usable cover from Open Library first.
10. If Open Library does not provide a usable cover, look for an official fallback source such as the publisher page or the official store product page.
11. Prefer official sources over blogs, review sites, or marketplaces.
12. Download the chosen image to a temporary local file using the following priority:
    a. Use the internal `fetch_webpage` tool with the image URL. If it returns usable binary content, save it to a temporary file (e.g., `/tmp/<slug>-cover.jpg`). This is the preferred approach.
    b. Fall back to `curl` in the terminal only if the internal fetch tool cannot retrieve binary image data:
       ```bash
       curl -L -o /tmp/<slug>-cover.jpg "<image-url>"
       ```
13. Use tool: `optimize-web-image` with that local file and target width `180` to convert it to WebP, resize it while preserving aspect ratio, and save it at `src/i-like/libros/<slug>.webp`.
14. Do not create or edit the MDX review file in this skill.

## Source-Selection Rules

- If the user provides an explicit image URL, try that source first before any lookup.
- A user-provided image URL does not need to come from Open Library, but it must resolve to a usable image.
- Prefer the cover associated with the same edition used for metadata when possible.
- If multiple official images are available, prefer the front cover at the largest reasonable resolution.
- If the image URL includes size parameters, prefer a larger source when available.
- If no usable official cover is available after checking Open Library and official fallback sources, stop and explain the blocker instead of inventing an image URL.

## Repository Editing Rules

- Make the smallest change that solves the task.
- The correct destination for a local downloaded book cover is `src/i-like/libros/<slug>.webp`.
- Validate that the generated file is a real WebP image after conversion.
- Validate that the generated image has a width of 180 pixels and preserves the original aspect ratio.
- Use tool: `optimize-web-image` with the exact verified conversion and validation flow instead of inventing a different image-processing flow.

## Expected Outcome

1. A WebP cover exists at `src/i-like/libros/<slug>.webp`.
2. The generated image has a width of 180 pixels and keeps the original aspect ratio.
3. The user is told the final image path and the source URL used.
4. If the task could not be completed, the user is told exactly which lookup or source failed.
