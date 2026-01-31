"use client";

import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { motion } from "framer-motion";

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-white text-gray-900">
            <Navbar />

            <main className="pt-32 pb-20">

                {/* Hero Section */}
                <section className="max-w-4xl mx-auto px-6 mb-24 text-center">
                    <motion.span
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-blue-600 font-bold tracking-widest text-xs uppercase mb-4 block"
                    >
                        Our Story
                    </motion.span>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-5xl md:text-7xl font-light tracking-tighter mb-8"
                    >
                        Redefining Relief.
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-xl md:text-2xl text-gray-500 font-light leading-relaxed max-w-2xl mx-auto"
                    >
                        We believe that a healthy spine is the foundation of a vibrant life. FlexCore was born from a simple mission: to make chiropractic-grade decompression accessible to everyone.
                    </motion.p>
                </section>

                {/* Editorial Image */}
                <section className="w-full h-[60vh] bg-gray-100 mb-24 overflow-hidden relative">
                    <img
                        src="/sequence/frame_060.png"
                        alt="FlexCore Engineering"
                        className="w-full h-full object-cover object-center mix-blend-multiply opacity-50 grayscale"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="glass-panel p-12 rounded-2xl backdrop-blur-md bg-white/60 border border-white/40 shadow-xl max-w-lg mx-6">
                            <h3 className="text-3xl font-light mb-4">Precision Engineered</h3>
                            <p className="text-gray-700">
                                Every curve of the FlexCore Arc is calculated to match the natural lumbar lordosis. It's not just a piece of plastic; it's a medical device designed to reverse the effects of gravity.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Values Grid */}
                <section className="max-w-7xl mx-auto px-6 mb-24">
                    <div className="grid md:grid-cols-3 gap-12">
                        <div>
                            <h3 className="text-2xl font-light mb-4 border-l-4 border-blue-500 pl-4">Science First</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Our development process involves consultation with chiropractors and physiotherapists to ensure safety and efficacy. We don't guess; we test.
                            </p>
                        </div>
                        <div>
                            <h3 className="text-2xl font-light mb-4 border-l-4 border-emerald-500 pl-4">Sustainable Design</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Built with high-density, recyclable ABS and medical-grade TPE. We are committed to reducing our environmental footprint while increasing your comfort.
                            </p>
                        </div>
                        <div>
                            <h3 className="text-2xl font-light mb-4 border-l-4 border-purple-500 pl-4">Customer Obsession</h3>
                            <p className="text-gray-600 leading-relaxed">
                                With over 10,000 happy spines, our community is our greatest asset. We listen to feedback and constantly iterate on our design.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Team / Founder Note (Optional Placeholder) */}
                <section className="max-w-3xl mx-auto px-6 text-center bg-gray-50 rounded-3xl p-16 border border-gray-100">
                    <h2 className="text-3xl font-light mb-8">"Pain shouldn't be the price of productivity."</h2>
                    <p className="text-gray-500 text-lg italic mb-6">
                        — The Founding Team
                    </p>
                </section>

            </main>
            <Footer />
        </div>
    );
}
