"use client";

import { useScroll, useTransform, motion, useSpring } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { ArrowRight, CheckCircle2, ChevronDown } from "lucide-react";

const TOTAL_FRAMES = 240;

export default function ChipScroll() {
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [images, setImages] = useState<HTMLImageElement[]>([]);
    const [imagesLoaded, setImagesLoaded] = useState(false);
    const [loadProgress, setLoadProgress] = useState(0);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"],
    });

    // Smooth spring physics for frame interpolation (The "Butter" factor)
    const smoothProgress = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    // Smooth Scrubbing Logic: Play full animation 1 -> 240
    const targetFrame = useTransform(scrollYProgress,
        [0, 1],
        [1, 240]
    );

    const frameIndex = useSpring(targetFrame, { stiffness: 200, damping: 20 }); // Smooth the jump slightly

    // Dynamic Canvas Offset Logic (Editorial Layout) - Synced with Strict Snaps
    const canvasOffsetX = useTransform(scrollYProgress,
        [0, 0.3, 0.31, 0.6, 0.61, 1],
        [0, 0, 25, 25, -25, -25] // Center -> Right Panel -> Left Panel
    );

    // Text Overlay Opacities
    const opacityHero = useTransform(scrollYProgress, [0, 0.15], [1, 0]);
    const opacityFeature = useTransform(scrollYProgress, [0.2, 0.3, 0.45, 0.55], [0, 1, 1, 0]);
    const opacityBenefit = useTransform(scrollYProgress, [0.6, 0.7, 0.85, 0.95], [0, 1, 1, 0]);
    const opacityCTA = useTransform(scrollYProgress, [0.9, 1], [0, 1]);

    // Preload Images
    useEffect(() => {
        let isMounted = true;
        const loadImages = async () => {
            let loaded = 0;
            const promises = Array.from({ length: TOTAL_FRAMES }, (_, i) => {
                return new Promise<HTMLImageElement>((resolve) => {
                    const img = new Image();
                    const frameNum = String(i + 1).padStart(3, "0");
                    img.src = `/sequence/frame_${frameNum}.png`;
                    img.onload = () => {
                        if (isMounted) {
                            loaded++;
                            setLoadProgress(Math.round((loaded / TOTAL_FRAMES) * 100));
                        }
                        resolve(img);
                    };
                    img.onerror = () => resolve(img); // Fail gracefully
                });
            });

            const imgs = await Promise.all(promises);
            if (isMounted) {
                setImages(imgs);
                setImagesLoaded(true);
            }
        };
        loadImages();
        return () => { isMounted = false; };
    }, []);

    // High-Fidelity Render Loop
    useEffect(() => {
        if (!imagesLoaded || images.length === 0) return;

        const render = () => {
            const canvas = canvasRef.current;
            if (!canvas) return;

            const ctx = canvas.getContext("2d", { alpha: false }); // Opt: Disable alpha for perf
            if (!ctx) return;

            // 1. Get current smooth frame
            const index = Math.min(Math.round(frameIndex.get()), images.length - 1);
            const img = images[index];
            if (!img) return;

            // Safety check: ensure image has valid dimensions to avoid NaN
            if (!img.width || !img.height) return;

            // 2. Retina Scaling (The "Crispness" factor)
            const dpr = Math.min(window.devicePixelRatio || 1, 3); // Cap at 3x
            const rect = canvas.getBoundingClientRect();

            // Allow canvas resolution to match display resolution
            canvas.width = rect.width * dpr;
            canvas.height = rect.height * dpr;

            // Reset transform before drawing
            ctx.setTransform(1, 0, 0, 1, 0, 0);
            ctx.scale(dpr, dpr);

            // 3. High Quality Settings
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'high';
            ctx.fillStyle = "#ffffff";
            ctx.fillRect(0, 0, rect.width, rect.height);

            // 4. Calculate Contain Logic with "Crisp Cap"
            // Start with a base relative scale (60% of viewport width)
            // But CAP it at 1000px to avoid upscaling on large screens (keeping it "minimized" & sharp)
            const MAX_WIDTH = 1000;
            let targetDrawWidth = Math.min(rect.width * 0.6, MAX_WIDTH);

            // Adjust for mobile (give it more width on small screens)
            if (rect.width < 768) {
                targetDrawWidth = rect.width * 0.85;
            }

            const imgAspect = img.width / img.height;
            let drawWidth = targetDrawWidth;
            let drawHeight = drawWidth / imgAspect;

            // Ensure height doesn't overflow viewport
            if (drawHeight > rect.height * 0.8) {
                drawHeight = rect.height * 0.8;
                drawWidth = drawHeight * imgAspect;
            }

            // 5. Apply Dynamic Editorial Offset
            const currentOffsetPercent = canvasOffsetX.get();
            const pixelOffset = (rect.width * currentOffsetPercent) / 100;

            const x = (rect.width - drawWidth) / 2 + pixelOffset;
            const y = (rect.height - drawHeight) / 2;

            ctx.drawImage(img, x, y, drawWidth, drawHeight);

            // 6. Seamless White Masking (Aggressive Crop)
            // Explicitly draw white bars over the edges of the image to hide artifacts
            // The source images have a thick black border, so we must crop significantly (25px)
            ctx.fillStyle = "#ffffff";
            const maskSize = 25; // Cover 25px into the image (removes dirty edges)

            // Left Mask
            ctx.fillRect(x - 1, y, maskSize + 1, drawHeight);
            // Right Mask
            ctx.fillRect(x + drawWidth - maskSize, y, maskSize + 1, drawHeight);
            // Top Mask
            ctx.fillRect(x, y - 1, drawWidth, maskSize + 1);
            // Bottom Mask
            ctx.fillRect(x, y + drawHeight - maskSize, drawWidth, maskSize + 1);
        };

        const unsubscribe = smoothProgress.on("change", render);
        render(); // Initial draw
        window.addEventListener("resize", render);
        return () => {
            unsubscribe();
            window.removeEventListener("resize", render);
        };
    }, [images, imagesLoaded, smoothProgress, canvasOffsetX]); // Re-bind when motion values update

    return (
        <div ref={containerRef} className="relative h-[600vh] bg-white">
            {/* Loading Overlay */}
            {!imagesLoaded && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-white text-gray-900">
                    <div className="text-center">
                        <div className="w-16 h-16 border-4 border-gray-100 border-t-blue-600 rounded-full animate-spin mx-auto mb-4" />
                        <p className="text-sm font-medium tracking-widest uppercase text-gray-400">Loading Experience {loadProgress}%</p>
                    </div>
                </div>
            )}

            <div className="sticky top-0 h-screen w-full overflow-hidden">
                <canvas ref={canvasRef} className="absolute inset-0 w-full h-full object-cover" />

                {/* --- STAGE 1: HERO (Centered) --- */}
                <motion.div style={{ opacity: opacityHero }} className="absolute inset-x-0 bottom-[15%] text-center pointer-events-none z-10">
                    <h1 className="text-[12vw] leading-[0.9] font-light tracking-tighter text-gray-900 mb-6 mix-blend-multiply">
                        FlexCore Arc
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-500 font-light tracking-tight max-w-lg mx-auto">
                        Engineered for Ergonomic Excellence
                    </p>
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1, duration: 1 }}
                        className="mt-12"
                    >
                        <div className="flex flex-col items-center gap-2 text-gray-400 text-xs tracking-widest uppercase">
                            <span>Scroll to Configure</span>
                            <ChevronDown className="animate-bounce" size={16} />
                        </div>
                    </motion.div>
                </motion.div>

                {/* --- STAGE 2: FEATURES (Left Panel) --- */}
                <motion.div
                    style={{ opacity: opacityFeature, x: useTransform(opacityFeature, [0, 1], [-50, 0]) }}
                    className="absolute inset-0 flex items-center justify-start px-6 md:px-24 pointer-events-none"
                >
                    <div className="glass-panel p-10 md:p-12 rounded-3xl max-w-md w-full pointer-events-auto backdrop-blur-xl bg-white/80 border border-white/40 shadow-2xl">
                        <span className="text-blue-600 font-bold tracking-widest text-xs uppercase mb-4 block">Core Technology</span>
                        <h2 className="text-4xl font-light text-gray-900 mb-6 tracking-tight text-balance">
                            3-Layer Anti-Fatigue System
                        </h2>
                        <p className="text-lg text-gray-600 leading-relaxed font-light mb-8">
                            Precision-molded layers work in harmony to support your spine's natural curve. The proprietary foam composition absorbs micro-vibrations.
                        </p>
                        <ul className="space-y-3">
                            {["Medical-grade TPE", "Memory Foam Core", "Breathable Mesh"].map((item) => (
                                <li key={item} className="flex items-center gap-3 text-gray-700">
                                    <CheckCircle2 size={18} className="text-blue-500" />
                                    <span className="text-sm font-medium">{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </motion.div>

                {/* --- STAGE 3: BENEFITS (Right Panel) --- */}
                <motion.div
                    style={{ opacity: opacityBenefit, x: useTransform(opacityBenefit, [0, 1], [50, 0]) }}
                    className="absolute inset-0 flex items-center justify-end px-6 md:px-24 pointer-events-none"
                >
                    <div className="glass-panel p-10 md:p-12 rounded-3xl max-w-md w-full pointer-events-auto backdrop-blur-xl bg-white/80 border border-white/40 shadow-2xl">
                        <span className="text-emerald-600 font-bold tracking-widest text-xs uppercase mb-4 block">Medical Benefits</span>
                        <h2 className="text-4xl font-light text-gray-900 mb-6 tracking-tight text-balance">
                            Built for Instant Relief
                        </h2>
                        <p className="text-lg text-gray-600 leading-relaxed font-light mb-8">
                            Decompress your lumbar spine in just 10 minutes a day. Designed by chiropractors to reverse the effects of sedentary lifestyle.
                        </p>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 bg-gray-50 rounded-2xl">
                                <div className="text-3xl font-light text-gray-900 mb-1">10<span className="text-sm align-top">min</span></div>
                                <div className="text-xs text-gray-500 uppercase tracking-wider">Daily Use</div>
                            </div>
                            <div className="p-4 bg-gray-50 rounded-2xl">
                                <div className="text-3xl font-light text-gray-900 mb-1">110<span className="text-sm align-top">deg</span></div>
                                <div className="text-xs text-gray-500 uppercase tracking-wider">Arc Angle</div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* --- STAGE 4: CTA (Center) --- */}
                <motion.div style={{ opacity: opacityCTA }} className="absolute inset-0 flex items-center justify-center pointer-events-none bg-white/0">
                    <div className="text-center relative z-20 pointer-events-auto mt-[40vh]">
                        <h2 className="text-5xl md:text-7xl font-light text-gray-900 mb-8 tracking-tighter">
                            Experience the Elevation
                        </h2>
                        <button className="group relative px-12 py-6 bg-gray-900 text-white rounded-full text-xl font-medium shadow-2xl hover:scale-105 hover:bg-black transition-all duration-500 overflow-hidden">
                            <span className="relative z-10 flex items-center gap-3">
                                Shop Now — $89.99
                                <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                            </span>
                        </button>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
