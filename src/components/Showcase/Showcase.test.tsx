import React from "react"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { axe } from "jest-axe"
import { useStaticQuery, navigate } from "gatsby"
import { useLocation } from "@reach/router"
import Showcase from "./Showcase"

const mockedUseStaticQuery = useStaticQuery as jest.Mock
const mockedUseLocation = useLocation as jest.Mock
const mockedNavigate = navigate as jest.Mock

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
      {
        id: "3",
        internal: {
          contentFilePath: "/home/user/site/src/i-like/libros/libro-2.mdx",
        },
        frontmatter: {
          title: "Libro dos",
          tags: ["libros", "tecnología"],
          image: null,
        },
      },
    ],
  },
}

describe("Showcase", () => {
  beforeEach(() => {
    mockedUseStaticQuery.mockReturnValue(mockShowcaseData)
    mockedUseLocation.mockReturnValue({
      pathname: "/i-like",
      search: "",
    })
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

  it("updates URL with cat param when a category is selected", async () => {
    render(<Showcase />)
    await userEvent.click(screen.getByRole("checkbox", { name: "libros" }))
    expect(mockedNavigate).toHaveBeenCalledWith("/i-like?cat=libros", { replace: true })
  })

  it("removes cat param from URL when same category is clicked again", async () => {
    mockedUseLocation.mockReturnValue({
      pathname: "/i-like",
      search: "?cat=libros",
    })
    render(<Showcase />)
    await userEvent.click(screen.getByRole("checkbox", { name: "libros" }))
    expect(mockedNavigate).toHaveBeenCalledWith("/i-like?", { replace: true })
  })

  it("pre-selects category from cat query param", async () => {
    mockedUseLocation.mockReturnValue({
      pathname: "/i-like",
      search: "?cat=podcasts",
    })
    render(<Showcase />)
    expect(await screen.findByAltText("Podcast uno")).toBeInTheDocument()
    expect(screen.queryByAltText("Libro uno")).not.toBeInTheDocument()
    expect(screen.getByRole("checkbox", { name: "podcasts" })).toBeChecked()
  })

  it("resets selected tag when category changes", async () => {
    render(<Showcase />)
    // select "libros" category — shows "Libro uno" (novela) and "Libro dos" (tecnología)
    await userEvent.click(screen.getByRole("checkbox", { name: "libros" }))
    // select "tecnología" tag — only "Libro dos" should show
    await userEvent.click(screen.getByRole("checkbox", { name: "tecnología" }))
    expect(screen.queryByAltText("Libro uno")).not.toBeInTheDocument()
    expect(await screen.findByAltText("Libro dos")).toBeInTheDocument()
    // change category — tag should reset, all items in new category visible
    await userEvent.click(screen.getByRole("checkbox", { name: "podcasts" }))
    expect(await screen.findByAltText("Podcast uno")).toBeInTheDocument()
    expect(screen.queryByAltText("Libro dos")).not.toBeInTheDocument()
    expect(screen.getByRole("checkbox", { name: "tecnología" })).not.toBeChecked()
  })

  it("should have no accessibility violations", async () => {
    const { container } = render(<Showcase />)
    expect(await axe(container)).toHaveNoViolations()
  })
})
