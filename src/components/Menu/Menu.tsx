import React, { FC, useEffect, useState } from "react";
import * as css from "./Menu.module.css"
import { Link } from "gatsby";
import { useLocation } from "@reach/router"
import IconMenu from "../../images/icons/menu.svg"
import IconX from "../../images/icons/x.svg"
import BackIcon from "../../images/icons/back.svg"
export interface MenuProps {
  back?: string
  isOpen?: boolean
}

const Menu: FC<MenuProps> = ({ back, isOpen }) => {
  const [isMenuOpened, setMenuOpened] = useState(isOpen || false)
  const [jsMenu, setJsMenu] = useState(false)
  const location = useLocation();

  const options = [
    { link: "/", label: "Hola" },
    { link: "/ahora/", label: "Ahora" },
    { link: "/uso/", label: "Lo que uso" },
    { link: "/me-gusta", label: "Me gusta" },
  ]

  useEffect(() => {
    setJsMenu(true)
  }, [])

  return (
    <nav className={`${css.menu} ${isMenuOpened && css.active}`}>
      {back && <Link to={back} className={css.back} aria-label="volver"><BackIcon /></Link>}
      {jsMenu && <>
        <input type="checkbox" id="overlay-input" onChange={(e) => setMenuOpened((v) => !v)} checked={isOpen} />
        <label className={css.overlayButton} htmlFor="overlay-input">
          {!isMenuOpened && <IconMenu />}
          {isMenuOpened && <IconX />}
        </label>
      </>}
      {!jsMenu &&
        <a href="/menu/" className={css.overlayButton}><IconMenu /></a>
      }
      <div className={`${css.overlay}`}>
        <ul >
          {options.map(({ link, label }) => <li key={`option-${link}`} className={link === location.pathname ? css.selected : ""}><Link to={link}>{label}</Link></li>)}
        </ul>
      </div>

    </nav>
  )
}

export default Menu