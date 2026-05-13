import { useStaticQuery, graphql, Link } from "gatsby"
import React, { FC, useMemo } from "react"
import Tag from "../Tag/Tag"
import Card from "../Card/Card"
import * as css from "./PagesList.module.css"

interface PageInfo {
  id: string
  title: string
  path: string
  tags: string[]
  timestamp: number
  excerpt?: string
  image?: any
}

interface PageFrontmatter {
  title?: string
  tags?: string[]
  date?: string
}

interface PageContext {
  id?: string
  frontmatter?: PageFrontmatter
}

interface PagesListProps {
  tags: string[]
  excludeTags?: string[]
  showTags?: boolean
  showFilterTags?: boolean
  showSummary?: boolean
}

const PagesList: FC<PagesListProps> = ({
  tags,
  excludeTags = [],
  showTags = false,
  showFilterTags = false,
  showSummary = false,
}) => {
  const { allSitePage, allMdx, allFile } = useStaticQuery(graphql`
    query {
      allSitePage {
        nodes {
          id
          path
          pageContext
        }
      }
      allMdx {
        nodes {
          id
          excerpt
          parent {
            ... on File {
              modifiedTime
            }
          }
        }
      }
      allFile(filter: { sourceInstanceName: { eq: "content" }, relativeDirectory: { eq: "proyectos" }, extension: { in: ["png", "jpg", "jpeg", "webp"] } }) {
        nodes {
          name
          childImageSharp {
            gatsbyImageData(width: 400, height: 180, layout: CONSTRAINED)
          }
        }
      }
    }
  `)

  const visiblePages = useMemo<PageInfo[]>(() => {
    const excerptMap: Record<string, string> = {}
    const modifiedTimeMap: Record<string, number> = {}
    const imageMap: Record<string, any> = {}

    for (const mdxNode of allMdx?.nodes ?? []) {
      if (mdxNode.id) {
        excerptMap[mdxNode.id] = mdxNode.excerpt ?? ""
        modifiedTimeMap[mdxNode.id] = Date.parse(mdxNode.parent?.modifiedTime ?? "1970/01/01")
      }
    }

    for (const fileNode of allFile?.nodes ?? []) {
      imageMap[fileNode.name] = fileNode.childImageSharp?.gatsbyImageData
    }

    return (allSitePage?.nodes?.map((node: Queries.SitePage): PageInfo => {
      const ctx = node?.pageContext as PageContext | null
      const mdxId = ctx?.id ?? ""
      const dateStr = ctx?.frontmatter?.date
      const timestamp = dateStr
        ? Date.parse(dateStr)
        : (modifiedTimeMap[mdxId] ?? 0)
      const pageName = node.path.replace(/^\/proyectos\//, "").replace(/\/$/, "")
      return {
        id: node?.id,
        path: node.path,
        title: ctx?.frontmatter?.title ?? "",
        tags: ctx?.frontmatter?.tags ?? [],
        timestamp,
        excerpt: excerptMap[mdxId],
        image: imageMap[pageName],
      }
    }) ?? [])
      .filter((p: PageInfo) => tags.every(tag => (p.tags || []).includes(tag)))
      .filter((p: PageInfo) => excludeTags.every(tag => !(p.tags || []).includes(tag)))
      .sort((a: PageInfo, b: PageInfo) => {
        const dateSort = b?.timestamp - a?.timestamp
        return dateSort === 0 ? a?.title?.localeCompare(b?.title, "es-ES") : dateSort
      })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allSitePage, allMdx, allFile, JSON.stringify(tags), JSON.stringify(excludeTags)])

  return (
    <ul className={css.grid}>
      {visiblePages.map(({ id, path, title, tags: pageTags, excerpt, image }) => (
        <li key={id} className={css.item}>
          <Card
            title={title}
            excerpt={showSummary ? excerpt : undefined}
            tags={showTags ? (showFilterTags ? pageTags : pageTags.filter(tag => !tags.includes(tag))) : []}
            image={image}
            path={path}
          />
        </li>
      ))}
    </ul>
  )
}

export default PagesList