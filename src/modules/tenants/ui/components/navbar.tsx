"use client";

import { appPath, generateTenantURL } from "@/lib/utils";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import Image from "@/components/media-image";
import Link from "next/link";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { LogoMark } from "@/components/logo";
import { ShoppingCartIcon } from "lucide-react";

const CheckoutButton = dynamic(
  () =>
    import("@/modules/checkout/ui/components/checkout-button").then(
      (mod) => mod.CheckoutButton
    ),
  {
    ssr: false,
    loading: () => (
      <Button disabled variant="secondary" size="icon" aria-label="Cart">
        <ShoppingCartIcon />
      </Button>
    ),
  }
);

const Slash = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className="size-5 shrink-0 text-[#d4d4d4]">
    <path d="M16.88 3.549L7.12 20.451" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

interface Props {
  slug: string;
}

const Shell = ({ children }: { children: React.ReactNode }) => (
  <nav className="sticky top-0 z-40 h-16 border-b bg-background/80 backdrop-blur-md">
    <div className="mx-auto flex h-full max-w-(--breakpoint-xl) items-center justify-between gap-4 px-4 lg:px-12">
      {children}
    </div>
  </nav>
);

export const Navbar = ({ slug }: Props) => {
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(trpc.tenants.getOne.queryOptions({ slug }));
  return (
    <Shell>
      <div className="flex min-w-0 items-center gap-2">
        <Link href={appPath("/")} aria-label="Shelf home">
          <LogoMark />
        </Link>
        <Slash />
        <Link
          href={generateTenantURL(slug)}
          className="flex min-w-0 items-center gap-2 rounded-md px-1.5 py-1 hover:bg-accent"
        >
          {data.image?.url && (
            <Image
              alt=""
              src={data.image.url}
              width={24}
              height={24}
              className="size-6 shrink-0 rounded-full"
            />
          )}
          <span className="truncate text-sm font-medium">{data.name}</span>
        </Link>
      </div>
      <CheckoutButton hideIfEmpty tenantSlug={slug} />
    </Shell>
  );
};

export const NavbarSkeleton = () => {
  return (
    <Shell>
      <div className="flex items-center gap-2">
        <LogoMark />
        <Slash />
        <div className="h-5 w-32 animate-pulse rounded bg-muted" />
      </div>
      <div />
    </Shell>
  );
};
