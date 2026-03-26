/** @type {import("jest").Config} */
module.exports = {
  transform: {
    "^.+\\.[jt]sx?$": "<rootDir>/jest-preprocess.js",
  },
  moduleNameMapper: {
    // CSS Modules get identity-obj-proxy so class names return their own key
    ".+\\.module\\.css$": "identity-obj-proxy",
    // Plain CSS files get a simple stub
    ".+\\.(css|styl|less|sass|scss)$": "<rootDir>/__mocks__/file-mock.js",
    ".+\\.(jpg|jpeg|png|gif|eot|otf|webp|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$":
      "<rootDir>/__mocks__/file-mock.js",
    ".+\\.svg$": "<rootDir>/__mocks__/svg-mock.js",
  },
  testPathIgnorePatterns: ["node_modules", "\\.cache", "<rootDir>.*/public"],
  transformIgnorePatterns: [
    "node_modules/(?!(gatsby|gatsby-script|gatsby-link|gatsby-plugin-image)/)",
  ],
  globals: {
    __PATH_PREFIX__: "",
  },
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
}
