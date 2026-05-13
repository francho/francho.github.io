import { GatsbyImage, getImage } from "gatsby-plugin-image"
import { Link } from "gatsby"
import React, { FC } from "react"
import Tag from "../Tag/Tag"
import * as css from "./Card.module.css"
import BluePrintMask from "../../images/blueprint_mask.svg"

interface CardProps {
  title: string
  excerpt?: string
  tags: string[]
  image?: any // GatsbyImageData or null
  path: string
}

const Card: FC<CardProps> = ({ title, excerpt, tags, image, path }) => {
  const gatsbyImage = image ? getImage(image) : null

  return (
    <Link to={path} className={css.card}>
      <div className={css.imageContainer}>
        {gatsbyImage ? (
          <GatsbyImage image={gatsbyImage} alt={title} className={css.image} />
        ) : (
          <div className={css.placeholder}></div>
        )}
        <BluePrintMask className={css.blueprintMask} />
      </div>
      <div className={css.content}>
        <h3 className={css.title}>{title}</h3>
        {excerpt && <p className={css.excerpt}>{excerpt}</p>}
        {tags.length > 0 && (
          <div className={css.tags}>
            {tags.map(tag => (
              <Tag key={tag} tag={tag} onClick={() => {}} selected={false} />
            ))}
          </div>
        )}
      </div>
    </Link>
  )
}

export default Card