import React, { FC, ReactNode } from "react"
import * as css from "./Section.module.css"

interface SectionProps extends React.HTMLProps<HTMLElement> {
  type?: "hello" | "dark" | "light" | "disclaimer"
}

const Section: FC<SectionProps> = ({ type, className, children }, props) => {
  const styles = {
    hello: css.hello,
    dark: css.dark,
    light: css.light,
    disclaimer: css.disclaimer
  }

  const typeStyle = type ? styles[type] : ""
  return <section className={`${css.section} ${typeStyle} ${className}`} {...props}>{children}</section>
}

export default Section