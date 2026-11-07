import sharp from "sharp";

/**
 * Original abstract artwork for demo products and stores: soft gradient-mesh
 * blobs, film grain and one modern accent shape (glass panel, rings, orb,
 * waves, grid or arcs). Deterministic: the same key always draws the same
 * image.
 */

export const PALETTES = {
  aurora: ["#0B1026", "#5B5BF7", "#B66DFF", "#FF7AC6", "#7CE7FF"],
  sunset: ["#1A0B12", "#FF6B3D", "#FF9F6E", "#FFD29D", "#C2457B"],
  lagoon: ["#04161C", "#00C2A8", "#2D7FF9", "#9BF6E3", "#1E3A8A"],
  citrus: ["#121608", "#C6F432", "#5EE6A8", "#FFE45C", "#1F9D6B"],
  blush: ["#FFF4F1", "#FFB4C6", "#FF8FA3", "#FFD6A5", "#CDB4FF"],
  ocean: ["#020B1F", "#1E40FF", "#00B7FF", "#7DD3FC", "#6366F1"],
  ember: ["#140A06", "#FF4D1C", "#FF9E1B", "#FFCF70", "#8B1E3F"],
  mint: ["#F2FFF8", "#7EF0C4", "#A7F3D0", "#93C5FD", "#C4B5FD"],
  dusk: ["#0E0A1F", "#7C3AED", "#F472B6", "#FB923C", "#38BDF8"],
  sand: ["#FBF6EE", "#F4C095", "#E7A977", "#B9D8C2", "#8FB8DE"],
} as const;

export type PaletteName = keyof typeof PALETTES;

const STYLES = ["glass", "shapes", "rings", "orb", "waves", "grid", "arcs", "shapes", "glass"] as const;
const FONT = "Helvetica Neue, Helvetica, Arial, sans-serif";

// Small seeded PRNG (mulberry32).
function rng(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const hash = (s: string) =>
  [...s].reduce((h, c) => Math.imul(h ^ c.charCodeAt(0), 16777619) >>> 0, 2166136261);

const isLight = (hex: string) => {
  const n = parseInt(hex.slice(1), 16);
  return ((n >> 16) * 299 + ((n >> 8) & 255) * 587 + (n & 255) * 114) / 1000 > 160;
};

function accent(style: (typeof STYLES)[number], r: () => number, W: number, H: number, ink: string, palette: readonly string[]) {
  const cx = W * (0.35 + r() * 0.3);
  const cy = H * (0.35 + r() * 0.3);
  switch (style) {
    case "glass": {
      const w = W * 0.42, h = H * 0.5;
      const x = cx - w / 2, y = cy - h / 2;
      return `<g transform="rotate(${(-12 + r() * 24).toFixed(1)} ${cx} ${cy})">
        <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="36" fill="#ffffff" fill-opacity="0.16" stroke="#ffffff" stroke-opacity="0.55" stroke-width="2"/>
        <rect x="${x + 36}" y="${y + 40}" width="${w * 0.45}" height="14" rx="7" fill="#ffffff" fill-opacity="0.75"/>
        <rect x="${x + 36}" y="${y + 70}" width="${w * 0.3}" height="10" rx="5" fill="#ffffff" fill-opacity="0.45"/>
        <circle cx="${x + w - 60}" cy="${y + h - 60}" r="26" fill="#ffffff" fill-opacity="0.6"/>
      </g>`;
    }
    case "shapes": {
      // Crisp glossy shapes floating over the blur.
      const g = (id: string, a: string, b: string) =>
        `<linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient>`;
      const [c1, c2, c3, c4] = palette.slice(1);
      const s1 = H * (0.2 + r() * 0.06);
      return `<defs>${g("s1", "#ffffff", c1!)}${g("s2", c2!, c3!)}${g("s3", c4!, "#ffffff")}
          <filter id="shadow" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur in="SourceAlpha" stdDeviation="28"/><feOffset dy="24"/><feComponentTransfer><feFuncA type="linear" slope="0.35"/></feComponentTransfer><feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>
        <g filter="url(#shadow)">
          <circle cx="${cx - s1 * 0.9}" cy="${cy - s1 * 0.2}" r="${s1}" fill="url(#s1)"/>
          <rect x="${cx - s1 * 0.2}" y="${cy - s1 * 0.25}" width="${s1 * 2.2}" height="${s1 * 0.95}" rx="${s1 * 0.475}" fill="url(#s2)" transform="rotate(${(-25 + r() * 20).toFixed(1)} ${cx} ${cy})"/>
          <path d="M ${cx + s1 * 0.4} ${cy + s1 * 1.6} a ${s1 * 0.8} ${s1 * 0.8} 0 0 1 ${s1 * 0.8} -${s1 * 0.8} v ${s1 * 0.8} z" fill="url(#s3)"/>
        </g>`;
    }
    case "rings":
      return Array.from({ length: 7 }, (_, i) =>
        `<circle cx="${cx}" cy="${cy}" r="${70 + i * 46}" fill="none" stroke="${ink}" stroke-opacity="${(0.6 - i * 0.07).toFixed(2)}" stroke-width="2"/>`
      ).join("");
    case "orb": {
      const rad = H * (0.26 + r() * 0.08);
      return `<defs><radialGradient id="orb" cx="35%" cy="30%" r="75%">
          <stop offset="0" stop-color="#ffffff" stop-opacity="0.95"/>
          <stop offset="0.35" stop-color="#ffffff" stop-opacity="0.35"/>
          <stop offset="1" stop-color="#ffffff" stop-opacity="0"/></radialGradient></defs>
        <circle cx="${cx}" cy="${cy}" r="${rad}" fill="url(#orb)"/>
        <circle cx="${cx}" cy="${cy}" r="${rad}" fill="none" stroke="#ffffff" stroke-opacity="0.5" stroke-width="1.5"/>`;
    }
    case "waves": {
      const amp = 30 + r() * 40, freq = 1.5 + r() * 1.5, phase = r() * Math.PI * 2;
      return Array.from({ length: 9 }, (_, i) => {
        const y0 = H * 0.3 + i * 34;
        let d = `M 0 ${y0}`;
        for (let x = 0; x <= W; x += 20) {
          d += ` L ${x} ${(y0 + amp * Math.sin((x / W) * Math.PI * 2 * freq + phase + i * 0.35)).toFixed(1)}`;
        }
        return `<path d="${d}" fill="none" stroke="${ink}" stroke-opacity="${(0.2 + i * 0.07).toFixed(2)}" stroke-width="2"/>`;
      }).join("");
    }
    case "grid": {
      const step = 60;
      const lines = [];
      for (let x = 0; x <= W; x += step) lines.push(`<line x1="${x}" y1="0" x2="${x}" y2="${H}"/>`);
      for (let y = 0; y <= H; y += step) lines.push(`<line x1="0" y1="${y}" x2="${W}" y2="${y}"/>`);
      return `<defs><radialGradient id="fade" cx="${(cx / W).toFixed(2)}" cy="${(cy / H).toFixed(2)}" r="0.6">
          <stop offset="0" stop-color="#fff" stop-opacity="1"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>
          <mask id="m"><rect width="${W}" height="${H}" fill="url(#fade)"/></mask></defs>
        <g stroke="${ink}" stroke-opacity="0.45" stroke-width="1.2" mask="url(#m)">${lines.join("")}</g>
        <circle cx="${Math.round(cx / step) * step}" cy="${Math.round(cy / step) * step}" r="14" fill="${ink}" fill-opacity="0.9"/>`;
    }
    case "arcs":
      return Array.from({ length: 4 }, (_, i) => {
        const rad = 160 + i * 70;
        return `<path d="M ${cx - rad} ${cy} A ${rad} ${rad} 0 0 1 ${cx + rad} ${cy}" fill="none" stroke="${ink}" stroke-opacity="${(0.55 - i * 0.1).toFixed(2)}" stroke-width="${10 - i * 2}" stroke-linecap="round"/>`;
      }).join("");
  }
}

/** A 3:2 abstract cover; the square card and 3.9:1 banner both crop it well. */
export async function abstractCover(seedKey: string, palette: PaletteName) {
  const W = 1500, H = 1000;
  const r = rng(hash(seedKey));
  const [base, ...colors] = PALETTES[palette];
  const ink = isLight(base) ? "#1b1b1f" : "#ffffff";
  const style = STYLES[Math.floor(r() * STYLES.length)]!;

  const blobs = Array.from({ length: 7 }, (_, i) => {
    const c = colors[i % colors.length]!;
    return `<ellipse cx="${(r() * W).toFixed(0)}" cy="${(r() * H).toFixed(0)}" rx="${(250 + r() * 380).toFixed(0)}" ry="${(220 + r() * 320).toFixed(0)}" fill="${c}" fill-opacity="${(0.65 + r() * 0.35).toFixed(2)}"/>`;
  }).join("");

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
    <defs><filter id="blur" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="105"/></filter></defs>
    <rect width="${W}" height="${H}" fill="${base}"/>
    <g filter="url(#blur)">${blobs}</g>
    ${accent(style, r, W, H, ink, PALETTES[palette])}
  </svg>`;

  // Film grain: seeded noise blended softly over the gradient.
  const noisePixels = Buffer.alloc((W / 2) * (H / 2));
  // Low-contrast noise around mid-grey keeps the grain subtle.
  for (let i = 0; i < noisePixels.length; i++) noisePixels[i] = 128 + Math.floor((r() - 0.5) * 70);
  const noise = await sharp(noisePixels, { raw: { width: W / 2, height: H / 2, channels: 1 } })
    .resize(W, H)
    .toColourspace("srgb")
    .png()
    .toBuffer();

  const art = await sharp(Buffer.from(svg)).png().toBuffer();
  return sharp(art)
    .composite([{ input: noise, blend: "soft-light" }])
    .webp({ quality: 84 })
    .toBuffer();
}

/** Store logo: gradient tile with the store's initial. */
export async function abstractAvatar(seedKey: string, palette: PaletteName, letter: string) {
  const S = 256;
  const r = rng(hash(seedKey));
  const [, ...colors] = PALETTES[palette];
  const i = Math.floor(r() * colors.length);
  const a = colors[i]!;
  const b = colors[(i + 1 + Math.floor(r() * 3)) % colors.length]!;
  const letterColor = isLight(a) && isLight(b) ? "#1b1b1f" : "#ffffff";
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${S}" height="${S}">
    <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient></defs>
    <rect width="${S}" height="${S}" fill="url(#g)"/>
    <circle cx="${S * 0.8}" cy="${S * 0.18}" r="${S * 0.36}" fill="#ffffff" fill-opacity="0.2"/>
    <text x="128" y="172" text-anchor="middle" font-family="${FONT}" font-weight="700" font-size="128" fill="${letterColor}">${letter}</text>
  </svg>`;
  return sharp(Buffer.from(svg)).webp({ quality: 88 }).toBuffer();
}

// Initials avatar for demo buyers.
export async function avatar(opts: { initials: string; color: string }) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256">
    <rect width="256" height="256" fill="${opts.color}"/>
    <circle cx="128" cy="128" r="100" fill="#fff" stroke="#000" stroke-width="10"/>
    <text x="128" y="160" text-anchor="middle" font-family="${FONT}" font-weight="800" font-size="92" fill="#000">${opts.initials}</text>
  </svg>`;
  return sharp(Buffer.from(svg)).webp({ quality: 85 }).toBuffer();
}
