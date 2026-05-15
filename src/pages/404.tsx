import * as React from "react"
import { Link, HeadFC, PageProps } from "gatsby"
import Game404 from "../components/Game404/Game404"


const NotFoundPage: React.FC<PageProps> = () => {
  return (
    <main style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "100vh",
      fontFamily: "'Courier New', monospace",
      userSelect: "none",
      gap: "2rem",
    }}>
      <div>
        <h1
          style={{
            fontSize: 72,
            fontWeight: 900,
            color: "#e94560",
            letterSpacing: -2,
            lineHeight: 1,
            textShadow: "4px 4px 0 #c0392b, 8px 8px 0 rgba(200,50,50,0.3)",
            animation: "none",
            paddingBottom: 0
          }}
        >
          404
        </h1>
        <div style={{ color: "#8892a4", fontSize: 13, letterSpacing: 4 }}>
          PÁGINA NO ENCONTRADA
        </div>
        </div>
      <Game404 />
      <Link to="/">Volver al inicio</Link>
    </main>
  )
}

export default NotFoundPage

export const Head: HeadFC = () => <title>Not found</title>
