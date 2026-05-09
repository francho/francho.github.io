import React from "react"
import { render } from "@testing-library/react"
import { axe } from "jest-axe"
import RssPlayer from "./RssPlayer"

describe("RssPlayer", () => {
  const url = "https://example.com/episode.mp3"

  it("renders an audio element", () => {
    const { container } = render(<RssPlayer url={url} />)
    expect(container.querySelector("audio")).toBeInTheDocument()
  })

  it("source src matches the provided url", () => {
    const { container } = render(<RssPlayer url={url} />)
    expect(container.querySelector("source")).toHaveAttribute("src", url)
  })

  it("aria-label uses the provided title", () => {
    const { container } = render(<RssPlayer url={url} title="Mi episodio" />)
    expect(container.querySelector("audio")?.getAttribute("aria-label")).toBe("Mi episodio")
  })

  it("aria-label falls back to default when title is omitted", () => {
    const { container } = render(<RssPlayer url={url} />)
    expect(container.querySelector("audio")?.getAttribute("aria-label")).toBe("Episodio de podcast")
  })

  it("has no axe violations", async () => {
    const { container } = render(<RssPlayer url={url} title="Episodio" />)
    expect(await axe(container)).toHaveNoViolations()
  }, 30000)
})
