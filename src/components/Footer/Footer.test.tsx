import React from "react"
import { render, screen } from "@testing-library/react"
import { axe } from "jest-axe"
import Footer from "./Footer"

describe("Footer", () => {
  it("renders footer element", () => {
    const { container } = render(<Footer />)
    expect(container.querySelector("footer")).toBeInTheDocument()
  })

  it("renders Creative Commons license link", () => {
    render(<Footer />)
    expect(
      screen.getByRole("link", { name: /Creative Commons/i })
    ).toBeInTheDocument()
  })

  it("does not show update date when no date prop", () => {
    render(<Footer />)
    expect(screen.queryByText(/Actualizada en/)).not.toBeInTheDocument()
  })

  it("shows update date when date prop is provided", () => {
    render(<Footer date="2024-03-15" />)
    expect(screen.getByText(/Actualizada en/)).toBeInTheDocument()
  })

  it("formats the update date in Spanish", () => {
    render(<Footer date="2024-03-15" />)
    expect(screen.getByText(/marzo/i)).toBeInTheDocument()
    expect(screen.getByText(/2024/)).toBeInTheDocument()
  })

  it("should have no accessibility violations", async () => {
    const { container } = render(<Footer date="2024-03-15" />)
    expect(await axe(container)).toHaveNoViolations()
  })
})
