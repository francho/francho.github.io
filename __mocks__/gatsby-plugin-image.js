const React = require("react")

const GatsbyImage = jest.fn(({ image, alt, className }) =>
  React.createElement("img", { src: image?.src || "mock-image", alt, className })
)

const StaticImage = jest.fn(({ src, alt, className }) =>
  React.createElement("img", { src, alt, className })
)

const getImage = jest.fn((src) => src)

module.exports = {
  GatsbyImage,
  StaticImage,
  getImage,
}
