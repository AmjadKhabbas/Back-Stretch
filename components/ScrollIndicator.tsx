"use client";

import { motion, useScroll, useTransform } from "framer-motion";

export const ScrollIndicator = () => {
    const { scrollYProgress } = useScroll();
    const opacity = useTransform(scrollYProgress, [0, 0.1], [1, 0]);

    return (
        <motion.div
            style={{ opacity }}
            className="fixed bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 pointer-events-none z-50 mix-blend-difference"
        >
            <span className="text-white/60 text-sm font-light tracking-[0.2em] uppercase">
                Scroll to Explore
            </span>
            <div className="w-[30px] h-[50px] border border-white/30 rounded-full flex justify-center p-2">
                <motion.div
                    animate={{
                        y: [0, 12, 0],
                    }}
                    transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                    className="w-1 h-3 bg-white rounded-full"
                />
            </div>
        </motion.div>
    );
};
