import React from "react"
import { render } from "@testing-library/react"
import { axe } from "jest-axe"
import IvooxPlayer, { getIvooxId } from "./IvooxPlayer"

describe("getIvooxId", () => {
  it("extracts ID from a standard iVoox episode URL", () => {
    expect(getIvooxId("https://www.ivoox.com/episodio_rf_41770851_1.html")).toBe("41770851")
  })

  it("throws for an invalid iVoox URL", () => {
    expect(() => getIvooxId("https://www.ivoox.com/podcast")).toThrow(
      "URL de iVoox no válida"
    )
  })
})

describe("IvooxPlayer", () => {
  const url = "https://www.ivoox.com/episodio-ejemplo_rf_12345678_1.html"

  it("renders an iframe", () => {
    const { container } = render(<IvooxPlayer url={url} />)
    expect(container.querySelector("iframe")).toBeInTheDocument()
  })

  it("embed src contains the correct episode ID", () => {
    const { container } = render(<IvooxPlayer url={url} />)
    expect(container.querySelector("iframe")?.src).toContain(
      "ivoox.com/player_ej_12345678_6_1.html"
    )
  })

  it("iframe title uses the provided title", () => {
    const { container } = render(<IvooxPlayer url={url} title="Mi episodio" />)
    expect(container.querySelector("iframe")?.title).toBe("Mi episodio")
  })

  it("iframe title falls back to default when title is omitted", () => {
    const { container } = render(<IvooxPlayer url={url} />)
    expect(container.querySelector("iframe")?.title).toBe("Episodio de iVoox")
  })

  it("has no axe violations", async () => {
    const { container } = render(<IvooxPlayer url={url} title="Episodio" />)
    expect(await axe(container)).toHaveNoViolations()
  })
})
