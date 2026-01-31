"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { Beaker, CheckCircle, AlertTriangle, XCircle, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { apiClient } from "@/lib/api-client";

type MicronutrientResult = {
    symbol: string;
    name: string;
    prediction_raw: number; // Raw prediction (log scale or transformed)
    status: "Deficient" | "Sufficient" | "Toxic";
    recommendation: string;
};

export const MicronutrientSuite = () => {
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState<MicronutrientResult[] | null>(null);
    const [formData, setFormData] = useState({
        N: "",
        P: "",
        K: "",
        ph: "",
        EC: "",
        crop_label: "Pomegranate" // Default or allow selection
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Prepare payload
            const payload = {
                N: parseFloat(formData.N),
                P: parseFloat(formData.P),
                K: parseFloat(formData.K),
                ph: parseFloat(formData.ph),
                EC: parseFloat(formData.EC),
                crop_label: formData.crop_label // Backend expects 'crop_label'
            };

            const response = await apiClient.post<Record<string, number>>("/predict/micronutrients", payload);

            // Map flat response {'B': 1.2, 'Cu': 0.5...} to UI objects
            const nutrients = [
                { sym: 'B', name: 'Boron' },
                { sym: 'Cu', name: 'Copper' },
                { sym: 'Fe', name: 'Iron' },
                { sym: 'Mn', name: 'Manganese' },
                { sym: 'S', name: 'Sulphur' },
                { sym: 'Zn', name: 'Zinc' }
            ];

            const mappedResults: MicronutrientResult[] = nutrients.map(n => {
                const val = response[n.sym] || 0;
                // Simple status logic logic
                let status: "Deficient" | "Sufficient" | "Toxic" = "Sufficient";
                if (val < 0.5) status = "Deficient";
                if (val > 50) status = "Toxic";

                return {
                    symbol: n.sym,
                    name: n.name,
                    prediction_raw: val,
                    status: status,
                    recommendation: val === -1 ? "Error in prediction" : `Level: ${val} ppm`
                };
            });

            setResults(mappedResults);

        } catch (error) {
            console.error("Analysis failed", error);
            // Handle error state
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8">
            {/* Input Form Section */}
            <div className="bg-white p-8 rounded-[4px] border border-border-thin shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                    <div className="h-10 w-10 bg-sage/10 rounded-lg flex items-center justify-center">
                        <Beaker className="h-6 w-6 text-sage" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-forest">Soil Composition Analysis</h2>
                        <p className="text-text-secondary text-sm">Enter primary soil metrics and crop type.</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-forest">Nitrogen (N)</label>
                        <Input name="N" type="number" placeholder="mg/kg" value={formData.N} onChange={handleInputChange} required />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-forest">Phosphorus (P)</label>
                        <Input name="P" type="number" placeholder="mg/kg" value={formData.P} onChange={handleInputChange} required />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-forest">Potassium (K)</label>
                        <Input name="K" type="number" placeholder="mg/kg" value={formData.K} onChange={handleInputChange} required />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-forest">Soil pH</label>
                        <Input name="ph" type="number" step="0.1" placeholder="0-14" value={formData.ph} onChange={handleInputChange} required />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-forest">EC (dS/m)</label>
                        <Input name="EC" type="number" step="0.01" placeholder="Electrical Conductivity" value={formData.EC} onChange={handleInputChange} required />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-forest">Target Crop</label>
                        <select
                            name="crop_label"
                            className="flex h-12 w-full rounded-xl border border-sage/20 bg-ivory px-4 py-2 text-sm font-medium ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage/50 uppercase"
                            value={formData.crop_label}
                            onChange={handleInputChange}
                        >
                            <option value="Pomegranate">Pomegranate</option>
                            <option value="Grapes">Grapes</option>
                            <option value="Mango">Mango</option>
                        </select>
                    </div>

                    <div className="flex items-end md:col-span-3">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full h-12 bg-sage hover:bg-sage-dark text-white font-bold rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {loading ? "Analyzing..." : <>Run Diagnostics <ArrowRight className="h-4 w-4" /></>}
                        </button>
                    </div>
                </form>
            </div>

            {/* Results Grid */}
            <AnimatePresence>
                {results && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    >
                        {results.map((item) => (
                            <div key={item.symbol} className="bg-white rounded-[4px] border border-border-thin shadow-sm hover:shadow-md transition-shadow p-6 flex flex-col relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-4 opacity-10 font-bold text-6xl text-forest group-hover:opacity-20 transition-opacity select-none">
                                    {item.symbol}
                                </div>

                                <div className="flex justify-between items-start z-10 mb-4">
                                    <div>
                                        <h3 className="text-lg font-bold text-forest">{item.name}</h3>
                                        <p className="text-xs font-mono text-text-secondary mt-1">
                                            Predicted: {item.prediction_raw.toFixed(2)} ppm
                                        </p>
                                    </div>
                                    <StatusBadge status={item.status} />
                                </div>

                                <div className="z-10 mt-auto pt-4 border-t border-dashed border-gray-100">
                                    <p className="text-sm text-text-secondary leading-relaxed">
                                        {item.recommendation}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const StatusBadge = ({ status }: { status: string }) => {
    switch (status) {
        case "Deficient":
            return (
                <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-red-50 text-red-700 text-xs font-bold border border-red-100">
                    <AlertTriangle className="h-3 w-3" /> Deficient
                </span>
            );
        case "Toxic":
            return (
                <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-orange-50 text-orange-700 text-xs font-bold border border-orange-100">
                    <XCircle className="h-3 w-3" /> Toxic
                </span>
            );
        default:
            return (
                <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-green-50 text-green-700 text-xs font-bold border border-green-100">
                    <CheckCircle className="h-3 w-3" /> Sufficient
                </span>
            );
    }
}
