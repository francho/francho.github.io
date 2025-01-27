import { useStaticQuery, graphql, Link } from "gatsby"
import { GatsbyImage, getImage } from "gatsby-plugin-image";
import React, { FC, useEffect, useState } from "react"
import * as css from "./Showcase.module.css"
import Filter from "./Filter/Filter";
import Tag from "../Tag/Tag";


export const categories = ["libros", "podcasts", "series", "películas"]


const getPath = (node: Queries.Mdx) => node!.internal!.contentFilePath!
  .replace(/.*i-like\//, "/")
  .replace(/\.mdx$/, "")
  .toLowerCase();


const Showcase: FC = () => {
  const { allMdx } = useStaticQuery(graphql`
    query {
      allMdx(filter: { frontmatter: { tags: { in: ["libros","podcasts","series","películas"] }}}) {
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

  const [selectedCategory, setSelectedCategory] = useState("")
  const [selectedTag, setSelectedTag] = useState("")
  const [visibleItems, setVisibleItems] = useState(allMdx.nodes)


  useEffect(() => {
    const items = allMdx.nodes.filter((node: Queries.Mdx) => {
      const tags = (node.frontmatter?.tags || [])
      return (!selectedCategory || tags.includes(selectedCategory)) && (!selectedTag || tags.includes(selectedTag))
    })
    setVisibleItems(items)
  }, [allMdx, selectedTag, selectedCategory])

  return <div>
    <div className={css.categories}>
      {
        categories.map(c => <Tag key={`cat-${c}`} tag={c} onClick={() => setSelectedCategory(c)} selected={selectedCategory === c} />)
      }
    </div>
    <Filter nodes={allMdx.nodes} onTagSelected={setSelectedTag} />
    <div className={css.showcase}>
      {
        visibleItems.map((node: Queries.Mdx) => {
          const { frontmatter } = node
          let image = getImage(frontmatter?.image?.childImageSharp?.gatsbyImageData || null)
          return (
            <Link to={getPath(node)} key={node.id} className={css.card}>
              <div view-transition-name="main-image">
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


