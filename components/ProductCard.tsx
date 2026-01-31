"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import NextImage from "next/image";

interface Product {
    id: string;
    name: string;
    price: number;
    image: string;
    description: string;
}

export function ProductCard({ product }: { product: Product }) {
    return (
        <Link href="/product">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="group relative aspect-[4/5] bg-gray-50 rounded-3xl overflow-hidden cursor-pointer"
            >
                {/* Image */}
                <div className="absolute inset-0 p-8 flex items-center justify-center">
                    <NextImage
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-500"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                </div>

                {/* Overlay Details */}
                <div className="absolute inset-0 p-6 flex flex-col justify-end bg-gradient-to-t from-white/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="flex justify-between items-end">
                        <div>
                            <h3 className="text-xl font-medium text-gray-900">{product.name}</h3>
                            <p className="text-gray-600">${product.price}</p>
                        </div>
                        <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                            <ArrowRight size={18} />
                        </div>
                    </div>
                </div>

                {/* Static Details (Visible by default, hidden on hover) */}
                <div className="absolute bottom-6 left-6 group-hover:opacity-0 transition-opacity duration-300">
                    <h3 className="text-xl font-medium text-gray-900">{product.name}</h3>
                    <p className="text-gray-500">${product.price}</p>
                </div>
            </motion.div>
        </Link>
    );
}
