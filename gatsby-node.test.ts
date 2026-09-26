import { execFileSync } from "node:child_process"
import { onCreateWebpackConfig } from "./gatsby-node"

describe("dependency compatibility", () => {
  it("loads image SVGs as components while retaining other asset rules", () => {
    const imageRule = { test: /\.(png|jpg|svg)$/, use: ["url-loader"] }
    const cssRule = { test: /\.css$/, use: ["css-loader"] }
    const config = { module: { rules: [imageRule, cssRule] } }
    const replaceWebpackConfig = jest.fn()

    onCreateWebpackConfig({
      actions: { replaceWebpackConfig },
      getConfig: () => config,
      rules: { images: () => imageRule },
    } as Parameters<typeof onCreateWebpackConfig>[0], { plugins: [] })

    const updated = replaceWebpackConfig.mock.calls[0][0]
    const [images, css, svg] = updated.module.rules
    expect(css).toBe(cssRule)
    expect(images.use).toEqual(imageRule.use)
    expect(images.exclude.test("/src/images/icons/menu.svg")).toBe(true)
    expect(images.exclude.test("/src/images/photo.jpg")).toBe(false)
    expect(images.exclude.test("/src/content/diagram.svg")).toBe(false)
    expect(svg.include.test("/src/images/blueprint_mask.svg")).toBe(true)
    expect(svg.use).toEqual([
      { loader: "@svgr/webpack", options: { svgo: false } },
    ])
  })

  it("preserves Gatsby query parsing with the patched ESM decoder", () => {
    const script = `
      const assert = require("node:assert/strict");
      const { createRequire } = require("node:module");
      const gatsbyRequire = createRequire(require.resolve("gatsby/package.json"));
      const query = gatsbyRequire("query-string");
      assert.equal(query.parse("title=caf%C3%A9+%26+web").title, "caf\\u00e9 & web");
      assert.equal(query.stringify({ url: "https://francho.org/?a=1&b=2" }),
        "url=https%3A%2F%2Ffrancho.org%2F%3Fa%3D1%26b%3D2");
      assert.equal(query.parse("bad=%E0%A4%A").bad, "%E0%A4%A");
      query.parse("bad=" + "%FF".repeat(10000));
    `
    expect(() => execFileSync(process.execPath, ["-e", script], {
      cwd: process.cwd(),
      timeout: 5000,
      stdio: "pipe",
    })).not.toThrow()
  })
})