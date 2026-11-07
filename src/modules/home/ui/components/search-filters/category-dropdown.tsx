"use client";

import { cn } from "@/lib/utils";
import { useRef, useState } from "react";
import { SubcategoryMenu } from "./subcategory-menu";
import Link from "next/link";
import { CategoriesGetManyOutput } from "@/modules/categories/types";

interface Props {
  category: CategoriesGetManyOutput[1];
  isActive?: boolean;
  isNavigationHovered?: boolean;
}

export const CategoryDropdown = ({
  category,
  isActive,
  isNavigationHovered,
}: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  
  const onMouseEnter = () => {
      if (category.subcategories) {
          setIsOpen(true);
        }
    };
    
    const onMouseLeave = () => setIsOpen(false);

  return (
    <div
      className="relative"
      ref={dropdownRef}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {/* Tab-style link; the active category gets an underline. */}
      <Link
        href={`/${category.slug === "all" ? "" : category.slug}`}
        className={cn(
          "relative mb-2 flex h-8 items-center whitespace-nowrap rounded-md px-3 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground",
          (isOpen || (isActive && !isNavigationHovered)) && "text-foreground",
          isActive &&
            "after:absolute after:inset-x-2 after:-bottom-2 after:h-0.5 after:rounded-full after:bg-foreground"
        )}
      >
        {category.name}
      </Link>

      <SubcategoryMenu
      category={category}
      isOpen={isOpen}
      />
    </div>
  );
};
