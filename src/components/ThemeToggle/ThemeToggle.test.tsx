import React from "react"
import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { axe } from "jest-axe"
import ThemeToggle from "./ThemeToggle"

const mockMatchMedia = (matches = false) => {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: jest.fn().mockImplementation((query) => ({
      matches,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  })
}

describe("ThemeToggle", () => {
  beforeEach(() => {
    localStorage.clear()
    document.documentElement.removeAttribute("data-theme")
    mockMatchMedia(false)
  })

  it("renders three theme buttons", async () => {
    render(<ThemeToggle />)

    await waitFor(() => {
      expect(screen.getByRole("button", { name: "Tema claro" })).toBeInTheDocument()
      expect(screen.getByRole("button", { name: "Tema del sistema" })).toBeInTheDocument()
      expect(screen.getByRole("button", { name: "Tema oscuro" })).toBeInTheDocument()
    })
  })

  it("defaults to system theme when no preference is stored", async () => {
    render(<ThemeToggle />)

    await waitFor(() => {
      const systemButton = screen.getByRole("button", { name: "Tema del sistema" })
      expect(systemButton).toHaveAttribute("aria-pressed", "true")
    })
  })

  it("applies stored theme preference from localStorage", async () => {
    localStorage.setItem("theme-preference", "dark")

    render(<ThemeToggle />)

    await waitFor(() => {
      const darkButton = screen.getByRole("button", { name: "Tema oscuro" })
      expect(darkButton).toHaveAttribute("aria-pressed", "true")
    })
  })

  it("changes theme when a button is clicked", async () => {
    render(<ThemeToggle />)

    await waitFor(() => {
      expect(screen.getByRole("button", { name: "Tema claro" })).toBeInTheDocument()
    })

    const lightButton = screen.getByRole("button", { name: "Tema claro" })
    fireEvent.click(lightButton)

    await waitFor(() => {
      expect(lightButton).toHaveAttribute("aria-pressed", "true")
      expect(localStorage.getItem("theme-preference")).toBe("light")
      expect(document.documentElement.getAttribute("data-theme")).toBe("light")
    })
  })

  it("saves theme preference to localStorage", async () => {
    render(<ThemeToggle />)

    await waitFor(() => {
      expect(screen.getByRole("button", { name: "Tema oscuro" })).toBeInTheDocument()
    })

    const darkButton = screen.getByRole("button", { name: "Tema oscuro" })
    fireEvent.click(darkButton)

    await waitFor(() => {
      expect(localStorage.getItem("theme-preference")).toBe("dark")
    })
  })

  it("applies data-theme attribute to document element", async () => {
    render(<ThemeToggle />)

    await waitFor(() => {
      expect(screen.getByRole("button", { name: "Tema oscuro" })).toBeInTheDocument()
    })

    const darkButton = screen.getByRole("button", { name: "Tema oscuro" })
    fireEvent.click(darkButton)

    await waitFor(() => {
      expect(document.documentElement.getAttribute("data-theme")).toBe("dark")
    })
  })

  it("has no accessibility violations", async () => {
    const { container } = render(<ThemeToggle />)

    await waitFor(() => {
      expect(screen.getByRole("button", { name: "Tema claro" })).toBeInTheDocument()
    })

    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  it("applies system theme when system button is selected", async () => {
    // Mock matchMedia to return dark theme
    mockMatchMedia(true)

    render(<ThemeToggle />)

    await waitFor(() => {
      expect(screen.getByRole("button", { name: "Tema del sistema" })).toBeInTheDocument()
    })

    const systemButton = screen.getByRole("button", { name: "Tema del sistema" })
    fireEvent.click(systemButton)

    await waitFor(() => {
      expect(localStorage.getItem("theme-preference")).toBe("system")
      expect(document.documentElement.getAttribute("data-theme")).toBe("dark")
    })
  })
})
