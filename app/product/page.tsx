"use client";

import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/Button";
import { QuantitySelector } from "@/components/ui/QuantitySelector";
import { useCartStore } from "@/store/cartStore";
import { Check, ShieldCheck, Truck, ArrowLeft, Star } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

export default function ProductPage() {
    const router = useRouter();
    const [currentFrame, setCurrentFrame] = useState(100); // Default to hero shot
    const [quantity, setQuantity] = useState(1);
    const [activeTab, setActiveTab] = useState("specs");

    const addItem = useCartStore((state) => state.addItem);

    const handleAddToCart = () => {
        addItem({
            id: `flexcore-arc`,
            name: "FlexCore Arc Back Stretcher",
            price: 49.99,
            quantity,
            image: `/sequence/frame_${String(currentFrame).padStart(3, '0')}.png`,
        });
    };

    const handleBuyNow = () => {
        handleAddToCart();
        router.push("/checkout");
    }

    // Anchor Frames for Gallery
    const GALLERY_FRAMES = [1, 60, 150];

    return (
        <div className="min-h-screen bg-white text-gray-900">
            <Navbar />

            <main className="pt-32 pb-20 max-w-7xl mx-auto px-6">
                <Link href="/" className="inline-flex items-center text-gray-500 hover:text-gray-900 mb-8 transition-colors">
                    <ArrowLeft size={16} className="mr-2" /> Back to Home
                </Link>

                <div className="grid lg:grid-cols-2 gap-16 mb-24">
                    {/* Left Column: Gallery (Sticky) */}
                    <div className="relative h-fit lg:sticky lg:top-32">
                        <div className="aspect-square bg-gray-50 rounded-3xl border border-gray-100 flex items-center justify-center p-12 mb-6 overflow-hidden relative group">
                            <motion.img
                                key={currentFrame} // Trigger animation on change
                                src={`/sequence/frame_${String(currentFrame).padStart(3, '0')}.png`}
                                alt="FlexCore Arc"
                                className="w-full h-full object-contain drop-shadow-2xl z-10 mix-blend-multiply"
                                style={{ clipPath: "inset(10px)" }} // HACK: Crop black borders
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.3 }}
                            />
                        </div>
                        <div className="grid grid-cols-4 gap-4">
                            {GALLERY_FRAMES.map((frame, i) => (
                                <button
                                    key={i}
                                    onClick={() => setCurrentFrame(frame)}
                                    className={cn(
                                        "aspect-square bg-gray-50 rounded-xl border transition-all cursor-pointer p-2 overflow-hidden",
                                        currentFrame === frame ? "border-blue-500 ring-2 ring-blue-500/20" : "border-gray-100 hover:border-blue-400/50"
                                    )}
                                >
                                    <img
                                        src={`/sequence/frame_${String(frame).padStart(3, '0')}.png`}
                                        className="w-full h-full object-contain mix-blend-multiply opacity-90"
                                        style={{ clipPath: "inset(5px)" }} // Mask thumbnail borders too
                                    />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Right Column: Details */}
                    <div>
                        <h1 className="text-5xl font-light tracking-tight text-gray-900 mb-4">
                            FlexCore Arc Back Stretcher
                        </h1>
                        <p className="text-gray-500 text-lg mb-8 font-light">
                            3-Layer Ergonomic Design for Lumbar Relief
                        </p>

                        <div className="flex items-end gap-4 mb-8">
                            <span className="text-4xl font-light text-gray-900">$49.99</span>
                            <span className="text-gray-400 line-through text-xl">$79.99</span>
                            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">Save $30</span>
                        </div>

                        {/* Quantity */}
                        <div className="flex items-center gap-4 mb-10">
                            <label className="text-gray-500">Quantity</label>
                            <QuantitySelector
                                quantity={quantity}
                                onIncrease={() => setQuantity(q => q + 1)}
                                onDecrease={() => setQuantity(q => Math.max(1, q - 1))}
                            />
                        </div>

                        {/* CTAs */}
                        <div className="flex flex-col gap-4 mb-10">
                            <Button onClick={handleAddToCart} size="lg" className="w-full py-5 text-lg shadow-xl shadow-blue-900/10">
                                Add to Cart — ${(49.99 * quantity).toFixed(2)}
                            </Button>
                            <Button onClick={handleBuyNow} variant="outline" size="lg" className="w-full py-5 text-lg border-gray-300 hover:bg-gray-50 text-gray-900">
                                Buy Now (Express Checkout)
                            </Button>
                        </div>

                        {/* Trust Signals */}
                        <div className="space-y-3 text-sm text-gray-500 pt-8 border-t border-gray-100">
                            <div className="flex items-center gap-3">
                                <Truck size={18} className="text-blue-600" /> Free shipping on orders over $50
                            </div>
                            <div className="flex items-center gap-3">
                                <ShieldCheck size={18} className="text-blue-600" /> 30-day money-back guarantee
                            </div>
                            <div className="flex items-center gap-3">
                                <Check size={18} className="text-blue-600" /> Ships within 2-3 business days
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabbed Content */}
                <div className="max-w-4xl mx-auto">
                    <div className="flex border-b border-gray-200 mb-8">
                        {['specs', 'how-it-works', 'reviews'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={cn(
                                    "px-8 py-4 text-sm font-medium transition-colors relative",
                                    activeTab === tab ? "text-gray-900" : "text-gray-400 hover:text-gray-600"
                                )}
                            >
                                {tab === 'specs' && 'Specifications'}
                                {tab === 'how-it-works' && 'How It Works'}
                                {tab === 'reviews' && 'Reviews (2.8k)'}
                                {activeTab === tab && (
                                    <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900" />
                                )}
                            </button>
                        ))}
                    </div>

                    <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100 min-h-[300px]">
                        {activeTab === 'specs' && (
                            <div className="grid md:grid-cols-2 gap-8">
                                <div>
                                    <h3 className="text-xl text-gray-900 mb-4">Technical Details</h3>
                                    <ul className="space-y-4 text-gray-600">
                                        <li className="flex justify-between border-b border-gray-200 pb-2"><span>Dimensions</span> <span>15&quot; × 10&quot; × 4&quot;</span></li>
                                        <li className="flex justify-between border-b border-gray-200 pb-2"><span>Weight</span> <span>2.1 lbs</span></li>
                                        <li className="flex justify-between border-b border-gray-200 pb-2"><span>Material</span> <span>Medical-grade TPE, ABS</span></li>
                                        <li className="flex justify-between border-b border-gray-200 pb-2"><span>Load Capacity</span> <span>350 lbs</span></li>
                                    </ul>
                                </div>
                                <div>
                                    <h3 className="text-xl text-gray-900 mb-4">In The Box</h3>
                                    <ul className="list-disc pl-5 space-y-2 text-gray-600">
                                        <li>FlexCore Arc Base Unit</li>
                                        <li>Memory Foam Comfort Strip</li>
                                        <li>User Guide & Exercise Chart</li>
                                        <li>Travel Bag</li>
                                    </ul>
                                </div>
                            </div>
                        )}
                        {activeTab === 'reviews' && (
                            <div className="text-center py-10">
                                <div className="flex items-center justify-center gap-1 text-yellow-400 mb-4">
                                    {[1, 2, 3, 4, 5].map(i => <Star key={i} fill="currentColor" />)}
                                </div>
                                <h3 className="text-2xl text-gray-900 mb-2">4.8 out of 5 Stars</h3>
                                <p className="text-gray-500 mb-6">Based on 2,847 verified reviews</p>
                                <Link href="/reviews">
                                    <Button variant="secondary" className="bg-white text-gray-900 border border-gray-200 hover:bg-gray-50">View All Reviews</Button>
                                </Link>
                            </div>
                        )}
                        {activeTab === 'how-it-works' && (
                            <div className="grid md:grid-cols-3 gap-8 text-center">
                                {[1, 2, 3].map((step) => (
                                    <div key={step} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                                        <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-xl">
                                            {step}
                                        </div>
                                        <h4 className="text-gray-900 font-medium mb-2">Step {step}</h4>
                                        <p className="text-gray-500 text-sm">
                                            {step === 1 ? "Place the device on a flat, non-slip surface like a yoga mat or carpet." :
                                                step === 2 ? "Slowly lie back onto the arch, aligning it with your lower spine." :
                                                    "Relax for 5-10 minutes as gravity decompresses your vertebrae."}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

            </main>

            <Footer />
        </div>
    );
}
