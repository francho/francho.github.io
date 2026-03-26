import React from "react"
import { render, screen } from "@testing-library/react"
import { axe } from "jest-axe"
import Section from "./Section"

describe("Section", () => {
  it("renders children", () => {
    render(<Section>contenido de prueba</Section>)
    expect(screen.getByText("contenido de prueba")).toBeInTheDocument()
  })

  it("renders a section element", () => {
    const { container } = render(<Section>contenido</Section>)
    expect(container.querySelector("section")).toBeInTheDocument()
  })

  it("applies type-specific class for type='hello'", () => {
    const { container } = render(<Section type="hello">contenido</Section>)
    const section = container.querySelector("section")
    expect(section).toBeInTheDocument()
    expect(section?.className).toBeTruthy()
  })

  it("applies type-specific class for type='dark'", () => {
    const { container } = render(<Section type="dark">contenido</Section>)
    const section = container.querySelector("section")
    expect(section).toBeInTheDocument()
    expect(section?.className).toBeTruthy()
  })

  it("applies custom className", () => {
    const { container } = render(
      <Section className="custom">contenido</Section>
    )
    const section = container.querySelector("section")
    expect(section?.className).toContain("custom")
  })

  it("should have no accessibility violations", async () => {
    const { container } = render(
      <Section>
        <p>contenido accesible</p>
      </Section>
    )
    expect(await axe(container)).toHaveNoViolations()
  })
})
