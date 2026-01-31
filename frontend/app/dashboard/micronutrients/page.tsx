"use client";
import { MicronutrientSuite } from "@/components/agriculture/micronutrient-suite";

export default function MicronutrientsPage() {
    return (
        <div className="w-full h-full">
            <header className="mb-8">
                <h2 className="text-3xl font-bold text-forest">Micronutrient Intelligence</h2>
                <p className="text-forest/60 mt-2">Comprehensive analysis of essential trace elements.</p>
            </header>

            <MicronutrientSuite />
        </div>
    );
}
