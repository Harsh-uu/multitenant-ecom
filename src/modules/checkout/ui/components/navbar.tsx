import { Button } from "@/components/ui/button";
import { LogoMark } from "@/components/logo";
import { appPath, generateTenantURL } from "@/lib/utils";
import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";

interface Props {
  slug: string;
}

export const Navbar = ({ slug }: Props) => {
  return (
    <nav className="sticky top-0 z-40 h-16 border-b bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-full max-w-(--breakpoint-xl) items-center justify-between px-4 lg:px-12">
        <div className="flex items-center gap-3">
          <Link href={appPath("/")} aria-label="Shelf home">
            <LogoMark />
          </Link>
          <span className="text-sm font-medium">Checkout</span>
        </div>
        <Button asChild variant="secondary" size="sm">
          <Link href={generateTenantURL(slug)}>
            <ArrowLeftIcon />
            Continue shopping
          </Link>
        </Button>
      </div>
    </nav>
  );
};
