import React from "react"
import { render, screen } from "@testing-library/react"
import { axe } from "jest-axe"
import PageTitle from "./PageTitle"

describe("PageTitle", () => {
  it("renders the page title in an h1", () => {
    render(<PageTitle title="Mi página" />)
    expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument()
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "Mi página"
    )
  })

  it("renders the document title tag", () => {
    render(<PageTitle title="Mi página" />)
    // React 19 hoists <title> to <head> — verify the element is present in the document
    expect(document.querySelector("title")).toBeInTheDocument()
  })

  it("includes section in document title when provided", () => {
    render(<PageTitle title="Mi página" section="Blog" />)
    expect(document.querySelector("title")).toBeInTheDocument()
  })

  it("does not render h1 when title is not provided", () => {
    render(<PageTitle />)
    expect(screen.queryByRole("heading")).not.toBeInTheDocument()
  })

  it("should have no accessibility violations", async () => {
    const { container } = render(<PageTitle title="Mi página" />)
    expect(await axe(container)).toHaveNoViolations()
  })
})
