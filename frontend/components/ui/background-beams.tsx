"use client";
import { cn } from "@/lib/utils";
import React, { useEffect, useRef } from "react";

export const BackgroundBeams = ({ className }: { className?: string }) => {
    const beamsRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Optional: Add some JS-based particle movement if pure CSS isn't enough
        // For now, pure CSS animation in globals.css or tailwind classes will handle the ambient feel
    }, []);

    return (
        <div
            className={cn(
                "absolute inset-0 overflow-hidden pointer-events-none flex flex-col items-center justify-center bg-ivory",
                className
            )}
        >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(138,154,91,0.1),transparent_50%)]" />
            <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />

            {/* Animated Beams */}
            <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-sage/30 blur-[100px] animate-pulse" />
            <div className="absolute top-[40%] -right-[10%] w-[40%] h-[40%] rounded-full bg-forest/10 blur-[100px] animate-pulse delay-1000" />
            <div className="absolute -bottom-[20%] left-[20%] w-[60%] h-[60%] rounded-full bg-sage/20 blur-[120px] animate-pulse delay-700" />

        </div>
    );
};
