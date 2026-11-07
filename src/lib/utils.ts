import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** The app's base URL without a trailing slash (env values often have one). */
export function getAppUrl() {
  return (process.env.NEXT_PUBLIC_APP_URL || "").replace(/\/+$/, "");
}

const usesSubdomains = () =>
  process.env.NODE_ENV !== "development" &&
  process.env.NEXT_PUBLIC_ENABLE_SUBDOMAIN_ROUTING === "true";

/**
 * Link to a page on the main app. Relative unless stores live on subdomains,
 * so client-side navigation and prefetching keep working.
 */
export function appPath(path: string) {
  return usesSubdomains() ? `${getAppUrl()}${path}` : path;
}

/**
 * Link to a store. Relative (/tenants/slug) unless subdomain routing is on.
 * Pass { absolute: true } where a full URL is required (e.g. Stripe redirects).
 */
export function generateTenantURL(
  tenantSlug: string,
  { absolute = false }: { absolute?: boolean } = {}
) {
  if (usesSubdomains()) {
    return `https://${tenantSlug}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`;
  }
  const path = `/tenants/${tenantSlug}`;
  return absolute ? `${getAppUrl()}${path}` : path;
}

export function formatCurrency(value: number | string) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(Number(value));
}
