import React from "react"
import { render, screen } from "@testing-library/react"
import { axe } from "jest-axe"
import { useStaticQuery } from "gatsby"
import PagesList from "./PagesList"

const mockedUseStaticQuery = useStaticQuery as jest.Mock

const mockPagesData = {
  allSitePage: {
    nodes: [
      {
        id: "page-1",
        path: "/proyectos/app-1/",
        pageContext: {
          id: "mdx-1",
          frontmatter: {
            title: "App 1",
            tags: ["proyectos", "react"],
            date: "2024-01-15",
          },
        },
      },
      {
        id: "page-2",
        path: "/proyectos/app-2/",
        pageContext: {
          id: "mdx-2",
          frontmatter: {
            title: "App 2",
            tags: ["proyectos", "gatsby"],
            date: "2024-02-20",
          },
        },
      },
      {
        id: "page-3",
        path: "/notas/nota-1/",
        pageContext: {
          id: "mdx-3",
          frontmatter: {
            title: "Nota 1",
            tags: ["notas"],
            date: "2024-03-01",
          },
        },
      },
      {
        id: "page-4",
        path: "/proyectos/sin-fecha/",
        pageContext: {
          id: "mdx-4",
          frontmatter: {
            title: "Sin Fecha",
            tags: ["proyectos", "wip"],
          },
        },
      },
    ],
  },
  allMdx: {
    nodes: [
      {
        id: "mdx-1",
        excerpt: "Resumen de App 1",
        parent: { modifiedTime: "2024-01-10T00:00:00.000Z" },
      },
      {
        id: "mdx-2",
        excerpt: "Resumen de App 2",
        parent: { modifiedTime: "2024-02-01T00:00:00.000Z" },
      },
      {
        id: "mdx-3",
        excerpt: "Resumen de Nota 1",
        parent: { modifiedTime: "2024-03-01T00:00:00.000Z" },
      },
      {
        id: "mdx-4",
        excerpt: "Resumen de Sin Fecha",
        parent: { modifiedTime: "2024-06-01T00:00:00.000Z" },
      },
    ],
  },
}

describe("PagesList", () => {
  beforeEach(() => {
    mockedUseStaticQuery.mockReturnValue(mockPagesData)
  })

  it("renders a list element", () => {
    const { container } = render(<PagesList tags={["proyectos"]} />)
    expect(container.querySelector("ul")).toBeInTheDocument()
  })

  it("renders pages that match the given tags", async () => {
    render(<PagesList tags={["proyectos"]} />)
    expect(await screen.findByText("App 1")).toBeInTheDocument()
    expect(await screen.findByText("App 2")).toBeInTheDocument()
  })

  it("excludes pages that do not match the given tags", async () => {
    render(<PagesList tags={["proyectos"]} />)
    expect(screen.queryByText("Nota 1")).not.toBeInTheDocument()
  })

  it("renders links for each page", async () => {
    render(<PagesList tags={["proyectos"]} />)
    expect(
      await screen.findByRole("link", { name: "App 1" })
    ).toHaveAttribute("href", "/proyectos/app-1/")
  })

  describe("excludeTags", () => {
    it("excludes pages that have any of the excluded tags", async () => {
      render(<PagesList tags={["proyectos"]} excludeTags={["wip"]} />)
      expect(await screen.findByText("App 1")).toBeInTheDocument()
      expect(screen.queryByText("Sin Fecha")).not.toBeInTheDocument()
    })

    it("shows all matching pages when excludeTags is empty", async () => {
      render(<PagesList tags={["proyectos"]} excludeTags={[]} />)
      expect(await screen.findByText("App 1")).toBeInTheDocument()
      expect(await screen.findByText("Sin Fecha")).toBeInTheDocument()
    })
  })

  describe("showTags", () => {
    it("does not render tags by default", async () => {
      render(<PagesList tags={["proyectos"]} />)
      await screen.findByText("App 1")
      expect(screen.queryByText("react")).not.toBeInTheDocument()
    })

    it("renders tags when showTags is true", async () => {
      render(<PagesList tags={["proyectos"]} showTags />)
      expect(await screen.findByText("react")).toBeInTheDocument()
      expect(await screen.findByText("gatsby")).toBeInTheDocument()
    })
  })

  describe("showSummary", () => {
    it("does not render excerpt by default", async () => {
      render(<PagesList tags={["proyectos"]} />)
      await screen.findByText("App 1")
      expect(screen.queryByText("Resumen de App 1")).not.toBeInTheDocument()
    })

    it("renders excerpt when showSummary is true", async () => {
      render(<PagesList tags={["proyectos"]} showSummary />)
      expect(await screen.findByText("Resumen de App 1")).toBeInTheDocument()
      expect(await screen.findByText("Resumen de App 2")).toBeInTheDocument()
    })
  })

  describe("ordering", () => {
    it("shows pages without date before pages with date when modifiedTime is more recent", async () => {
      render(<PagesList tags={["proyectos"]} />)
      const links = await screen.findAllByRole("link")
      const titles = links.map(l => l.textContent)
      expect(titles.indexOf("Sin Fecha")).toBeLessThan(titles.indexOf("App 2"))
      expect(titles.indexOf("Sin Fecha")).toBeLessThan(titles.indexOf("App 1"))
    })
  })

  it("should have no accessibility violations", async () => {
    const { container } = render(<PagesList tags={["proyectos"]} />)
    expect(await axe(container)).toHaveNoViolations()
  })

  it("should have no accessibility violations with showTags and showSummary", async () => {
    const { container } = render(
      <PagesList tags={["proyectos"]} showTags showSummary />
    )
    expect(await axe(container)).toHaveNoViolations()
  })
})
