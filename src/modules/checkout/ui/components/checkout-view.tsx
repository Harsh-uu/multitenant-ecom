"use client";

import { useTRPC } from "@/trpc/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCart } from "../../hooks/use-cart";
import { useEffect } from "react";
import { toast } from "sonner";
import { generateTenantURL } from "@/lib/utils";
import { CheckoutItem } from "./checkout-item";
import { CheckoutSidebar } from "./checkout-sidebar";
import { InboxIcon, LoaderIcon } from "lucide-react";
import { useCheckoutStates } from "../../hooks/use-checkout-states";
import { useRouter } from "next/navigation";

interface CheckoutViewProps {
  tenantSlug: string;
}

export const CheckoutView = ({ tenantSlug }: CheckoutViewProps) => {
    const router = useRouter();
    const queryClient = useQueryClient();
    const [states, setStates] = useCheckoutStates();
  const { productIds, removeProduct, clearCart } = useCart(tenantSlug);

  const trpc = useTRPC();
  const { data, error, isLoading } = useQuery(
    trpc.checkout.getProducts.queryOptions({
      ids: productIds,
    })
  );

  const purchase = useMutation(trpc.checkout.purchase.mutationOptions({
    onMutate: () => {
        setStates({success: false, cancel: false})
    },
    onSuccess:(data) => {
        window.location.href = data.url;
    },
    onError:(error) => {
        if(error.data?.code === "UNAUTHORIZED"){
            router.push("/sign-in");
        }
        toast.error(error.message)
    },

  }));

  useEffect(() => {
    if(states.success){
        setStates({success: false, cancel: false})
        clearCart();
        queryClient.invalidateQueries(trpc.library.getMany.infiniteQueryFilter());
        router.push("/library")
    }
  }, [states.success, clearCart, router, setStates, queryClient, trpc.library.getMany])

  useEffect(() => {
    if (error?.data?.code === "NOT_FOUND") {
      clearCart();
      toast.warning("Invalid products found, cart cleared");
    }
  }, [error, clearCart]);

  if (isLoading) {
    return (
      <div className="px-4 pt-8 pb-12 lg:px-12 lg:pt-12">
        <div className="flex w-full flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-[#c9c9c9] bg-background p-12">
          <LoaderIcon className="size-5 text-muted-foreground animate-spin" />
        </div>
      </div>
    );
  }

  if (data?.totalDocs === 0) {
    return (
      <div className="px-4 pt-8 pb-12 lg:px-12 lg:pt-12">
        <div className="flex w-full flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-[#c9c9c9] bg-background p-12">
          <InboxIcon className="size-5 text-muted-foreground" />
          <p className="text-sm font-medium">Your cart is empty</p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 pt-8 pb-12 lg:px-12 lg:pt-12">
      <div className="grid grid-cols-1 lg:grid-cols-7 gap-4 lg:gap-16">
        <div className="lg:col-span-4">
          <div className="overflow-hidden rounded-xl bg-card shadow-(--shadow-card)">
            {data?.docs.map((product, index) => (
              <CheckoutItem
                key={product.id}
                isLast={index === data.docs.length - 1}
                imageUrl={product.image?.url}
                name={product.name}
                productUrl={`${generateTenantURL(product.tenant.slug)}/products/${product.id}`}
                tenantUrl={generateTenantURL(product.tenant.slug)}
                tenantName={product.tenant.name}
                price={product.price}
                onRemove={() => removeProduct(product.id)}
              />
            ))}
          </div>
        </div>

        <div className="lg:col-span-3">
          <CheckoutSidebar
            total={data?.totalPrice || 0}
            onPurchase={() => purchase.mutate({tenantSlug, productIds})}
            isCanceled={states.cancel}
            disabled={purchase.isPending}
          />
        </div>
      </div>
    </div>
  );
};
