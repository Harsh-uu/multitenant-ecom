"use client";

import { useTRPC } from "@/trpc/client";
import { Categories } from "./categories";
import { SearchInput } from "./search-input";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { BreadcrumbNavigation } from "./breadcrumbs-navigation";
import { useProductFilters } from "@/modules/products/hooks/use-product-filters";

export const SearchFilters = () => {
  const [filters, setFilters] = useProductFilters();
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(trpc.categories.getMany.queryOptions());

  const params = useParams();
  const categoryParam = params.category as string | undefined;
  const activeCategory = categoryParam || "all";

  const activeCategoryData = data.find(
    (category) => category.slug === activeCategory
  );

  const activeCategoryName = activeCategoryData?.name || null;

  const activeSubcategory = params.subcategory as string | undefined;
  const activeSubcategoryName =
    activeCategoryData?.subcategories?.find(
      (subcategory) => subcategory.slug === activeSubcategory
    )?.name || null;

  return (
    <div className="w-full border-b bg-background">
      <div className="mx-auto flex max-w-screen-2xl flex-col gap-3 px-4 pt-4 pb-4 lg:px-12 lg:pb-0">
      <SearchInput
        defaultValue={filters.search}
        onChange={(value) =>
          setFilters({
            search: value,
          })
        }
      />
      <div className="hidden lg:block">
        <Categories data={data} />
      </div>
      <div className="lg:hidden">
        <BreadcrumbNavigation
          activeCategory={activeCategory}
          activeCategoryName={activeCategoryName}
          activeSubcategoryName={activeSubcategoryName}
        />
      </div>
      </div>
    </div>
  );
};

export const SearchFiltersSkeleton = () => {
  return (
    <div className="w-full border-b bg-background">
      <div className="mx-auto flex max-w-screen-2xl flex-col gap-3 px-4 pt-4 pb-4 lg:px-12 lg:pb-0">
        <SearchInput disabled />
        <div className="hidden lg:block">
          <div className="h-11" />
        </div>
      </div>
    </div>
  );
};
