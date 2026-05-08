import React from "react"
import { render, screen } from "@testing-library/react"
import { axe } from "jest-axe"
import PageFooter from "./PageFooter"
import { FooterContentProvider } from "./FooterContext"
import Footer from "./Footer"

describe("PageFooter", () => {
  it("renders footer element", () => {
    const { container } = render(<PageFooter />)
    expect(container.querySelector("footer")).toBeInTheDocument()
  })

  it("renders Creative Commons license link", () => {
    render(<PageFooter />)
    expect(
      screen.getByRole("link", { name: /Creative Commons/i })
    ).toBeInTheDocument()
  })

  it("does not show update date when no date prop", () => {
    render(<PageFooter />)
    expect(screen.queryByText(/Actualizada en/)).not.toBeInTheDocument()
  })

  it("shows update date when date prop is provided", () => {
    render(<PageFooter date="2024-03-15" />)
    expect(screen.getByText(/Actualizada en/)).toBeInTheDocument()
  })

  it("formats the update date in Spanish", () => {
    render(<PageFooter date="2024-03-15" />)
    expect(screen.getByText(/marzo/i)).toBeInTheDocument()
    expect(screen.getByText(/2024/)).toBeInTheDocument()
  })

  it("should have no accessibility violations", async () => {
    const { container } = render(<PageFooter date="2024-03-15" />)
    expect(await axe(container)).toHaveNoViolations()
  })

  // Tests for injected content functionality
  describe("with injected content", () => {
    it("renders injected text content before license", () => {
      render(
        <FooterContentProvider>
          <Footer>Custom disclaimer text</Footer>
          <PageFooter />
        </FooterContentProvider>
      )
      
      expect(screen.getByText("Custom disclaimer text")).toBeInTheDocument()
      expect(screen.getByRole("link", { name: /Creative Commons/i })).toBeInTheDocument()
    })

    it("renders injected React elements", () => {
      render(
        <FooterContentProvider>
          <Footer>
            <p><strong>Warning:</strong> Test content</p>
          </Footer>
          <PageFooter />
        </FooterContentProvider>
      )
      
      expect(screen.getByText("Warning:")).toBeInTheDocument()
      expect(screen.getByText(/Test content/)).toBeInTheDocument()
    })

    it("does not render injected content when none is provided", () => {
      const { container } = render(
        <FooterContentProvider>
          <PageFooter />
        </FooterContentProvider>
      )
      
      // Should only show the license, no injected content
      expect(container.querySelector(".injectedContent")).not.toBeInTheDocument()
      expect(screen.getByRole("link", { name: /Creative Commons/i })).toBeInTheDocument()
    })

    it("renders injected markdown-style content", () => {
      render(
        <FooterContentProvider>
          <Footer>
            <p><strong>Disclaimer:</strong> Important info</p>
            <ul>
              <li>Point A</li>
              <li>Point B</li>
            </ul>
          </Footer>
          <PageFooter date="2024-03-15" />
        </FooterContentProvider>
      )
      
      expect(screen.getByText("Disclaimer:")).toBeInTheDocument()
      expect(screen.getByText("Point A")).toBeInTheDocument()
      expect(screen.getByText("Point B")).toBeInTheDocument()
      expect(screen.getByText(/marzo/i)).toBeInTheDocument()
    })

    it("should have no accessibility violations with injected content", async () => {
      const { container } = render(
        <FooterContentProvider>
          <Footer>
            <p><strong>Warning:</strong> Accessible disclaimer</p>
          </Footer>
          <PageFooter date="2024-03-15" />
        </FooterContentProvider>
      )
      
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})
