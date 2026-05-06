import React, { useEffect } from "react";
import { FC } from "react";
import * as css from "./Filter.module.css"
import Tag from "../../Tag/Tag";
import { categories } from "../Showcase";

export interface FilterProps {
  nodes: Queries.Mdx[]
  selectedTag: string
  onTagSelected: (tag: string) => void
}

const Filter: FC<FilterProps> = ({ nodes, selectedTag, onTagSelected }) => {
  const allTags: string[] = [];

  nodes.forEach((book: Queries.Mdx) => {
    allTags.push(...(book?.frontmatter?.tags as string[] || []));
  });
  const uniqueTags = [...new Set(allTags.filter(t => !categories.includes(t)))];

  return <div className={css.tags}>
    {uniqueTags.map(t => <Tag
      key={`tag-${t}`}
      tag={t}
      onClick={() => onTagSelected(t !== selectedTag ? t : "")}
      selected={t === selectedTag} />)}
  </div >
}

export default Filter