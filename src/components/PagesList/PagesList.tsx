import { useStaticQuery, graphql, Link } from "gatsby"
import React, { FC, useEffect, useState } from "react"

interface PageInfo {
  id: string
  title: string
  path: string
  tags: string[]
  timestamp: number
}

interface PageFrontmatter {
  title?: string
  tags?: string[]
  date?: string
}

interface PageContext {
  frontmatter?: PageFrontmatter
}

interface PagesListProps {
  tags: string[]
}

const PagesList: FC<PagesListProps> = ({ tags }) => {
  const { allSitePage } = useStaticQuery(graphql`
    query {
      allSitePage {
        nodes {
          id
          path
          pageContext 
        }
      }
    }
  `)

  const [visiblePages, setVisiblePages] = useState<PageInfo[]>([])
  useEffect(() => {
    const items = allSitePage?.nodes?.map((node: Queries.SitePage): PageInfo => {
      const ctx = node?.pageContext as PageContext | null
      return {
        id: node?.id,
        path: node.path,
        title: ctx?.frontmatter?.title ?? "",
        tags: ctx?.frontmatter?.tags ?? [],
        timestamp: Date.parse(ctx?.frontmatter?.date || "1970/01/01")
      }
    })
      .filter((p: PageInfo) => tags.every(tag => (p.tags || []).includes(tag)))
      .sort((a: PageInfo, b: PageInfo) => {
        const dateSort = b?.timestamp - a?.timestamp
        return (dateSort === 0) ? a?.title?.localeCompare(b?.title, "es-ES") : dateSort
      })
    setVisiblePages(items)
  }, [allSitePage])

  return (<ul>
    {visiblePages.map(({ id, path, title }) => <li key={id}><Link to={path}>{title}</Link></li>)}
  </ul>)
}

export default PagesList