import { cn } from "@/lib/utils";

/** The Shelf mark: three stacked shelves in a rounded square. */
export const LogoMark = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    aria-hidden="true"
    className={cn("size-6 shrink-0", className)}
  >
    <rect width="24" height="24" rx="6" className="fill-foreground" />
    <rect x="6" y="6.5" width="12" height="2.25" rx="1.125" className="fill-background" />
    <rect x="6" y="10.875" width="9" height="2.25" rx="1.125" className="fill-background" />
    <rect x="6" y="15.25" width="5.5" height="2.25" rx="1.125" className="fill-background" />
  </svg>
);

export const Logo = ({
  className,
  markClassName,
}: {
  className?: string;
  markClassName?: string;
}) => (
  <span className={cn("inline-flex items-center gap-2", className)}>
    <LogoMark className={markClassName} />
    <span className="text-lg font-semibold tracking-tight">Shelf</span>
  </span>
);
