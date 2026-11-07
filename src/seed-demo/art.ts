import sharp from "sharp";

const FONT = "Helvetica Neue, Helvetica, Arial, sans-serif";

const escape = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

function wrap(text: string, maxChars: number) {
  const lines: string[] = [];
  let line = "";
  for (const word of text.split(" ")) {
    if ((line + " " + word).trim().length > maxChars && line) {
      lines.push(line);
      line = word;
    } else {
      line = (line + " " + word).trim();
    }
  }
  if (line) lines.push(line);
  return lines;
}

// Deterministic per-title variety without randomness between runs.
const hash = (s: string) =>
  [...s].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7);

function pattern(kind: number, color: string) {
  switch (kind % 4) {
    case 0: // dots
      return Array.from({ length: 5 }, (_, r) =>
        Array.from({ length: 9 }, (_, c) =>
          `<circle cx="${70 + c * 108}" cy="${70 + r * 40}" r="9" fill="#000" opacity="0.85"/>`
        ).join("")
      ).join("") +
        `<circle cx="840" cy="760" r="70" fill="#fff" stroke="#000" stroke-width="8"/>`;
    case 1: // stripes
      return Array.from({ length: 7 }, (_, i) =>
        `<rect x="${-40 + i * 160}" y="20" width="60" height="220" fill="#000" transform="skewX(-20)"/>`
      ).join("") +
        `<rect x="660" y="700" width="280" height="120" fill="#fff" stroke="#000" stroke-width="8"/>`;
    case 2: // circles
      return `<circle cx="180" cy="150" r="130" fill="#fff" stroke="#000" stroke-width="8"/>
        <circle cx="330" cy="120" r="80" fill="#000"/>
        <rect x="700" y="690" width="240" height="140" rx="70" fill="#000"/>`;
    default: // grid
      return Array.from({ length: 11 }, (_, i) =>
        `<line x1="${i * 100}" y1="0" x2="${i * 100}" y2="1000" stroke="#000" stroke-width="2" opacity="0.25"/>
         <line x1="0" y1="${i * 100}" x2="1000" y2="${i * 100}" stroke="#000" stroke-width="2" opacity="0.25"/>`
      ).join("") +
        `<polygon points="80,260 260,60 440,260" fill="#fff" stroke="#000" stroke-width="8"/>`;
  }
}

/**
 * A square, neo-brutalist product cover. The title sits in the middle band so
 * it survives the 3.9:1 crop used on the product page banner.
 */
export async function productCover(opts: {
  title: string;
  store: string;
  label: string;
  color: string;
}) {
  const { title, store, label, color } = opts;
  const lines = wrap(title, 18);
  const size = lines.length >= 3 ? 72 : lines.length === 2 ? 84 : 92;
  const lineHeight = size * 1.05;
  const top = 500 - ((lines.length - 1) * lineHeight) / 2 + size * 0.35;

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="1000">
    <rect width="1000" height="1000" fill="${color}"/>
    ${pattern(hash(title), color)}
    <rect x="60" y="${500 - 150}" width="880" height="300" fill="#fff" stroke="#000" stroke-width="8"/>
    <rect x="76" y="${500 + 150}" width="880" height="16" fill="#000"/>
    <rect x="940" y="${500 - 134}" width="16" height="300" fill="#000"/>
    ${lines
      .map(
        (l, i) =>
          `<text x="500" y="${top + i * lineHeight}" text-anchor="middle" font-family="${FONT}" font-weight="800" font-size="${size}" fill="#000">${escape(l)}</text>`
      )
      .join("")}
    <rect x="60" y="880" width="${48 + label.length * 22}" height="64" fill="#000"/>
    <text x="84" y="924" font-family="${FONT}" font-weight="700" font-size="34" fill="#fff">${escape(label.toUpperCase())}</text>
    <rect x="${940 - 48 - store.length * 19}" y="880" width="${48 + store.length * 19}" height="64" fill="#fff" stroke="#000" stroke-width="6"/>
    <text x="916" y="924" text-anchor="end" font-family="${FONT}" font-weight="700" font-size="34" fill="#000">${escape(store)}</text>
  </svg>`;

  return sharp(Buffer.from(svg)).webp({ quality: 82 }).toBuffer();
}

export async function avatar(opts: { initials: string; color: string }) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256">
    <rect width="256" height="256" fill="${opts.color}"/>
    <circle cx="128" cy="128" r="100" fill="#fff" stroke="#000" stroke-width="10"/>
    <text x="128" y="160" text-anchor="middle" font-family="${FONT}" font-weight="800" font-size="92" fill="#000">${escape(opts.initials)}</text>
  </svg>`;
  return sharp(Buffer.from(svg)).webp({ quality: 85 }).toBuffer();
}
