"use client";

import NextImage, { type ImageLoaderProps, type ImageProps } from "next/image";

const isUnsplash = (src: ImageProps["src"]) =>
  typeof src === "string" && src.startsWith("https://images.unsplash.com/");

/** Resize on Unsplash's image CDN (their API terms require hotlinking). */
function unsplashLoader({ src, width, quality }: ImageLoaderProps) {
  const url = new URL(src);
  url.searchParams.set("w", String(width));
  url.searchParams.set("q", String(quality || 75));
  url.searchParams.set("auto", "format");
  if (!url.searchParams.has("fit")) url.searchParams.set("fit", "max");
  return url.toString();
}

/**
 * Drop-in replacement for next/image: Unsplash photos load straight from
 * Unsplash's CDN; every other image uses Next's built-in optimizer.
 */
export default function Image(props: ImageProps) {
  return <NextImage {...props} loader={isUnsplash(props.src) ? unsplashLoader : props.loader} />;
}
