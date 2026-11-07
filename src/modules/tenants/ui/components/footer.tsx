import { Logo } from "@/components/logo";
import { appPath } from "@/lib/utils";
import Link from "next/link";

export const Footer = () => {
  return (
    <footer className="border-t bg-background">
      <div className="mx-auto flex max-w-(--breakpoint-xl) items-center gap-2 px-4 py-6 text-sm text-muted-foreground lg:px-12">
        <span>Powered by</span>
        <Link href={appPath("/")} className="text-foreground">
          <Logo markClassName="size-5" className="[&>span:last-child]:text-sm" />
        </Link>
      </div>
    </footer>
  );
};
