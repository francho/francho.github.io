import path from "path";
import { GatsbyNode } from "gatsby";

const pageTemplate = path.resolve(`./src/templates/PageTemplate.tsx`);
const iLikeTemplate = path.resolve(`./src/templates/ILikeTemplate.tsx`);

export const createPages: GatsbyNode["createPages"] = async ({
  graphql,
  actions,
  reporter,
}) => {
  const { createPage } = actions;

  const result = await graphql(`
    query {
      allMdx {
        nodes {
          id
          frontmatter {
            title
            path
          }
          internal {
            contentFilePath
          }
        }
      }
    }
  `);

  if (result.errors) {
    reporter.panicOnBuild("Error loading MDX files", result.errors);
    return;
  }

  result.data.allMdx.nodes.forEach((node) => {
    const slug: string =
      node.frontmatter?.path ||
      node.internal.contentFilePath
        .replace(/.*\/content\//, "")
        .replace(/.*\/pages\//, "")
        .replace(/.*\/i-like\//, "")
        .replace(/\.mdx$/, "")
        .toLowerCase();

    const template = slug.match(/^(libros|podcasts|series|peliculas)/)
      ? iLikeTemplate
      : pageTemplate;

    createPage({
      path: slug ?? "/",
      component: `${template}?__contentFilePath=${node.internal.contentFilePath}`, // La plantilla que se usará
      context: {
        id: node.id,
      },
    });
  });
};
