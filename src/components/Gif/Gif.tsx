import React from 'react';
import { graphql, useStaticQuery } from 'gatsby';
import * as css from './Gif.module.css';

type GifProps = {
  name: string;
};

type GifData = {
  allFile: {
    nodes: Array<{
      name: string;
      publicURL: string;
    }>;
  };
};

const Gif: React.FC<GifProps> = ({ name }) => {
  const data = useStaticQuery<GifData>(graphql`
    query {
      allFile(
        filter: {
          sourceInstanceName: { eq: "images" }
          relativeDirectory: { eq: "gifs" }
          extension: { eq: "gif" }
        }
      ) {
        nodes {
          name
          publicURL
        }
      }
    }
  `);

  const gifName = name.replace(/\.gif$/i, '');
  const gif = data.allFile.nodes.find((node) => node.name === gifName);

  if (!gif?.publicURL) {
    return null;
  }

  return (
    <div className={css.container}>
      <img className={css.image} src={gif.publicURL} alt={gifName.replace(/[_-]/g, ' ')} />
    </div>
  );
};

export default Gif;
