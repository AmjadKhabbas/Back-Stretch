"use client";

import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/Button";
import { CheckCircle, ArrowRight, Package } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useCartStore } from "@/store/cartStore";
import { useSearchParams } from "next/navigation";

export default function SuccessPage() {
    const clearCart = useCartStore((state) => state.clearCart);
    const [orderNumber, setOrderNumber] = useState("00000");

    // Clear cart on mount if successful
    useEffect(() => {
        clearCart();
        setOrderNumber(String(Math.floor(Math.random() * 90000) + 10000));
    }, [clearCart]);

    return (
        <div className="min-h-screen bg-canvas text-white">
            <Navbar />

            <main className="min-h-screen flex items-center justify-center pt-20 pb-20 px-6">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-center max-w-2xl w-full"
                >
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: "spring" }}
                        className="w-32 h-32 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-8 ring-4 ring-green-500/10"
                    >
                        <CheckCircle className="w-16 h-16 text-green-400" />
                    </motion.div>

                    <h1 className="text-5xl font-light mb-4 text-shadow-hero">
                        Order Confirmed!
                    </h1>

                    <p className="text-white/60 text-lg mb-12">
                        Thanks for your purchase! Your FlexCore Arc is being prepared for shipment.
                    </p>

                    <div className="bg-white/5 rounded-2xl p-8 mb-12 text-left border border-white/10">
                        <div className="flex items-center gap-3 mb-6 pb-6 border-b border-white/10">
                            <Package className="text-blue-400" />
                            <h3 className="font-medium">Order Details</h3>
                        </div>
                        <div className="space-y-3 text-white/80">
                            <div className="flex justify-between">
                                <span className="text-white/40">Order Number</span>
                                <span className="font-mono">FC-{orderNumber}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-white/40">Estimated Delivery</span>
                                <span>Feb 2 - Feb 5, 2026</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-white/40">Status</span>
                                <span className="text-green-400 flex items-center gap-2">Processing</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-4 justify-center">
                        <Link href="/">
                            <Button variant="secondary" size="lg">Return Home</Button>
                        </Link>
                        <Button size="lg">
                            Track Order <ArrowRight size={16} className="ml-2" />
                        </Button>
                    </div>
                </motion.div>
            </main>
            <Footer />
        </div>
    );
}
