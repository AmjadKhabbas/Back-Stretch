"use client";

import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useCartStore } from "@/store/cartStore";
import { loadStripe } from "@stripe/stripe-js";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Check, Loader2, ShieldCheck, CreditCard, ShoppingBag, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useRouter } from "next/navigation";

// Schema for shipping form
const shippingSchema = z.object({
    firstName: z.string().min(2, "Required"),
    lastName: z.string().min(2, "Required"),
    email: z.string().email("Invalid email"),
    address: z.string().min(5, "Required"),
    city: z.string().min(2, "Required"),
    zip: z.string().min(4, "Required"),
    emailOptIn: z.boolean().optional(),
});

type ShippingFormData = z.infer<typeof shippingSchema>;

// Initialize Stripe gracefully
const stripePromise = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
    ? loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
    : null;

export default function CheckoutPage() {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const { items, getCartTotal, clearCart } = useCartStore();
    const router = useRouter();

    const { register, handleSubmit, formState: { errors }, watch } = useForm<ShippingFormData>({
        resolver: zodResolver(shippingSchema),
    });

    const formData = watch();

    const handlePayment = async (data: ShippingFormData) => {
        setLoading(true);

        // Mock payment if stripe key is missing or for demo purposes if desired
        if (!stripePromise) {
            console.warn("Stripe key missing, simulating successful checkout.");
            await new Promise(resolve => setTimeout(resolve, 2000)); // Fake network delay
            clearCart();
            router.push('/success?mock=true');
            return;
        }

        try {
            const stripe = await stripePromise;
            if (!stripe) throw new Error("Stripe not loaded");

            const response = await fetch("/api/checkout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    items,
                    customerDetails: data
                }),
            });

            const { sessionId, error } = await response.json();
            if (error) throw new Error(error);

            await (stripe as any).redirectToCheckout({ sessionId });
        } catch (err) {
            console.error(err);
            // Fallback for demo if backend fails or is not set up
            if (confirm("Checkout failed (likely no backend). Simulate success?")) {
                clearCart();
                router.push('/success?mock=true');
            }
            setLoading(false);
        }
    };

    if (items.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-medium text-gray-900 mb-4">Your cart is empty</h2>
                    <Link href="/product"><Button>Return to Shop</Button></Link>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
            <Navbar />

            <main className="pt-32 pb-20 max-w-7xl mx-auto px-6">
                <div className="flex items-center gap-4 mb-8">
                    <Link href="/cart" className="text-gray-500 hover:text-gray-900 transition-colors">
                        <ArrowLeft size={20} />
                    </Link>
                    <h1 className="text-3xl font-light tracking-tight text-gray-900">Checkout</h1>
                </div>

                <div className="grid lg:grid-cols-2 gap-16 items-start">

                    {/* Left Column: Flow */}
                    <div className="space-y-8">
                        {/* Steps Indicator */}
                        <div className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
                            <div className={cn("flex items-center gap-3 px-4 py-2 rounded-lg transition-colors", step >= 1 ? "bg-blue-50 text-blue-700" : "text-gray-400")}>
                                <div className={cn("w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs border", step >= 1 ? "border-blue-200 bg-blue-100" : "border-gray-200")}>1</div>
                                <span className="font-medium text-sm">Shipping</span>
                            </div>
                            <div className="w-8 h-px bg-gray-200" />
                            <div className={cn("flex items-center gap-3 px-4 py-2 rounded-lg transition-colors", step >= 2 ? "bg-blue-50 text-blue-700" : "text-gray-400")}>
                                <div className={cn("w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs border", step >= 2 ? "border-blue-200 bg-blue-100" : "border-gray-200")}>2</div>
                                <span className="font-medium text-sm">Payment</span>
                            </div>
                        </div>

                        {/* Step 1: Shipping Form */}
                        {step === 1 && (
                            <form onSubmit={handleSubmit((d) => setStep(2))} className="space-y-6 animate-in fade-in slide-in-from-left-4 duration-500">
                                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
                                    <h2 className="text-lg font-medium mb-6 flex items-center gap-2">
                                        <ShoppingBag size={18} className="text-blue-500" /> Shipping Information
                                    </h2>
                                    <div className="grid grid-cols-2 gap-4">
                                        <Input label="First Name" {...register("firstName")} error={errors.firstName?.message} />
                                        <Input label="Last Name" {...register("lastName")} error={errors.lastName?.message} />
                                    </div>
                                    <div className="mt-4">
                                        <Input label="Email Address" type="email" {...register("email")} error={errors.email?.message} />
                                    </div>
                                    <div className="mt-4">
                                        <Input label="Street Address" {...register("address")} error={errors.address?.message} />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4 mt-4">
                                        <Input label="City" {...register("city")} error={errors.city?.message} />
                                        <Input label="ZIP Code" {...register("zip")} error={errors.zip?.message} />
                                    </div>
                                    <div className="mt-6 flex items-start gap-3">
                                        <input type="checkbox" id="emailOptIn" {...register("emailOptIn")} className="mt-1 w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500" />
                                        <label htmlFor="emailOptIn" className="text-sm text-gray-600 leading-snug">
                                            Send me order confirmation and exclusive offers to my email
                                        </label>
                                    </div>
                                </div>

                                <Button type="submit" size="lg" className="w-full h-14 text-lg">
                                    Continue to Payment <Check className="ml-2 w-5 h-5" />
                                </Button>
                            </form>
                        )}

                        {/* Step 2: Review & Pay */}
                        {step === 2 && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-left-4 duration-500">
                                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                                    <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-100">
                                        <h3 className="font-medium text-gray-500 text-sm uppercase tracking-wide">Shipping To</h3>
                                        <button onClick={() => setStep(1)} className="text-blue-600 text-sm font-medium hover:underline">Edit</button>
                                    </div>
                                    <div className="text-gray-900 font-medium">{formData.firstName} {formData.lastName}</div>
                                    <div className="text-gray-600">{formData.address}</div>
                                    <div className="text-gray-600">{formData.city}, {formData.zip}</div>
                                    <div className="text-gray-600 mt-1">{formData.email}</div>
                                </div>

                                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                                    <h3 className="font-medium text-gray-500 text-sm uppercase tracking-wide mb-4">Payment Method</h3>
                                    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
                                        <div className="w-10 h-6 bg-gray-200 rounded flex items-center justify-center">
                                            <span className="text-[10px] font-bold text-gray-500">CARD</span>
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-gray-900">Credit / Debit Card</p>
                                            <p className="text-xs text-gray-500">Securely processed via Stripe</p>
                                        </div>
                                        <ShieldCheck className="text-green-500" size={18} />
                                    </div>
                                </div>

                                <Button
                                    onClick={handleSubmit(handlePayment)}
                                    disabled={loading}
                                    size="lg"
                                    className="w-full h-14 text-lg bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/20"
                                >
                                    {loading ? <Loader2 className="animate-spin" /> : `Pay $${getCartTotal().toFixed(2)}`}
                                </Button>
                                <p className="text-center text-xs text-gray-400">By paying, you agree to our Terms of Service.</p>
                            </div>
                        )}
                    </div>

                    {/* Right Column: Order Summary (Sticky) */}
                    <div className="lg:sticky lg:top-32 h-fit">
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-lg shadow-gray-200/50 p-8">
                            <h3 className="text-xl font-medium mb-6 text-gray-900">Your Order</h3>
                            <div className="space-y-4 mb-8 max-h-[400px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-200">
                                {items.map(item => (
                                    <div key={item.id} className="flex gap-4 group">
                                        <div className="w-16 h-16 bg-gray-50 rounded-lg p-1 border border-gray-100 shrink-0">
                                            <img src={item.image} className="w-full h-full object-contain mix-blend-multiply" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium text-gray-900 truncate">{item.name}</p>
                                            <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                                        </div>
                                        <p className="font-medium text-gray-900">${(item.price * item.quantity).toFixed(2)}</p>
                                    </div>
                                ))}
                            </div>
                            <div className="space-y-3 pt-6 border-t border-gray-100">
                                <div className="flex justify-between text-gray-600">
                                    <span>Subtotal</span>
                                    <span>${getCartTotal().toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>Shipping</span>
                                    <span className="text-green-600 font-medium">Free</span>
                                </div>
                            </div>
                            <div className="border-t border-gray-100 pt-6 mt-6 flex justify-between text-2xl font-bold text-gray-900">
                                <span>Total</span>
                                <span>${getCartTotal().toFixed(2)}</span>
                            </div>
                        </div>
                    </div>

                </div>
            </main>
            <Footer />
        </div>
    );
}
