import React, { useEffect, useRef, useCallback } from "react";
import bichon from "./sprites/bichon_strip.png";
import francho from "./sprites/francho_strip.png";
import aussie from "./sprites/aussie_strip.png";

// ─── Types ────────────────────────────────────────────────────────────────────

interface SpriteSheet {
  img: HTMLImageElement;
  frameW: number;
  frameH: number;
  cols: number;
  rows: number;
  totalFrames: number;
  // Per-frame padding from bottom (frameH - visual_bottom_row).
  // Used to anchor each frame so feet always sit on GROUND_LINE.
  frameBottomPad: number[];
}

interface Character {
  sheet: SpriteSheet;
  x: number;
  y: number;
  vy: number;
  frame: number;
  frameTick: number;
  isJumping: boolean;
  scale: number;
}

interface Obstacle {
  x: number;
  y: number;
  w: number;
  h: number;
  type: "rock" | "bush";
  variant: number;
}

interface Mountain {
  x: number;
  y: number;
  w: number;
  h: number;
  layer: number;
}

interface GameState {
  running: boolean;
  started: boolean;
  over: boolean;
  score: number;
  highScore: number;
  speed: number;
  tick: number;
  obstacles: Obstacle[];
  mountains: Mountain[];
  chars: Character[];
  sheets: (SpriteSheet | null)[];
}

// ─── Constants ────────────────────────────────────────────────────────────────

const SPRITE_FILES = [aussie, bichon, francho];

// Visual bottom row of each frame (measured from sprite-frame top).
// New layout: single row of 8 frames. Measured with Pillow.
const SPRITE_BOTTOM_ROWS: number[][] = [
  [386, 412, 414, 417, 220, 216, 223, 200], // aussie  (frameH=425)
  [401, 408, 408, 415, 215, 215, 222, 221], // bichon  (frameH=422)
  [438, 459, 444, 456, 406, 386, 412, 392], // francho (frameH=512)
];

const SPRITE_COLS = 8;
const SPRITE_ROWS = 1;
const GRAVITY = 0.6;
const JUMP_FORCE = -16;
const FRAME_SPEED = 8; // game ticks between animation frames
const CANVAS_W = 900;
const CANVAS_H = 320;
const GROUND_LINE = 252; // Y of the ground surface

const CHAR_SCALES = [0.40, 0.20, 0.48]; // aussie, bichon, francho
const CHAR_X = [150, 200, 60];          

const PALETTE = {
  sky: ["#dce8f5", "#c5d8ee", "#b0c8e3"],
  ground: "#8b7355",
  groundLine: "#6b5535",
  groundDetail: "#9d8464",
  mountainFar: "#b8c9d8",
  mountainMid: "#8fa8b8",
  mountainNear: "#6b8898",
  snow: "#eef4f8",
  text: "#2c1810",
  accent: "#c0392b",
  ui: "#34495e",
};

// ─── Pure helpers (no hooks) ──────────────────────────────────────────────────

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((res, rej) => {
    const img = new Image();
    img.onload = () => res(img);
    img.onerror = () => rej(new Error(`Failed: ${src}`));
    img.src = src;
  });
}

function makeSheet(img: HTMLImageElement, bottomRows: number[]): SpriteSheet {
  const frameW = img.width / SPRITE_COLS;
  const frameH = img.height / SPRITE_ROWS;
  return {
    img, frameW, frameH,
    cols: SPRITE_COLS, rows: SPRITE_ROWS,
    totalFrames: SPRITE_COLS * SPRITE_ROWS,
    frameBottomPad: bottomRows.map((b) => frameH - b),
  };
}

/**
 * Returns the sprite top-left Y so its visual feet sit exactly on GROUND_LINE.
 * Each frame gets its own Y because the visual bottom varies frame-to-frame.
 */
function groundAnchorY(sheet: SpriteSheet, frame: number, scale: number): number {
  const pad = sheet.frameBottomPad[frame] * scale;
  return GROUND_LINE - sheet.frameH * scale + pad;
}

function drawSprite(
  ctx: CanvasRenderingContext2D,
  sheet: SpriteSheet, frame: number,
  dx: number, dy: number, scale: number
) {
  const col = frame % sheet.cols;
  const row = Math.floor(frame / sheet.cols);
  ctx.drawImage(
    sheet.img,
    col * sheet.frameW, row * sheet.frameH, sheet.frameW, sheet.frameH,
    dx, dy, sheet.frameW * scale, sheet.frameH * scale
  );
}

function charHitbox(c: Character) {
  const dw = c.sheet.frameW * c.scale;
  const dh = c.sheet.frameH * c.scale;
  return { x: c.x + dw * 0.22, y: c.y + dh * 0.12, w: dw * 0.55, h: dh * 0.82 };
}

function rectsOverlap(ax: number, ay: number, aw: number, ah: number,
                      bx: number, by: number, bw: number, bh: number) {
  return ax < bx + bw && ax + aw > bx && ay < by + bh && ay + ah > by;
}

function spawnMountains(): Mountain[] {
  const mts: Mountain[] = [];
  for (let x = 0; x < CANVAS_W + 400; x += 220)
    mts.push({ x: x + Math.random() * 80, y: 0, w: 160 + Math.random() * 80, h: 110 + Math.random() * 50, layer: 0 });
  for (let x = 0; x < CANVAS_W + 300; x += 160)
    mts.push({ x: x + Math.random() * 60, y: 0, w: 120 + Math.random() * 60, h: 80 + Math.random() * 40, layer: 1 });
  for (let x = 0; x < CANVAS_W + 200; x += 120)
    mts.push({ x: x + Math.random() * 40, y: 0, w: 90 + Math.random() * 40, h: 60 + Math.random() * 30, layer: 2 });
  return mts;
}

function drawMountain(ctx: CanvasRenderingContext2D, mt: Mountain) {
  const colors = [PALETTE.mountainFar, PALETTE.mountainMid, PALETTE.mountainNear];
  const snowH = [0.3, 0.25, 0.2];
  const baseY = [130, 155, 175];
  const bY = baseY[mt.layer];
  const peakX = mt.x + mt.w / 2;
  const peakY = bY - mt.h;
  ctx.beginPath();
  ctx.moveTo(mt.x, bY); ctx.lineTo(peakX, peakY); ctx.lineTo(mt.x + mt.w, bY);
  ctx.closePath(); ctx.fillStyle = colors[mt.layer]; ctx.fill();
  const sl = peakY + mt.h * snowH[mt.layer];
  const sw = mt.w * snowH[mt.layer] * 0.8;
  ctx.beginPath();
  ctx.moveTo(peakX - sw * 0.5, sl); ctx.lineTo(peakX, peakY); ctx.lineTo(peakX + sw * 0.5, sl);
  ctx.closePath(); ctx.fillStyle = PALETTE.snow; ctx.fill();
}

function drawRock(ctx: CanvasRenderingContext2D, { x, y, w, h, variant }: Obstacle) {
  const c = ["#7a6a5a", "#8a7a6a", "#6a5a4a"];
  if (variant === 0) {
    ctx.beginPath(); ctx.ellipse(x + w / 2, y + h * 0.6, w * 0.5, h * 0.45, -0.1, 0, Math.PI * 2);
    ctx.fillStyle = c[0]; ctx.fill();
    ctx.beginPath(); ctx.ellipse(x + w * 0.35, y + h * 0.35, w * 0.25, h * 0.2, -0.3, 0, Math.PI * 2);
    ctx.fillStyle = "#9a8a7a"; ctx.fill();
  } else if (variant === 1) {
    ctx.beginPath(); ctx.ellipse(x + w * 0.35, y + h * 0.65, w * 0.35, h * 0.38, 0, 0, Math.PI * 2);
    ctx.fillStyle = c[0]; ctx.fill();
    ctx.beginPath(); ctx.ellipse(x + w * 0.72, y + h * 0.75, w * 0.28, h * 0.28, 0.2, 0, Math.PI * 2);
    ctx.fillStyle = c[2]; ctx.fill();
  } else {
    [[0.2, 0.7, 0.22, 0.32], [0.5, 0.65, 0.28, 0.38], [0.8, 0.78, 0.2, 0.25]].forEach(([rx, ry, rw, rh], i) => {
      ctx.beginPath(); ctx.ellipse(x + w * rx, y + h * ry, w * rw, h * rh, 0, 0, Math.PI * 2);
      ctx.fillStyle = c[i % 3]; ctx.fill();
    });
  }
}

function drawBush(ctx: CanvasRenderingContext2D, { x, y, w, h, variant }: Obstacle) {
  const g = ["#2d6a2d", "#3a8a3a", "#1e4d1e", "#4aaa4a"];
  const clusters = variant === 0 ? [[0.5, 0.5, 0.5], [0.2, 0.7, 0.35], [0.8, 0.7, 0.35]]
    : variant === 1 ? [[0.3, 0.5, 0.42], [0.7, 0.5, 0.42], [0.5, 0.3, 0.35]]
    : [[0.5, 0.45, 0.55], [0.25, 0.65, 0.38], [0.75, 0.65, 0.38], [0.5, 0.75, 0.3]];
  clusters.forEach(([cx, cy, cr], i) => {
    ctx.beginPath(); ctx.arc(x + w * cx, y + h * cy, w * cr * 0.5, 0, Math.PI * 2);
    ctx.fillStyle = g[i % g.length]; ctx.fill();
  });
}

function makeObstacle(): Obstacle {
  // const type: "rock" | "bush" = Math.random() < 0.5 ? "rock" : "bush";
  
  const type = "rock";
  const w = type === "rock" ? 20 + Math.random() * 30 : 50 + Math.random() * 40;
  const h = type === "rock" ? 10 + Math.random() * 20 : 40 + Math.random() * 30;
  return { x: CANVAS_W + 50, y: GROUND_LINE - h, w, h, type, variant: Math.floor(Math.random() * 3) };
}

// ─── Component ────────────────────────────────────────────────────────────────

const NotFoundGame: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef<GameState>({
    running: false, started: false, over: false,
    score: 0, highScore: 0, speed: 5, tick: 0,
    obstacles: [], mountains: spawnMountains(),
    chars: [], sheets: [null, null, null],
  });
  const rafRef = useRef<number>(0);
  const loadedRef = useRef(false);

  function buildChar(sheet: SpriteSheet, i: number): Character {
    const scale = CHAR_SCALES[i];
    const y = groundAnchorY(sheet, 0, scale);
    return { sheet, x: CHAR_X[i], y, vy: 0, frame: 0, frameTick: 0, isJumping: false, scale };
  }

  // ── Render scene ─────────────────────────────────────────────────────────────
  function renderScene(ctx: CanvasRenderingContext2D, gs: GameState) {
    const skyGrad = ctx.createLinearGradient(0, 0, 0, CANVAS_H);
    skyGrad.addColorStop(0, PALETTE.sky[0]);
    skyGrad.addColorStop(0.6, PALETTE.sky[1]);
    skyGrad.addColorStop(1, PALETTE.sky[2]);
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

    [0, 1, 2].forEach((layer) =>
      gs.mountains.filter((m) => m.layer === layer).forEach((mt) => drawMountain(ctx, mt))
    );

    ctx.fillStyle = PALETTE.ground;
    ctx.fillRect(0, GROUND_LINE, CANVAS_W, CANVAS_H - GROUND_LINE);
    ctx.fillStyle = PALETTE.groundLine;
    ctx.fillRect(0, GROUND_LINE, CANVAS_W, 3);
    ctx.fillStyle = PALETTE.groundDetail;
    const off = (gs.tick * 2) % 40;
    for (let gx = -off; gx < CANVAS_W; gx += 40) {
      ctx.fillRect(gx, GROUND_LINE + 8, 3, 2);
      ctx.fillRect(gx + 20, GROUND_LINE + 18, 2, 2);
    }

    gs.obstacles.forEach((ob) => ob.type === "rock" ? drawRock(ctx, ob) : drawBush(ctx, ob));
    gs.chars.forEach((c) => { if (c.sheet) drawSprite(ctx, c.sheet, c.frame, c.x, c.y, c.scale); });
  }

  function drawHUD(ctx: CanvasRenderingContext2D, score: number, hi: number) {
    ctx.font = "bold 14px 'Courier New', monospace";
    ctx.textAlign = "right";
    ctx.fillStyle = PALETTE.ui;
    ctx.fillText(`HI ${String(hi).padStart(5, "0")}`, CANVAS_W - 12, 26);
    ctx.fillStyle = PALETTE.text;
    ctx.fillText(String(score).padStart(5, "0"), CANVAS_W - 12, 46);
    ctx.textAlign = "left";
  }

  function drawPrompt(ctx: CanvasRenderingContext2D, over: boolean, started: boolean) {
    ctx.textAlign = "center";
    if (over) {
      ctx.font = "bold 28px 'Courier New', monospace";
      ctx.fillStyle = PALETTE.accent;
      ctx.fillText("GAME OVER", CANVAS_W / 2, CANVAS_H / 2 - 20);
      ctx.font = "15px 'Courier New', monospace";
      ctx.fillStyle = PALETTE.ui;
      ctx.fillText("Pulsa ESPACIO o toca para reiniciar", CANVAS_W / 2, CANVAS_H / 2 + 14);
    } else if (!started) {
      ctx.font = "15px 'Courier New', monospace";
      ctx.fillStyle = PALETTE.ui;
      ctx.fillText("Pulsa ESPACIO o toca para empezar", CANVAS_W / 2, CANVAS_H / 2 - 16);
    }
    ctx.textAlign = "left";
  }

  // ── Loop factory ──────────────────────────────────────────────────────────────
  const startLoop = useCallback((mode: "idle" | "game") => {
    cancelAnimationFrame(rafRef.current);

    const tick = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      const gs = stateRef.current;

      gs.tick++;

      if (mode === "game") {
        gs.score = Math.floor(gs.tick / 6);
        gs.speed = 5 + Math.floor(gs.score / 200) * 0.5;
      }

      // Animate characters
      gs.chars.forEach((c) => {
        c.frameTick++;
        if (c.frameTick >= FRAME_SPEED) {
          c.frameTick = 0;
          c.frame = (c.frame + 1) % c.sheet.totalFrames;
        }

        if (mode === "idle") {
          // Lock Y to ground every frame — no jumping on idle screen
          c.y = groundAnchorY(c.sheet, c.frame, c.scale);
        } else {
          // Physics
          if (c.isJumping) {
            c.vy += GRAVITY;
            c.y += c.vy;
            const gY = groundAnchorY(c.sheet, c.frame, c.scale);
            if (c.y >= gY) { c.y = gY; c.vy = 0; c.isJumping = false; }
          } else {
            // Keep locked to ground when not jumping
            c.y = groundAnchorY(c.sheet, c.frame, c.scale);
          }
        }
      });

      if (mode === "game") {
        // Parallax mountains
        const sp = [gs.speed * 0.15, gs.speed * 0.3, gs.speed * 0.55];
        gs.mountains.forEach((mt) => {
          mt.x -= sp[mt.layer];
          if (mt.x + mt.w < 0) mt.x += CANVAS_W + mt.w + 50;
        });

        // Obstacles
        gs.obstacles.forEach((ob) => { ob.x -= gs.speed; });
        gs.obstacles = gs.obstacles.filter((ob) => ob.x + ob.w > -20);
        const last = gs.obstacles[gs.obstacles.length - 1];
        const gap = Math.max(280, 500 - gs.score * 0.3);
        if (!last || last.x < CANVAS_W - gap - Math.random() * 200)
          gs.obstacles.push(makeObstacle());

        // Collision (francho = index 2)
        const leader = gs.chars[2];
        if (leader) {
          const hb = charHitbox(leader);
          for (const ob of gs.obstacles) {
            if (rectsOverlap(hb.x, hb.y, hb.w, hb.h, ob.x, ob.y, ob.w, ob.h)) {
              endGame();
              return;
            }
          }
        }
      }

      renderScene(ctx, gs);
      drawHUD(ctx, gs.score, gs.highScore);
      if (mode === "idle") drawPrompt(ctx, gs.over, gs.started);

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
  }, []);

  const endGame = useCallback(() => {
    const gs = stateRef.current;
    gs.running = false;
    gs.over = true;
    if (gs.score > gs.highScore) gs.highScore = gs.score;
    gs.tick = 0; // reset tick so ground texture doesn't jump
    startLoop("idle");
  }, [startLoop]);

  // ── Load ──────────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (loadedRef.current) return;
    loadedRef.current = true;

    Promise.all(SPRITE_FILES.map(loadImage))
      .then((imgs) => {
        const gs = stateRef.current;
        gs.sheets = imgs.map((img, i) => makeSheet(img, SPRITE_BOTTOM_ROWS[i]));
        gs.chars = (gs.sheets as SpriteSheet[]).map(buildChar);
        startLoop("idle");
      })
      .catch(console.error);

    return () => cancelAnimationFrame(rafRef.current);
  }, [startLoop]);

  // ── Input ─────────────────────────────────────────────────────────────────────
  const jump = useCallback(() => {
    const gs = stateRef.current;

    if (!gs.running) {
      // Start or restart game
      if (!gs.sheets[0]) return;
      cancelAnimationFrame(rafRef.current);
      gs.running = true;
      gs.started = true;
      gs.over = false;
      gs.score = 0;
      gs.speed = 5;
      gs.tick = 0;
      gs.obstacles = [];
      gs.mountains = spawnMountains();
      gs.chars = (gs.sheets as SpriteSheet[]).map(buildChar);
      startLoop("game");
      return;
    }

    gs.chars.forEach((c) => {
      if (!c.isJumping) { c.isJumping = true; c.vy = JUMP_FORCE; }
    });
  }, [startLoop]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code === "Space" || e.code === "ArrowUp") { e.preventDefault(); jump(); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [jump]);

  return (
    <div
      style={{
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        fontFamily: "'Courier New', monospace", userSelect: "none",
      }}
    >
      <div
        style={{ position: "relative", overflow: "hidden", cursor: "pointer" }}
        onClick={jump}
      >
        <canvas
          ref={canvasRef}
          width={CANVAS_W}
          height={CANVAS_H}
          style={{ display: "block", maxWidth: "100vw" }}
        />
      </div>
      <div style={{ marginTop: 16, color: "#4a5568", fontSize: 12, letterSpacing: 2, textTransform: "uppercase" }}>
        Espacio / ↑ / Toca para saltar
      </div>
    </div>
  );
};

export default NotFoundGame;