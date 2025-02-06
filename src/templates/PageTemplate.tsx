import React from 'react';
import { graphql, Link, PageProps } from 'gatsby';
import { MDXProvider } from '@mdx-js/react';
import "../styles/global.css"
import Section from '../components/Section/Section';
import Footer from '../components/Footer/Footer';
import Header from '../components/Header/Header';
import Showcase from '../components/Showcase/Showcase';
import PagesList from '../components/PagesList/PagesList';
import PageTitle from '../components/PageTitle/PageTitle';

const shortcodes = { Link, Section, Showcase, PagesList }

const PageTemplate: React.FC<PageProps<{ mdx: Queries.Mdx }>> = ({ data, children }) => {
  const meta = data.mdx.frontmatter;

  let section = ""
  let back
  if (meta?.tags?.includes("proyectos")) {
    section = "proyectos"
    back = "/proyectos/"
  }

  return (
    <MDXProvider components={shortcodes}>
      <Header back={back} />
      <PageTitle title={meta?.title || undefined} section={section} />
      <article className={meta?.path === "/" ? "home" : ""}>
        {children}
      </article>
      <Footer date={meta?.date} />
    </MDXProvider>
  );
};

export default PageTemplate;

export const Head = () => <html lang="en" />

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