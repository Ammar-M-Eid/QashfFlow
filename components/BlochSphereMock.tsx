'use client';

import { motion } from 'framer-motion';
import { ModelCache } from '@/lib/types';

interface BlochSphereMockProps {
    modelCache: ModelCache;
}

export default function BlochSphereMock({ modelCache }: BlochSphereMockProps) {
    // Fixed representative reservoir state activations (illustrative of typical QRC patterns)
    const heatmapData = [
        [0.92, 0.45, 0.78, 0.31, 0.87, 0.54, 0.66, 0.23, 0.91, 0.48, 0.73, 0.36],
        [0.41, 0.83, 0.27, 0.69, 0.52, 0.94, 0.18, 0.77, 0.43, 0.85, 0.29, 0.61],
        [0.76, 0.33, 0.88, 0.57, 0.24, 0.71, 0.96, 0.39, 0.64, 0.12, 0.82, 0.47],
        [0.55, 0.97, 0.44, 0.19, 0.80, 0.62, 0.35, 0.93, 0.26, 0.58, 0.74, 0.89],
        [0.21, 0.68, 0.53, 0.86, 0.37, 0.11, 0.75, 0.49, 0.98, 0.32, 0.56, 0.14],
        [0.84, 0.16, 0.72, 0.95, 0.43, 0.67, 0.28, 0.81, 0.15, 0.90, 0.38, 0.63],
        [0.50, 0.79, 0.22, 0.46, 0.99, 0.34, 0.60, 0.17, 0.70, 0.42, 0.95, 0.25],
        [0.13, 0.65, 0.91, 0.30, 0.58, 0.85, 0.40, 0.72, 0.55, 0.20, 0.47, 0.88],
    ];

    const runtimeData = [
        { model: 'ML', time: modelCache.ML?.metrics.inference_time, color: 'from-blue-500 to-blue-600' },
        { model: 'QML', time: modelCache.QML?.metrics.inference_time, color: 'from-purple-500 to-purple-600' },
        { model: 'QRC', time: modelCache.QRC?.metrics.inference_time, color: 'from-pink-500 to-pink-600' },
    ].filter((d): d is { model: string; time: number; color: string } => d.time !== undefined);

    const maxTime = runtimeData.length > 0 ? Math.max(...runtimeData.map((d) => d.time)) : 1;

    return (
        <section className="container mx-auto px-4 py-12">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <h2 className="text-3xl font-bold mb-8 text-center">Advanced Quantum Visualizations</h2>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Bloch Sphere Mock */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.1 }}
                        className="glass-card rounded-2xl p-6"
                    >
                        <h3 className="text-xl font-semibold mb-4 text-center">QML Bloch Sphere</h3>
                        <div className="relative h-64 flex items-center justify-center">
                            <svg viewBox="0 0 250 250" className="w-full h-full">
                                {/* Sphere outline */}
                                <circle cx="125" cy="125" r="80" fill="none" stroke="#8b5cf6" strokeWidth="2" opacity="0.6" />

                                {/* Equator */}
                                <ellipse cx="125" cy="125" rx="80" ry="25" fill="none" stroke="#8b5cf6" strokeWidth="1" opacity="0.4" />

                                {/* Meridians */}
                                <ellipse cx="125" cy="125" rx="25" ry="80" fill="none" stroke="#8b5cf6" strokeWidth="1" opacity="0.4" />

                                {/* Axes */}
                                <line x1="45" y1="125" x2="205" y2="125" stroke="#ffffff30" strokeWidth="1" />
                                <line x1="125" y1="45" x2="125" y2="205" stroke="#ffffff30" strokeWidth="1" />

                                {/* Animated quantum state vector */}
                                <motion.line
                                    x1="125"
                                    y1="125"
                                    stroke="#ec4899"
                                    strokeWidth="3"
                                    animate={{
                                        x2: [125, 160, 140, 100, 125],
                                        y2: [45, 80, 140, 100, 45],
                                    }}
                                    transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                                />

                                {/* State point */}
                                <motion.circle
                                    r="6"
                                    fill="#ec4899"
                                    animate={{
                                        cx: [125, 160, 140, 100, 125],
                                        cy: [45, 80, 140, 100, 45],
                                        scale: [1, 1.2, 1, 1.2, 1],
                                    }}
                                    transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                                />

                                {/* Labels */}
                                <text x="125" y="35" fill="#9ca3af" fontSize="12" textAnchor="middle">|0⟩</text>
                                <text x="125" y="225" fill="#9ca3af" fontSize="12" textAnchor="middle">|1⟩</text>
                                <text x="215" y="130" fill="#9ca3af" fontSize="12">X</text>
                                <text x="130" y="40" fill="#9ca3af" fontSize="12">Z</text>
                            </svg>
                        </div>
                        <p className="text-sm text-gray-400 text-center mt-4">
                            Quantum state evolution in Bloch sphere representation
                        </p>
                    </motion.div>

                    {/* Reservoir State Heatmap */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                        className="glass-card rounded-2xl p-6"
                    >
                        <h3 className="text-xl font-semibold mb-4 text-center">QRC Reservoir States</h3>
                        <div className="h-64 flex items-center justify-center">
                            <div className="grid grid-cols-12 gap-1 w-full max-w-xs">
                                {heatmapData.flat().map((value, idx) => (
                                    <motion.div
                                        key={idx}
                                        className="aspect-square rounded-sm"
                                        style={{
                                            backgroundColor: `rgba(139, 92, 246, ${value})`,
                                        }}
                                        animate={{
                                            opacity: [value * 0.5, value, value * 0.5],
                                        }}
                                        transition={{
                                            duration: 2,
                                            repeat: Infinity,
                                            delay: (idx % 12) * 0.1,
                                        }}
                                    />
                                ))}
                            </div>
                        </div>
                        <div className="mt-4">
                            <div className="flex justify-between text-xs text-gray-400 mb-1">
                                <span>Low Activation</span>
                                <span>High Activation</span>
                            </div>
                            <div className="h-2 bg-gradient-to-r from-purple-900 to-purple-400 rounded-full" />
                        </div>
                    </motion.div>

                    {/* Runtime Comparison */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 }}
                        className="glass-card rounded-2xl p-6"
                    >
                        <h3 className="text-xl font-semibold mb-6 text-center">Runtime Comparison</h3>
                        <div className="space-y-6">
                            {runtimeData.map((item, idx) => {
                                const percentage = (item.time / maxTime) * 100;
                                return (
                                    <motion.div
                                        key={item.model}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.4 + idx * 0.1 }}
                                    >
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="font-semibold">{item.model}</span>
                                            <span className="text-sm text-gray-400">{item.time.toFixed(10)} ms</span>
                                        </div>
                                        <div className="h-4 bg-white/10 rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${percentage}%` }}
                                                transition={{ duration: 1, delay: 0.6 + idx * 0.1 }}
                                                className={`h-full bg-gradient-to-r ${item.color}`}
                                            />
                                        </div>
                                        {idx === 0 && (
                                            <p className="text-xs text-green-400 mt-1">Baseline Classical</p>
                                        )}
                                        {idx === 1 && (
                                            <p className="text-xs text-purple-400 mt-1">Quantum Enhanced</p>
                                        )}
                                        {idx === 2 && (
                                            <p className="text-xs text-pink-400 mt-1">Reservoir Optimized</p>
                                        )}
                                    </motion.div>
                                );
                            })}
                        </div>

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1 }}
                            className="mt-8 p-4 bg-purple-500/10 rounded-lg border border-purple-500/20"
                        >
                            <p className="text-sm text-gray-300">
                                <span className="text-purple-400 font-semibold">Insight:</span> QRC often achieves
                                faster inference due to fixed quantum reservoir architecture.
                            </p>
                        </motion.div>
                    </motion.div>
                </div>
            </motion.div>
        </section>
    );
}
