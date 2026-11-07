import { cn, formatCurrency } from "@/lib/utils";
import Image from "@/components/media-image";
import Link from "next/link";

interface CheckoutItemProps {
  isLast?: boolean;
  imageUrl?: string | null;
  name: string;
  productUrl: string;
  tenantUrl: string;
  tenantName: string;
  price: number;
  onRemove: () => void;
}

export const CheckoutItem = ({
  name,
  onRemove,
  price,
  productUrl,
  tenantName,
  tenantUrl,
  imageUrl,
  isLast,
}: CheckoutItemProps) => {
  return (
    <div
      className={cn(
        "flex items-center gap-4 border-b p-4",
        isLast && "border-b-0"
      )}
    >
      <div className="relative size-20 shrink-0 overflow-hidden rounded-lg bg-muted">
        <Image
          src={imageUrl || "/placeholder.png"}
          alt={name}
          fill
          className="object-cover"
          sizes="80px"
        />
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <Link href={productUrl} className="truncate text-sm font-medium hover:underline underline-offset-4">
          {name}
        </Link>
        <Link href={tenantUrl} className="truncate text-sm text-muted-foreground hover:text-foreground">
          {tenantName}
        </Link>
      </div>

      <div className="flex flex-col items-end gap-1">
        <p className="font-mono text-sm font-medium">{formatCurrency(price)}</p>
        <button
          className="cursor-pointer text-sm text-muted-foreground hover:text-foreground"
          onClick={onRemove}
          type="button"
        >
          Remove
        </button>
      </div>
    </div>
  );
};
