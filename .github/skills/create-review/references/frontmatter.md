# Frontmatter Examples

## Common Structure

```yaml
---
title: <title>
tags:
  - <primary-tag>
  - <optional existing category tags>
image: ./<slug>.<ext>
url: <source-url>
---
```

## Libros

```yaml
---
title: El nombre del libro
isbn: "9781234567890"
author: Nombre del Autor
tags:
  - libros
  - ficción
  - ciencia-ficción
image: ./el-nombre-del-libro.webp
---
```

**Notes**:
- Include `isbn` if available (prioritize)
- Include `author` if available
- Only include `url` if no ISBN or adds valuable context

## Películas

```yaml
---
title: El nombre de la película
tags:
  - películas
  - drama
image: ./el-nombre-de-la-pelicula.webp
url: https://www.themoviedb.org/movie/12345
---
```

**Notes**:
- Always include TMDB `url`
- Do not add `author` or `isbn` fields

## Series

```yaml
---
title: El nombre de la serie
tags:
  - series
  - comedia
image: ./el-nombre-de-la-serie.webp
url: https://www.themoviedb.org/tv/12345
---
```

**Notes**:
- Always include TMDB `url`
- Do not add `author` or `isbn` fields

## Documentales

```yaml
---
title: El nombre del documental
tags:
  - documentales
  - naturaleza
image: ./el-nombre-del-documental.webp
url: https://www.themoviedb.org/movie/12345
---
```

**Notes**:
- Same as Películas (documentaries are movies in TMDB)
- Always include TMDB `url`
- Do not add `author` or `isbn` fields

## Podcasts

```yaml
---
title: El nombre del podcast
tags:
  - podcasts
  - tecnología
image: ./el-nombre-del-podcast.jpg
url: https://www.example.com/podcast
---
```

**Notes**:
- Always include official website `url`
- Image can be `.jpg` or `.png` (keep original format)
- Do not add `author` or `isbn` fields
