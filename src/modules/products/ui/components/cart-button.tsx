import { Button } from "@/components/ui/button";
import { appPath, cn } from "@/lib/utils";
import { useCart } from "@/modules/checkout/hooks/use-cart";
import Link from "next/link";

interface Props {
  tenantSlug: string;
  productId: string;
  isPurchased?: boolean;
}

export const CartButton = ({ tenantSlug, productId, isPurchased }: Props) => {
  const cart = useCart(tenantSlug);

  if (isPurchased) {
    return (
      <Button asChild size="lg" variant="secondary" className="flex-1">
        <Link href={appPath(`/library/${productId}`)}>
          View in Library
        </Link>
      </Button>
    );
  }

  return (
    <Button
      size="lg"
      variant={cart.isProductInCart(productId) ? "secondary" : "default"}
      className={cn("flex-1")}
      onClick={() => cart.toggleProduct(productId)}
    >
      {cart.isProductInCart(productId) ? "Remove from cart" : "Add to cart"}
    </Button>
  );
};
