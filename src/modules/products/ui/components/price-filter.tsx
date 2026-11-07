"use client"

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChangeEvent } from "react";

interface Props{
    minPrice?: string | null;
    maxPrice?: string | null;
    onMinPriceChange: (value: string) => void;
    onMaxPriceChange: (value: string) => void;
}

export const formatAsCurrecy = (value: string) => {
    const numericValue = value.replace(/[^0-9.]/g, "");
    const parts = numericValue.split(".");
    const formattedValue = parts[0] + (parts.length > 1 ? "." + parts[1]?.slice(0, 2): "");

    if(!formattedValue) return "";

    const numberValue = parseFloat(formattedValue);
    if(isNaN(numberValue)) return "";

    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    }).format(numberValue);
}

export const PriceFilter = ({minPrice, maxPrice, onMinPriceChange, onMaxPriceChange}: Props) => {
    const handleMinPriceChange = (e: ChangeEvent<HTMLInputElement>) => {
        const numericValue = e.target.value.replace(/[^0-9.]/g, "");
        onMinPriceChange(numericValue);
    }
    const handleMaxPriceChange = (e: ChangeEvent<HTMLInputElement>) => {
        const numericValue = e.target.value.replace(/[^0-9.]/g, "");
        onMaxPriceChange(numericValue);
    }
    return(
        <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label className="text-xs font-normal text-muted-foreground">Minimum price</Label>
                <Input type="text" placeholder="$0" value={minPrice ? formatAsCurrecy(minPrice): ""} onChange={handleMinPriceChange}></Input>
            </div>
            <div className="flex flex-col gap-2">
                <Label className="text-xs font-normal text-muted-foreground">Maximum price</Label>
                <Input type="text" placeholder="∞" value={maxPrice ? formatAsCurrecy(maxPrice): ""} onChange={handleMaxPriceChange}></Input>
            </div>
        </div>
    )
}