"use client";
import { CropRecommender } from "@/components/agriculture/crop-recommender";

export default function CropRecommenderPage() {
    return (
        <div className="w-full max-w-4xl mx-auto">
            <header className="mb-10">
                <h2 className="text-3xl font-bold text-forest">Crop Recommendation Model</h2>
                <p className="text-forest/60 mt-2 text-lg">Input your soil parameters to get AI-powered crop suggestions.</p>
            </header>

            <div className="bg-white rounded-3xl p-1 shadow-xl shadow-sage/5 border border-sage/10">
                <CropRecommender />
            </div>
        </div>
    );
}
