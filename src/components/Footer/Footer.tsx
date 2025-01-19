import React from "react";
import { FC } from "react";
import * as css from "./Footer.module.css"
import IconCcLogo from "../../images/icons/cc-logo.svg"
import IconByLogo from "../../images/icons/cc-by.svg"
import IconSaLogo from "../../images/icons/cc-sa.svg"

interface FooterProps extends React.HTMLProps<HTMLElement> {
  date?: string | null
}

const Footer: FC<FooterProps> = ({ className, date }, props) => {
  let updated = null
  if (date) {
    const fecha = new Date(date);
    updated = new Intl.DateTimeFormat('es-ES', {
      year: 'numeric',
      month: 'long'
    }).format(fecha);
  }
  return <footer className={`${className} ${css.footer}`} {...props}>
    {!!updated && <div className={css.updated}>Actualizada en {updated}</div>}



    <div className={css.license}><div><IconCcLogo /><IconByLogo /><IconSaLogo /></div>
      <div> El contenido de este sitio está sujeto a la <a rel="license" href="https://creativecommons.org/licenses/by-sa/4.0/legalcode.es">licencia de Creative Commons <i>Reconocimiento, Compartir bajo la misma licencia 4.0</i></a></div>
    </div>
  </footer>
}

export default Footer