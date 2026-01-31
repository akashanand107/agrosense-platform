"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LayoutDashboard, Sprout, Droplets, Leaf, ThermometerSun, Settings, LogOut } from "lucide-react";
import { motion } from "framer-motion";

const sidebarItems = [
    {
        title: "Dashboard",
        href: "/dashboard",
        icon: <LayoutDashboard className="h-5 w-5" />,
    },
    {
        title: "Crop Recommender",
        href: "/dashboard/crop-recommender",
        icon: <Sprout className="h-5 w-5" />,
    },
    {
        title: "Fertilizer Advisor",
        href: "/dashboard/fertilizer-advisor",
        icon: <Droplets className="h-5 w-5" />,
    },
    {
        title: "Micronutrients",
        href: "/dashboard/micronutrients",
        icon: <Leaf className="h-5 w-5" />,
    },
    {
        title: "Sensor Analytics",
        href: "/dashboard/sensors",
        icon: <ThermometerSun className="h-5 w-5" />,
    },
];

export const Sidebar = () => {
    const pathname = usePathname();

    return (
        <aside className="fixed left-0 top-0 h-screen w-64 bg-stone-forest text-ivory flex flex-col justify-between border-r border-sage/10 z-50">
            <div>
                <div className="p-8">
                    <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                        <Leaf className="text-sage" /> AgroSense
                    </h1>
                </div>

                <nav className="px-4 space-y-2">
                    {sidebarItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative overflow-hidden",
                                    isActive ? "bg-sage-active text-white shadow-lg shadow-sage-active/20" : "text-gray-400 hover:text-white hover:bg-white/5"
                                )}
                            >
                                {isActive && (
                                    <motion.div
                                        layoutId="activeTab"
                                        className="absolute inset-0 bg-sage-active z-0"
                                        initial={false}
                                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                    />
                                )}
                                <span className="relative z-10">{item.icon}</span>
                                <span className="relative z-10 font-medium">{item.title}</span>
                            </Link>
                        )
                    })}
                </nav>
            </div>

            <div className="p-4 border-t border-white/10">
                <button className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-all">
                    <Settings className="h-5 w-5" />
                    <span className="font-medium">Settings</span>
                </button>
                <button className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all mt-1">
                    <LogOut className="h-5 w-5" />
                    <span className="font-medium">Logout</span>
                </button>
            </div>
        </aside>
    );
};
