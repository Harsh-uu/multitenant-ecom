"use client";

import { TriangleAlertIcon } from "lucide-react";

const ErrorPage = () => {
  return (
    <div className="px-4 lg:px-12 py-18">
      <div className="flex w-full flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-[#c9c9c9] bg-background p-12">
        <TriangleAlertIcon className="size-5 text-muted-foreground" />
        <p className="text-sm font-medium">Something went wrong</p>
      </div>
    </div>
  );
};

export default ErrorPage