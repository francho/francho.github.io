module.exports = {
  useLocation: jest.fn(() => ({
    pathname: "/",
    search: "",
    hash: "",
    href: "http://localhost/",
    origin: "http://localhost",
    protocol: "http:",
    host: "localhost",
    hostname: "localhost",
    port: "",
    state: undefined,
    key: "default",
  })),
}
