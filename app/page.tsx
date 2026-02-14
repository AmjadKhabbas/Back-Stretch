"use client";

import { Navbar } from "@/components/Navbar";
import ChipScroll from "@/components/ChipScroll";
import { Footer } from "@/components/Footer";
import { ProductCard } from "@/components/ProductCard";

const products = [
  {
    id: "1",
    name: "FlexCore Arc",
    price: 89.99,
    image: "/Sequence/frame_100.png",
    description: "The ultimate back relief solution.",
  },
];

export default function Home() {
  return (
    <main className="bg-white min-h-screen text-gray-900">
      <Navbar />

      {/* Scrollytelling Section */}
      <ChipScroll />

      {/* Product Showcase / Shop Section */}
      <section className="py-32 px-6 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between mb-16">
          <div>
            <h2 className="text-4xl font-light text-gray-900 tracking-tight mb-2">The Collection</h2>
            <p className="text-gray-500 font-light">Engineered for your well-being.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}

          {/* Placeholders */}
          <div className="aspect-[4/5] bg-gray-50 rounded-3xl flex items-center justify-center border border-dashed border-gray-200">
            <span className="text-gray-400 font-light">Coming Soon</span>
          </div>
          <div className="aspect-[4/5] bg-gray-50 rounded-3xl flex items-center justify-center border border-dashed border-gray-200">
            <span className="text-gray-400 font-light">Coming Soon</span>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
