---
name: optimize-web-image
description: 'Optimize an already downloaded image for web delivery. Use when you need to convert a local image to WebP, resize it to a requested size, preserve aspect ratio, and validate the output before using it in the site.'
argument-hint: 'Local image path and target size'
user-invocable: true
---

# Optimize Web Image

## When to Use

- Optimizing a local image that has already been downloaded.
- Converting an image to WebP for web delivery.
- Resizing an image to a requested width while preserving aspect ratio.
- Replacing an existing asset with a smaller, web-ready version.
- Validating that the final asset has the expected format and dimensions.

## Inputs

- A local source image path.
- A requested target size.

Interpret the requested size like this:

- If the user gives a single value such as `180`, treat it as target width in pixels and preserve aspect ratio.
- If the user gives a size like `180x240`, treat it as a bounding box and preserve aspect ratio unless the user explicitly asks to crop or distort.

## Default Output Behavior

- Save the optimized image next to the source image unless the caller provides a different output path.
- Change the extension to `.webp`.
- Do not overwrite an existing target file without confirmation.

## Procedure

1. Resolve the local source path and confirm it exists.
2. Resolve the requested target size.
3. Resolve the output path.
   Example: `path/to/image.webp`
4. If the target file already exists, ask for confirmation before overwriting.
5. Convert and resize with ImageMagick using the verified repository command pattern.

For width-only resizing:

```bash
magick "$src" -resize 180x -quality 88 "$out"
```

For bounding-box resizing:

```bash
magick "$src" -resize 180x240 -quality 88 "$out"
```

6. Validate the output file type:

```bash
file "$out"
```

7. Validate dimensions and format with ImageMagick:

```bash
magick identify -format '%m %w %h' "$out"
```

8. Accept the result only if the format is `WEBP` and the resulting dimensions match the requested resize rule.
9. If validation fails, stop and report the exact failure.

## Working Command Template

```bash
set -e
src='path/to/source.png'
out='path/to/source.webp'
target_width='180'
magick "$src" -resize "${target_width}x" -quality 88 "$out"
file "$out"
magick identify -format '%m %w %h' "$out"
```

## Fallbacks

- If the source image is unreadable, stop and report that the local input file is invalid.
- If the output dimensions do not match the requested resize rule, stop and report the measured dimensions.
- If the caller needs a different destination path, preserve the same conversion and validation flow with the new target path.

## Completion Check

- Output file exists at the requested destination.
- `file` reports a WebP image.
- `magick identify -format '%m %w %h'` reports dimensions consistent with the requested size.
- The image is ready to be referenced from the site.