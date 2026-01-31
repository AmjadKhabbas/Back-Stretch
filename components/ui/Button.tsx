import { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "outline" | "ghost";
    size?: "sm" | "md" | "lg";
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = "primary", size = "md", ...props }, ref) => {
        return (
            <button
                ref={ref}
                className={cn(
                    "inline-flex items-center justify-center rounded-xl font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400/50 disabled:opacity-50 disabled:pointer-events-none active:scale-95",
                    {
                        "bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:shadow-[0_0_30px_rgba(59,130,246,0.5)] hover:bg-blue-600": variant === "primary",
                        "bg-white/10 text-white hover:bg-white/20 backdrop-blur-md": variant === "secondary",
                        "border border-white/20 text-white hover:bg-white/5": variant === "outline",
                        "text-white/70 hover:text-white hover:bg-white/5": variant === "ghost",
                        "px-4 py-2 text-sm": size === "sm",
                        "px-6 py-3 text-base": size === "md",
                        "px-8 py-4 text-lg": size === "lg",
                    },
                    className
                )}
                {...props}
            />
        );
    }
);

Button.displayName = "Button";
