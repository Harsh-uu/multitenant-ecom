"use client";

import { cn } from "@/lib/utils";
import { ChevronDownIcon, ChevronRightIcon } from "lucide-react";
import { useState } from "react";
import { PriceFilter } from "./price-filter";
import { useProductFilters } from "../../hooks/use-product-filters";
import { TagsFilter } from "./tags-filter";

interface ProductFilterProps {
  title: string;
  className?: string;
  children: React.ReactNode;
}

const ProductFilter = ({ children, title, className }: ProductFilterProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const Icon = isOpen ? ChevronDownIcon : ChevronRightIcon;

  return (
    <div className={cn("border-b px-4 py-3 flex flex-col gap-3", className)}>
      <button
        type="button"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((current) => !current)}
        className="flex items-center justify-between cursor-pointer text-sm font-medium"
      >
        {title}
        <Icon className="size-4 text-muted-foreground" />
      </button>
      {isOpen && children}
    </div>
  );
};

export const ProductFilters = () => {
  const [filters, setFilters] = useProductFilters();

  const hasAnyFilters = Object.entries(filters).some(([key, value]) => {
    if(key === "sort") return false;

    if(Array.isArray(value)){
      return value.length > 0;
    }

    if (typeof value === "string") {
      return value !== "";
    }

    return value !== null;
  });

  const onClear = () => {
    setFilters({
      minPrice: "",
      maxPrice: "",
      tags: [],
    });
  };

  const onChange = (key: keyof typeof filters, value: unknown) => {
    setFilters({ ...filters, [key]: value });
  };
  return (
    <div className="rounded-xl bg-card shadow-(--shadow-card) lg:sticky lg:top-20">
      <div className="px-4 py-3 border-b flex items-center justify-between">
        <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">Filters</p>
        {hasAnyFilters && (
          <button className="text-sm text-muted-foreground hover:text-foreground cursor-pointer" onClick={() => onClear()} type="button">
            Clear
          </button>
        )}
      </div>
      <ProductFilter title="Price">
        <PriceFilter
          minPrice={filters.minPrice}
          maxPrice={filters.maxPrice}
          onMinPriceChange={(value) => onChange("minPrice", value)}
          onMaxPriceChange={(value) => onChange("maxPrice", value)}
        />
      </ProductFilter>
      <ProductFilter title="Tags" className="border-b-0">
        <TagsFilter
          value={filters.tags}
          onChange={(value) => onChange("tags", value)}
        />
      </ProductFilter>
    </div>
  );
};
