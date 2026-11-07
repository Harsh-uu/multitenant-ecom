import { ProductView, ProductViewSkeleton } from "@/modules/products/ui/views/product-view";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { notFound } from "next/navigation";
import { Suspense } from "react";

interface Props {
    params: Promise<{productId: string; slug: string}>;
};

export const dynamic = "force-dynamic";

const Page = async({params}: Props) => {
    const {productId, slug} = await params;

    const queryClient = getQueryClient();
    // Fetch on the server so the page arrives fully rendered; a missing
    // product, or one from another store, is a real 404.
    const [, product] = await Promise.all([
        queryClient.prefetchQuery(trpc.tenants.getOne.queryOptions({ slug })),
        queryClient
            .fetchQuery(trpc.products.getOne.queryOptions({ id: productId }))
            .catch(() => null),
    ]);
    if (!product || product.tenant?.slug !== slug) notFound();

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <Suspense fallback={<ProductViewSkeleton/>}>
            <ProductView productId={productId} tenantSlug={slug}/>
            </Suspense>
        </HydrationBoundary>
    )
}

export default Page