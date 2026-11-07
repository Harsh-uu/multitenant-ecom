import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Link from "next/link";

interface Props {
  activeCategoryName?: string | null;
  activeCategory?: string | null;
  activeSubcategoryName?: string | null;
}

export const BreadcrumbNavigation = ({
  activeCategory,
  activeCategoryName,
  activeSubcategoryName,
}: Props) => {
  if (!activeCategoryName || activeCategory === "all") return null;
  return (
    <Breadcrumb>
      <BreadcrumbList>
        {activeSubcategoryName ? (
          <>
            <BreadcrumbItem>
              <BreadcrumbLink
                asChild
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                <Link href={`/${activeCategory}`}>{activeCategoryName}</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="text-[#c9c9c9]">
              /
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbPage className="text-sm font-medium">
                {activeSubcategoryName}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </>
        ) : (
          <BreadcrumbItem>
            <BreadcrumbPage className="text-sm font-medium">
              {activeCategoryName}
            </BreadcrumbPage>
          </BreadcrumbItem>
        )}
      </BreadcrumbList>
    </Breadcrumb>
  );
};
