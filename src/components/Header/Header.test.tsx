import React from "react"
import { render, screen } from "@testing-library/react"
import { axe } from "jest-axe"
import Header from "./Header"

jest.mock("@reach/router", () => ({
  useLocation: jest.fn(() => ({ pathname: "/" })),
}))

describe("Header", () => {
  it("renders a header element", () => {
    const { container } = render(<Header />)
    expect(container.querySelector("header")).toBeInTheDocument()
  })

  it("renders the navigation menu inside the header", () => {
    const { container } = render(<Header />)
    expect(container.querySelector("nav")).toBeInTheDocument()
  })

  it("passes back prop to the inner Menu", () => {
    render(<Header back="/anterior/" />)
    expect(screen.getByRole("link", { name: "volver" })).toHaveAttribute(
      "href",
      "/anterior/"
    )
  })

  it("should have no accessibility violations", async () => {
    const { container } = render(<Header />)
    expect(await axe(container)).toHaveNoViolations()
  })
})
