"use client";

import React, { useState } from "react";
import { apiClient } from "@/lib/api-client";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Input } from "../ui/input";

export const CropRecommender = () => {
    const [formData, setFormData] = useState({
        N: 0,
        P: 0,
        K: 0,
        temperature: 0,
        humidity: 0,
        ph: 0,
        rainfall: 0,
    });

    const [result, setResult] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: parseFloat(e.target.value) });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await apiClient.post<{ recommendation: string }>('/predict/crop', {
                N: formData.N,
                P: formData.P,
                K: formData.K,
                temperature: formData.temperature,
                humidity: formData.humidity,
                ph: formData.ph
            });
            setResult(response.recommendation);
        } catch (error) {
            console.error(error);
            // Optional: Set error state
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-4xl mx-auto p-8 rounded-2xl bg-white/50 backdrop-blur-md border border-sage/20 shadow-xl">
            <h2 className="text-3xl font-bold text-forest mb-6 text-center">Crop Recommender</h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                    { label: "Nitrogen (N)", name: "N" },
                    { label: "Phosphorus (P)", name: "P" },
                    { label: "Potassium (K)", name: "K" },
                    { label: "Temperature (°C)", name: "temperature" },
                    { label: "Humidity (%)", name: "humidity" },
                    { label: "pH Level", name: "ph" },
                    { label: "Rainfall (mm)", name: "rainfall" }
                ].map((field) => (
                    <div key={field.name} className="flex flex-col space-y-2">
                        <label className="text-sm font-medium text-forest/80">{field.label}</label>
                        {field.name === "rainfall" ? (
                            <div className="space-y-2">
                                {/* Removed as per precision requirement */}
                                <p className="text-xs text-text-secondary italic">Not used in precision model</p>
                            </div>
                        ) : (
                            <Input
                                type="number"
                                name={field.name}
                                onChange={handleChange}
                                required
                            />
                        )}
                    </div>
                ))}

                <div className="md:col-span-2 flex justify-center mt-4">
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-8 py-3 rounded-full bg-sage text-white font-semibold shadow-lg hover:shadow-sage/40 hover:scale-105 transition-all disabled:opacity-50"
                    >
                        {loading ? "Analyzing..." : "Get Recommendation"}
                    </button>
                </div>
            </form>

            {result && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-8 p-6 rounded-xl bg-sage/10 border border-sage/20 text-center"
                >
                    <p className="text-lg text-forest/80">Recommended Crop:</p>
                    <h3 className="text-4xl font-bold text-forest mt-2">{result}</h3>
                </motion.div>
            )}
        </div>
    );
};
