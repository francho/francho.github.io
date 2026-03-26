import React from "react"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { axe } from "jest-axe"
import Tag from "./Tag"

describe("Tag", () => {
  const defaultProps = {
    tag: "javascript",
    onClick: jest.fn(),
    selected: false,
  }

  it("renders the tag label", () => {
    render(<Tag {...defaultProps} />)
    expect(screen.getByLabelText("javascript")).toBeInTheDocument()
  })

  it("renders an unchecked checkbox when selected is false", () => {
    render(<Tag {...defaultProps} selected={false} />)
    expect(screen.getByRole("checkbox")).not.toBeChecked()
  })

  it("renders a checked checkbox when selected is true", () => {
    render(<Tag {...defaultProps} selected={true} />)
    expect(screen.getByRole("checkbox")).toBeChecked()
  })

  it("calls onClick when the checkbox changes", async () => {
    const onClick = jest.fn()
    render(<Tag {...defaultProps} onClick={onClick} />)
    await userEvent.click(screen.getByRole("checkbox"))
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it("should have no accessibility violations", async () => {
    const { container } = render(<Tag {...defaultProps} />)
    expect(await axe(container)).toHaveNoViolations()
  })
})
