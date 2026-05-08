import React, { useState, useEffect } from "react"
import IconSun from "../../images/icons/sun.svg"
import IconMoon from "../../images/icons/moon.svg"
import IconSystem from "../../images/icons/system.svg"
import * as styles from "./ThemeToggle.module.css"

type Theme = "light" | "dark" | "system"

const STORAGE_KEY = "theme-preference"

const getSystemTheme = (): "light" | "dark" => {
  if (typeof window === "undefined") return "light"
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light"
}

const getStoredTheme = (): Theme => {
  if (typeof window === "undefined") return "system"
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored === "light" || stored === "dark" || stored === "system") {
    return stored
  }
  return "system"
}

const applyTheme = (theme: Theme): void => {
  if (typeof document === "undefined") return

  const effectiveTheme = theme === "system" ? getSystemTheme() : theme
  document.documentElement.setAttribute("data-theme", effectiveTheme)
}

const ThemeToggle: React.FC = () => {
  const [theme, setTheme] = useState<Theme>("system")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const storedTheme = getStoredTheme()
    setTheme(storedTheme)
    applyTheme(storedTheme)
  }, [])

  useEffect(() => {
    if (!mounted) return

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
    const handleChange = () => {
      if (theme === "system") {
        applyTheme("system")
      }
    }

    mediaQuery.addEventListener("change", handleChange)
    return () => mediaQuery.removeEventListener("change", handleChange)
  }, [theme, mounted])

  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme)
    localStorage.setItem(STORAGE_KEY, newTheme)
    applyTheme(newTheme)
  }

  if (!mounted) {
    return null
  }

  return (
    <div className={styles.themeToggle} role="group" aria-label="Selector de tema">
      <button
        type="button"
        className={`${styles.button} ${theme === "light" ? styles.active : ""}`}
        onClick={() => handleThemeChange("light")}
        aria-label="Tema claro"
        aria-pressed={theme === "light"}
      >
        <IconSun />
      </button>
      <button
        type="button"
        className={`${styles.button} ${theme === "system" ? styles.active : ""}`}
        onClick={() => handleThemeChange("system")}
        aria-label="Tema del sistema"
        aria-pressed={theme === "system"}
      >
        <IconSystem />
      </button>
      <button
        type="button"
        className={`${styles.button} ${theme === "dark" ? styles.active : ""}`}
        onClick={() => handleThemeChange("dark")}
        aria-label="Tema oscuro"
        aria-pressed={theme === "dark"}
      >
        <IconMoon />
      </button>
    </div>
  )
}

export default ThemeToggle
