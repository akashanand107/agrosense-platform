"use client";
import { LiveSensor } from "@/components/agriculture/live-sensor";

export default function SensorsPage() {
    return (
        <div className="w-full h-full">
            <header className="mb-8">
                <h2 className="text-3xl font-bold text-forest">Sensor Analytics</h2>
                <p className="text-forest/60 mt-2">Real-time telemetry from your field sensors.</p>
            </header>

            <div className="bg-white rounded-3xl p-6 shadow-xl shadow-sage/5 border border-sage/10 h-[800px]">
                <LiveSensor />
            </div>
        </div>
    );
}
