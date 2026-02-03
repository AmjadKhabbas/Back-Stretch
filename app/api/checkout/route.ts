import { NextResponse } from "next/server";
import Stripe from "stripe";

// Initialize Stripe (Server-Side)
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_fallback_key", {
    apiVersion: "2024-12-18.acacia" as any, // Suppress type mismatch for version
});

interface CartItem {
    name: string;
    image: string;
    price: number;
    quantity: number;
}

export async function POST(req: Request) {
    try {
        const { items, customerDetails } = await req.json();

        if (!items || items.length === 0) {
            return NextResponse.json({ error: "No items in cart" }, { status: 400 });
        }

        // Create Checkout Session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: items.map((item: CartItem) => ({
                price_data: {
                    currency: "usd",
                    product_data: {
                        name: item.name,
                        images: [item.image.startsWith("/") ? `${req.headers.get("origin")}${item.image}` : item.image],
                        // Note: Images need absolute URLs for Stripe
                    },
                    unit_amount: Math.round(item.price * 100),
                },
                quantity: item.quantity,
            })),
            mode: "payment",
            customer_email: customerDetails?.email, // Pre-fill email if passed
            success_url: `${req.headers.get("origin")}/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${req.headers.get("origin")}/cart`,
            metadata: {
                shipping_name: `${customerDetails?.firstName} ${customerDetails?.lastName}`,
                shipping_address: customerDetails?.address,
            }
        });

        return NextResponse.json({ sessionId: session.id });
    } catch (err: unknown) {
        console.error("Stripe Error:", err);
        const errorMessage = err instanceof Error ? err.message : "Internal Server Error";
        return NextResponse.json(
            { error: errorMessage },
            { status: 500 }
        );
    }
}
