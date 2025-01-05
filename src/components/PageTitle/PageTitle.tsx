import React, { FC } from "react"

export interface PageTitleProps {
  title?: string
  section?: string
}

const PageTitle: FC<PageTitleProps> = ({ title, section }) => {
  return <>
    <title>{title} :: Francho Joven</title>
    {title && <h1><span>Francho {section && ` / ${section}`}</span>{title}</h1>}
  </>
}

export default PageTitle