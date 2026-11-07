"use client";

import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { ReviewSidebar } from "../components/review-sidebar";
import { RichText } from "@payloadcms/richtext-lexical/react";

interface Props {
  productId: string;
}

export const ProductView = ({ productId }: Props) => {
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(
    trpc.library.getOne.queryOptions({
      productId,
    })
  );
  return (
    <div className="min-h-screen bg-subtle">
      <nav className="sticky top-0 z-40 h-16 border-b bg-background/80 backdrop-blur-md">
        <div className="max-w-(--breakpoint-xl) mx-auto flex h-full items-center px-4 lg:px-12">
          <Link prefetch href="/library" className="flex items-center gap-2 rounded-md px-2 py-1.5 -ml-2 text-sm text-muted-foreground hover:bg-accent hover:text-foreground">
            <ArrowLeftIcon className="size-4" />
            Back to Library
          </Link>
        </div>
      </nav>
      <header className="border-b bg-background py-10">
        <div className="max-w-(--breakpoint-xl) mx-auto px-4 lg:px-12">
          <h1 className="text-3xl font-semibold tracking-tight">{data.name}</h1>
        </div>
      </header>
      <section className="max-w-(--breakpoint-xl) mx-auto px-4 lg:px-12 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-7 gap-4 lg:gap-16">
          <div className="lg:col-span-2">
            <div className="rounded-xl bg-card p-5 shadow-(--shadow-card) lg:sticky lg:top-24">
              <ReviewSidebar productId={productId} />
            </div>
          </div>{" "}
          <div className="lg:col-span-5 rounded-xl bg-card p-6 shadow-(--shadow-card) lg:p-8">
            {data.content ? (
              <RichText className="rich-text" data={data.content} />
            ) : (
              <p className="text-sm text-muted-foreground">
                No special content
              </p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};
