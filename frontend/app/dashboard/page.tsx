import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid";
import { Sprout, Droplets, Leaf, ThermometerSun, TrendingUp, AlertCircle } from "lucide-react";
import Link from 'next/link';

export default function DashboardPage() {
    return (
        <div className="space-y-8">
            <header className="flex justify-between items-end border-b border-sage/10 pb-6">
                <div>
                    <h2 className="text-3xl font-bold text-forest">Overview</h2>
                    <p className="text-forest/60 mt-2">Welcome back. Here&apos;s your farm&apos;s latest intelligence report.</p>
                </div>
                <div className="flex gap-4">
                    <div className="px-4 py-2 bg-white rounded-lg border border-sage/20 shadow-sm">
                        <span className="text-xs text-forest/50 uppercase font-bold tracking-wider">Soil Moisture</span>
                        <div className="text-lg font-bold text-sage">62% <span className="text-xs font-normal text-forest/60">avg</span></div>
                    </div>
                    <div className="px-4 py-2 bg-white rounded-lg border border-sage/20 shadow-sm">
                        <span className="text-xs text-forest/50 uppercase font-bold tracking-wider">Next Harvest</span>
                        <div className="text-lg font-bold text-sage">14 Days</div>
                    </div>
                </div>
            </header>

            <BentoGrid className="md:auto-rows-[250px]">
                <Link href="/dashboard/crop-recommender" className="md:col-span-1 md:row-span-1 h-full">
                    <BentoGridItem
                        title="Crop Recommender"
                        description="Analyze soil samples to predict optimal crop yield."
                        header={<div className="h-full w-full bg-sage/10 rounded-xl flex items-center justify-center group-hover:bg-sage/20 transition-colors"><Sprout className="h-10 w-10 text-sage" /></div>}
                        icon={<TrendingUp className="h-4 w-4 text-neutral-500" />}
                        className="h-full cursor-pointer hover:border-sage/50"
                    />
                </Link>

                <Link href="/dashboard/micronutrients" className="md:col-span-2 md:row-span-1 h-full">
                    <BentoGridItem
                        title="Micronutrient Health"
                        description="Deep dive into trace elements: B, Cu, Fe, Mn, S, Zn."
                        header={
                            <div className="flex gap-2 h-full items-center justify-around bg-gradient-to-br from-sage/5 to-forest/5 rounded-xl p-4">
                                {['B', 'Cu', 'Fe', 'Mn', 'S', 'Zn'].map(el => (
                                    <div key={el} className="h-12 w-12 rounded-full bg-white shadow-sm border border-sage/10 flex items-center justify-center font-bold text-forest/70 text-sm">
                                        {el}
                                    </div>
                                ))}
                            </div>
                        }
                        className="h-full cursor-pointer hover:border-sage/80"
                    />
                </Link>

                <Link href="/dashboard/sensors" className="md:col-span-2 md:row-span-1 h-full">
                    <BentoGridItem
                        title="Live Field Telemetry"
                        description="Real-time sensor data visualization."
                        header={<div className="h-full w-full bg-forest/5 rounded-xl flex items-center justify-center"><ThermometerSun className="h-12 w-12 text-forest/40" /></div>}
                        className="h-full cursor-pointer hover:border-sage/50"
                    />
                </Link>

                <Link href="/dashboard/fertilizer-advisor" className="md:col-span-1 md:row-span-1 h-full">
                    <BentoGridItem
                        title="Fertilizer Advisor"
                        description="Optimize nutrient delivery."
                        header={<div className="h-full w-full bg-blue-50/50 rounded-xl flex items-center justify-center"><Droplets className="h-10 w-10 text-blue-400" /></div>}
                        className="h-full cursor-pointer hover:border-sage/50"
                    />
                </Link>
            </BentoGrid>
        </div>
    );
}
