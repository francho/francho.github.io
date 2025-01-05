import React, { FC, useState } from "react";
import * as css from "./Menu.module.css"
import { Link } from "gatsby";
import { useLocation } from "@reach/router"
import IconMenu from "../../images/icons/menu.svg"
import IconX from "../../images/icons/x.svg"
import BackIcon from "../../images/icons/back.svg"
export interface MenuProps {
  back?: string
}

const Menu: FC<MenuProps> = ({ back }) => {
  const [isMenuOpened, setMenuOpened] = useState(false)
  const location = useLocation();

  const options = [
    { link: "/", label: "Hola" },
    { link: "/ahora/", label: "Ahora" },
    { link: "/uso/", label: "Lo que uso" },
    { link: "/me-gusta", label: "Me gusta" },
  ]

  return (
    <nav className={`${css.menu} ${isMenuOpened && css.active}`}>
      {back && <Link to={back} className={css.back}><BackIcon /></Link>}

      <input type="checkbox" id="overlay-input" onChange={(e) => setMenuOpened((v) => !v)} />
      <label className={css.overlayButton} htmlFor="overlay-input">
        {!isMenuOpened && <IconMenu />}
        {isMenuOpened && <IconX />}
      </label>
      <div className={`${css.overlay}`}>
        <ul >
          {options.map(({ link, label }) => <li key={`option-${link}`} className={link === location.pathname ? css.selected : ""}><Link to={link}>{label}</Link></li>)}
        </ul>
      </div>

    </nav>
  )
}

export default Menu