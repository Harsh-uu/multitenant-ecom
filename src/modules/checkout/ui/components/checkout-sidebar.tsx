import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { CircleXIcon } from "lucide-react";

interface CheckoutSidebarProps {
  total: number;
  onPurchase: () => void;
  isCanceled?: boolean;
  disabled?: boolean;
}

export const CheckoutSidebar = ({
  onPurchase,
  total,
  isCanceled,
  disabled,
}: CheckoutSidebarProps) => {
  return (
    <div className="flex flex-col overflow-hidden rounded-xl bg-card shadow-(--shadow-card) lg:sticky lg:top-24">
      <div className="flex items-center justify-between border-b p-5">
        <h2 className="text-sm text-muted-foreground">Total</h2>
        <p className="font-mono text-xl font-semibold tracking-tight">{formatCurrency(total)}</p>
      </div>
      <div className="p-5">
        <Button
          disabled={disabled}
          onClick={onPurchase}
          size="lg"
          className="w-full"
        >
          Checkout
        </Button>
      </div>
      {isCanceled && (
        <div className="border-t p-5">
          <div className="flex items-center gap-2 rounded-md border border-[#ffd0d0] bg-[#fff0f0] px-3 py-2.5 text-sm text-[#cb2a2f]">
            <CircleXIcon className="size-4 shrink-0" />
            <span>Checkout failed. Please try again.</span>
          </div>
        </div>
      )}
    </div>
  );
};
