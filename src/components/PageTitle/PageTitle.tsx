import React, { FC } from "react"
import * as css from "./PageTitle.module.css"

export interface PageTitleProps {
  title?: string
  section?: string
}

const PageTitle: FC<PageTitleProps> = ({ title, section }) => {
  return <>
    <title>{title} :: Francho Joven</title>
    {title && <h1 className={css.pageTitle}><span>Francho {section && ` / ${section}`}</span>{title}</h1>}
  </>
}

export default PageTitle