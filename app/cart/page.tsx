"use client";

import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/Button";
import { QuantitySelector } from "@/components/ui/QuantitySelector";
import { useCartStore } from "@/store/cartStore";
import { Trash2, ShoppingCart, ArrowRight } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

export default function CartPage() {
    const { items, removeItem, updateQuantity, getCartTotal } = useCartStore();
    const [mounted, setMounted] = useState(false);

    useEffect(() => setMounted(true), []);

    if (!mounted) return null;

    return (
        <div className="min-h-screen bg-canvas text-white">
            <Navbar />

            <main className="pt-32 pb-20 max-w-7xl mx-auto px-6">
                <h1 className="text-4xl font-light mb-12">Your Cart ({items.length})</h1>

                {items.length === 0 ? (
                    <div className="text-center py-20 bg-white/5 rounded-3xl border border-white/10">
                        <ShoppingCart className="w-24 h-24 text-white/20 mx-auto mb-6" />
                        <h2 className="text-3xl text-white mb-4">Your cart is empty</h2>
                        <p className="text-white/50 mb-8">Looks like you haven&apos;t added any gear yet.</p>
                        <Link href="/product">
                            <Button>Continue Shopping <ArrowRight size={16} className="ml-2" /></Button>
                        </Link>
                    </div>
                ) : (
                    <div className="grid lg:grid-cols-3 gap-12">
                        {/* Cart Items */}
                        <div className="lg:col-span-2 space-y-6">
                            <AnimatePresence>
                                {items.map((item) => (
                                    <motion.div
                                        key={item.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                                        className="flex gap-6 p-6 bg-white/5 rounded-2xl border border-white/10 relative overflow-hidden group"
                                    >
                                        <div className="w-24 h-24 bg-black/20 rounded-xl shrink-0 p-2">
                                            <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                                        </div>

                                        <div className="flex-1">
                                            <div className="flex justify-between items-start mb-2">
                                                <h3 className="text-lg font-medium">{item.name}</h3>
                                                <p className="text-lg font-light">${(item.price * item.quantity).toFixed(2)}</p>
                                            </div>

                                            {item.color && (
                                                <p className="text-sm text-white/50 mb-4 flex items-center gap-2">
                                                    Color: <span className="w-3 h-3 rounded-full inline-block" style={{ backgroundColor: item.color === 'Blue' ? '#5b7bb4' : item.color.toLowerCase() }} /> {item.color}
                                                </p>
                                            )}

                                            <div className="flex items-center justify-between">
                                                <QuantitySelector
                                                    quantity={item.quantity}
                                                    onIncrease={() => updateQuantity(item.id, item.quantity + 1)}
                                                    onDecrease={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                                                    className="scale-90 origin-left"
                                                />
                                                <button
                                                    onClick={() => removeItem(item.id)}
                                                    className="text-white/30 hover:text-red-400 transition-colors p-2"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>

                        {/* Order Summary */}
                        <div className="lg:sticky lg:top-32 h-fit">
                            <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-8">
                                <h3 className="text-xl font-light mb-6">Order Summary</h3>

                                <div className="space-y-4 text-sm mb-8">
                                    <div className="flex justify-between text-white/70">
                                        <span>Subtotal</span>
                                        <span>${getCartTotal().toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-white/70">
                                        <span>Shipping</span>
                                        <span>$0.00</span>
                                    </div>
                                    <div className="flex justify-between text-white/70">
                                        <span>Tax</span>
                                        <span>Included</span>
                                    </div>
                                    <div className="border-t border-white/10 pt-4 flex justify-between text-lg font-medium text-white">
                                        <span>Total</span>
                                        <span>${getCartTotal().toFixed(2)}</span>
                                    </div>
                                </div>

                                <Link href="/checkout">
                                    <Button size="lg" className="w-full">
                                        Proceed to Checkout
                                    </Button>
                                </Link>

                                <div className="mt-6 flex items-center justify-center gap-2 text-white/40 text-xs">
                                    <span className="flex items-center gap-1"><ShieldCheck size={12} /> Secure Checkout</span>
                                </div>
                            </div>

                        </div>
                    </div>
                )}
            </main>
            <Footer />
        </div>
    );
}

function ShieldCheck(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
            <path d="m9 12 2 2 4-4" />
        </svg>
    )
}
