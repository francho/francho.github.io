import React from "react"
import { render, screen } from "@testing-library/react"
import { axe } from "jest-axe"
import PageFooter from "./PageFooter"
import { FooterContentProvider } from "./FooterContext/FooterContext"
import Footer from "./Footer/Footer"

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

  it("should have no accessibility violations", async () => {
    const { container } = render(<PageFooter />)
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
          <PageFooter />
        </FooterContentProvider>
      )
      
      expect(screen.getByText("Disclaimer:")).toBeInTheDocument()
      expect(screen.getByText("Point A")).toBeInTheDocument()
      expect(screen.getByText("Point B")).toBeInTheDocument()
    })

    it("renders date information via Footer component", () => {
      render(
        <FooterContentProvider>
          <Footer>Actualizada en marzo de 2024</Footer>
          <PageFooter />
        </FooterContentProvider>
      )
      
      expect(screen.getByText(/Actualizada en/)).toBeInTheDocument()
      expect(screen.getByText(/marzo/i)).toBeInTheDocument()
      expect(screen.getByText(/2024/)).toBeInTheDocument()
    })

    it("should have no accessibility violations with injected content", async () => {
      const { container } = render(
        <FooterContentProvider>
          <Footer>
            <p><strong>Warning:</strong> Accessible disclaimer</p>
          </Footer>
          <PageFooter />
        </FooterContentProvider>
      )
      
      expect(await axe(container)).toHaveNoViolations()
    })

    it("renders multiple Footer components in reverse order", () => {
      render(
        <FooterContentProvider>
          <Footer>First footer</Footer>
          <Footer>Second footer</Footer>
          <Footer>Third footer</Footer>
          <PageFooter />
        </FooterContentProvider>
      )
      
      // All should be present
      expect(screen.getByText("First footer")).toBeInTheDocument()
      expect(screen.getByText("Second footer")).toBeInTheDocument()
      expect(screen.getByText("Third footer")).toBeInTheDocument()
    })

    it("displays last added Footer first (reverse order)", () => {
      render(
        <FooterContentProvider>
          <Footer>First</Footer>
          <Footer>Second</Footer>
          <Footer>Third</Footer>
          <PageFooter />
        </FooterContentProvider>
      )
      
      // Verify all content is present
      expect(screen.getByText("First")).toBeInTheDocument()
      expect(screen.getByText("Second")).toBeInTheDocument()
      expect(screen.getByText("Third")).toBeInTheDocument()
      
      // Verify order by checking text content position
      const footerText = screen.getByRole("contentinfo").textContent
      const firstIndex = footerText!.indexOf("First")
      const secondIndex = footerText!.indexOf("Second")
      const thirdIndex = footerText!.indexOf("Third")
      
      // Last added should appear first (reverse order)
      expect(thirdIndex).toBeLessThan(secondIndex)
      expect(secondIndex).toBeLessThan(firstIndex)
    })
  })
})
