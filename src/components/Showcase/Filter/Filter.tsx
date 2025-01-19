import React, { useCallback, useEffect, useState } from "react";
import { FC } from "react";
import * as css from "./Filter.module.css"
import Tag from "../../Tag/Tag";
import { categories } from "../Showcase";

export interface FilterProps {
  nodes: Queries.Mdx[]
  onTagSelected: (tag: string) => void
}

const Filter: FC<FilterProps> = ({ nodes, onTagSelected }) => {
  const allTags: string[] = [];
  const [selectedTag, setSelectedTag] = useState("")

  useEffect(() => {
    onTagSelected(selectedTag)
  }, [selectedTag])

  nodes.forEach((book: Queries.Mdx) => {
    allTags.push(...(book?.frontmatter?.tags as string[] || []));
  });
  const uniqueTags = [...new Set(allTags.filter(t => !categories.includes(t)))];

  return <div className={css.tags}>
    {uniqueTags.map(t => <Tag
      key={`tag-${t}`}
      tag={t}
      onClick={() => setSelectedTag(t !== selectedTag ? t : "")}
      selected={t === selectedTag} />)}
  </div >
}

export default Filter