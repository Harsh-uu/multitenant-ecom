import { ProductListSkeleton } from "@/modules/products/ui/components/product-list";

export default function Loading() {
  return (
    <div className="mx-auto w-full max-w-screen-2xl px-4 py-8 lg:px-12 lg:py-10">
      <ProductListSkeleton narrowView />
    </div>
  );
}
