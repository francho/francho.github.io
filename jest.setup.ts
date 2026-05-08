import "@testing-library/jest-dom"
import { toHaveNoViolations } from "jest-axe"

expect.extend(toHaveNoViolations)

// Mock matchMedia for all tests since ThemeToggle is used in Menu component
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
})

