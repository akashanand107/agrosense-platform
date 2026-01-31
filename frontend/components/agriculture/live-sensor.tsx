"use client";

import React, { useEffect, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { cn } from "@/lib/utils";

type SensorData = {
    time: string;
    n: number;
    p: number;
    k: number;
    ph: number;
    conductivity: number;
    moisture: number;
};

const generateDataPoint = (date: Date): SensorData => ({
    time: `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`,
    n: 40 + Math.random() * 10,
    p: 20 + Math.random() * 5,
    k: 15 + Math.random() * 5,
    ph: 6.5 + Math.random() * 0.5,
    conductivity: 1.2 + Math.random() * 0.2, // dS/m
    moisture: 45 + Math.random() * 5
});

export const LiveSensor = () => {
    const [data, setData] = useState<SensorData[]>(() => {
        // Initial Dummy Data
        return Array.from({ length: 15 }).map((_, i) => {
            const now = new Date();
            now.setSeconds(now.getSeconds() - (15 - i) * 5);
            return generateDataPoint(now);
        });
    });

    useEffect(() => {
        const interval = setInterval(() => {
            setData(prev => {
                const nav = [...prev, generateDataPoint(new Date())];
                if (nav.length > 20) nav.shift();
                return nav;
            });
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
            {/* Primary: Soil Moisture & Conductivity */}
            <div className="bg-white border border-border-thin rounded-[4px] p-6 shadow-sm flex flex-col">
                <h3 className="text-lg font-bold text-forest mb-4">Real-time Soil Telemetry</h3>
                <div className="flex-1 min-h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data}>
                            <defs>
                                <linearGradient id="colorMoisture" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#8A9A5B" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#8A9A5B" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                            <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#374151' }} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#374151' }} />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#fff', borderColor: '#E5E7EB', borderRadius: '4px' }}
                                itemStyle={{ color: '#1A1F16' }}
                            />
                            <Area type="monotone" dataKey="moisture" stroke="#8A9A5B" fillOpacity={1} fill="url(#colorMoisture)" strokeWidth={2} name="Moisture (%)" />
                            <Area type="monotone" dataKey="conductivity" stroke="#1A1F16" strokeWidth={2} fill="transparent" name="EC (dS/m)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Secondary: NPK Levels */}
            <div className="bg-white border border-border-thin rounded-[4px] p-6 shadow-sm shadow-black/5 flex flex-col">
                <h3 className="text-lg font-bold text-forest mb-4">Nutrient Levels (NPK)</h3>
                <div className="flex-1 min-h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data.slice(-5)}> {/* Show only last 5 entries for bar chart to reduce clutter */}
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                            <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#374151' }} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#374151' }} />
                            <Tooltip cursor={{ fill: '#F9FBF9' }} contentStyle={{ borderRadius: '4px' }} />
                            <Bar dataKey="n" fill="#1A1F16" name="Nitrogen" radius={[4, 4, 0, 0]} />
                            <Bar dataKey="p" fill="#8A9A5B" name="Phosphorus" radius={[4, 4, 0, 0]} />
                            <Bar dataKey="k" fill="#D4D4D4" name="Potassium" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Tertiary: pH */}
            <div className="lg:col-span-2 bg-white border border-border-thin rounded-[4px] p-6 shadow-sm shadow-black/5 flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-bold text-forest">Average pH Level</h3>
                    <p className="text-text-secondary text-sm">Maintained within optimal range for most crops.</p>
                </div>
                <div className="text-4xl font-mono font-bold text-forest">
                    {data.length > 0 ? data[data.length - 1].ph.toFixed(2) : "6.50"}
                    <span className="text-sm text-slate-grey font-sans bg-slate-100 px-2 py-1 rounded ml-2">Acidic</span>
                </div>
            </div>
        </div>
    );
};
