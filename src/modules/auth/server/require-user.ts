import "server-only";
import { redirect } from "next/navigation";

import { caller } from "@/trpc/server";

/**
 * Redirects signed-out visitors to /sign-in. Call it before prefetching
 * protected queries; layouts render in parallel with pages, so it must live
 * in the page itself.
 */
export async function requireUser() {
  const session = await caller.auth.session();
  if (!session.user) redirect("/sign-in");
  return session.user;
}
