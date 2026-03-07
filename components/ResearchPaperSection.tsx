'use client';

import { motion, useInView } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import { BookOpen, Award, Zap, Shield, TrendingUp, GitBranch, FlaskConical } from 'lucide-react';

// Animated counter hook
function useAnimatedNumber(target: number, decimals: number = 0, suffix: string = '') {
    const [value, setValue] = useState(0);
    const ref = useRef<HTMLSpanElement>(null);
    const inView = useInView(ref, { once: true, margin: '-50px' });

    useEffect(() => {
        if (!inView) return;
        let start = 0;
        const duration = 1500;
        const step = 16;
        const increment = target / (duration / step);
        const timer = setInterval(() => {
            start += increment;
            if (start >= target) {
                start = target;
                clearInterval(timer);
            }
            setValue(parseFloat(start.toFixed(decimals)));
        }, step);
        return () => clearInterval(timer);
    }, [inView, target, decimals]);

    return { ref, displayValue: `${value.toFixed(decimals)}${suffix}` };
}

function StatCard({
    value,
    decimals,
    suffix,
    label,
    sublabel,
    icon: Icon,
    color,
    delay,
}: {
    value: number;
    decimals?: number;
    suffix?: string;
    label: string;
    sublabel: string;
    icon: any;
    color: string;
    delay: number;
}) {
    const { ref, displayValue } = useAnimatedNumber(value, decimals ?? 0, suffix ?? '');

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay }}
            className="glass-card rounded-2xl p-6 text-center"
        >
            <Icon className={`w-8 h-8 mx-auto mb-3 ${color}`} />
            <div className={`text-4xl font-bold mb-1 ${color}`}>
                <span ref={ref}>{displayValue}</span>
            </div>
            <div className="text-lg font-semibold text-white mb-1">{label}</div>
            <div className="text-sm text-gray-400">{sublabel}</div>
        </motion.div>
    );
}

const contributions = [
    {
        icon: GitBranch,
        color: 'text-purple-400',
        bg: 'from-purple-900/30 to-purple-800/20',
        border: 'border-purple-500/30',
        title: 'Architecture Design',
        desc: 'A superconducting quantum circuit (5-qubit transmon, T1=50µs) coupled to a 1mm silicon-nitride photonic waveguide array running at 1550 nm, enabling real-time encoding and noise-resistant feature extraction.',
    },
    {
        icon: Zap,
        color: 'text-blue-400',
        bg: 'from-blue-900/30 to-blue-800/20',
        border: 'border-blue-500/30',
        title: 'Efficiency Gains',
        desc: '35–45% decrease in compute latency compared to traditional RC models. HPQRC processes 25,000 data points per second — 3× faster than Classical RC (8,000 pts/s), with a 56.09% computational time improvement.',
    },
    {
        icon: FlaskConical,
        color: 'text-pink-400',
        bg: 'from-pink-900/30 to-pink-800/20',
        border: 'border-pink-500/30',
        title: 'Practical Validation',
        desc: 'Financial forecasting (S&P 500 hourly) and biomedical signal analysis (MIT-BIH ECG), achieving 81.3% prediction accuracy under controlled noise, with AUC=0.97 for anomaly detection.',
    },
];

const noiseTable = [
    { noise: '0%', hpqrc: 92.37, qrc: 85.24, classical: 78.12 },
    { noise: '10%', hpqrc: 88.7, qrc: 77.9, classical: 65.3 },
    { noise: '15%', hpqrc: 84.9, qrc: 71.5, classical: 53.6 },
    { noise: '30%', hpqrc: 81.3, qrc: 64.1, classical: 47.2 },
];

export default function ResearchPaperSection() {
    return (
        <section className="container mx-auto px-4 py-16">
            {/* Paper Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
                className="text-center mb-14"
            >
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card border border-purple-500/30 mb-6">
                    <BookOpen className="w-4 h-4 text-purple-400" />
                    <span className="text-sm text-purple-300">Research Paper · arXiv:2511.09218</span>
                </div>

                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                    <span className="gradient-text">
                        Hybrid Photonic-Quantum Reservoir Computing
                    </span>
                    <br />
                    <span className="text-white">For Time-Series Prediction</span>
                </h2>
                <p className="text-gray-400 mb-6">
                    Oishik Kar & Aswath Babu H. · IIIT Dharwad, Karnataka, India
                </p>

                <div className="max-w-3xl mx-auto glass-card rounded-2xl p-6 text-left border border-white/10">
                    <p className="text-gray-300 leading-relaxed text-sm">
                        We propose the <span className="text-purple-400 font-semibold">Hybrid Photonic-Quantum Reservoir Computing (HPQRC)</span> paradigm,
                        combining the high-speed parallelism of photonic systems with the quantum reservoir's capacity for modeling
                        complex, nonlinear dynamics. The architecture addresses computational bottlenecks, energy inefficiency,
                        and noise sensitivity common in existing reservoir computing models. Our simulation results show that
                        HPQRC attains <span className="text-green-400 font-semibold">significantly higher accuracy with lower computational time</span> than
                        both classical and quantum-only models, making it suitable for financial forecasting, industrial automation,
                        and smart sensor networks.
                    </p>
                </div>
            </motion.div>

            {/* Key Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-14">
                <StatCard
                    value={92.37}
                    decimals={2}
                    suffix="%"
                    label="HPQRC Accuracy"
                    sublabel="vs 78.12% Classical RC"
                    icon={Award}
                    color="text-green-400"
                    delay={0}
                />
                <StatCard
                    value={21.8}
                    decimals={1}
                    suffix="ms"
                    label="Inference Latency"
                    sublabel="vs 49.6ms Classical RC"
                    icon={Zap}
                    color="text-blue-400"
                    delay={0.1}
                />
                <StatCard
                    value={88.7}
                    decimals={1}
                    suffix="%"
                    label="Noise Resilience"
                    sublabel="at 10% Gaussian noise"
                    icon={Shield}
                    color="text-purple-400"
                    delay={0.2}
                />
                <StatCard
                    value={25000}
                    decimals={0}
                    suffix=" pts/s"
                    label="Throughput"
                    sublabel="3× faster than Classical RC"
                    icon={TrendingUp}
                    color="text-pink-400"
                    delay={0.3}
                />
            </div>

            {/* Three Contributions */}
            <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="mb-14"
            >
                <h3 className="text-2xl font-bold text-center mb-8">Three Core Contributions</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {contributions.map((c, i) => {
                        const Icon = c.icon;
                        return (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: i * 0.15 }}
                                className={`glass-card rounded-2xl p-6 bg-gradient-to-br ${c.bg} border ${c.border}`}
                            >
                                <Icon className={`w-7 h-7 ${c.color} mb-3`} />
                                <h4 className={`text-lg font-semibold mb-2 ${c.color}`}>{c.title}</h4>
                                <p className="text-gray-300 text-sm leading-relaxed">{c.desc}</p>
                            </motion.div>
                        );
                    })}
                </div>
            </motion.div>

            {/* Performance vs Noise Table */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="glass-card rounded-2xl p-8 mb-14"
            >
                <h3 className="text-2xl font-bold mb-2 text-center">Accuracy vs. Noise (from paper)</h3>
                <p className="text-center text-gray-400 text-sm mb-6">
                    All models tested under synthetic Gaussian noise (σ = 0, 0.1, 0.15, 0.3)
                </p>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-white/10">
                                <th className="px-4 py-3 text-left text-gray-400">Noise Level</th>
                                <th className="px-4 py-3 text-center text-green-400">HPQRC</th>
                                <th className="px-4 py-3 text-center text-blue-400">Quantum RC</th>
                                <th className="px-4 py-3 text-center text-gray-300">Classical RC</th>
                            </tr>
                        </thead>
                        <tbody>
                            {noiseTable.map((row, i) => (
                                <motion.tr
                                    key={i}
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1 }}
                                    className="border-b border-white/5 hover:bg-white/5 transition-colors"
                                >
                                    <td className="px-4 py-3 font-semibold">{row.noise}</td>
                                    <td className="px-4 py-3 text-center">
                                        <span className="text-green-400 font-bold">{row.hpqrc}%</span>
                                        <div className="mt-1 h-1 rounded-full bg-white/10 overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                whileInView={{ width: `${row.hpqrc}%` }}
                                                viewport={{ once: true }}
                                                transition={{ duration: 0.8, delay: i * 0.1 }}
                                                className="h-full bg-green-500 rounded-full"
                                            />
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        <span className="text-blue-400 font-bold">{row.qrc}%</span>
                                        <div className="mt-1 h-1 rounded-full bg-white/10 overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                whileInView={{ width: `${row.qrc}%` }}
                                                viewport={{ once: true }}
                                                transition={{ duration: 0.8, delay: i * 0.1 + 0.1 }}
                                                className="h-full bg-blue-500 rounded-full"
                                            />
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        <span className="text-gray-300 font-bold">{row.classical}%</span>
                                        <div className="mt-1 h-1 rounded-full bg-white/10 overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                whileInView={{ width: `${row.classical}%` }}
                                                viewport={{ once: true }}
                                                transition={{ duration: 0.8, delay: i * 0.1 + 0.2 }}
                                                className="h-full bg-gray-400 rounded-full"
                                            />
                                        </div>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </motion.div>

            {/* Processing Time Comparison */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="glass-card rounded-2xl p-8"
            >
                <h3 className="text-2xl font-bold mb-2 text-center">Processing Time Comparison</h3>
                <p className="text-center text-gray-400 text-sm mb-8">
                    Average per-prediction latency (ms) — lower is better
                </p>
                <div className="space-y-5 max-w-2xl mx-auto">
                    {[
                        { label: 'HPQRC', value: 21.8, max: 49.6, color: 'from-green-500 to-emerald-400', badge: 'Best' },
                        { label: 'Quantum RC', value: 35.1, max: 49.6, color: 'from-blue-500 to-blue-400', badge: '37.85% slower' },
                        { label: 'Classical RC', value: 49.6, max: 49.6, color: 'from-gray-500 to-gray-400', badge: '56.05% slower' },
                    ].map((item, i) => (
                        <motion.div
                            key={item.label}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.15 }}
                        >
                            <div className="flex justify-between items-center mb-2">
                                <div className="flex items-center gap-3">
                                    <span className="font-semibold text-white">{item.label}</span>
                                    {item.badge === 'Best' && (
                                        <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/20 text-green-400 border border-green-500/30">
                                            ✓ Best
                                        </span>
                                    )}
                                </div>
                                <span className="text-gray-400 text-sm">{item.value} ms</span>
                            </div>
                            <div className="h-4 bg-white/10 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    whileInView={{ width: `${(item.value / item.max) * 100}%` }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 1, delay: i * 0.15 + 0.2 }}
                                    className={`h-full bg-gradient-to-r ${item.color} rounded-full`}
                                />
                            </div>
                            {item.badge !== 'Best' && (
                                <p className="text-xs text-gray-500 mt-1">{item.badge} than HPQRC</p>
                            )}
                        </motion.div>
                    ))}
                </div>
            </motion.div>
        </section>
    );
}
