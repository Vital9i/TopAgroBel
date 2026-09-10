/**
 * Replace site-header + #mobile-menu on all HTML pages with the unified pattern.
 * Run: node scripts/apply-site-header.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  renderSiteHeaderAndMobile,
  SERVICE_LABEL_BY_SLUG,
} from "./site-header.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");

const SKIP_DIRS = new Set(["node_modules", ".git", "assets", "css", "js", "api"]);

/**
 * @param {string} dir
 * @returns {string[]}
 */
function walkHtml(dir) {
  /** @type {string[]} */
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith(".")) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (SKIP_DIRS.has(entry.name)) continue;
      out.push(...walkHtml(full));
      continue;
    }
    if (entry.isFile() && entry.name.endsWith(".html")) out.push(full);
  }
  return out;
}

/**
 * Find end index (exclusive) of an element starting at `start` that opens with `<div`.
 * Walks nested div open/close tags.
 * @param {string} html
 * @param {number} start
 */
function findBalancedDivEnd(html, start) {
  const openRe = /<div\b[^>]*>/gi;
  const closeRe = /<\/div>/gi;
  openRe.lastIndex = start;
  const first = openRe.exec(html);
  if (!first || first.index !== start) {
    throw new Error("Expected <div at start offset");
  }
  let depth = 1;
  let pos = first.index + first[0].length;
  while (depth > 0 && pos < html.length) {
    openRe.lastIndex = pos;
    closeRe.lastIndex = pos;
    const nextOpen = openRe.exec(html);
    const nextClose = closeRe.exec(html);
    if (!nextClose) throw new Error("Unclosed div while scanning mobile menu");
    if (nextOpen && nextOpen.index < nextClose.index) {
      depth += 1;
      pos = nextOpen.index + nextOpen[0].length;
    } else {
      depth -= 1;
      pos = nextClose.index + nextClose[0].length;
    }
  }
  return pos;
}

/**
 * @param {string} html
 * @returns {{ start: number; end: number } | null}
 */
function findHeaderMobileRange(html) {
  const headerMatch = html.match(/<header\s+class=["']site-header["'][^>]*>/i);
  if (!headerMatch || headerMatch.index == null) return null;
  const start = headerMatch.index;

  const afterHeader = html.slice(start);
  const mobileMatch = afterHeader.match(
    /<div\s+class=["']nav-mobile["'][^>]*\bid=["']mobile-menu["'][^>]*>/i,
  );
  if (!mobileMatch || mobileMatch.index == null) {
    // try id before class
    const alt = afterHeader.match(
      /<div\s+id=["']mobile-menu["'][^>]*class=["'][^"']*nav-mobile[^"']*["'][^>]*>/i,
    );
    if (!alt || alt.index == null) return null;
    const mobileStart = start + alt.index;
    const end = findBalancedDivEnd(html, mobileStart);
    return { start, end };
  }
  const mobileStart = start + mobileMatch.index;
  const end = findBalancedDivEnd(html, mobileStart);
  return { start, end };
}

/**
 * @param {string} relPosix
 */
function classifyPage(relPosix) {
  const file = path.posix.basename(relPosix);
  const dir = path.posix.dirname(relPosix);

  if (file === "thank-you.html") {
    return { skip: true, reason: "thank-you" };
  }

  /** @type {'root' | 'uslugi' | 'subdir'} */
  let depth = "subdir";
  if (dir === ".") depth = "root";
  else if (dir === "uslugi") depth = "uslugi";

  /** @type {'home' | 'uslugi' | 'o-kompanii' | 'blog' | null} */
  let active = null;
  /** @type {string | null} */
  let trailLabel = null;
  /** @type {string | null} */
  let trailSlug = null;
  /** @type {'single' | 'dual'} */
  let phonesMode = "single";

  if (relPosix === "index.html") {
    active = "home";
    phonesMode = "dual";
  } else if (relPosix === "uslugi/index.html") {
    active = "uslugi";
    trailLabel = "Все услуги";
    trailSlug = null;
  } else if (dir === "uslugi" && file.endsWith(".html")) {
    const slug = file.replace(/\.html$/i, "");
    const label = SERVICE_LABEL_BY_SLUG.get(slug);
    active = "uslugi";
    if (label) {
      trailLabel = label;
      trailSlug = slug;
    } else {
      // Unknown service page: trail from title-ish slug, still mark uslugi active
      trailLabel = slug;
      trailSlug = slug;
    }
  } else if (dir === "o-kompanii" || relPosix.startsWith("o-kompanii/")) {
    active = "o-kompanii";
  } else if (dir === "blog" || relPosix.startsWith("blog/")) {
    active = "blog";
  } else {
    // kontakty, partnery, rekvizity, sertifikaty, seo-sitemap — no forced active, no trail
    active = null;
  }

  return { skip: false, depth, active, trailLabel, trailSlug, phonesMode };
}

function main() {
  const files = walkHtml(ROOT);
  /** @type {string[]} */
  const updated = [];
  /** @type {string[]} */
  const skipped = [];
  /** @type {string[]} */
  const failed = [];
  /** @type {string[]} */
  const unchanged = [];

  for (const abs of files) {
    const rel = path.relative(ROOT, abs).split(path.sep).join("/");
    let html;
    try {
      html = fs.readFileSync(abs, "utf8");
    } catch (err) {
      failed.push(`${rel}: read error ${err}`);
      continue;
    }

    if (!/class=["']site-header["']/.test(html)) {
      skipped.push(`${rel}: no site-header`);
      continue;
    }

    const meta = classifyPage(rel);
    if (meta.skip) {
      skipped.push(`${rel}: ${meta.reason}`);
      continue;
    }

    let range;
    try {
      range = findHeaderMobileRange(html);
    } catch (err) {
      failed.push(`${rel}: parse error ${err}`);
      continue;
    }
    if (!range) {
      failed.push(`${rel}: could not locate header + #mobile-menu`);
      continue;
    }

    const replacement = renderSiteHeaderAndMobile({
      depth: meta.depth,
      active: meta.active,
      trailLabel: meta.trailLabel,
      trailSlug: meta.trailSlug,
      phonesMode: meta.phonesMode,
    });

    const next =
      html.slice(0, range.start) + replacement + html.slice(range.end);
    if (next === html) {
      unchanged.push(rel);
      continue;
    }
    fs.writeFileSync(abs, next, "utf8");
    updated.push(rel);
  }

  console.log(`Updated: ${updated.length}`);
  for (const f of updated) console.log(`  + ${f}`);
  console.log(`Unchanged: ${unchanged.length}`);
  for (const f of unchanged) console.log(`  = ${f}`);
  console.log(`Skipped: ${skipped.length}`);
  for (const f of skipped) console.log(`  - ${f}`);
  console.log(`Failed: ${failed.length}`);
  for (const f of failed) console.log(`  ! ${f}`);
}

main();
