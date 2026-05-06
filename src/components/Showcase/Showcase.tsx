import { useStaticQuery, graphql, Link, navigate } from "gatsby"
import { GatsbyImage, getImage } from "gatsby-plugin-image";
import React, { FC, useEffect, useState } from "react"
import { useLocation } from "@reach/router"
import * as css from "./Showcase.module.css"
import Filter from "./Filter/Filter";
import Tag from "../Tag/Tag";


export const categories = ["libros", "podcasts", "series", "películas", "documentales"]


const getPath = (node: Queries.Mdx) => node!.internal!.contentFilePath!
  .replace(/.*i-like\//, "/")
  .replace(/\.mdx$/, "")
  .toLowerCase();


const Showcase: FC = () => {
  const { allMdx } = useStaticQuery(graphql`
    query {
      allMdx(filter: { frontmatter: { tags: { in: ["libros","podcasts","series","películas", "documentales"] }}}) {
        nodes {
          id,
          frontmatter {
            title,
            isbn,
            author,
            tags,
            date,
            image {
              childImageSharp {
                gatsbyImageData(width: 180)
              }
            }
          },
          excerpt,
          internal {
            contentFilePath
          }
        }
      }
    }
  `)

  const location = useLocation()
  const searchParams = new URLSearchParams(location.search)
  const catFromUrl = searchParams.get("cat") || ""

  const [selectedCategory, setSelectedCategory] = useState(catFromUrl)
  const [selectedTag, setSelectedTag] = useState("")

  const handleCategoryChange = (cat: string) => {
    const newCat = selectedCategory === cat ? "" : cat
    setSelectedCategory(newCat)
    const params = new URLSearchParams(location.search)
    if (newCat) {
      params.set("cat", newCat)
    } else {
      params.delete("cat")
    }
    navigate(`${location.pathname}?${params.toString()}`, { replace: true })
  }

  useEffect(() => {
    setSelectedCategory(catFromUrl)
  }, [catFromUrl])
  const [visibleItems, setVisibleItems] = useState(allMdx.nodes)
  const categoryFilteredItems = allMdx.nodes.filter((node: Queries.Mdx) => {
    const tags = (node.frontmatter?.tags || [])
    return !selectedCategory || tags.includes(selectedCategory)
  })

  useEffect(() => {
    const items = categoryFilteredItems.filter((node: Queries.Mdx) => {
      const tags = (node.frontmatter?.tags || [])
      return !selectedTag || tags.includes(selectedTag)
    })
    setVisibleItems(items)
  }, [allMdx, selectedTag, selectedCategory])

  return <div>
    <div className={css.categories}>
      {
        categories.map(c => <Tag key={`cat-${c}`} tag={c} onClick={() => handleCategoryChange(c)} selected={selectedCategory === c} />)
      }
    </div>
    <Filter nodes={categoryFilteredItems} onTagSelected={setSelectedTag} />
    <div className={css.showcase}>
      {
        visibleItems.map((node: Queries.Mdx) => {
          const { frontmatter } = node
          let image = getImage(frontmatter?.image?.childImageSharp?.gatsbyImageData || null)
          return (
            <Link to={getPath(node)} key={node.id} className={css.card}>
              <div view-transition-name={`image-${node.id}`}>
                <GatsbyImage image={image!} alt={frontmatter!.title || ""} className={css.image} />
              </div>
            </Link>
          )
        })
      }
    </div>
  </div>
}

export default Showcase


