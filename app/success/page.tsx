"use client";

import { Suspense, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/Button";
import { CheckCircle2, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCartStore } from "@/store/cartStore";

function SuccessContent() {
    const searchParams = useSearchParams();
    const isMock = searchParams.get('mock') === 'true';
    const clearCart = useCartStore(state => state.clearCart);

    useEffect(() => {
        if (isMock) {
            clearCart();
        }
    }, [isMock, clearCart]);

    return (
        <div className="flex flex-col items-center justify-center text-center">
            <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-8 animate-in zoom-in duration-500">
                <CheckCircle2 size={48} />
            </div>

            <h1 className="text-4xl font-light tracking-tight text-gray-900 mb-4">Order Confirmed!</h1>
            <p className="text-gray-500 max-w-lg mx-auto mb-12 text-lg">
                Thank you for your purchase. We&apos;ve sent a confirmation email to your inbox. Your order will be shipped within 24 hours.
            </p>

            <div className="flex gap-4">
                <Link href="/">
                    <Button variant="outline" size="lg">Return Home</Button>
                </Link>
                <Link href="/product">
                    <Button size="lg">Continue Shopping <ArrowRight size={16} className="ml-2" /></Button>
                </Link>
            </div>
        </div>
    );
}

export default function SuccessPage() {
    return (
        <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
            <Navbar />
            <main className="pt-32 pb-20 max-w-7xl mx-auto px-6 flex flex-col items-center justify-center min-h-[60vh]">
                <Suspense fallback={<div className="animate-pulse">Loading order details...</div>}>
                    <SuccessContent />
                </Suspense>
            </main>
            <Footer />
        </div>
    );
}
