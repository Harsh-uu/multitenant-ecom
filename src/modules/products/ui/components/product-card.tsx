import { formatCurrency, generateTenantURL } from "@/lib/utils";
import { StarIcon } from "lucide-react";
import Image from "@/components/media-image";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface ProductCardProps {
  id: string;
  name: string;
  imageUrl?: string | null;
  tenantSlug: string;
  tenantImageUrl?: string | null;
  reviewRating: number;
  reviewCount: number;
  price: number;
  priority?: boolean;
}

export const ProductCard = ({
  tenantImageUrl,
  tenantSlug,
  id,
  name,
  price,
  reviewCount,
  reviewRating,
  imageUrl,
  priority = false,
}: ProductCardProps) => {
  const router = useRouter();

  const handleUserClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    router.push(generateTenantURL(tenantSlug));
  };
  return (
    <Link
      href={`${generateTenantURL(tenantSlug)}/products/${id}`}
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
            preload={priority}
            fetchPriority={priority ? "high" : undefined}
            loading={priority ? "eager" : undefined}
          />
        </div>
        <div className="flex flex-1 flex-col gap-3 p-4">
          <h2 className="line-clamp-2 text-[15px] font-medium leading-snug tracking-tight">
            {name}
          </h2>
          <div
            className="flex w-fit items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
            onClick={handleUserClick}
          >
            {tenantImageUrl && (
              <Image
                alt=""
                src={tenantImageUrl}
                width={16}
                height={16}
                className="size-4 shrink-0 rounded-full"
              />
            )}
            <span>{tenantSlug}</span>
          </div>
          <div className="mt-auto flex items-center justify-between pt-1">
            <span className="font-mono text-sm font-medium">
              {formatCurrency(price)}
            </span>
            {reviewCount > 0 && (
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
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

export const ProductCardSkeleton = () => {
  return (
    <div className="overflow-hidden rounded-xl bg-card shadow-(--shadow-card)">
      <div className="aspect-[4/3] animate-pulse bg-muted" />
      <div className="flex flex-col gap-3 p-4">
        <div className="h-4 w-3/4 animate-pulse rounded bg-muted" />
        <div className="h-3 w-1/3 animate-pulse rounded bg-muted" />
        <div className="h-4 w-12 animate-pulse rounded bg-muted" />
      </div>
    </div>
  );
};
