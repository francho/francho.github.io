import React from 'react';
import { graphql, Link, PageProps } from 'gatsby';
import { MDXProvider } from '@mdx-js/react';
import "../styles/global.css"
import Section from '../components/Section/Section';
import PageFooter from '../components/PageFooter/PageFooter';
import Header from '../components/Header/Header';
import Showcase from '../components/Showcase/Showcase';
import PagesList from '../components/PagesList/PagesList';
import PageTitle from '../components/PageTitle/PageTitle';
import Gif from '../components/Gif/Gif';
import * as css from "./PageTemplate.module.css"
import { FooterContentProvider } from '../components/PageFooter/FooterContext/FooterContext';
import Footer from '../components/PageFooter/Footer/Footer';

const shortcodes = { 
  Link, 
  Section, 
  Showcase, 
  PagesList,
  Gif,
  Footer,
  table: ({ children }: any) => (
      <table className={css.table}>{children}</table>
  ),
  thead: ({ children }: any) => <thead className={css.thead}>{children}</thead>,
  tbody: ({ children }: any) => <tbody className={css.tbody}>{children}</tbody>,
  tr: ({ children }: any) => <tr className={css.tr}>{children}</tr>,
  th: ({ children }: any) => <th className={css.th}>{children}</th>,
  td: ({ children }: any) => <td className={css.td}>{children}</td>,
}

const PageTemplate: React.FC<PageProps<{ mdx: Queries.Mdx }>> = ({ data, children }) => {
  const meta = data.mdx.frontmatter;

  let section = ""
  let back
  if (meta?.tags?.includes("proyectos")) {
    section = "proyectos"
    back = "/proyectos/"
  }

  const updatedDate = meta?.date ? new Intl.DateTimeFormat('es-ES', {
    year: 'numeric',
    month: 'long'
  }).format(new Date(meta.date)) : null;

  return (
    <FooterContentProvider>
      <MDXProvider components={shortcodes}>
        <Header back={back} />
        <PageTitle title={meta?.title || undefined} section={section} />
        <article className={meta?.path === "/" ? "home" : ""}>
          {children}
        </article>
        {updatedDate && <Footer>Actualizada en {updatedDate}</Footer>}
        <PageFooter />
      </MDXProvider>
    </FooterContentProvider>
  );
};

export default PageTemplate;

export const Head: React.FC<PageProps<{ mdx: Queries.Mdx }>> = ({ data }) => (
  <>
    <html lang="es" />
    <title>{data.mdx.frontmatter?.title} :: Francho Joven</title>
  </>
)

export const query = graphql`
  query($id: String!) {
    mdx(id: { eq: $id }) {
      frontmatter {
        title,
        date,
        path,
        tags
      }
    }
  }
`