import { ProductViewSkeleton } from "@/modules/products/ui/views/product-view";

// Shown instantly on navigation while the product streams in.
export default function Loading() {
  return <ProductViewSkeleton />;
}
