import React from "react"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { axe } from "jest-axe"
import Filter from "./Filter"

const mockNodes = [
  {
    id: "1",
    frontmatter: { tags: ["novela", "ficción", "libros"] },
  },
  {
    id: "2",
    frontmatter: { tags: ["tecnología", "libros"] },
  },
  {
    id: "3",
    frontmatter: { tags: ["novela", "libros"] },
  },
] as unknown as Parameters<typeof Filter>[0]["nodes"]

const mockPodcastNodes = [
  {
    id: "4",
    frontmatter: { tags: ["entrevistas", "podcasts"] },
  },
  {
    id: "5",
    frontmatter: { tags: ["tecnología", "podcasts"] },
  },
] as unknown as Parameters<typeof Filter>[0]["nodes"]

describe("Filter", () => {
  it("renders unique non-category tags", () => {
    render(<Filter nodes={mockNodes} selectedTag="" onTagSelected={jest.fn()} />)
    expect(screen.getByLabelText("novela")).toBeInTheDocument()
    expect(screen.getByLabelText("ficción")).toBeInTheDocument()
    expect(screen.getByLabelText("tecnología")).toBeInTheDocument()
  })

  it("does not render category tags", () => {
    render(<Filter nodes={mockNodes} selectedTag="" onTagSelected={jest.fn()} />)
    expect(screen.queryByLabelText("libros")).not.toBeInTheDocument()
  })

  it("only shows tags present in the provided nodes", () => {
    render(<Filter nodes={mockPodcastNodes} selectedTag="" onTagSelected={jest.fn()} />)
    expect(screen.getByLabelText("entrevistas")).toBeInTheDocument()
    expect(screen.getByLabelText("tecnología")).toBeInTheDocument()
    expect(screen.queryByLabelText("novela")).not.toBeInTheDocument()
    expect(screen.queryByLabelText("ficción")).not.toBeInTheDocument()
  })

  it("reflects the selectedTag prop as checked", () => {
    render(<Filter nodes={mockNodes} selectedTag="novela" onTagSelected={jest.fn()} />)
    expect(screen.getByRole("checkbox", { name: "novela" })).toBeChecked()
    expect(screen.getByRole("checkbox", { name: "tecnología" })).not.toBeChecked()
  })

  it("calls onTagSelected with the tag when clicked", async () => {
    const onTagSelected = jest.fn()
    render(<Filter nodes={mockNodes} selectedTag="" onTagSelected={onTagSelected} />)
    await userEvent.click(screen.getByRole("checkbox", { name: "novela" }))
    expect(onTagSelected).toHaveBeenCalledWith("novela")
  })

  it("deselects the tag when clicked again", async () => {
    const onTagSelected = jest.fn()
    render(<Filter nodes={mockNodes} selectedTag="novela" onTagSelected={onTagSelected} />)
    await userEvent.click(screen.getByRole("checkbox", { name: "novela" }))
    expect(onTagSelected).toHaveBeenLastCalledWith("")
  })

  it("should have no accessibility violations", async () => {
    const { container } = render(
      <Filter nodes={mockNodes} selectedTag="" onTagSelected={jest.fn()} />
    )
    expect(await axe(container)).toHaveNoViolations()
  })
})
