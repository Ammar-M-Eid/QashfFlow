'use client';

import { motion } from 'framer-motion';
import { Database, Cpu, Layers, TrendingUp, ArrowRight } from 'lucide-react';

export default function QRCPipeline() {
    const steps = [
        {
            icon: Database,
            title: 'Data Input',
            description: 'Financial features from uploaded dataset',
            color: 'from-blue-500 to-blue-600',
            delay: 0,
        },
        {
            icon: Cpu,
            title: 'Quantum Reservoir Circuit',
            description: 'Non-trainable quantum layer with entanglement',
            color: 'from-purple-500 to-purple-600',
            delay: 0.2,
        },
        {
            icon: Layers,
            title: 'Nonlinear Feature Extraction',
            description: 'Quantum measurements create rich feature space',
            color: 'from-pink-500 to-pink-600',
            delay: 0.4,
        },
        {
            icon: Layers,
            title: 'Classical Linear Layer',
            description: 'Trainable weights on extracted features',
            color: 'from-green-500 to-green-600',
            delay: 0.6,
        },
        {
            icon: TrendingUp,
            title: 'Predicted Option Price',
            description: 'Call and Put option pricing output',
            color: 'from-orange-500 to-orange-600',
            delay: 0.8,
        },
    ];

    return (
        <section className="container mx-auto px-4 py-12">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <h2 className="text-3xl font-bold mb-6 text-center">
                    Quantum Reservoir Computing Pipeline
                </h2>
                <p className="text-center text-gray-400 mb-12 max-w-2xl mx-auto">
                    QRC leverages quantum dynamics as a computational resource without training the quantum
                    layer, reducing quantum circuit complexity.
                </p>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Pipeline Visualization */}
                    <div className="space-y-6">
                        {steps.map((step, index) => {
                            const Icon = step.icon;
                            return (
                                <div key={index}>
                                    <motion.div
                                        initial={{ opacity: 0, x: -50 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: step.delay, duration: 0.5 }}
                                        className="relative"
                                    >
                                        {/* Step Card */}
                                        <motion.div
                                            whileHover={{ scale: 1.02, x: 10 }}
                                            className="glass-card rounded-2xl p-6 cursor-pointer glass-card-hover"
                                        >
                                            <div className="flex items-start gap-4">
                                                {/* Icon with glow */}
                                                <motion.div
                                                    animate={{ scale: [1, 1.1, 1] }}
                                                    transition={{ duration: 2, repeat: Infinity, delay: step.delay }}
                                                    className={`p-3 rounded-xl bg-gradient-to-br ${step.color} glow-effect`}
                                                >
                                                    <Icon className="w-6 h-6 text-white" />
                                                </motion.div>

                                                {/* Content */}
                                                <div className="flex-1">
                                                    <h3 className="text-lg font-semibold mb-1">{step.title}</h3>
                                                    <p className="text-sm text-gray-400">{step.description}</p>
                                                </div>

                                                {/* Step number */}
                                                <div className="text-2xl font-bold text-white/20">{index + 1}</div>
                                            </div>
                                        </motion.div>

                                        {/* Arrow connector */}
                                        {index < steps.length - 1 && (
                                            <motion.div
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: 24 }}
                                                transition={{ delay: step.delay + 0.3 }}
                                                className="flex justify-center my-2"
                                            >
                                                <motion.div
                                                    animate={{ y: [0, 5, 0] }}
                                                    transition={{ duration: 1.5, repeat: Infinity, delay: step.delay }}
                                                >
                                                    <ArrowRight className="w-6 h-6 text-purple-400 rotate-90" />
                                                </motion.div>
                                            </motion.div>
                                        )}
                                    </motion.div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Explanation Panel */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4, duration: 0.5 }}
                        className="space-y-6"
                    >
                        {/* Quantum Reservoir Visualization */}
                        <div className="glass-card rounded-2xl p-6">
                            <h3 className="text-xl font-semibold mb-4">Quantum Reservoir</h3>
                            <div className="relative h-48 bg-gradient-to-br from-purple-900/30 to-pink-900/30 rounded-xl p-4 overflow-hidden">
                                {/* Animated quantum state representation */}
                                <svg viewBox="0 0 200 150" className="w-full h-full">
                                    {/* Quantum gates representation */}
                                    {[0, 1, 2, 3].map((row) => (
                                        <g key={row}>
                                            {/* Qubit line */}
                                            <line
                                                x1={10}
                                                y1={30 + row * 30}
                                                x2={190}
                                                y2={30 + row * 30}
                                                stroke="#8b5cf6"
                                                strokeWidth={2}
                                            />
                                            {/* Gates */}
                                            {[0, 1, 2].map((col) => (
                                                <motion.g
                                                    key={col}
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: [0.5, 1, 0.5] }}
                                                    transition={{
                                                        duration: 2,
                                                        repeat: Infinity,
                                                        delay: row * 0.2 + col * 0.3,
                                                    }}
                                                >
                                                    <rect
                                                        x={30 + col * 60}
                                                        y={20 + row * 30}
                                                        width={20}
                                                        height={20}
                                                        fill="#8b5cf6"
                                                        rx={4}
                                                    />
                                                </motion.g>
                                            ))}
                                            {/* Entanglement connections */}
                                            {row < 3 && (
                                                <motion.line
                                                    x1={70}
                                                    y1={30 + row * 30}
                                                    x2={70}
                                                    y2={30 + (row + 1) * 30}
                                                    stroke="#ec4899"
                                                    strokeWidth={2}
                                                    initial={{ pathLength: 0 }}
                                                    animate={{ pathLength: [0, 1, 0] }}
                                                    transition={{ duration: 2, repeat: Infinity, delay: row * 0.3 }}
                                                />
                                            )}
                                        </g>
                                    ))}
                                </svg>
                            </div>
                            <p className="text-sm text-gray-400 mt-3">
                                Fixed quantum circuit with random entangling gates creating a rich computational
                                reservoir
                            </p>
                        </div>

                        {/* Key Advantages */}
                        <div className="glass-card rounded-2xl p-6">
                            <h3 className="text-xl font-semibold mb-4">Key Advantages</h3>
                            <div className="space-y-3">
                                {[
                                    {
                                        title: 'No Quantum Training',
                                        desc: 'Only classical layer requires training',
                                    },
                                    {
                                        title: 'Hardware Efficient',
                                        desc: 'Works on current NISQ devices',
                                    },
                                    {
                                        title: 'Fast Inference',
                                        desc: 'Reduced circuit depth and gates',
                                    },
                                    {
                                        title: 'Rich Features',
                                        desc: 'Quantum dynamics create complex feature space',
                                    },
                                ].map((item, idx) => (
                                    <motion.div
                                        key={idx}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 1 + idx * 0.1 }}
                                        className="flex items-start gap-3"
                                    >
                                        <div className="w-2 h-2 bg-purple-500 rounded-full mt-2" />
                                        <div>
                                            <h4 className="font-semibold text-purple-300">{item.title}</h4>
                                            <p className="text-sm text-gray-400">{item.desc}</p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>

                        {/* Performance Note */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 1.5 }}
                            className="glass-card rounded-2xl p-6 bg-gradient-to-br from-green-900/20 to-emerald-900/20"
                        >
                            <h4 className="font-semibold text-green-400 mb-2">💡 Pro Tip</h4>
                            <p className="text-sm text-gray-300">
                                QRC can achieve competitive performance with significantly fewer trainable
                                parameters compared to variational quantum circuits (VQC).
                            </p>
                        </motion.div>
                    </motion.div>
                </div>
            </motion.div>
        </section>
    );
}
