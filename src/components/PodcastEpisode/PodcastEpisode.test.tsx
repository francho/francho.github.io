import React from "react"
import { render, screen, fireEvent, act } from "@testing-library/react"
import { axe } from "jest-axe"
import PodcastEpisode, { detectPlatform } from "./PodcastEpisode"

// Mock navigator.share and clipboard
const mockShare = jest.fn()
const mockWriteText = jest.fn()

beforeEach(() => {
  jest.clearAllMocks()
  Object.defineProperty(navigator, 'share', {
    value: undefined,
    configurable: true,
    writable: true,
  })
  Object.defineProperty(navigator, 'clipboard', {
    value: { writeText: mockWriteText },
    configurable: true,
    writable: true,
  })
})

describe("detectPlatform", () => {
  it("detects spotify", () => {
    expect(detectPlatform("https://open.spotify.com/episode/abc123")).toBe("spotify")
  })

  it("detects pocket-casts via pocketcasts.com", () => {
    expect(detectPlatform("https://pocketcasts.com/episode/xyz")).toBe("pocket-casts")
  })

  it("detects pocket-casts via pca.st shortlink", () => {
    expect(detectPlatform("https://pca.st/episode/xyz")).toBe("pocket-casts")
  })

  it("detects ivoox", () => {
    expect(detectPlatform("https://www.ivoox.com/episodio_rf_12345678_1.html")).toBe("ivoox")
  })

  it("detects rss from mp3 URL", () => {
    expect(detectPlatform("https://example.com/episode.mp3")).toBe("rss")
  })

  it("detects rss from m4a URL", () => {
    expect(detectPlatform("https://example.com/episode.m4a")).toBe("rss")
  })

  it("throws for unsupported URL", () => {
    expect(() => detectPlatform("https://unsupported.com/episode")).toThrow(
      "URL de podcast no soportada"
    )
  })
})

describe("PodcastEpisode", () => {
  describe("Spotify", () => {
    const spotifyUrl = "https://open.spotify.com/episode/abc123"

    it("renders play button", () => {
      render(<PodcastEpisode url={spotifyUrl} />)
      expect(screen.getByRole("button", { name: /reproducir/i })).toBeInTheDocument()
    })

    it("does NOT render iframe initially", () => {
      const { container } = render(<PodcastEpisode url={spotifyUrl} />)
      expect(container.querySelector("iframe")).not.toBeInTheDocument()
    })

    it("renders spotify player (iframe) after clicking play", () => {
      const { container } = render(<PodcastEpisode url={spotifyUrl} />)
      fireEvent.click(screen.getByRole("button", { name: /reproducir/i }))
      expect(container.querySelector("iframe")).toBeInTheDocument()
    })

    it("hides iframe after clicking play twice", () => {
      const { container } = render(<PodcastEpisode url={spotifyUrl} />)
      fireEvent.click(screen.getByRole("button", { name: /reproducir/i }))
      fireEvent.click(screen.getByRole("button", { name: /ocultar/i }))
      expect(container.querySelector("iframe")).not.toBeInTheDocument()
    })

    it("renders link to open in Spotify", () => {
      render(<PodcastEpisode url={spotifyUrl} />)
      expect(screen.getByText(/escuchar en spotify/i)).toBeInTheDocument()
    })

    it("renders share button", () => {
      render(<PodcastEpisode url={spotifyUrl} />)
      expect(screen.getByRole("button", { name: /compartir/i })).toBeInTheDocument()
    })
  })

  describe("Pocket Casts", () => {
    const pocketCastsUrl = "https://pocketcasts.com/episode/xyz"

    it("renders play button as a link (no embed available)", () => {
      render(<PodcastEpisode url={pocketCastsUrl} />)
      const playLink = screen.getByRole("link", { name: /escuchar episodio/i })
      expect(playLink).toHaveAttribute("href", pocketCastsUrl)
    })

    it("does NOT render iframe", () => {
      const { container } = render(<PodcastEpisode url={pocketCastsUrl} />)
      expect(container.querySelector("iframe")).not.toBeInTheDocument()
    })

    it("does NOT render audio player", () => {
      const { container } = render(<PodcastEpisode url={pocketCastsUrl} />)
      expect(container.querySelector("audio")).not.toBeInTheDocument()
    })

    it("renders link to open in Pocket Casts", () => {
      render(<PodcastEpisode url={pocketCastsUrl} />)
      expect(screen.getByText(/escuchar en pocket casts/i)).toBeInTheDocument()
    })

    it("renders share button", () => {
      render(<PodcastEpisode url={pocketCastsUrl} />)
      expect(screen.getByRole("button", { name: /compartir/i })).toBeInTheDocument()
    })
  })

  describe("iVoox", () => {
    const ivooxUrl = "https://www.ivoox.com/episodio-ejemplo_rf_12345678_1.html"

    it("renders play button", () => {
      render(<PodcastEpisode url={ivooxUrl} />)
      expect(screen.getByRole("button", { name: /reproducir/i })).toBeInTheDocument()
    })

    it("does NOT render iframe initially", () => {
      const { container } = render(<PodcastEpisode url={ivooxUrl} />)
      expect(container.querySelector("iframe")).not.toBeInTheDocument()
    })

    it("renders ivoox player (iframe) after clicking play", () => {
      const { container } = render(<PodcastEpisode url={ivooxUrl} />)
      fireEvent.click(screen.getByRole("button", { name: /reproducir/i }))
      expect(container.querySelector("iframe")).toBeInTheDocument()
    })

    it("renders link to open in iVoox", () => {
      render(<PodcastEpisode url={ivooxUrl} />)
      expect(screen.getByText(/escuchar en ivoox/i)).toBeInTheDocument()
    })

    it("renders share button", () => {
      render(<PodcastEpisode url={ivooxUrl} />)
      expect(screen.getByRole("button", { name: /compartir/i })).toBeInTheDocument()
    })
  })

  describe("RSS", () => {
    const rssUrl = "https://example.com/ep.mp3"

    it("renders play button", () => {
      render(<PodcastEpisode url={rssUrl} />)
      expect(screen.getByRole("button", { name: /reproducir/i })).toBeInTheDocument()
    })

    it("does NOT render audio player initially", () => {
      const { container } = render(<PodcastEpisode url={rssUrl} />)
      expect(container.querySelector("audio")).not.toBeInTheDocument()
    })

    it("renders rss player (audio) after clicking play", () => {
      const { container } = render(<PodcastEpisode url={rssUrl} />)
      fireEvent.click(screen.getByRole("button", { name: /reproducir/i }))
      expect(container.querySelector("audio")).toBeInTheDocument()
    })

    it("renders download link", () => {
      render(<PodcastEpisode url={rssUrl} />)
      expect(screen.getByText(/descargar episodio/i)).toBeInTheDocument()
    })

    it("renders share button", () => {
      render(<PodcastEpisode url={rssUrl} />)
      expect(screen.getByRole("button", { name: /compartir/i })).toBeInTheDocument()
    })
  })

  describe("unsupported URL", () => {
    it("throws an error for unsupported URL", () => {
      const consoleError = jest.spyOn(console, "error").mockImplementation(() => {})
      expect(() =>
        render(<PodcastEpisode url="https://unsupported.com/episode" />)
      ).toThrow("URL de podcast no soportada")
      consoleError.mockRestore()
    })
  })

  describe("title prop", () => {
    it("renders title when provided", () => {
      render(
        <PodcastEpisode url="https://open.spotify.com/episode/abc123" title="Mi episodio favorito" />
      )
      expect(screen.getByText("Mi episodio favorito")).toBeInTheDocument()
    })

    it("does not render title element when omitted", () => {
      const { container } = render(
        <PodcastEpisode url="https://open.spotify.com/episode/abc123" />
      )
      expect(container.querySelector("p")).not.toBeInTheDocument()
    })
  })

  describe("share button", () => {
    it("uses Web Share API when available", async () => {
      Object.defineProperty(navigator, 'share', { value: mockShare, configurable: true })
      mockShare.mockResolvedValueOnce(undefined)

      render(
        <PodcastEpisode url="https://open.spotify.com/episode/abc123" title="Episodio" />
      )
      fireEvent.click(screen.getByRole("button", { name: /compartir/i }))

      expect(mockShare).toHaveBeenCalledWith(
        expect.objectContaining({ url: "https://open.spotify.com/episode/abc123" })
      )
    })

    it("falls back to clipboard when Web Share API is unavailable", async () => {
      const pocketCastsUrl = "https://pocketcasts.com/episode/xyz"
      mockWriteText.mockResolvedValueOnce(undefined)

      render(<PodcastEpisode url={pocketCastsUrl} />)
      await act(async () => {
        fireEvent.click(screen.getByRole("button", { name: /compartir/i }))
      })

      expect(mockWriteText).toHaveBeenCalledWith(pocketCastsUrl)
    })
  })

  describe("accessibility", () => {
    it("spotify player has no axe violations", async () => {
      const { container } = render(
        <PodcastEpisode url="https://open.spotify.com/episode/abc123" title="Episodio" />
      )
      expect(await axe(container)).toHaveNoViolations()
    })

    it("pocket-casts player has no axe violations", async () => {
      const { container } = render(
        <PodcastEpisode url="https://pocketcasts.com/episode/xyz" />
      )
      expect(await axe(container)).toHaveNoViolations()
    })

    it("ivoox player has no axe violations", async () => {
      const { container } = render(
        <PodcastEpisode url="https://www.ivoox.com/episodio_rf_12345678_1.html" title="Episodio" />
      )
      expect(await axe(container)).toHaveNoViolations()
    })

    it("rss player has no axe violations", async () => {
      const { container } = render(
        <PodcastEpisode url="https://example.com/ep.mp3" title="Episodio" />
      )
      expect(await axe(container)).toHaveNoViolations()
    }, 30000)
  })
})
