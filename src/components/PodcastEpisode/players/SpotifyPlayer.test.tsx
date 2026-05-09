import React from "react"
import { render } from "@testing-library/react"
import { axe } from "jest-axe"
import SpotifyPlayer, { getSpotifyId } from "./SpotifyPlayer"

describe("getSpotifyId", () => {
  it("extracts ID from a standard Spotify episode URL", () => {
    expect(getSpotifyId("https://open.spotify.com/episode/abc123XYZ")).toBe("abc123XYZ")
  })

  it("throws for an invalid Spotify URL", () => {
    expect(() => getSpotifyId("https://open.spotify.com/track/abc123")).toThrow(
      "URL de Spotify no válida"
    )
  })
})

describe("SpotifyPlayer", () => {
  const url = "https://open.spotify.com/episode/abc123"

  it("renders an iframe", () => {
    const { container } = render(<SpotifyPlayer url={url} />)
    expect(container.querySelector("iframe")).toBeInTheDocument()
  })

  it("embed src contains the correct episode ID", () => {
    const { container } = render(<SpotifyPlayer url={url} />)
    expect(container.querySelector("iframe")?.src).toContain(
      "open.spotify.com/embed/episode/abc123"
    )
  })

  it("iframe title uses the provided title", () => {
    const { container } = render(<SpotifyPlayer url={url} title="Mi episodio" />)
    expect(container.querySelector("iframe")?.title).toBe("Mi episodio")
  })

  it("iframe title falls back to default when title is omitted", () => {
    const { container } = render(<SpotifyPlayer url={url} />)
    expect(container.querySelector("iframe")?.title).toBe("Episodio de Spotify")
  })

  it("has no axe violations", async () => {
    const { container } = render(<SpotifyPlayer url={url} title="Episodio" />)
    expect(await axe(container)).toHaveNoViolations()
  })
})
