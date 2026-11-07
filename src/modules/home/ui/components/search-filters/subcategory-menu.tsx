import { CategoriesGetManyOutput } from "@/modules/categories/types";
import { Category } from "@/payload-types";
import { ChevronRightIcon } from "lucide-react";
import Link from "next/link";

interface Props {
  category: CategoriesGetManyOutput[1];
  isOpen: boolean;
}

export const SubcategoryMenu = ({ category, isOpen }: Props) => {
  if (
    !isOpen ||
    !category.subcategories ||
    category.subcategories.length === 0
  ) {
    return null;
  }

  return (
    <div
      className="absolute z-100"
      style={{
        top: "100%",
        left: 0,
      }}
    >
      <div className="h-1 w-60" />
      <div className="w-60 rounded-xl bg-popover p-1 shadow-(--shadow-menu) animate-in fade-in-0 zoom-in-95 duration-100">
        {category.subcategories?.map((subcategory: Category) => (
          <Link
            key={subcategory.slug}
            href={`/${category.slug}/${subcategory.slug}`}
            className="group flex items-center justify-between rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            {subcategory.name}
            <ChevronRightIcon className="size-3.5 opacity-0 transition-opacity group-hover:opacity-100" />
          </Link>
        ))}
      </div>
    </div>
  );
};
