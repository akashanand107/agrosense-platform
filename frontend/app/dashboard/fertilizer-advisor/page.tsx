"use client";
import { FertilizerOptimizer } from "@/components/agriculture/fertilizer-optimizer";

export default function FertilizerPage() {
    return (
        <div className="w-full h-full">
            <header className="mb-8">
                <h2 className="text-3xl font-bold text-forest">Fertilizer Advisor</h2>
                <p className="text-forest/60 mt-2">Optimize your nutrient application strategy.</p>
            </header>

            <div className="bg-white rounded-3xl p-6 shadow-xl shadow-sage/5 border border-sage/10 min-h-[400px]">
                <FertilizerOptimizer />
            </div>
        </div>
    );
}
