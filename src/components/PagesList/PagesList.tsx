import { useStaticQuery, graphql, Link } from "gatsby"
import React, { FC, useMemo } from "react"
import Tag from "../Tag/Tag"

interface PageInfo {
  id: string
  title: string
  path: string
  tags: string[]
  timestamp: number
  excerpt?: string
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
  const { allSitePage, allMdx } = useStaticQuery(graphql`
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
    }
  `)

  const visiblePages = useMemo<PageInfo[]>(() => {
    const excerptMap: Record<string, string> = {}
    const modifiedTimeMap: Record<string, number> = {}
    for (const mdxNode of allMdx?.nodes ?? []) {
      if (mdxNode.id) {
        excerptMap[mdxNode.id] = mdxNode.excerpt ?? ""
        modifiedTimeMap[mdxNode.id] = Date.parse(mdxNode.parent?.modifiedTime ?? "1970/01/01")
      }
    }

    return (allSitePage?.nodes?.map((node: Queries.SitePage): PageInfo => {
      const ctx = node?.pageContext as PageContext | null
      const mdxId = ctx?.id ?? ""
      const dateStr = ctx?.frontmatter?.date
      const timestamp = dateStr
        ? Date.parse(dateStr)
        : (modifiedTimeMap[mdxId] ?? 0)
      return {
        id: node?.id,
        path: node.path,
        title: ctx?.frontmatter?.title ?? "",
        tags: ctx?.frontmatter?.tags ?? [],
        timestamp,
        excerpt: excerptMap[mdxId],
      }
    }) ?? [])
      .filter((p: PageInfo) => tags.every(tag => (p.tags || []).includes(tag)))
      .filter((p: PageInfo) => excludeTags.every(tag => !(p.tags || []).includes(tag)))
      .sort((a: PageInfo, b: PageInfo) => {
        const dateSort = b?.timestamp - a?.timestamp
        return dateSort === 0 ? a?.title?.localeCompare(b?.title, "es-ES") : dateSort
      })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allSitePage, allMdx, JSON.stringify(tags), JSON.stringify(excludeTags)])

  return (
    <ul>
      {visiblePages.map(({ id, path, title, tags: pageTags, excerpt }) => (
        <li key={id}>
          <Link to={path}>{title}</Link>
          {showTags && pageTags.length > 0 && (
            <div>
              {(showFilterTags ? pageTags : pageTags.filter(tag => !tags.includes(tag))).map(tag => <Tag key={`${id}-${tag}`} tag={tag} onClick={() => {}} selected={false} />)}
            </div>
          )}
          {showSummary && excerpt && <p>{excerpt}</p>}
        </li>
      ))}
    </ul>
  )
}

export default PagesList