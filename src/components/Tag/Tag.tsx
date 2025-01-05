import React from "react"
import { FC } from "react"
import * as css from "./Tag.module.css"

export interface TagProps {
  tag: string
  onClick: () => void
  selected: boolean
  className?: string
}

const Tag: FC<TagProps> = ({ tag, onClick, selected, className }) => {
  return <span key={`tag-${tag}`} className={`${css.tag} ${className}`}>
    <input id={tag} type="checkbox" onChange={onClick} checked={selected} />
    <label htmlFor={tag}>{tag}</label>
  </span>
}

export default Tag