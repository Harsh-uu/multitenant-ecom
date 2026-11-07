"use client";

import { useProductFilters } from "../../hooks/use-product-filters";
import { cn } from "@/lib/utils";

const OPTIONS = [
  { value: "curated", label: "Curated" },
  { value: "trending", label: "Trending" },
  { value: "hot_and_new", label: "Hot & New" },
] as const;

/** Segmented control for the product sort order. */
export const ProductSort = () => {
  const [filters, setFilters] = useProductFilters();

  return (
    <div
      role="radiogroup"
      aria-label="Sort products"
      className="inline-flex w-fit items-center gap-0.5 rounded-lg bg-muted p-0.5"
    >
      {OPTIONS.map((option) => {
        const active = filters.sort === option.value;
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => setFilters({ sort: option.value })}
            className={cn(
              "h-7 cursor-pointer rounded-md px-3 text-sm text-muted-foreground transition-colors hover:text-foreground",
              active && "bg-background text-foreground shadow-(--shadow-card)"
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
};
