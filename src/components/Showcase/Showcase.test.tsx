import React from "react"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { axe } from "jest-axe"
import { useStaticQuery } from "gatsby"
import Showcase from "./Showcase"

const mockedUseStaticQuery = useStaticQuery as jest.Mock

const mockShowcaseData = {
  allMdx: {
    nodes: [
      {
        id: "1",
        internal: {
          contentFilePath: "/home/user/site/src/i-like/libros/libro-1.mdx",
        },
        frontmatter: {
          title: "Libro uno",
          tags: ["libros", "novela"],
          image: null,
        },
      },
      {
        id: "2",
        internal: {
          contentFilePath: "/home/user/site/src/i-like/podcasts/podcast-1.mdx",
        },
        frontmatter: {
          title: "Podcast uno",
          tags: ["podcasts", "tecnología"],
          image: null,
        },
      },
    ],
  },
}

describe("Showcase", () => {
  beforeEach(() => {
    mockedUseStaticQuery.mockReturnValue(mockShowcaseData)
  })

  it("renders category filter tags", () => {
    render(<Showcase />)
    expect(screen.getByLabelText("libros")).toBeInTheDocument()
    expect(screen.getByLabelText("podcasts")).toBeInTheDocument()
    expect(screen.getByLabelText("series")).toBeInTheDocument()
    expect(screen.getByLabelText("películas")).toBeInTheDocument()
    expect(screen.getByLabelText("documentales")).toBeInTheDocument()
  })

  it("renders all items by default", async () => {
    render(<Showcase />)
    expect(await screen.findByAltText("Libro uno")).toBeInTheDocument()
    expect(await screen.findByAltText("Podcast uno")).toBeInTheDocument()
  })

  it("filters items by category when a category tag is selected", async () => {
    render(<Showcase />)
    await userEvent.click(screen.getByRole("checkbox", { name: "libros" }))
    expect(await screen.findByAltText("Libro uno")).toBeInTheDocument()
    expect(screen.queryByAltText("Podcast uno")).not.toBeInTheDocument()
  })

  it("should have no accessibility violations", async () => {
    const { container } = render(<Showcase />)
    expect(await axe(container)).toHaveNoViolations()
  })
})
