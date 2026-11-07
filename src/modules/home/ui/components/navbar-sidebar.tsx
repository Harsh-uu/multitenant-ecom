import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import Link from "next/link";

interface NavbarItem {
  href: string;
  children: React.ReactNode;
}

interface Props {
  items: NavbarItem[];
  isSignedIn: boolean;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const NavbarSidebar = ({ items, isSignedIn, open, onOpenChange }: Props) => {
  const close = () => onOpenChange(false);
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="p-0 transition-none">
        <SheetHeader className="h-16 justify-center border-b px-4">
          <SheetTitle>
            <Logo />
          </SheetTitle>
        </SheetHeader>
        <ScrollArea className="flex h-full flex-col overflow-y-auto pb-2">
          <div className="flex flex-col p-2">
            {items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-md px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                onClick={close}
              >
                {item.children}
              </Link>
            ))}
          </div>
          <div className="flex flex-col gap-2 border-t p-4">
            {isSignedIn ? (
              <Button asChild onClick={close}>
                <Link href="/admin">Dashboard</Link>
              </Button>
            ) : (
              <>
                <Button asChild variant="secondary" onClick={close}>
                  <Link href="/sign-in">Log in</Link>
                </Button>
                <Button asChild onClick={close}>
                  <Link href="/sign-up">Start selling</Link>
                </Button>
              </>
            )}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};
