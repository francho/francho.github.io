import React from "react";
import { FC } from "react";
import * as css from "./PageFooter.module.css"
import IconCcLogo from "../../images/icons/cc-logo.svg"
import IconByLogo from "../../images/icons/cc-by.svg"
import IconSaLogo from "../../images/icons/cc-sa.svg"
import { useFooterContent } from "./FooterContext/FooterContext";

interface PageFooterProps extends React.HTMLProps<HTMLElement> {}

const PageFooter: FC<PageFooterProps> = ({ className, ...props }) => {
  // Try to get footer content from context, but handle case where provider is not available
  let footerContents: Array<{ id: number; content: React.ReactNode }> = [];
  try {
    const context = useFooterContent();
    footerContents = context.footerContents;
  } catch (error) {
    // Provider not available - this is OK for backward compatibility
    footerContents = [];
  }

  // Render in reverse order (last added first)
  const reversedContents = [...footerContents].reverse();

  return <footer className={`${className} ${css.footer}`} {...props}>
    {reversedContents.length > 0 && (
      <div className={css.injectedContent}>
        {reversedContents.map(item => (
          <div key={item.id}>{item.content}</div>
        ))}
      </div>
    )}

    <div className={css.license}><div><IconCcLogo /><IconByLogo /><IconSaLogo /></div>
      <div> El contenido de este sitio está sujeto a la <a rel="license" href="https://creativecommons.org/licenses/by-sa/4.0/legalcode.es">licencia de Creative Commons <i>Reconocimiento, Compartir bajo la misma licencia 4.0</i></a></div>
    </div>
  </footer>
}

export default PageFooter