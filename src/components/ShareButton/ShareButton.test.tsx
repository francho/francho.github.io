import React from "react"
import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { axe } from "jest-axe"
import ShareButton from "./ShareButton"

describe("ShareButton", () => {
  let mockShare: jest.Mock
  let mockWriteText: jest.Mock

  beforeEach(() => {
    // Mock navigator.share
    mockShare = jest.fn()
    Object.defineProperty(navigator, "share", {
      writable: true,
      configurable: true,
      value: mockShare,
    })

    // Mock clipboard API
    mockWriteText = jest.fn().mockResolvedValue(undefined)
    Object.defineProperty(navigator, "clipboard", {
      writable: true,
      configurable: true,
      value: {
        writeText: mockWriteText,
      },
    })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it("renders the share button", async () => {
    render(<ShareButton title="Test Title" />)

    await waitFor(() => {
      expect(screen.getByRole("button", { name: "Compartir esta página" })).toBeInTheDocument()
    })
  })

  it("displays title text by default", async () => {
    render(<ShareButton title="Test Title" />)

    await waitFor(() => {
      expect(screen.getByText("Test Title")).toBeInTheDocument()
    })
  })

  it("renders after client-side mounting", async () => {
    const { container } = render(<ShareButton title="Test Title" />)
    
    // Wait for the component to render after useEffect
    await waitFor(() => {
      expect(container.firstChild).toBeInTheDocument()
      expect(screen.getByText("Test Title")).toBeInTheDocument()
    })
  })

  it("calls navigator.share when Web Share API is available", async () => {
    mockShare.mockResolvedValue(undefined)
    
    render(<ShareButton title="Test Title" url="https://test.com/page" />)

    await waitFor(() => {
      expect(screen.getByText("Test Title")).toBeInTheDocument()
    })

    const button = screen.getByRole("button", { name: "Compartir esta página" })
    fireEvent.click(button)

    await waitFor(() => {
      expect(mockShare).toHaveBeenCalledWith({
        url: "https://test.com/page",
      })
    })
  })

  it("uses custom URL when provided", async () => {
    mockShare.mockResolvedValue(undefined)
    
    render(<ShareButton title="Test Title" url="https://custom.url/page" />)

    await waitFor(() => {
      expect(screen.getByText("Test Title")).toBeInTheDocument()
    })

    const button = screen.getByRole("button", { name: "Compartir esta página" })
    fireEvent.click(button)

    await waitFor(() => {
      expect(mockShare).toHaveBeenCalledWith({
        url: "https://custom.url/page",
      })
    })
  })

  it("falls back to clipboard when navigator.share is not available", async () => {
    // Remove navigator.share
    Object.defineProperty(navigator, "share", {
      writable: true,
      configurable: true,
      value: undefined,
    })

    render(<ShareButton title="Test Title" url="https://test.com/page" />)

    await waitFor(() => {
      expect(screen.getByText("Test Title")).toBeInTheDocument()
    })

    const button = screen.getByRole("button", { name: "Compartir esta página" })
    fireEvent.click(button)

    await waitFor(() => {
      expect(mockWriteText).toHaveBeenCalledWith("https://test.com/page")
    })
  })

  it("shows 'Copiado' message after copying to clipboard", async () => {
    // Remove navigator.share
    Object.defineProperty(navigator, "share", {
      writable: true,
      configurable: true,
      value: undefined,
    })

    render(<ShareButton title="Test Title" url="https://test.com/page" />)

    await waitFor(() => {
      expect(screen.getByText("Test Title")).toBeInTheDocument()
    })

    const button = screen.getByRole("button", { name: "Compartir esta página" })
    fireEvent.click(button)

    await waitFor(() => {
      expect(screen.getByText("Copiado")).toBeInTheDocument()
    })
  })

  it("handles user cancellation (AbortError) gracefully", async () => {
    const abortError = new Error("User cancelled")
    abortError.name = "AbortError"
    mockShare.mockRejectedValue(abortError)
    
    render(<ShareButton title="Test Title" url="https://test.com/page" />)

    await waitFor(() => {
      expect(screen.getByText("Test Title")).toBeInTheDocument()
    })

    const button = screen.getByRole("button", { name: "Compartir esta página" })
    fireEvent.click(button)

    await waitFor(() => {
      // Should not fall back to clipboard on user cancellation
      expect(mockWriteText).not.toHaveBeenCalled()
    })
  })

  it("falls back to clipboard on share error", async () => {
    const error = new Error("Share failed")
    error.name = "ShareError"
    mockShare.mockRejectedValue(error)
    
    render(<ShareButton title="Test Title" url="https://test.com/page" />)

    await waitFor(() => {
      expect(screen.getByText("Test Title")).toBeInTheDocument()
    })

    const button = screen.getByRole("button", { name: "Compartir esta página" })
    fireEvent.click(button)

    await waitFor(() => {
      expect(mockWriteText).toHaveBeenCalledWith("https://test.com/page")
    })
  })

  it("should have no accessibility violations", async () => {
    const { container } = render(<ShareButton title="Test Title" />)
    
    await waitFor(() => {
      expect(screen.getByText("Test Title")).toBeInTheDocument()
    })

    expect(await axe(container)).toHaveNoViolations()
  })
})
