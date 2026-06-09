---
name: remove-image-geolocation-exif
description: "Remove GPS/geolocation EXIF metadata from images before committing or uploading. Use when the user wants to strip location data from image files, sanitize photos for privacy, or clean GPS tags before adding images to a repository."
argument-hint: "Image file path(s) or directory"
user-invocable: true
---
# Remove GPS EXIF Metadata

## Prerequisite

`exiftool` must be available. If missing, install it:
```bash
sudo apt-get install -y libimage-exiftool-perl
```

## Supported formats
`.jpg` `.jpeg` `.png` `.webp` `.tif` `.tiff` `.heic`

---

## Workflow

### 1. Resolve targets

- **File path(s) given** → verify each exists and has a supported extension.
- **Directory given** → use recursive flag (`-r`); exiftool will filter by extension automatically.
- **Nothing given** → ask the user for file paths or a directory before proceeding.

### 2. Strip GPS metadata

**Single file or explicit list:**
```bash
exiftool "-GPS:All=" -overwrite_original FILE [FILE2 ...]
```

**Entire directory (recursive):**
```bash
exiftool "-GPS:All=" -overwrite_original -r \
  -ext jpg -ext jpeg -ext png -ext webp -ext tif -ext tiff -ext heic \
  DIRECTORY/
```

`-GPS:All=` removes every GPS tag across all metadata groups (EXIF, XMP, IPTC).  
`-overwrite_original` edits in place — no `.original` backup files are created.

> **Do not** remove IPTC/XMP fields such as `City`, `Country`, or `Sub-location` unless the user explicitly asks; those are editorial metadata, not precision coordinates.

### 3. Verify

```bash
exiftool -GPS:All FILE [FILE2 ...]
# or for a directory:
exiftool -GPS:All -r DIRECTORY/
```

Expected: no output (empty result = no GPS tags remain). If any GPS tags are still present, re-run Step 2 for those files and report the failure.

### 4. Report

Provide a concise summary:
- Files cleaned (count + list if ≤10 files).
- Files that already had no GPS data (skip silently if many).
- Any files that failed and why.