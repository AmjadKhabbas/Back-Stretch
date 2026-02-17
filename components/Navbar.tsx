"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export function Navbar() {
    const items = useCartStore((state) => state.items);
    const [scrolled, setScrolled] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener("scroll", handleScroll);
        setMounted(true);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);

    // Prevent hydration mismatch for badge
    if (!mounted) return null;

    return (
        <nav
            className={cn(
                "fixed top-0 w-full z-50 transition-all duration-300 border-b border-transparent",
                scrolled ? "bg-white/90 backdrop-blur-md py-4 border-gray-200 shadow-sm" : "bg-transparent py-6"
            )}
        >
            <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
                <Link href="/" className="text-2xl font-light tracking-tight text-gray-900 hover:opacity-80 transition-opacity">
                    FlexCore
                </Link>

                <div className="flex items-center gap-8">
                    <Link href="/product" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
                        Product
                    </Link>
                    <Link href="/about" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
                        About
                    </Link>
                    <Link href="/reviews" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
                        Reviews
                    </Link>
                    <Link href="/cart" className="relative group text-gray-600 hover:text-gray-900 transition-colors">
                        <ShoppingCart size={24} strokeWidth={1.5} />
                        {itemCount > 0 && (
                            <span className="absolute -top-2 -right-2 w-5 h-5 bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center rounded-full">
                                {itemCount}
                            </span>
                        )}
                    </Link>
                </div>
            </div>
        </nav>
    );
}
