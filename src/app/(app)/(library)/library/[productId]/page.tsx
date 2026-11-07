import { requireUser } from "@/modules/auth/server/require-user";
import { ProductView } from "@/modules/library/ui/views/product-view";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

export const dynamic = "force-dynamic";


interface Props {
  params: Promise<{
    productId: string;
  }>;
}

const Page = async ({ params }: Props) => {
  const { productId } = await params;
  await requireUser();
  const queryClient = getQueryClient();
  await queryClient.prefetchQuery(
    trpc.library.getOne.queryOptions({
      productId,
    })
  );
  await queryClient.prefetchQuery(
    trpc.reviews.getOne.queryOptions({
      productId,
    })
  );
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProductView productId={productId} />
    </HydrationBoundary>
  );
};

export default Page;
