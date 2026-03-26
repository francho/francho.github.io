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
        id: "1",
        path: "/proyectos/app-1/",
        pageContext: {
          frontmatter: {
            title: "App 1",
            tags: ["proyectos", "react"],
            date: "2024-01-15",
          },
        },
      },
      {
        id: "2",
        path: "/proyectos/app-2/",
        pageContext: {
          frontmatter: {
            title: "App 2",
            tags: ["proyectos", "gatsby"],
            date: "2024-02-20",
          },
        },
      },
      {
        id: "3",
        path: "/notas/nota-1/",
        pageContext: {
          frontmatter: {
            title: "Nota 1",
            tags: ["notas"],
            date: "2024-03-01",
          },
        },
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

  it("should have no accessibility violations", async () => {
    const { container } = render(<PagesList tags={["proyectos"]} />)
    expect(await axe(container)).toHaveNoViolations()
  })
})
