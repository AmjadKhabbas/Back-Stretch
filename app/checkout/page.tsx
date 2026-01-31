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
import { Check, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

// Schema for shipping form
const shippingSchema = z.object({
    firstName: z.string().min(2, "Required"),
    lastName: z.string().min(2, "Required"),
    email: z.string().email("Invalid email"),
    address: z.string().min(5, "Required"),
    city: z.string().min(2, "Required"),
    zip: z.string().min(4, "Required"),
});

type ShippingFormData = z.infer<typeof shippingSchema>;

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function CheckoutPage() {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const { items, getCartTotal } = useCartStore();

    const { register, handleSubmit, formState: { errors }, watch } = useForm<ShippingFormData>({
        resolver: zodResolver(shippingSchema),
    });

    const formData = watch();

    const handlePayment = async (data: ShippingFormData) => {
        setLoading(true);
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
            alert("Checkout failed. Check console.");
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-canvas text-white">
            <Navbar />

            <main className="pt-32 pb-20 max-w-7xl mx-auto px-6">
                <h1 className="text-4xl font-light mb-12">Checkout</h1>

                <div className="grid lg:grid-cols-2 gap-16">

                    {/* Left Column: Flow */}
                    <div>
                        {/* Steps Indicator */}
                        <div className="flex items-center gap-4 mb-12">
                            <div className={cn("flex items-center gap-2", step >= 1 ? "text-blue-400" : "text-white/30")}>
                                <div className="w-8 h-8 rounded-full border-2 border-current flex items-center justify-center font-bold">1</div>
                                <span className="font-medium">Shipping</span>
                            </div>
                            <div className="w-12 h-px bg-white/10" />
                            <div className={cn("flex items-center gap-2", step >= 2 ? "text-blue-400" : "text-white/30")}>
                                <div className="w-8 h-8 rounded-full border-2 border-current flex items-center justify-center font-bold">2</div>
                                <span className="font-medium">Payment</span>
                            </div>
                        </div>

                        {/* Step 1: Shipping Form */}
                        {step === 1 && (
                            <form onSubmit={handleSubmit((d) => setStep(2))} className="space-y-6 animate-in slide-in-from-left-4 fade-in duration-500">
                                <div className="grid grid-cols-2 gap-4">
                                    <Input label="First Name" {...register("firstName")} error={errors.firstName?.message} />
                                    <Input label="Last Name" {...register("lastName")} error={errors.lastName?.message} />
                                </div>
                                <Input label="Email Address" type="email" {...register("email")} error={errors.email?.message} />
                                <Input label="Street Address" {...register("address")} error={errors.address?.message} />
                                <div className="grid grid-cols-2 gap-4">
                                    <Input label="City" {...register("city")} error={errors.city?.message} />
                                    <Input label="ZIP Code" {...register("zip")} error={errors.zip?.message} />
                                </div>

                                <Button type="submit" size="lg" className="w-full mt-6">
                                    Continue to Payment <Check className="ml-2 w-4 h-4" />
                                </Button>
                            </form>
                        )}

                        {/* Step 2: Review & Pay */}
                        {step === 2 && (
                            <div className="space-y-8 animate-in slide-in-from-left-4 fade-in duration-500">
                                <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="font-medium text-white/70">Shipping To</h3>
                                        <button onClick={() => setStep(1)} className="text-blue-400 text-sm hover:underline">Edit</button>
                                    </div>
                                    <p className="text-lg">{formData.firstName} {formData.lastName}</p>
                                    <p className="text-white/60">{formData.address}</p>
                                    <p className="text-white/60">{formData.city}, {formData.zip}</p>
                                </div>

                                <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                                    <h3 className="font-medium text-white/70 mb-4">Payment Method</h3>
                                    <div className="flex items-center gap-2 p-3 bg-black/20 rounded border border-white/5">
                                        <ShieldCheck className="text-green-400" size={18} />
                                        <span className="text-sm">Secure Redirect to Stripe</span>
                                    </div>
                                </div>

                                <Button
                                    onClick={handleSubmit(handlePayment)}
                                    disabled={loading}
                                    size="lg"
                                    className="w-full"
                                >
                                    {loading ? <Loader2 className="animate-spin" /> : `Pay $${getCartTotal().toFixed(2)}`}
                                </Button>
                            </div>
                        )}
                    </div>

                    {/* Right Column: Order Summary (Sticky) */}
                    <div className="lg:sticky lg:top-32 h-fit">
                        <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-8">
                            <h3 className="text-xl font-light mb-6">Your Order</h3>
                            <div className="space-y-4 mb-8">
                                {items.map(item => (
                                    <div key={item.id} className="flex gap-4">
                                        <div className="w-16 h-16 bg-white/5 rounded-lg p-1">
                                            <img src={item.image} className="w-full h-full object-contain" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-medium line-clamp-1">{item.name}</p>
                                            <p className="text-sm text-white/50">Qty: {item.quantity}</p>
                                        </div>
                                        <p>${(item.price * item.quantity).toFixed(2)}</p>
                                    </div>
                                ))}
                            </div>
                            <div className="border-t border-white/10 pt-4 flex justify-between text-xl font-medium">
                                <span>Total Today</span>
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
