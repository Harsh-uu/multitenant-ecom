"use client";

import { StarRating } from "@/components/star-rating";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { formatCurrency, generateTenantURL } from "@/lib/utils";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { CheckIcon, LinkIcon, ShieldCheckIcon, StarIcon } from "lucide-react";
import Image from "@/components/media-image";
import Link from "next/link";
import { Fragment, useState } from "react";
import dynamic from "next/dynamic";
import { toast } from "sonner";
import {RichText} from "@payloadcms/richtext-lexical/react"

const CartButton = dynamic(
  () => import("../components/cart-button").then((mod) => mod.CartButton),
  {
    ssr: false,
    loading: () => (
      <Button disabled size="lg" className="flex-1">
        Add to cart
      </Button>
    ),
  }
);

interface ProductViewProps {
  productId: string;
  tenantSlug: string;
}

export const ProductView = ({ productId, tenantSlug }: ProductViewProps) => {
  const [isCopied, setIsCopied] = useState(false);
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(
    trpc.products.getOne.queryOptions({ id: productId })
  );
  const ratingLabel = `${data.reviewCount} ${data.reviewCount === 1 ? "rating" : "ratings"}`;

  return (
    <div className="px-4 py-8 lg:px-12 lg:py-12">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-12">
        {/* Main column: cover, title, description */}
        <div className="flex flex-col gap-8 lg:col-span-8">
          <div className="relative aspect-[16/9] overflow-hidden rounded-xl bg-muted shadow-(--shadow-card)">
            <Image
              src={data.image?.url || "/placeholder.png"}
              alt={data.name}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 66vw"
              priority
            />
            {data.image?.credit?.name && (
              // Photographer credit, required for Unsplash photos.
              <p className="absolute bottom-3 right-3 rounded-md bg-black/60 px-2 py-1 text-xs text-white backdrop-blur-sm">
                Photo by{" "}
                <a href={data.image.credit.url ?? undefined} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2">
                  {data.image.credit.name}
                </a>
                {data.image.credit.source && (
                  <>
                    {" "}on{" "}
                    <a href={data.image.credit.sourceUrl ?? undefined} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2">
                      {data.image.credit.source}
                    </a>
                  </>
                )}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-4">
            <h1 className="text-3xl font-semibold tracking-tight lg:text-4xl">
              {data.name}
            </h1>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
              <Link
                href={generateTenantURL(tenantSlug)}
                className="flex items-center gap-2 text-foreground hover:underline underline-offset-4"
              >
                {data.tenant.image?.url && (
                  <Image
                    src={data.tenant.image.url}
                    alt=""
                    width={20}
                    height={20}
                    className="size-5 shrink-0 rounded-full"
                  />
                )}
                {data.tenant.name}
              </Link>
              <span aria-hidden className="text-[#c9c9c9]">/</span>
              <div className="flex items-center gap-2">
                <StarRating rating={data.reviewRating} iconClassName="size-3.5" />
                <span>{ratingLabel}</span>
              </div>
            </div>
          </div>

          <div className="border-t pt-8">
            {data.description ? (
              <RichText className="rich-text" data={data.description} />
            ) : (
              <p className="text-sm text-muted-foreground">No description provided</p>
            )}
          </div>
        </div>

        {/* Purchase card */}
        <aside className="lg:col-span-4">
          <div className="flex flex-col overflow-hidden rounded-xl bg-card shadow-(--shadow-card) lg:sticky lg:top-24">
            <div className="flex flex-col gap-4 p-6">
              <p className="font-mono text-3xl font-semibold tracking-tight">
                {formatCurrency(data.price)}
              </p>
              <div className="flex flex-row items-center gap-2">
                <CartButton
                  isPurchased={data.isPurchased}
                  productId={productId}
                  tenantSlug={tenantSlug}
                />
                <Button
                  size="lg"
                  variant="secondary"
                  className="size-12 px-0"
                  aria-label="Copy product link"
                  onClick={() => {
                    setIsCopied(true);
                    navigator.clipboard.writeText(window.location.href);
                    toast.success("Link copied");

                    setTimeout(() => {
                      setIsCopied(false);
                    }, 1000);
                  }}
                  disabled={isCopied}
                >
                  {isCopied ? <CheckIcon /> : <LinkIcon />}
                </Button>
              </div>
              <p className="flex items-center gap-2 text-sm text-muted-foreground">
                <ShieldCheckIcon className="size-4" />
                {data.refundPolicy === "no-refunds"
                  ? "No refunds"
                  : `${data.refundPolicy} money-back guarantee`}
              </p>
            </div>

            <div className="border-t p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-medium">Ratings</h2>
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <StarIcon className="size-3.5 fill-foreground text-foreground" />
                  <span className="text-foreground">{data.reviewRating}</span>
                  <span>· {ratingLabel}</span>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-[auto_1fr_auto] items-center gap-x-3 gap-y-2.5 text-sm">
                {[5, 4, 3, 2, 1].map((stars) => (
                  <Fragment key={stars}>
                    <div className="text-muted-foreground">
                      {stars} {stars === 1 ? "star" : "stars"}
                    </div>
                    <Progress
                      aria-label={`${stars} star ratings`}
                      value={data.ratingDistribution[stars]}
                    />
                    <div className="w-9 text-right font-mono text-xs text-muted-foreground">
                      {data.ratingDistribution[stars]}%
                    </div>
                  </Fragment>
                ))}
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export const ProductViewSkeleton = () => {
  return (
    <div className="px-4 py-8 lg:px-12 lg:py-12">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-12">
        <div className="flex flex-col gap-8 lg:col-span-8">
          <div className="aspect-[16/9] animate-pulse rounded-xl bg-muted" />
          <div className="h-9 w-2/3 animate-pulse rounded-md bg-muted" />
        </div>
        <div className="lg:col-span-4">
          <div className="h-64 animate-pulse rounded-xl bg-muted" />
        </div>
      </div>
    </div>
  );
};
