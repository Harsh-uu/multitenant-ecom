import { timingSafeEqual } from "crypto";
import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

import { CATALOG_TAG } from "@/lib/cache";

/**
 * Clears cached storefront data. Payload hooks do this automatically for
 * edits made through the app; scripts that write to the database directly
 * (like the demo seed) call this afterwards.
 *
 *   curl -X POST -H "Authorization: Bearer $REVALIDATE_SECRET" <app>/api/revalidate
 */
export async function POST(req: Request) {
  const secret = process.env.REVALIDATE_SECRET;
  const given = Buffer.from(req.headers.get("authorization") ?? "");
  const expected = Buffer.from(`Bearer ${secret}`);
  if (!secret || given.length !== expected.length || !timingSafeEqual(given, expected)) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  revalidateTag(CATALOG_TAG, { expire: 0 });
  revalidateTag("categories", { expire: 0 });
  return NextResponse.json({ revalidated: true });
}
