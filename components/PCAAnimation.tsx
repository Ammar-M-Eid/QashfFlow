'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

export default function PCAAnimation() {
    const [step, setStep] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setStep((prev) => (prev + 1) % 3);
        }, 3000);
        return () => clearInterval(timer);
    }, []);

    // Fixed scatter points for illustrative PCA visualization
    const highDimPoints = [
        { id: 0, x: 42, y: 187, z: 63 }, { id: 1, x: 218, y: 54, z: 41 },
        { id: 2, x: 131, y: 243, z: 78 }, { id: 3, x: 275, y: 113, z: 22 },
        { id: 4, x: 67, y: 28, z: 91 }, { id: 5, x: 196, y: 167, z: 55 },
        { id: 6, x: 88, y: 211, z: 34 }, { id: 7, x: 253, y: 76, z: 87 },
        { id: 8, x: 154, y: 139, z: 48 }, { id: 9, x: 19, y: 95, z: 71 },
        { id: 10, x: 301, y: 231, z: 29 }, { id: 11, x: 110, y: 52, z: 96 },
        { id: 12, x: 237, y: 188, z: 13 }, { id: 13, x: 73, y: 272, z: 60 },
        { id: 14, x: 181, y: 33, z: 82 }, { id: 15, x: 46, y: 148, z: 37 },
        { id: 16, x: 289, y: 197, z: 74 }, { id: 17, x: 122, y: 85, z: 19 },
        { id: 18, x: 205, y: 259, z: 51 }, { id: 19, x: 58, y: 311, z: 88 },
        { id: 20, x: 163, y: 121, z: 44 }, { id: 21, x: 327, y: 67, z: 66 },
        { id: 22, x: 94, y: 178, z: 31 }, { id: 23, x: 242, y: 134, z: 93 },
        { id: 24, x: 15, y: 222, z: 57 }, { id: 25, x: 178, y: 295, z: 26 },
        { id: 26, x: 115, y: 47, z: 84 }, { id: 27, x: 269, y: 160, z: 15 },
        { id: 28, x: 51, y: 103, z: 72 }, { id: 29, x: 201, y: 217, z: 39 },
    ];

    // Fixed clustered points for 2D PCA projection visualization
    const lowDimPoints = [
        { id: 0, x: 82, y: 133 }, { id: 1, x: 112, y: 161 }, { id: 2, x: 95, y: 147 },
        { id: 3, x: 68, y: 172 }, { id: 4, x: 104, y: 118 }, { id: 5, x: 88, y: 155 },
        { id: 6, x: 121, y: 140 }, { id: 7, x: 75, y: 126 }, { id: 8, x: 98, y: 168 },
        { id: 9, x: 110, y: 132 }, { id: 10, x: 232, y: 141 }, { id: 11, x: 258, y: 167 },
        { id: 12, x: 247, y: 123 }, { id: 13, x: 221, y: 155 }, { id: 14, x: 263, y: 148 },
        { id: 15, x: 238, y: 176 }, { id: 16, x: 215, y: 132 }, { id: 17, x: 252, y: 161 },
        { id: 18, x: 226, y: 144 }, { id: 19, x: 243, y: 130 }, { id: 20, x: 382, y: 138 },
        { id: 21, x: 407, y: 162 }, { id: 22, x: 394, y: 121 }, { id: 23, x: 368, y: 153 },
        { id: 24, x: 413, y: 145 }, { id: 25, x: 375, y: 173 }, { id: 26, x: 396, y: 129 },
        { id: 27, x: 422, y: 158 }, { id: 28, x: 361, y: 141 }, { id: 29, x: 403, y: 135 },
    ];

    return (
        <section className="container mx-auto px-4 py-12">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="glass-card rounded-2xl p-8"
            >
                <h2 className="text-3xl font-bold mb-6 text-center">
                    Principal Component Analysis (PCA)
                </h2>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                    {/* Visualization */}
                    <div className="relative h-80 glass-card rounded-xl p-4 overflow-hidden">
                        {step === 0 && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                            >
                                <div className="text-center mb-4">
                                    <h3 className="text-lg font-semibold text-purple-400">
                                        High-Dimensional Space
                                    </h3>
                                    <p className="text-sm text-gray-400">Multiple features</p>
                                </div>
                                <svg viewBox="0 0 400 300" className="w-full h-full">
                                    {/* Grid lines to show 3D space */}
                                    {[0, 1, 2, 3, 4].map((i) => (
                                        <g key={i}>
                                            <line
                                                x1={i * 100}
                                                y1={0}
                                                x2={i * 100}
                                                y2={300}
                                                stroke="#ffffff10"
                                                strokeWidth={1}
                                            />
                                            <line
                                                x1={0}
                                                y1={i * 75}
                                                x2={400}
                                                y2={i * 75}
                                                stroke="#ffffff10"
                                                strokeWidth={1}
                                            />
                                        </g>
                                    ))}
                                    {/* Points scattered in 3D-like space */}
                                    {highDimPoints.map((point) => (
                                        <motion.circle
                                            key={point.id}
                                            cx={point.x}
                                            cy={point.y}
                                            r={3 + point.z / 50}
                                            fill="#8b5cf6"
                                            initial={{ opacity: 0, scale: 0 }}
                                            animate={{ opacity: 0.6, scale: 1 }}
                                            transition={{ delay: point.id * 0.02 }}
                                        />
                                    ))}
                                </svg>
                            </motion.div>
                        )}

                        {step === 1 && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="flex items-center justify-center h-full"
                            >
                                <div className="text-center">
                                    <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                                        className="w-16 h-16 mx-auto mb-4 border-4 border-purple-500 border-t-transparent rounded-full"
                                    />
                                    <h3 className="text-lg font-semibold text-purple-400">Reducing Dimensions</h3>
                                    <p className="text-sm text-gray-400">Finding principal components</p>
                                </div>
                            </motion.div>
                        )}

                        {step === 2 && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                            >
                                <div className="text-center mb-4">
                                    <h3 className="text-lg font-semibold text-green-400">2D Projection</h3>
                                    <p className="text-sm text-gray-400">Clustered features</p>
                                </div>
                                <svg viewBox="0 0 450 300" className="w-full h-full">
                                    {/* Axes */}
                                    <line x1={50} y1={250} x2={400} y2={250} stroke="#ffffff30" strokeWidth={2} />
                                    <line x1={50} y1={50} x2={50} y2={250} stroke="#ffffff30" strokeWidth={2} />
                                    <text x={200} y={280} fill="#9ca3af" fontSize={12} textAnchor="middle">
                                        PC1
                                    </text>
                                    <text x={20} y={150} fill="#9ca3af" fontSize={12} textAnchor="middle">
                                        PC2
                                    </text>
                                    {/* Clustered points */}
                                    {lowDimPoints.map((point) => (
                                        <motion.circle
                                            key={point.id}
                                            cx={point.x + 50}
                                            cy={point.y + 50}
                                            r={5}
                                            fill={point.id % 3 === 0 ? '#8b5cf6' : point.id % 3 === 1 ? '#ec4899' : '#3b82f6'}
                                            initial={{ opacity: 0, scale: 0 }}
                                            animate={{ opacity: 0.8, scale: 1 }}
                                            transition={{ delay: point.id * 0.02 }}
                                        />
                                    ))}
                                </svg>
                            </motion.div>
                        )}

                        {/* Progress indicator */}
                        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
                            {[0, 1, 2].map((i) => (
                                <div
                                    key={i}
                                    className={`w-2 h-2 rounded-full transition-all ${step === i ? 'bg-purple-500 w-6' : 'bg-white/30'
                                        }`}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Explanation */}
                    <div className="space-y-4">
                        <motion.div
                            initial={{ x: 20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="glass-card p-6 rounded-xl"
                        >
                            <h4 className="font-semibold text-lg mb-2 text-purple-400">What is PCA?</h4>
                            <p className="text-gray-300">
                                Principal Component Analysis reduces high-dimensional financial data into fewer
                                dimensions while preserving variance, making it easier for models to learn patterns.
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ x: 20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="glass-card p-6 rounded-xl"
                        >
                            <h4 className="font-semibold text-lg mb-2 text-blue-400">Benefits</h4>
                            <ul className="text-gray-300 space-y-2">
                                <li className="flex items-start gap-2">
                                    <span className="text-blue-400">•</span>
                                    Reduces computational complexity
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-blue-400">•</span>
                                    Removes noise and redundancy
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-blue-400">•</span>
                                    Improves model performance
                                </li>
                            </ul>
                        </motion.div>

                        <motion.div
                            initial={{ x: 20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.4 }}
                            className="glass-card p-6 rounded-xl"
                        >
                            <h4 className="font-semibold text-lg mb-2 text-pink-400">In Our Pipeline</h4>
                            <p className="text-gray-300">
                                PCA is applied before feeding data into quantum circuits, optimizing the number of
                                qubits needed and reducing quantum computation time.
                            </p>
                        </motion.div>
                    </div>
                </div>
            </motion.div>
        </section>
    );
}
