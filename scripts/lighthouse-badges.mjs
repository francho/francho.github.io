#!/usr/bin/env node
/**
 * Reads a Lighthouse JSON report and writes SVG badges into public/images/.
 * Usage: node scripts/lighthouse-badges.mjs <path-to-lighthouse.json>
 */

import { makeBadge } from "badge-maker";
import { readFileSync, writeFileSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const OUT_DIR = join(ROOT, "public", "images");

const CATEGORIES = [
  { key: "performance", label: "Performance" },
  { key: "accessibility", label: "Accessibility" },
  { key: "best-practices", label: "Best Practices" },
  { key: "seo", label: "SEO" },
];

function scoreColor(score) {
  if (score >= 90) return "#0cce6b"; // green
  if (score >= 50) return "#ffa400"; // orange
  return "#ff4e42"; // red
}

const reportPath = process.argv[2];
if (!reportPath) {
  console.error("Usage: node scripts/lighthouse-badges.mjs <lighthouse.json>");
  process.exit(1);
}

const report = JSON.parse(readFileSync(reportPath, "utf-8"));
mkdirSync(OUT_DIR, { recursive: true });

for (const { key, label } of CATEGORIES) {
  const category = report.categories[key];
  if (!category) {
    console.warn(`Category "${key}" not found in report, skipping.`);
    continue;
  }

  const score = Math.round(category.score * 100);
  const svg = makeBadge({
    label: `Lighthouse ${label}`,
    message: String(score),
    color: scoreColor(score),
    style: "flat",
  });

  const outFile = join(OUT_DIR, `lighthouse-${key}.svg`);
  writeFileSync(outFile, svg);
  console.log(`Written: ${outFile} (score: ${score})`);
}
