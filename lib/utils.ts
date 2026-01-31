import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// Class merging utility
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

// Frame preloader utility
export const preloadFrames = (frameCount: number) => {
    if (typeof window === "undefined") return;

    const images: HTMLImageElement[] = [];
    for (let i = 1; i <= frameCount; i++) {
        const img = new Image();
        // Assuming frames are named frame_001.webp, etc.
        const pad = String(i).padStart(3, "0");
        img.src = `/sequence/frame_${pad}.webp`;
        images.push(img);
    }
    return images;
};
