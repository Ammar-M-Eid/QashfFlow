'use client';

import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

interface HeroSectionProps {
    onUploadClick: () => void;
}

export default function HeroSection({ onUploadClick }: HeroSectionProps) {
    // Generate floating particles
    const particles = Array.from({ length: 20 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 4 + 2,
        duration: Math.random() * 3 + 2,
    }));

    return (
        <section className="relative min-h-[600px] flex items-center justify-center overflow-hidden py-20">
            {/* Animated gradient background */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-pink-900/20" />

            {/* Floating particles */}
            {particles.map((particle) => (
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
                    {/* Icon */}
                    <motion.div
                        animate={{
                            rotate: [0, 360],
                        }}
                        transition={{
                            duration: 20,
                            repeat: Infinity,
                            ease: 'linear',
                        }}
                        className="inline-block mb-6"
                    >
                        <Sparkles className="w-16 h-16 text-purple-400" />
                    </motion.div>

                    {/* Title */}
                    <h1 className="text-5xl md:text-7xl font-bold mb-6">
                        <span className="gradient-text">
                            QashFlow
                        </span>
                    </h1>

                    {/* Subtitle */}
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3, duration: 0.8 }}
                        className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto"
                    >
                        Hybrid Classical & Quantum Machine Learning for Financial Prediction
                    </motion.p>

                    {/* CTA Button */}
                    <motion.button
                        onClick={onUploadClick}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl text-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all glow-effect"
                    >
                        Upload Dataset
                    </motion.button>

                    {/* Feature badges */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6, duration: 0.8 }}
                        className="flex flex-wrap gap-4 justify-center mt-12"
                    >
                        {['Classical ML', 'Quantum ML', 'QRC', 'HPQRC'].map((tech, index) => (
                            <motion.div
                                key={tech}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.8 + index * 0.1 }}
                                className="glass-card px-6 py-3 rounded-xl"
                            >
                                <span className="text-sm text-gray-300">{tech}</span>
                            </motion.div>
                        ))}
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
}
