import { ProductListSkeleton } from "@/modules/library/ui/components/product-list";

export default function Loading() {
  return (
    <div className="max-w-(--breakpoint-xl) mx-auto px-4 lg:px-12 py-10">
      <ProductListSkeleton />
    </div>
  );
}
