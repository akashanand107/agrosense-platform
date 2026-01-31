"use client";

import React from "react";
import { cn } from "@/lib/utils";

export const NutrivedaLogo = ({ className }: { className?: string }) => (
    <svg
        width="40"
        height="40"
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={cn("", className)}
    >
        {/* Geometric Leaf Outline */}
        <path
            d="M50 15C50 15 22 35 22 60C22 75 35 85 50 85C65 85 78 75 78 60C78 35 50 15 50 15Z"
            stroke="#8A9A5B"
            strokeWidth="4"
        />
        {/* Vertical AI Circuit Vein */}
        <path d="M50 25V85" stroke="#8A9A5B" strokeWidth="2" strokeDasharray="4 2" />
        {/* Sensor Nodes (N, P, K) */}
        <circle cx="50" cy="35" r="5" fill="#ECFCCB" className="animate-pulse" /> {/* N */}
        <circle cx="38" cy="55" r="4" fill="#8A9A5B" /> {/* P */}
        <circle cx="62" cy="55" r="4" fill="#8A9A5B" /> {/* K */}
    </svg>
);
