'use client';

import { motion } from 'framer-motion';
import { Sparkles, ArrowDown, FileText } from 'lucide-react';

interface HeroSectionProps {
    onUploadClick: () => void;
}

// Fixed particle positions to avoid hydration mismatch
const PARTICLES = [
    { id: 0, x: 12, y: 23, size: 4.2, duration: 3.1 },
    { id: 1, x: 87, y: 61, size: 2.8, duration: 4.5 },
    { id: 2, x: 45, y: 8, size: 5.1, duration: 2.7 },
    { id: 3, x: 67, y: 78, size: 3.3, duration: 3.8 },
    { id: 4, x: 23, y: 54, size: 2.5, duration: 4.2 },
    { id: 5, x: 78, y: 32, size: 4.0, duration: 3.5 },
    { id: 6, x: 34, y: 89, size: 3.7, duration: 2.9 },
    { id: 7, x: 92, y: 14, size: 2.2, duration: 4.8 },
    { id: 8, x: 56, y: 45, size: 4.5, duration: 3.3 },
    { id: 9, x: 11, y: 72, size: 3.0, duration: 4.0 },
    { id: 10, x: 82, y: 91, size: 2.7, duration: 2.6 },
    { id: 11, x: 38, y: 17, size: 3.9, duration: 3.7 },
    { id: 12, x: 63, y: 58, size: 4.3, duration: 4.1 },
    { id: 13, x: 19, y: 41, size: 2.4, duration: 3.4 },
    { id: 14, x: 74, y: 83, size: 5.0, duration: 2.8 },
    { id: 15, x: 48, y: 27, size: 3.5, duration: 4.4 },
    { id: 16, x: 91, y: 50, size: 2.9, duration: 3.6 },
    { id: 17, x: 28, y: 65, size: 4.1, duration: 2.5 },
    { id: 18, x: 57, y: 95, size: 3.2, duration: 4.7 },
    { id: 19, x: 15, y: 38, size: 2.6, duration: 3.2 },
];

const KEY_STATS = [
    { value: '0.998', label: 'R² Score', color: 'text-green-400' },
    { value: '1.93e-05', label: 'Best MSE (HPQRC)', color: 'text-blue-400' },
    { value: '<2%', label: 'Relative Error', color: 'text-purple-400' },
    { value: '0.00389', label: 'Best MAE (HPQRC)', color: 'text-pink-400' },
];

export default function HeroSection({ onUploadClick }: HeroSectionProps) {
    return (
        <section className="relative min-h-[700px] flex items-center justify-center overflow-hidden py-20">
            {/* Animated gradient background */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-pink-900/20" />

            {/* Floating particles */}
            {PARTICLES.map((particle) => (
                <motion.div
                    key={particle.id}
                    className="absolute rounded-full bg-purple-500/30"
                    style={{
                        left: `${particle.x}%`,
                        top: `${particle.y}%`,
                        width: particle.size,
                        height: particle.size,
                    }}
                    animate={{
                        y: [0, -30, 0],
                        opacity: [0.3, 0.8, 0.3],
                    }}
                    transition={{
                        duration: particle.duration,
                        repeat: Infinity,
                        ease: 'easeInOut',
                    }}
                />
            ))}

            <div className="container mx-auto px-4 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-center"
                >
                    {/* Documentation badge */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card border border-purple-500/40 mb-6"
                    >
                        <Sparkles className="w-4 h-4 text-purple-400" />
                        <span className="text-sm text-purple-300">Finance / QML · Partner: Quandela</span>
                    </motion.div>

                    {/* Title */}
                    <h1 className="text-4xl md:text-6xl font-bold mb-4">
                        <span className="gradient-text">QashfFlow</span>
                    </h1>

                    {/* Paper title */}
                    <motion.h2
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3, duration: 0.8 }}
                        className="text-lg md:text-xl text-gray-300 mb-3 max-w-3xl mx-auto font-medium"
                    >
                        Hybrid Photonic-Quantum Reservoir Computing
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4, duration: 0.8 }}
                        className="text-gray-400 mb-10 max-w-2xl mx-auto text-sm"
                    >
                        Interactive demo of QashfFlow — explore the architecture, understand each model,
                        and run predictions on your own dataset.
                    </motion.p>

                    {/* Key stats row */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, duration: 0.6 }}
                        className="flex flex-wrap gap-4 justify-center mb-10"
                    >
                        {KEY_STATS.map((stat, i) => (
                            <motion.div
                                key={stat.label}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.6 + i * 0.1 }}
                                className="glass-card px-5 py-3 rounded-xl text-center"
                            >
                                <div className={`text-xl font-bold ${stat.color}`}>{stat.value}</div>
                                <div className="text-xs text-gray-400 mt-0.5">{stat.label}</div>
                            </motion.div>
                        ))}
                    </motion.div>

                    {/* CTA Buttons */}
                    <div className="flex flex-wrap gap-4 justify-center">
                        <motion.button
                            onClick={onUploadClick}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl text-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all glow-effect"
                        >
                            Try It — Upload Dataset
                        </motion.button>
                        <motion.a
                            href="/Qashflow-documentation.pdf"
                            target="_blank"
                            rel="noopener noreferrer"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="inline-flex items-center gap-2 px-8 py-4 glass-card rounded-2xl text-lg font-semibold border border-white/20 hover:bg-white/10 transition-all"
                        >
                            <FileText className="w-5 h-5" />
                            View Documentation
                        </motion.a>
                    </div>

                    {/* Scroll hint */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.2 }}
                        className="mt-12 flex flex-col items-center gap-2 text-gray-500"
                    >
                        <span className="text-sm">Scroll to explore the research</span>
                        <motion.div
                            animate={{ y: [0, 6, 0] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                        >
                            <ArrowDown className="w-5 h-5" />
                        </motion.div>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
}
