"use client";

import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface QuantitySelectorProps {
    quantity: number;
    onIncrease: () => void;
    onDecrease: () => void;
    className?: string;
}

export function QuantitySelector({
    quantity,
    onIncrease,
    onDecrease,
    className,
}: QuantitySelectorProps) {
    return (
        <div className={cn("flex items-center gap-3 bg-gray-50 rounded-lg p-1 border border-gray-200", className)}>
            <button
                onClick={onDecrease}
                className="w-8 h-8 flex items-center justify-center hover:bg-white rounded-md text-gray-500 hover:text-gray-900 transition-colors shadow-sm"
                aria-label="Decrease quantity"
            >
                <Minus size={16} />
            </button>
            <span className="w-8 text-center text-gray-900 font-medium">{quantity}</span>
            <button
                onClick={onIncrease}
                className="w-8 h-8 flex items-center justify-center hover:bg-white rounded-md text-gray-500 hover:text-gray-900 transition-colors shadow-sm"
                aria-label="Increase quantity"
            >
                <Plus size={16} />
            </button>
        </div>
    );
}
