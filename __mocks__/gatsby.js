const React = require("react")
const gatsby = jest.requireActual("gatsby")

module.exports = {
  ...gatsby,
  graphql: jest.fn(),
  Link: jest.fn().mockImplementation(({ children, to, ...rest }) =>
    React.createElement("a", { ...rest, href: to }, children)
  ),
  StaticQuery: jest.fn(),
  useStaticQuery: jest.fn(),
  navigate: jest.fn(),
}
