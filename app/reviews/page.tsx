"use client";

import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Star, ThumbsUp } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

// Mock Data - Genuine, "Human" Reviews
const REVIEWS = [
    { id: 1, name: "sarah m.", stars: 5, date: "2 days ago", text: "honestly my back kills me usually after sitting all day but this actually helps?? i do it for like 5 mins before bed.", image: null },
    { id: 2, name: "james", stars: 5, date: "1 week ago", text: "super solid. feels like the one my chiro has. worth it.", image: null },
    { id: 3, name: "emily_k", stars: 4, date: "2 weeks ago", text: "good product. shipping was kinda slow but the thing itself works.", image: null },
    { id: 4, name: "mike b.", stars: 5, date: "3 weeks ago", text: "simple, effective. that pop when you first lay on it is insane lol.", image: null },
    { id: 5, name: "jess", stars: 5, date: "1 month ago", text: "obsessed. i keep it under my desk now.", image: null },
    { id: 6, name: "dave", stars: 3, date: "1 month ago", text: "it's uncomfy at first not gonna lie. gotta get used to it.", image: null },
];

export default function ReviewsPage() {
    const [filter, setFilter] = useState("5 Stars");

    return (
        <div className="min-h-screen bg-white text-gray-900">
            <Navbar />

            <main className="pt-32 pb-20 max-w-7xl mx-auto px-6">

                {/* Header */}
                <div className="text-center py-10 mb-12">
                    <h1 className="text-6xl font-light mb-4 text-gray-900">Customer Reviews</h1>
                    <div className="flex items-center justify-center gap-2 text-3xl text-yellow-400 mb-4">
                        <Star fill="currentColor" /> <Star fill="currentColor" /> <Star fill="currentColor" /> <Star fill="currentColor" /> <Star fill="currentColor" />
                    </div>
                    <p className="text-gray-500 text-xl">4.8 out of 5 stars (842 reviews)</p>
                </div>

                {/* Filter Bar */}
                <div className="flex flex-wrap justify-center gap-4 mb-16">
                    {["5 Stars", "4 Stars", "3 Stars"].map((option) => (
                        <button
                            key={option}
                            onClick={() => setFilter(option)}
                            className={cn(
                                "px-6 py-2 rounded-full border transition-all",
                                filter === option ? "bg-gray-900 text-white border-gray-900 font-medium" : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"
                            )}
                        >
                            {option}
                        </button>
                    ))}
                </div>

                {/* Reviews Grid (Masonry-ish) */}
                <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
                    {REVIEWS.map((review) => (
                        <div key={review.id} className="break-inside-avoid bg-gray-50 rounded-2xl p-6 border border-gray-100 hover:border-gray-200 transition-colors shadow-sm">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-3">
                                    {/* Generic PFP */}
                                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden">
                                        <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path>
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900 lowercase">{review.name}</p>
                                        <div className="flex text-yellow-400 text-xs gap-0.5">
                                            {Array(review.stars).fill(0).map((_, i) => <Star key={i} size={12} fill="currentColor" />)}
                                        </div>
                                    </div>
                                </div>
                                <span className="text-xs text-gray-400">{review.date}</span>
                            </div>

                            <p className="text-gray-600 leading-relaxed mb-4 lowercase">
                                {review.text}
                            </p>

                            <div className="flex items-center gap-4 pt-4 border-t border-gray-200 text-xs text-gray-400">
                                <span className="flex items-center gap-1 text-green-600 font-medium"><CheckCircle size={12} /> Verified Purchase</span>
                                <span className="flex items-center gap-1 hover:text-gray-600 cursor-pointer transition-colors"><ThumbsUp size={12} /> Helpful</span>
                            </div>
                        </div>
                    ))}
                </div>

            </main>
            <Footer />
        </div>
    );
}

function CheckCircle(props: any) {
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
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
    )
}
