"use client";

import { Navbar } from "@/components/Navbar";
import ChipScroll from "@/components/ChipScroll";
import CheckoutOverlay from "@/components/CheckoutOverlay";

export default function Home() {
  return (
    <main className="bg-white min-h-screen text-gray-900 overflow-hidden">
      <Navbar />

      {/* Cinematic Auto-Play Experience */}
      <ChipScroll />

      {/* Persistent Checkout CTA */}
      <CheckoutOverlay />
    </main>
  );
}
