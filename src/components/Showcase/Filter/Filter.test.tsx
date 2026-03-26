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

describe("Filter", () => {
  it("renders unique non-category tags", () => {
    render(<Filter nodes={mockNodes} onTagSelected={jest.fn()} />)
    expect(screen.getByLabelText("novela")).toBeInTheDocument()
    expect(screen.getByLabelText("ficción")).toBeInTheDocument()
    expect(screen.getByLabelText("tecnología")).toBeInTheDocument()
  })

  it("does not render category tags", () => {
    render(<Filter nodes={mockNodes} onTagSelected={jest.fn()} />)
    expect(screen.queryByLabelText("libros")).not.toBeInTheDocument()
  })

  it("calls onTagSelected with the tag when clicked", async () => {
    const onTagSelected = jest.fn()
    render(<Filter nodes={mockNodes} onTagSelected={onTagSelected} />)
    await userEvent.click(screen.getByRole("checkbox", { name: "novela" }))
    expect(onTagSelected).toHaveBeenCalledWith("novela")
  })

  it("deselects the tag when clicked again", async () => {
    const onTagSelected = jest.fn()
    render(<Filter nodes={mockNodes} onTagSelected={onTagSelected} />)
    await userEvent.click(screen.getByRole("checkbox", { name: "novela" }))
    await userEvent.click(screen.getByRole("checkbox", { name: "novela" }))
    expect(onTagSelected).toHaveBeenLastCalledWith("")
  })

  it("should have no accessibility violations", async () => {
    const { container } = render(
      <Filter nodes={mockNodes} onTagSelected={jest.fn()} />
    )
    expect(await axe(container)).toHaveNoViolations()
  })
})
