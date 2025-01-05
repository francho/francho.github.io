import React from "react";
import { FC } from "react";
import * as css from "./Header.module.css"
import Menu from "../Menu/Menu";


interface HeaderProps extends React.HTMLProps<HTMLElement> {
  back?: string
}

const Header: FC<HeaderProps> = ({ back, className }, props) => {
  return <header className={`${className} ${css.header}`} {...props} >
    <link rel="icon" href="/favicon.ico" />
    <Menu back={back} />
  </header>
}

export default Header