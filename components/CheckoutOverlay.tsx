"use client";

import { useCartStore } from "@/store/cartStore";
import { ArrowRight, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

export default function CheckoutOverlay() {
    const itemCount = useCartStore((state) => state.itemCount);

    // Hydration fix
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);

    if (!mounted) return null;

    // Check if promotion is active (2 or more items)
    const isPromoActive = itemCount >= 2;
    const itemsNeeded = Math.max(0, 2 - itemCount);

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3 pointer-events-auto">

            {/* Promotion Badge */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
                className="bg-black/80 backdrop-blur-md text-white px-4 py-2 rounded-xl text-sm font-medium shadow-xl border border-white/10"
            >
                {isPromoActive ? (
                    <div className="flex items-center gap-2 text-green-400">
                        <span>🎉 $10 OFF Applied!</span>
                    </div>
                ) : (
                    <div className="flex items-center gap-2 text-gray-200">
                        <span>Buy {itemsNeeded} more to save $10</span>
                    </div>
                )}
            </motion.div>

            {/* Checkout Button */}
            <Link href="/checkout">
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="group relative bg-blue-600 hover:bg-blue-500 text-white pl-6 pr-8 py-4 rounded-full font-medium text-lg shadow-2xl flex items-center gap-3 overflow-hidden transition-colors"
                >
                    <div className="relative">
                        <ShoppingBag size={24} />
                        {itemCount > 0 && (
                            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-blue-600">
                                {itemCount}
                            </span>
                        )}
                    </div>
                    <span>Checkout Now</span>
                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </motion.button>
            </Link>
        </div>
    );
}
