import React from "react"
import { render, screen } from "@testing-library/react"
import { axe } from "jest-axe"
import { useStaticQuery } from "gatsby"
import Gif from "./Gif"

const mockedUseStaticQuery = useStaticQuery as jest.Mock

const mockGifData = {
  allFile: {
    nodes: [
      { name: "celebration", publicURL: "/static/celebration.gif" },
      { name: "hello_world", publicURL: "/static/hello_world.gif" },
    ],
  },
}

describe("Gif", () => {
  beforeEach(() => {
    mockedUseStaticQuery.mockReturnValue(mockGifData)
  })

  it("renders an img element when the gif is found", () => {
    render(<Gif name="celebration" />)
    expect(screen.getByRole("img")).toBeInTheDocument()
    expect(screen.getByRole("img")).toHaveAttribute(
      "src",
      "/static/celebration.gif"
    )
  })

  it("sets alt text derived from the gif name", () => {
    render(<Gif name="hello_world" />)
    expect(screen.getByRole("img")).toHaveAttribute("alt", "hello world")
  })

  it("strips .gif extension from the name", () => {
    render(<Gif name="celebration.gif" />)
    expect(screen.getByRole("img")).toBeInTheDocument()
  })

  it("renders nothing when the gif is not found", () => {
    const { container } = render(<Gif name="nonexistent" />)
    expect(container.firstChild).toBeNull()
  })

  it("should have no accessibility violations", async () => {
    const { container } = render(<Gif name="celebration" />)
    expect(await axe(container)).toHaveNoViolations()
  })
})
