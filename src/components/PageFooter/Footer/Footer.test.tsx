import React from "react"
import { render } from "@testing-library/react"
import { axe } from "jest-axe"
import Footer from "./Footer"
import { FooterContentProvider, useFooterContent } from "../FooterContext/FooterContext"

// Helper component to read context value for testing
const ContextReader = () => {
  const { footerContents } = useFooterContent()
  return (
    <div data-testid="context-content">
      {footerContents.map(item => (
        <div key={item.id}>{item.content}</div>
      ))}
    </div>
  )
}

describe("Footer", () => {
  it("injects text content into context", () => {
    const { getByTestId } = render(
      <FooterContentProvider>
        <Footer>Test footer content</Footer>
        <ContextReader />
      </FooterContentProvider>
    )
    
    expect(getByTestId("context-content")).toHaveTextContent("Test footer content")
  })

  it("injects React elements into context", () => {
    const { getByTestId } = render(
      <FooterContentProvider>
        <Footer>
          <p><strong>Disclaimer:</strong> test content</p>
        </Footer>
        <ContextReader />
      </FooterContentProvider>
    )
    
    const content = getByTestId("context-content")
    expect(content.querySelector("strong")).toHaveTextContent("Disclaimer:")
    expect(content.querySelector("p")).toHaveTextContent("Disclaimer: test content")
  })

  it("injects markdown-like content into context", () => {
    const { getByTestId } = render(
      <FooterContentProvider>
        <Footer>
          <p><strong>Warning:</strong> This is a test</p>
          <ul>
            <li>Point 1</li>
            <li>Point 2</li>
          </ul>
        </Footer>
        <ContextReader />
      </FooterContentProvider>
    )
    
    const content = getByTestId("context-content")
    expect(content.querySelector("ul")).toBeInTheDocument()
    expect(content.querySelectorAll("li")).toHaveLength(2)
  })

  it("clears content when unmounted", () => {
    const { getByTestId, unmount } = render(
      <FooterContentProvider>
        <Footer>Test content</Footer>
        <ContextReader />
      </FooterContentProvider>
    )
    
    expect(getByTestId("context-content")).toHaveTextContent("Test content")
    
    unmount()
    
    const { getByTestId: getByTestId2 } = render(
      <FooterContentProvider>
        <ContextReader />
      </FooterContentProvider>
    )
    
    expect(getByTestId2("context-content")).toBeEmptyDOMElement()
  })

  it("returns null and does not render anything directly", () => {
    const { container } = render(
      <FooterContentProvider>
        <Footer>Test content</Footer>
      </FooterContentProvider>
    )
    
    // Footer itself should not render anything
    expect(container.textContent).toBe("")
  })

  it("should have no accessibility violations", async () => {
    const { container } = render(
      <FooterContentProvider>
        <Footer>
          <p><strong>Disclaimer:</strong> Accessible content</p>
        </Footer>
        <ContextReader />
      </FooterContentProvider>
    )
    
    expect(await axe(container)).toHaveNoViolations()
  })

  describe("multiple Footer components", () => {
    it("stacks multiple footer contents", () => {
      const { getByTestId } = render(
        <FooterContentProvider>
          <Footer>First content</Footer>
          <Footer>Second content</Footer>
          <Footer>Third content</Footer>
          <ContextReader />
        </FooterContentProvider>
      )
      
      const content = getByTestId("context-content")
      expect(content).toHaveTextContent("First content")
      expect(content).toHaveTextContent("Second content")
      expect(content).toHaveTextContent("Third content")
    })

    it("maintains order of multiple footers", () => {
      const { getByTestId } = render(
        <FooterContentProvider>
          <Footer>First</Footer>
          <Footer>Second</Footer>
          <Footer>Third</Footer>
          <ContextReader />
        </FooterContentProvider>
      )
      
      const content = getByTestId("context-content")
      const children = Array.from(content.children)
      expect(children).toHaveLength(3)
      expect(children[0]).toHaveTextContent("First")
      expect(children[1]).toHaveTextContent("Second")
      expect(children[2]).toHaveTextContent("Third")
    })

    it("removes only the unmounted footer content", () => {
      const { getByTestId, rerender } = render(
        <FooterContentProvider>
          <Footer>First</Footer>
          <Footer>Second</Footer>
          <ContextReader />
        </FooterContentProvider>
      )
      
      expect(getByTestId("context-content")).toHaveTextContent("First")
      expect(getByTestId("context-content")).toHaveTextContent("Second")
      
      // Remove second footer
      rerender(
        <FooterContentProvider>
          <Footer>First</Footer>
          <ContextReader />
        </FooterContentProvider>
      )
      
      const content = getByTestId("context-content")
      expect(content).toHaveTextContent("First")
      expect(content).not.toHaveTextContent("Second")
    })
  })
})
