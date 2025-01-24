import React, { FC } from "react"
import Menu from "../components/Menu/Menu"
import { HeadFC } from "gatsby"

const MenuPage: FC = () => {
  return <Menu isOpen={true}></Menu>
}

export default MenuPage
export const Head: HeadFC = () => <title>Menú :: Francho Joven</title>