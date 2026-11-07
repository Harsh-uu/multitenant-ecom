import { Button } from "@/components/ui/button";
import { useCart } from "../../hooks/use-cart";
import { cn, generateTenantURL } from "@/lib/utils";
import Link from "next/link";
import { ShoppingCartIcon } from "lucide-react";

interface Props {
  className?: string;
  hideIfEmpty?: boolean;
  tenantSlug: string;
}

export const CheckoutButton = ({
  tenantSlug,
  className,
  hideIfEmpty,
}: Props) => {
  const { totalItems } = useCart(tenantSlug);
  if (hideIfEmpty && totalItems === 0) return null;

  return (
    <Button variant="secondary" size="sm" asChild className={cn(className)}>
      <Link
        href={`${generateTenantURL(tenantSlug)}/checkout`}
        aria-label={`Cart, ${totalItems} ${totalItems === 1 ? "item" : "items"}`}
      >
        <ShoppingCartIcon />
        Cart
        {totalItems > 0 && (
          <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-foreground px-1.5 font-mono text-[11px] text-background">
            {totalItems}
          </span>
        )}
      </Link>
    </Button>
  );
};
