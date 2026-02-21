"use client";

import { useMotionValue, useTransform, motion, animate } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { CheckCircle2 } from "lucide-react";

const TOTAL_FRAMES = 240;
const ANIMATION_DURATION = 12; // Seconds for full loop

export default function ChipScroll() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [images, setImages] = useState<HTMLImageElement[]>([]);
    const [imagesLoaded, setImagesLoaded] = useState(false);
    const [loadProgress, setLoadProgress] = useState(0);

    // Time-based progress (0 to 1)
    const progress = useMotionValue(0);

    // Auto-Play Logic
    useEffect(() => {
        if (!imagesLoaded) return;

        const controls = animate(progress, 1, {
            duration: ANIMATION_DURATION,
            ease: "linear",
            // repeat: Infinity,
            // repeatDelay: 2,
            onComplete: () => {
                // Optional: Reset or loop
            }
        });

        return () => controls.stop();
    }, [imagesLoaded, progress]);


    // Frame Interpolation
    const frameIndex = useTransform(progress, [0, 1], [1, 240]);

    // Dynamic Canvas Offset Logic (Editorial Layout)
    const canvasOffsetX = useTransform(progress,
        [0, 0.3, 0.31, 0.6, 0.61, 1],
        [0, 0, 25, 25, -25, -25] // Center -> Right Panel -> Left Panel
    );

    // Text Overlay Opacities
    const opacityHero = useTransform(progress, [0, 0.15], [1, 0]);
    const opacityFeature = useTransform(progress, [0.2, 0.3, 0.45, 0.55], [0, 1, 1, 0]);
    const opacityBenefit = useTransform(progress, [0.6, 0.7, 0.85, 0.95], [0, 1, 1, 0]);
    const opacityFinal = useTransform(progress, [0.9, 1], [0, 1]);
    const opacityFinalCard = useTransform(progress, [0.95, 1], [0, 1]);

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
                    img.onerror = () => resolve(img);
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

    // Render Loop
    useEffect(() => {
        if (!imagesLoaded || images.length === 0) return;

        const render = () => {
            const canvas = canvasRef.current;
            if (!canvas) return;

            const ctx = canvas.getContext("2d", { alpha: false });
            if (!ctx) return;

            const index = Math.min(Math.round(frameIndex.get()), images.length - 1);
            const img = images[index];
            if (!img || !img.width || !img.height) return;

            const dpr = Math.min(window.devicePixelRatio || 1, 3);
            const rect = canvas.getBoundingClientRect();

            canvas.width = rect.width * dpr;
            canvas.height = rect.height * dpr;

            ctx.setTransform(1, 0, 0, 1, 0, 0);
            ctx.scale(dpr, dpr);
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'high';
            ctx.fillStyle = "#ffffff";
            ctx.fillRect(0, 0, rect.width, rect.height);

            const MAX_WIDTH = 1000;
            let targetDrawWidth = Math.min(rect.width * 0.6, MAX_WIDTH);
            if (rect.width < 768) targetDrawWidth = rect.width * 0.85;

            const imgAspect = img.width / img.height;
            let drawWidth = targetDrawWidth;
            let drawHeight = drawWidth / imgAspect;

            if (drawHeight > rect.height * 0.8) {
                drawHeight = rect.height * 0.8;
                drawWidth = drawHeight * imgAspect;
            }

            const currentOffsetPercent = canvasOffsetX.get();
            const pixelOffset = (rect.width * currentOffsetPercent) / 100;

            const x = (rect.width - drawWidth) / 2 + pixelOffset;
            const y = (rect.height - drawHeight) / 2;

            ctx.drawImage(img, x, y, drawWidth, drawHeight);

            // White Masking
            ctx.fillStyle = "#ffffff";
            const maskSize = 25;
            ctx.fillRect(x - 1, y, maskSize + 1, drawHeight);
            ctx.fillRect(x + drawWidth - maskSize, y, maskSize + 1, drawHeight);
            ctx.fillRect(x, y - 1, drawWidth, maskSize + 1);
            ctx.fillRect(x, y + drawHeight - maskSize, drawWidth, maskSize + 1);
        };

        const unsubscribe = frameIndex.on("change", render);
        render();
        window.addEventListener("resize", render);
        return () => {
            unsubscribe();
            window.removeEventListener("resize", render);
        };
    }, [images, imagesLoaded, frameIndex, canvasOffsetX]);

    return (
        <div className="fixed inset-0 bg-transparent z-0">
            {/* Loading Overlay */}
            {!imagesLoaded && (
                <div className="absolute inset-0 z-50 flex items-center justify-center bg-[#f6f7f9] text-gray-900">
                    <div className="text-center">
                        <div className="w-16 h-16 border-4 border-gray-100 border-t-blue-600 rounded-full animate-spin mx-auto mb-4" />
                        <p className="text-sm font-medium tracking-widest uppercase text-gray-400">Loading Experience {loadProgress}%</p>
                    </div>
                </div>
            )}

            <canvas ref={canvasRef} className="absolute inset-0 w-full h-full object-cover drop-shadow-[0_35px_35px_rgba(0,0,0,0.15)]" />

            {/* --- STAGE 1: HERO (Centered) --- */}
            <motion.div style={{ opacity: opacityHero }} className="absolute inset-x-0 top-[6%] text-center pointer-events-none z-10">
                <h1 className="text-[12vw] leading-[0.9] font-serif font-medium tracking-tighter text-gray-900 mix-blend-multiply">
                    FlexCore Arc
                </h1>
            </motion.div>

            <motion.div style={{ opacity: opacityHero }} className="absolute inset-x-0 bottom-[10%] text-center pointer-events-none z-10">
                <p className="text-xl md:text-2xl text-gray-500 font-light tracking-tight max-w-lg mx-auto">
                    Engineered for Ergonomic Excellence
                </p>
            </motion.div>

            {/* --- STAGE 2: FEATURES (Left Panel) --- */}
            <motion.div
                style={{ opacity: opacityFeature, x: useTransform(opacityFeature, [0, 1], [-50, 0]) }}
                className="absolute inset-0 flex items-center justify-start px-6 md:px-24 pointer-events-none"
            >
                <div className="glass-panel p-10 md:p-12 rounded-3xl max-w-md w-full pointer-events-auto backdrop-blur-xl border border-white/40 shadow-2xl">
                    <span className="text-blue-600 font-bold tracking-widest text-xs uppercase mb-4 block">Core Technology</span>
                    <h2 className="text-4xl font-serif text-gray-900 mb-6 tracking-tight text-balance">
                        3-Layer Anti-Fatigue System
                    </h2>
                    <p className="text-lg text-gray-600 leading-relaxed font-light mb-8">
                        Precision-molded layers work in harmony to support your spine's natural curve.
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
                <div className="glass-panel p-10 md:p-12 rounded-3xl max-w-md w-full pointer-events-auto backdrop-blur-xl border border-white/40 shadow-2xl">
                    <span className="text-emerald-600 font-bold tracking-widest text-xs uppercase mb-4 block">Medical Benefits</span>
                    <h2 className="text-4xl font-serif text-gray-900 mb-6 tracking-tight text-balance">
                        Built for Instant Relief
                    </h2>
                    <p className="text-lg text-gray-600 leading-relaxed font-light mb-8">
                        Decompress your lumbar spine in just 10 minutes a day. Designed by chiropractors.
                    </p>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-gray-50/50 rounded-2xl">
                            <div className="text-3xl font-light text-gray-900 mb-1">10<span className="text-sm align-top">min</span></div>
                            <div className="text-xs text-gray-500 uppercase tracking-wider">Daily Use</div>
                        </div>
                        <div className="p-4 bg-gray-50/50 rounded-2xl">
                            <div className="text-3xl font-light text-gray-900 mb-1">110<span className="text-sm align-top">deg</span></div>
                            <div className="text-xs text-gray-500 uppercase tracking-wider">Arc Angle</div>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* --- STAGE 4: Final Frame (Center left title, right demo card) --- */}
            <motion.div style={{ opacity: opacityFinal }} className="absolute inset-x-0 bottom-[10%] text-center md:text-left md:left-[8%] pointer-events-none z-10 w-fit">
                <h2 className="text-4xl md:text-7xl font-serif text-gray-900 tracking-tighter mb-4 text-balance">
                    Elevate Your Spine.
                </h2>
                <p className="text-xl text-gray-600 font-light max-w-md mt-4">
                    Experience the ultimate float effect, beautifully engineered to support your back day after day.
                </p>
            </motion.div>

            <motion.div style={{ opacity: opacityFinalCard, x: useTransform(opacityFinalCard, [0, 1], [50, 0]) }} className="absolute inset-y-0 right-0 flex items-center justify-end pr-6 md:pr-24 pointer-events-none z-20">
                <div className="glass-panel p-8 rounded-3xl w-full max-w-sm pointer-events-auto backdrop-blur-xl border border-white/40 shadow-2xl flex flex-col gap-6">
                    <div>
                        <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-[10px] font-bold tracking-widest uppercase rounded-full mb-3">Limited Edition</span>
                        <h3 className="text-2xl font-serif text-gray-900">FlexCore Arc</h3>
                        <div className="flex items-end gap-3 mt-2">
                            <span className="text-3xl font-light text-gray-900">$49.99</span>
                            <span className="text-sm text-gray-400 line-through mb-1">$79.99</span>
                        </div>
                    </div>

                    <div className="space-y-3 pt-4 border-t border-gray-100/50">
                        {["Free Worldwide Shipping", "100 Days Risk-Free Trial", "Lifetime Warranty"].map((item) => (
                            <div key={item} className="flex items-center gap-3">
                                <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                                    <CheckCircle2 size={12} className="text-emerald-600" />
                                </div>
                                <span className="text-sm text-gray-600 font-medium">{item}</span>
                            </div>
                        ))}
                    </div>

                    <button className="w-full py-4 mt-2 bg-gray-900 text-white rounded-xl font-medium tracking-wide hover:bg-gray-800 transition-colors shadow-xl shadow-gray-900/20">
                        Add to Cart — $49.99
                    </button>
                    <p className="text-center text-xs text-gray-400 font-medium">Or pay in 4 interest-free payments.</p>
                </div>
            </motion.div>
        </div>
    );
}
