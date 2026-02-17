"use client";

import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/Button";
import { QuantitySelector } from "@/components/ui/QuantitySelector";
import { useCartStore } from "@/store/cartStore";
import { Trash2, ShoppingCart, ArrowRight, ShieldCheck, Package } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export default function CartPage() {
    const { items, removeItem, updateQuantity, getCartTotal } = useCartStore();
    const [mounted, setMounted] = useState(false);

    useEffect(() => setMounted(true), []);

    if (!mounted) return null;

    return (
        <div className="min-h-screen bg-gray-50 text-gray-900 font-sans selection:bg-blue-100 selection:text-blue-900">
            <Navbar />

            <main className="pt-32 pb-20 max-w-7xl mx-auto px-6">
                <h1 className="text-4xl font-light tracking-tight mb-4 text-gray-900">Your Cart</h1>
                <p className="text-gray-500 mb-12">Review your selected items before checkout.</p>

                {items.length === 0 ? (
                    <div className="text-center py-32 bg-white rounded-3xl border border-dashed border-gray-200 shadow-sm max-w-3xl mx-auto">
                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <ShoppingCart className="w-8 h-8 text-gray-400" />
                        </div>
                        <h2 className="text-2xl font-medium text-gray-900 mb-2">Your cart is empty</h2>
                        <p className="text-gray-500 mb-8 max-w-md mx-auto">Looks like you haven&apos;t added any gear yet. Explore our products to find what moves you.</p>
                        <Link href="/product">
                            <Button size="lg" className="pl-6 pr-4">
                                Start Shopping <ArrowRight size={16} className="ml-2" />
                            </Button>
                        </Link>
                    </div>
                ) : (
                    <div className="grid lg:grid-cols-3 gap-12">
                        {/* Cart Items */}
                        <div className="lg:col-span-2 space-y-4">
                            <p className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">{items.length} Items</p>
                            <AnimatePresence mode="popLayout">
                                {items.map((item) => (
                                    <motion.div
                                        layout
                                        key={item.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        transition={{ duration: 0.2 }}
                                        className="flex gap-6 p-4 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group"
                                    >
                                        <div className="w-24 h-24 bg-gray-50 rounded-xl shrink-0 p-2 border border-gray-100 flex items-center justify-center">
                                            <img src={item.image} alt={item.name} className="w-full h-full object-contain mix-blend-multiply" />
                                        </div>

                                        <div className="flex-1 flex flex-col justify-between py-1">
                                            <div className="flex justify-between items-start gap-4">
                                                <div>
                                                    <h3 className="text-lg font-medium text-gray-900 leading-tight">{item.name}</h3>
                                                    {item.color && (
                                                        <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
                                                            <span className="w-2 h-2 rounded-full ring-1 ring-gray-200" style={{ backgroundColor: item.color === 'Blue' ? '#5b7bb4' : item.color.toLowerCase() }} />
                                                            {item.color}
                                                        </p>
                                                    )}
                                                </div>
                                                <p className="text-lg font-semibold text-gray-900">${(item.price * item.quantity).toFixed(2)}</p>
                                            </div>

                                            <div className="flex items-center justify-between mt-4">
                                                <QuantitySelector
                                                    quantity={item.quantity}
                                                    onIncrease={() => updateQuantity(item.id, item.quantity + 1)}
                                                    onDecrease={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                                                    className="w-fit"
                                                />
                                                <button
                                                    onClick={() => removeItem(item.id)}
                                                    className="text-gray-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-lg transition-all"
                                                    aria-label="Remove item"
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
                            <div className="bg-white rounded-2xl border border-gray-100 shadow-lg shadow-gray-200/50 p-8">
                                <h3 className="text-xl font-medium text-gray-900 mb-6">Order Summary</h3>

                                <div className="space-y-4 text-sm mb-8">
                                    <div className="flex justify-between text-gray-600">
                                        <span>Subtotal</span>
                                        <span className="font-medium text-gray-900">${getCartTotal().toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-600">
                                        <span>Shipping</span>
                                        <span className="text-green-600 font-medium">Free</span>
                                    </div>
                                    <div className="flex justify-between text-gray-600">
                                        <span>Tax</span>
                                        <span className="text-gray-400">Calculated at checkout</span>
                                    </div>
                                    <div className="border-t border-gray-100 pt-4 flex justify-between text-lg font-bold text-gray-900">
                                        <span>Total</span>
                                        <span>${getCartTotal().toFixed(2)}</span>
                                    </div>
                                </div>

                                <Link href="/checkout" className="block">
                                    <Button size="lg" className="w-full bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20 py-6 text-lg">
                                        Checkout <ArrowRight className="ml-2 w-5 h-5" />
                                    </Button>
                                </Link>

                                <div className="mt-8 space-y-3">
                                    <div className="flex items-start gap-3 text-xs text-gray-500">
                                        <ShieldCheck className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                                        <span>Secure SSL Encryption. Your transaction is safe.</span>
                                    </div>
                                    <div className="flex items-start gap-3 text-xs text-gray-500">
                                        <Package className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                                        <span>Free shipping on orders over $50. Returns accepted within 30 days.</span>
                                    </div>
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
