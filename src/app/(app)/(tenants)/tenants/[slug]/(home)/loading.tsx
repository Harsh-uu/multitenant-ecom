import { ProductListSkeleton } from "@/modules/products/ui/components/product-list";

export default function Loading() {
  return (
    <div className="px-4 lg:px-12 py-8">
      <ProductListSkeleton narrowView />
    </div>
  );
}
