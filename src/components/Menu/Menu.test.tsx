import React from "react"
import { render, screen } from "@testing-library/react"
import { axe } from "jest-axe"
import { useLocation } from "@reach/router"
import Menu from "./Menu"

jest.mock("@reach/router", () => ({
  useLocation: jest.fn(() => ({ pathname: "/" })),
}))

const mockedUseLocation = useLocation as jest.Mock

describe("Menu", () => {
  beforeEach(() => {
    mockedUseLocation.mockReturnValue({ pathname: "/" })
  })

  it("renders a nav element", () => {
    const { container } = render(<Menu />)
    expect(container.querySelector("nav")).toBeInTheDocument()
  })

  it("renders all navigation options", () => {
    render(<Menu />)
    expect(screen.getByText("Hola")).toBeInTheDocument()
    expect(screen.getByText("Ahora")).toBeInTheDocument()
    expect(screen.getByText("Lo que uso")).toBeInTheDocument()
    expect(screen.getByText("Me gusta")).toBeInTheDocument()
  })

  it("renders the back link when back prop is provided", () => {
    render(<Menu back="/pagina-anterior/" />)
    expect(screen.getByRole("link", { name: "volver" })).toBeInTheDocument()
    expect(screen.getByRole("link", { name: "volver" })).toHaveAttribute(
      "href",
      "/pagina-anterior/"
    )
  })

  it("does not render back link when back prop is not provided", () => {
    render(<Menu />)
    expect(screen.queryByRole("link", { name: "volver" })).not.toBeInTheDocument()
  })

  it("shows a toggle checkbox for the menu when JS is available", () => {
    render(<Menu />)
    expect(
      screen.getByRole("checkbox", { name: "Abrir menú" })
    ).toBeInTheDocument()
  })

  it("should have no accessibility violations", async () => {
    const { container } = render(<Menu />)
    expect(await axe(container)).toHaveNoViolations()
  })
})
