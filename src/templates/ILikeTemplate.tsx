import React from 'react';
import { graphql, Link, PageProps } from 'gatsby';
import { MDXProvider } from '@mdx-js/react';
import "../styles/global.css"
import Section from '../components/Section/Section';
import PageFooter from '../components/PageFooter/PageFooter';
import Header from '../components/Header/Header';
import { GatsbyImage, getImage } from 'gatsby-plugin-image';
import * as css from "./ILikeTemplate.module.css"
import PageTitle from '../components/PageTitle/PageTitle';
import Gif from '../components/Gif/Gif';
import { FooterContentProvider } from '../components/PageFooter/FooterContext/FooterContext';
import Footer from '../components/PageFooter/Footer/Footer';

const mdxComponents = { Link, Section, Gif, Footer }

const BookPageTemplate: React.FC<PageProps<{ mdx: Queries.Mdx }>> = ({ data, children }) => {
  const meta = data.mdx.frontmatter;
  const image = getImage(meta!.image!.childImageSharp!.gatsbyImageData)
  let url = !!meta?.isbn ? `https://openlibrary.org/isbn/${meta?.isbn}` : meta!.url

  const updatedDate = meta?.date ? new Intl.DateTimeFormat('es-ES', {
    year: 'numeric',
    month: 'long'
  }).format(new Date(meta.date)) : null;

  return (
    <FooterContentProvider>
      <MDXProvider components={mdxComponents}>
        <Header back="/me-gusta/" />
        <PageTitle title='Me gusta' />
        <article>
          <div className={css.info}>
            {image && <a href={url || "#"} target="_new" view-transition-name={`image-${data.mdx.id}`} >
              <GatsbyImage image={image} alt={meta?.title || ""} className={css.image} ></GatsbyImage>
            </a>}
            <h2>{meta?.title}</h2>
            {!!meta?.author && <p>{meta?.author}</p>}
            {!!meta?.isbn && <p>isbn: {meta?.isbn}</p>}
          </div>
          <div className={css.why}>{children}</div>
          <div className={css.tags}>
            {
              meta?.tags?.map(tag => <span className={css.tag} key={`tag-${tag}`}>{tag}</span>)
            }
          </div>
        </article>

        {updatedDate && <Footer>Actualizada en {updatedDate}</Footer>}
        <PageFooter />
      </MDXProvider >
    </FooterContentProvider>
  );
};

export default BookPageTemplate;

export const Head = () => <html lang="en" />

export const query = graphql`
  query($id: String!) {
    mdx(id: { eq: $id }) {
      id
      frontmatter {
        title,
        isbn,
        author,
        tags,
        date,
        image {
          childImageSharp {
              gatsbyImageData(width: 180)
          }
        },
        url
      }
    }
  }
`