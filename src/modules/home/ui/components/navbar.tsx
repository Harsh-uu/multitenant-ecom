"use client";

import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NavbarSidebar } from "./navbar-sidebar";
import { useState } from "react";
import { MenuIcon } from "lucide-react";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";

const navbarItems = [
  { href: "/", children: "Explore" },
  { href: "/library", children: "Library" },
];

export const Navbar = () => {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const trpc = useTRPC();
  const session = useQuery(trpc.auth.session.queryOptions());
  const isSignedIn = !!session.data?.user;

  return (
    <nav className="sticky top-0 z-40 h-16 border-b bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/70">
      <div className="mx-auto flex h-full max-w-screen-2xl items-center justify-between gap-6 px-4 lg:px-12">
        <div className="flex items-center gap-8">
          <Link href="/" aria-label="Shelf home">
            <Logo />
          </Link>
          <div className="hidden items-center gap-1 lg:flex">
            {navbarItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-md px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground",
                  pathname === item.href && "text-foreground"
                )}
              >
                {item.children}
              </Link>
            ))}
          </div>
        </div>

        <NavbarSidebar
          items={navbarItems}
          isSignedIn={isSignedIn}
          open={isSidebarOpen}
          onOpenChange={setIsSidebarOpen}
        />

        <div className="hidden items-center gap-2 lg:flex">
          {isSignedIn ? (
            <Button asChild size="sm">
              <Link href="/admin">Dashboard</Link>
            </Button>
          ) : (
            <>
              <Button asChild size="sm" variant="secondary">
                <Link prefetch href="/sign-in">
                  Log in
                </Link>
              </Button>
              <Button asChild size="sm">
                <Link prefetch href="/sign-up">
                  Start selling
                </Link>
              </Button>
            </>
          )}
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          aria-label="Open menu"
          onClick={() => setIsSidebarOpen(true)}
        >
          <MenuIcon className="size-5" />
        </Button>
      </div>
    </nav>
  );
};
