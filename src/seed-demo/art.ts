import sharp from "sharp";

const FONT = "Helvetica Neue, Helvetica, Arial, sans-serif";

const escape = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

// Initials avatar for demo buyers, who have no photo.
export async function avatar(opts: { initials: string; color: string }) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256">
    <rect width="256" height="256" fill="${opts.color}"/>
    <circle cx="128" cy="128" r="100" fill="#fff" stroke="#000" stroke-width="10"/>
    <text x="128" y="160" text-anchor="middle" font-family="${FONT}" font-weight="800" font-size="92" fill="#000">${escape(opts.initials)}</text>
  </svg>`;
  return sharp(Buffer.from(svg)).webp({ quality: 85 }).toBuffer();
}
