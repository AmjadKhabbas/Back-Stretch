import { InputHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ className, label, error, ...props }, ref) => {
        return (
            <div className="space-y-2">
                {label && <label className="text-white/70 text-sm block">{label}</label>}
                <input
                    ref={ref}
                    className={cn(
                        "w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/30 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all outline-none disabled:opacity-50",
                        error && "border-red-400 focus:border-red-400 focus:ring-red-400/20",
                        className
                    )}
                    {...props}
                />
                {error && <p className="text-red-400 text-sm">{error}</p>}
            </div>
        );
    }
);

Input.displayName = "Input";
