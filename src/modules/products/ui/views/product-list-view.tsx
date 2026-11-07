import { Suspense } from "react";
import { ProductFilters } from "../components/product-filters";
import { ProductSort } from "../components/product-sort";
import { ProductList, ProductListSkeleton } from "../components/product-list";

interface Props {
  category?: string;
  tenantSlug?: string;
  narrowView?: boolean;
}

export const ProductListView = ({ category, tenantSlug, narrowView }: Props) => {
  return (
    <div className="mx-auto flex w-full max-w-screen-2xl flex-col gap-6 px-4 py-8 lg:px-12 lg:py-10">
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold tracking-tight lg:text-3xl">
            {tenantSlug ? "Products" : "Curated for you"}
          </h1>
          {!tenantSlug && (
            <p className="text-sm text-muted-foreground">
              Courses, templates and tools, sold directly by the people who made them.
            </p>
          )}
        </div>
        <ProductSort />
      </div>

      <div className="grid grid-cols-1 gap-x-8 gap-y-6 lg:grid-cols-6 xl:grid-cols-8">
        <div className="lg:col-span-2 xl:col-span-2">
          <ProductFilters />
        </div>
        <div className="lg:col-span-4 xl:col-span-6">
          <Suspense fallback={<ProductListSkeleton narrowView={narrowView} />}>
            <ProductList category={category} tenantSlug={tenantSlug} narrowView={narrowView} />
          </Suspense>
        </div>
      </div>
    </div>
  );
};
