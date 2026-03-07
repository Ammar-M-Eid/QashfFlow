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
        title: 'Pipeline Architecture',
        desc: 'Swaption surface compressed to 5 principal components via PCA, scaled into [0, π], then routed through 5 independent quantum reservoirs (8 modes, 3 photons each) in parallel. A classical photonic time-delay reservoir adds temporal memory, feeding a Ridge regressor (α = 0.01).',
    },
    {
        icon: Zap,
        color: 'text-blue-400',
        bg: 'from-blue-900/30 to-blue-800/20',
        border: 'border-blue-500/30',
        title: 'Model Progression',
        desc: 'Nine configurations explored — from a Classical LSTM baseline (MSE 0.34264) through Hybrid Q-LSTM, Q-Transformer, Q-GRU and Q-TCN variants, down to HPQRC (MSE 1.93×10⁻⁵). Every quantum model outperformed the baseline.',
    },
    {
        icon: FlaskConical,
        color: 'text-pink-400',
        bg: 'from-pink-900/30 to-pink-800/20',
        border: 'border-pink-500/30',
        title: 'Practical Results',
        desc: 'Trained on 450 days of swaption data. On held-out days 451–456, overall R² reached 0.998 with MSE of 1.93×10⁻⁵ and MAE of 0.00389. Relative error stayed below 2% on four of six test days. The only trainable component was a Ridge regressor.',
    },
];

const modelTable = [
    { model: 'Classical LSTM', modes: '—', photons: '—', mse: '0.34264', mae: '—', r2: '—' },
    { model: 'Hybrid Q-LSTM', modes: '6', photons: '2', mse: '0.20765', mae: '0.36580', r2: '—' },
    { model: 'Hybrid Q-Transformer', modes: '6', photons: '2', mse: '0.15485', mae: '0.32732', r2: '—' },
    { model: 'Hybrid Q-GRU', modes: '6', photons: '2', mse: '0.12054', mae: '0.26349', r2: '—' },
    { model: 'Hybrid Q-TCN', modes: '6', photons: '2', mse: '0.07043', mae: '0.20995', r2: '—' },
    { model: 'Hybrid Q-TCN', modes: '6', photons: '3', mse: '0.09997', mae: '0.24012', r2: '—' },
    { model: 'Hybrid Q-TCN', modes: '6', photons: '4', mse: '0.07775', mae: '0.22061', r2: '—' },
    { model: 'Hybrid Q-TCN', modes: '6', photons: '5', mse: '0.07482', mae: '0.21329', r2: '—' },
    { model: 'HPQRC', modes: '8', photons: '3', mse: '1.93e-05', mae: '0.00389', r2: '0.998', best: true },
];

export default function ResearchPaperSection() {
    return (
        <section className="container mx-auto px-4 py-16">
            {/* Documentation Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
                className="text-center mb-14"
            >
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card border border-purple-500/30 mb-6">
                    <BookOpen className="w-4 h-4 text-purple-400" />
                    <span className="text-sm text-purple-300">Documentation · Finance / QML · Partner: Quandela</span>
                </div>

                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                    <span className="gradient-text">
                        Option Pricing with Quantum Machine Learning
                    </span>
                    <br />
                    <span className="text-white">Hybrid Photonic-Quantum Reservoir Computing</span>
                </h2>
                <p className="text-gray-400 mb-6">
                    QashfFlow · March 2026
                </p>

                <div className="max-w-3xl mx-auto glass-card rounded-2xl p-6 text-left border border-white/10">
                    <p className="text-gray-300 leading-relaxed text-sm">
                        We explored quantum machine learning for swaption pricing across nine model configurations,
                        from a classical LSTM up to a fully redesigned hybrid photonic-quantum pipeline.
                        Our best model achieves an <span className="text-green-400 font-semibold">R² of 0.998</span> on held-out data
                        with <span className="text-green-400 font-semibold">sub-2% relative error</span> on most prediction days.
                        The key insight was not the quantum layer alone, but how the pipeline was designed around it:
                        compress to meaningful structure first, diversify through an ensemble, and let the
                        photonic time-delay reservoir carry the temporal memory.
                    </p>
                </div>
            </motion.div>

            {/* Key Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-14">
                <StatCard
                    value={0.998}
                    decimals={3}
                    suffix=""
                    label="R² Score"
                    sublabel="HPQRC on held-out data"
                    icon={Award}
                    color="text-green-400"
                    delay={0}
                />
                <StatCard
                    value={0.00389}
                    decimals={5}
                    suffix=""
                    label="Best MAE"
                    sublabel="HPQRC vs 0.36580 Q-LSTM"
                    icon={Zap}
                    color="text-blue-400"
                    delay={0.1}
                />
                <StatCard
                    value={450}
                    decimals={0}
                    suffix=" days"
                    label="Training Data"
                    sublabel="Tested on days 451–456"
                    icon={Shield}
                    color="text-purple-400"
                    delay={0.2}
                />
                <StatCard
                    value={5}
                    decimals={0}
                    suffix=""
                    label="PCA Components"
                    sublabel="224 features → 5 components"
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

            {/* Model Comparison Table */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="glass-card rounded-2xl p-8 mb-14"
            >
                <h3 className="text-2xl font-bold mb-2 text-center">All Models Compared</h3>
                <p className="text-center text-gray-400 text-sm mb-6">
                    HPQRC uses the real price scale; all other models use normalised values
                </p>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-white/10">
                                <th className="px-4 py-3 text-left text-gray-400">Model</th>
                                <th className="px-4 py-3 text-center text-gray-400">Modes</th>
                                <th className="px-4 py-3 text-center text-gray-400">Photons</th>
                                <th className="px-4 py-3 text-center text-blue-400">MSE</th>
                                <th className="px-4 py-3 text-center text-purple-400">MAE</th>
                                <th className="px-4 py-3 text-center text-green-400">R²</th>
                            </tr>
                        </thead>
                        <tbody>
                            {modelTable.map((row, i) => (
                                <motion.tr
                                    key={i}
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.07 }}
                                    className={`border-b border-white/5 transition-colors ${
                                        row.best
                                            ? 'bg-green-500/10 hover:bg-green-500/15'
                                            : 'hover:bg-white/5'
                                    }`}
                                >
                                    <td className="px-4 py-3 font-semibold">
                                        {row.model}
                                        {row.best && (
                                            <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-green-500/20 text-green-400 border border-green-500/30">
                                                ✓ Best
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-4 py-3 text-center text-gray-300">{row.modes}</td>
                                    <td className="px-4 py-3 text-center text-gray-300">{row.photons}</td>
                                    <td className={`px-4 py-3 text-center font-bold ${row.best ? 'text-green-400' : 'text-blue-400'}`}>
                                        {row.mse}
                                    </td>
                                    <td className="px-4 py-3 text-center text-purple-400 font-bold">{row.mae}</td>
                                    <td className={`px-4 py-3 text-center font-bold ${row.best ? 'text-green-400' : 'text-gray-500'}`}>
                                        {row.r2}
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </motion.div>

            {/* MSE Improvement Bar Chart */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="glass-card rounded-2xl p-8"
            >
                <h3 className="text-2xl font-bold mb-2 text-center">MSE Progression</h3>
                <p className="text-center text-gray-400 text-sm mb-8">
                    Mean Squared Error across model iterations — lower is better
                </p>
                <div className="space-y-5 max-w-2xl mx-auto">
                    {[
                        { label: 'Classical LSTM', value: 0.34264, color: 'from-gray-500 to-gray-400', badge: 'Baseline' },
                        { label: 'Hybrid Q-GRU', value: 0.12054, color: 'from-blue-500 to-blue-400', badge: '64.8% better' },
                        { label: 'Hybrid Q-TCN', value: 0.07043, color: 'from-purple-500 to-purple-400', badge: '79.4% better' },
                        { label: 'HPQRC', value: 0.0000193, color: 'from-green-500 to-emerald-400', badge: 'Best' },
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
                                <span className="text-gray-400 text-sm">MSE: {item.value}</span>
                            </div>
                            <div className="h-4 bg-white/10 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    whileInView={{ width: `${(item.value / 0.34264) * 100}%` }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 1, delay: i * 0.15 + 0.2 }}
                                    className={`h-full bg-gradient-to-r ${item.color} rounded-full`}
                                />
                            </div>
                            {item.badge !== 'Best' && item.badge !== 'Baseline' && (
                                <p className="text-xs text-gray-500 mt-1">{item.badge} than baseline</p>
                            )}
                        </motion.div>
                    ))}
                </div>
            </motion.div>
        </section>
    );
}
