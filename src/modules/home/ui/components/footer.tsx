import { Logo } from "@/components/logo";
import Link from "next/link";

export const Footer = () => {
  return (
    <footer className="border-t bg-background">
      <div className="mx-auto flex max-w-screen-2xl flex-col gap-4 px-4 py-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between lg:px-12">
        <div className="flex items-center gap-3">
          <Logo markClassName="size-5" className="text-foreground [&>span:last-child]:text-base" />
          <span>© {new Date().getFullYear()} Shelf</span>
        </div>
        <div className="flex gap-6">
          <Link href="/" className="transition-colors hover:text-foreground">Explore</Link>
          <Link href="/sign-up" className="transition-colors hover:text-foreground">Start selling</Link>
          <Link href="/admin" className="transition-colors hover:text-foreground">Dashboard</Link>
        </div>
      </div>
    </footer>
  );
};
