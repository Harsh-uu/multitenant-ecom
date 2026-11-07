import { StarIcon } from "lucide-react";
import Image from "@/components/media-image";
import Link from "next/link";

interface ProductCardProps {
  id: string;
  name: string;
  imageUrl?: string | null;
  tenantSlug: string;
  tenantImageUrl?: string | null;
  reviewRating: number;
  reviewCount: number;
  priority?: boolean;
}

export const ProductCard = ({
  tenantImageUrl,
  tenantSlug,
  id,
  name,
  reviewCount,
  reviewRating,
  imageUrl,
  priority = false,
}: ProductCardProps) => {
  return (
    <Link
      prefetch
      href={`/library/${id}`}
      className="group block rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
    >
      <div className="flex h-full flex-col overflow-hidden rounded-xl bg-card shadow-(--shadow-card) transition-shadow duration-200 group-hover:shadow-(--shadow-card-hover)">
        <div className="relative aspect-[4/3] overflow-hidden border-b bg-muted">
          <Image
            alt={name}
            fill
            src={imageUrl || "/placeholder.png"}
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
            sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, (max-width: 1536px) 33vw, 25vw"
            priority={priority}
          />
        </div>
        <div className="flex flex-1 flex-col gap-3 p-4">
          <h2 className="line-clamp-2 text-[15px] font-medium leading-snug tracking-tight">
            {name}
          </h2>
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span className="flex items-center gap-2">
              {tenantImageUrl && (
                <Image
                  alt=""
                  src={tenantImageUrl}
                  width={16}
                  height={16}
                  className="size-4 shrink-0 rounded-full"
                />
              )}
              {tenantSlug}
            </span>
            {reviewCount > 0 && (
              <span className="flex items-center gap-1 text-xs">
                <StarIcon className="size-3 fill-foreground text-foreground" />
                <span className="text-foreground">{reviewRating}</span>
                <span>({reviewCount})</span>
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export { ProductCardSkeleton } from "@/modules/products/ui/components/product-card";
