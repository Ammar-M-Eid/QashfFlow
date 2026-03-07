'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { Brain, Zap, Activity, Sparkles, Atom, ChevronDown, ChevronUp, BookOpen, Code2 } from 'lucide-react';

interface NotebookDef {
    key: string;
    icon: any;
    color: string;
    badgeColor: string;
    bg: string;
    border: string;
    title: string;
    file: string;
    tagline: string;
    description: string;
    architecture: string[];
    metrics: { label: string; value: string; highlight?: boolean }[];
    howItWorks: string;
}

const notebooks: NotebookDef[] = [
    {
        key: 'ML',
        icon: Brain,
        color: 'text-blue-400',
        badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
        bg: 'from-blue-900/20 to-blue-800/10',
        border: 'border-blue-500/20',
        title: 'Classical LSTM',
        file: 'Classical LSTM.ipynb',
        tagline: 'Baseline sequential model for financial time-series',
        description:
            'A standard Long Short-Term Memory (LSTM) network serving as the classical baseline. It processes 224-dimensional swaption features in sliding windows of length 20, learning temporal dependencies purely through classical gradient descent.',
        architecture: [
            'Input: 224 swaption features per timestep',
            'Sliding window: seq_length = 20',
            'LSTM: hidden = 32, 1 layer, dropout = 0.3',
            'Output: Linear 32 → 224',
            'Optimizer: Adam lr=1e-3, 200 epochs',
        ],
        metrics: [
            { label: 'MSE', value: '0.31333' },
            { label: 'R²', value: '0.687' },
            { label: 'Batch', value: '32' },
        ],
        howItWorks:
            'The LSTM maintains a hidden state that captures sequential dependencies. A dropout layer prevents overfitting, and a linear head maps hidden features back to the 224-output space. This model establishes the classical performance floor.',
    },
    {
        key: 'QML',
        icon: Zap,
        color: 'text-purple-400',
        badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
        bg: 'from-purple-900/20 to-purple-800/10',
        border: 'border-purple-500/20',
        title: 'Hybrid Quantum LSTM',
        file: 'Hybrid-Quantum LSTM.ipynb',
        tagline: '2-photon quantum layer fused into LSTM',
        description:
            'Replaces the LSTM\'s classical hidden layer with a photonic quantum circuit using 6 modes and 2 photons, generating C(7,2)=21 measurement dimensions. A compression network maps the high-dim features to the quantum circuit input.',
        architecture: [
            'Compress: 224 → 32 → 6 features',
            'Quantum: 6 modes, 2 photons → C(7,2)=21 dims',
            'LSTM: hidden = 128',
            'Optimizer: Adam lr=1e-3, 20 epochs',
            'Framework: Perceval (Quandela)',
        ],
        metrics: [
            { label: 'MSE', value: '0.2077' },
            { label: 'MAE', value: '0.3658' },
            { label: 'R²', value: '0.792', highlight: true },
        ],
        howItWorks:
            'Input features are compressed and amplitude-encoded into a photonic circuit. The interferometer applies Haar-random unitary transformations, and boson-sampling measurements extract quantum features. These are fused back with the LSTM hidden state.',
    },
    {
        key: 'QRC',
        icon: Activity,
        color: 'text-pink-400',
        badgeColor: 'bg-pink-500/20 text-pink-300 border-pink-500/40',
        bg: 'from-pink-900/20 to-pink-800/10',
        border: 'border-pink-500/20',
        title: 'QRC — 3-photon TCN',
        file: '3photons_Hybrid_Quantum_TCN.ipynb',
        tagline: 'Temporal Convolutional Network + 3-photon quantum reservoir',
        description:
            'A Temporal Convolutional Network (TCN) extracts local temporal features, which are then projected into a 3-photon quantum reservoir with 6 modes, producing C(8,3)=56 measurement dimensions as rich quantum features for the output layer.',
        architecture: [
            'TCN: channels=[64,128,64], kernel=3, dropout=0.1',
            'Compress: 224 → 64 → 6 features',
            'Quantum: 6 modes, 3 photons → C(8,3)=56 dims',
            'Output: Linear 56 → 224',
            'Optimizer: Adam lr=1e-5, 20 epochs',
        ],
        metrics: [
            { label: 'MSE', value: '0.0999' },
            { label: 'MAE', value: '0.2401' },
            { label: 'R²', value: '0.900', highlight: true },
        ],
        howItWorks:
            'The TCN uses dilated causal convolutions to capture multi-scale temporal patterns without recurrence. The quantum reservoir acts as a fixed nonlinear feature expander — its random unitary structure creates an exponentially large effective feature space from the 3-photon Fock states.',
    },
    {
        key: 'QRC5',
        icon: Atom,
        color: 'text-emerald-400',
        badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
        bg: 'from-emerald-900/20 to-emerald-800/10',
        border: 'border-emerald-500/20',
        title: 'QRC — 5-photon TCN',
        file: '5photons_Hybrid_Quantum_TCN.ipynb',
        tagline: 'Larger photon number → richer quantum feature space',
        description:
            'Scales the 3-photon QRC to 5 photons, expanding the measurement space from C(8,3)=56 to C(10,5)=252 dimensions. More photons mean higher-order interference patterns, capturing more complex nonlinear dynamics in the data.',
        architecture: [
            'TCN: channels=[64,128,64], kernel=3, dropout=0.1',
            'Compress: 224 → 64 → 6 features',
            'Quantum: 6 modes, 5 photons → C(10,5)=252 dims',
            'Output: Linear 252 → 224',
            'Optimizer: Adam lr=1e-5, 10 epochs',
        ],
        metrics: [
            { label: 'MSE', value: '0.0748' },
            { label: 'MAE', value: '0.2133' },
            { label: 'R²', value: '0.925', highlight: true },
        ],
        howItWorks:
            'Increasing photon number from 3 to 5 grows the Hilbert space exponentially (C(8,3)→C(10,5)), providing a much richer basis for feature extraction. The additional quantum correlations help the model distinguish subtle patterns that smaller photon numbers miss.',
    },
    {
        key: 'HPQRC',
        icon: Sparkles,
        color: 'text-amber-400',
        badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
        bg: 'from-amber-900/20 to-amber-800/10',
        border: 'border-amber-500/20',
        title: 'HPQRC — Hybrid Photonic-QRC',
        file: 'HP-QR.ipynb',
        tagline: 'Full photonic-quantum hybrid reservoir — best-in-class',
        description:
            'The flagship model from the paper. Uses 5 independent quantum reservoirs (each with 8 modes, 3 photons) across 5 temporal layers, producing a 139-dimensional feature vector (50 quantum + 64 photonic + 25 raw PCA). Ridge regression achieves R²=0.998.',
        architecture: [
            'PCA: 5 components, window = 5',
            '5 reservoirs × 5 layers, ph_units = 64',
            '8 modes, 3 photons per reservoir',
            'Feature vector: 139 dims (Q=50, P=64, raw=25)',
            'Ridge regression α=0.01',
        ],
        metrics: [
            { label: 'MSE', value: '1.93e-5', highlight: true },
            { label: 'MAE', value: '0.00326', highlight: true },
            { label: 'R²', value: '0.998', highlight: true },
        ],
        howItWorks:
            'PCA compresses raw data to 5 principal components. Each of 5 reservoir layers processes the PCA features through a photonic interferometer (producing 64-dim photonic features) and a quantum circuit (producing 10-dim quantum features per reservoir × 5 = 50). The 139-dim concatenated vector is fed to ridge regression for final prediction.',
    },
];

function NotebookCard({ nb, index }: { nb: NotebookDef; index: number }) {
    const [expanded, setExpanded] = useState(false);
    const Icon = nb.icon;

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className={`glass-card rounded-2xl border ${nb.border} bg-gradient-to-br ${nb.bg} overflow-hidden`}
        >
            {/* Header */}
            <div className="p-5">
                <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-xl ${nb.bg} border ${nb.border}`}>
                            <Icon className={`w-6 h-6 ${nb.color}`} />
                        </div>
                        <div>
                            <h3 className={`font-bold text-base ${nb.color}`}>{nb.title}</h3>
                            <p className="text-xs text-gray-400">{nb.tagline}</p>
                        </div>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full border shrink-0 ${nb.badgeColor}`}>
                        Model {index + 1}
                    </span>
                </div>

                {/* Notebook filename */}
                <div className="mt-3 flex items-center gap-2 text-xs text-gray-500">
                    <Code2 className="w-3.5 h-3.5" />
                    <span className="font-mono">{nb.file}</span>
                </div>

                {/* Metrics row */}
                <div className="mt-4 flex gap-3">
                    {nb.metrics.map((m) => (
                        <div key={m.label} className="flex flex-col items-center glass-card rounded-lg px-3 py-2 flex-1">
                            <span className="text-xs text-gray-500 mb-0.5">{m.label}</span>
                            <span className={`text-sm font-bold ${m.highlight ? nb.color : 'text-gray-300'}`}>
                                {m.value}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Expand toggle */}
            <button
                onClick={() => setExpanded((p) => !p)}
                className="w-full flex items-center justify-center gap-2 py-2 text-xs text-gray-400 hover:text-gray-200 border-t border-white/5 transition-colors"
            >
                {expanded ? (
                    <>Less detail <ChevronUp className="w-3.5 h-3.5" /></>
                ) : (
                    <>More detail <ChevronDown className="w-3.5 h-3.5" /></>
                )}
            </button>

            {/* Expanded section */}
            {expanded && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="px-5 pb-5 space-y-4"
                >
                    <p className="text-gray-300 text-sm leading-relaxed">{nb.description}</p>

                    <div>
                        <p className="text-xs text-gray-500 font-semibold uppercase tracking-widest mb-2">Architecture</p>
                        <ul className="space-y-1">
                            {nb.architecture.map((a, i) => (
                                <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                                    <span className={`${nb.color} mt-1`}>›</span>
                                    {a}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className={`rounded-xl p-4 bg-gradient-to-br ${nb.bg} border ${nb.border}`}>
                        <p className="text-xs text-gray-500 font-semibold uppercase tracking-widest mb-2">How It Works</p>
                        <p className="text-sm text-gray-300 leading-relaxed">{nb.howItWorks}</p>
                    </div>
                </motion.div>
            )}
        </motion.div>
    );
}

export default function NotebookExplainerSection() {
    return (
        <section className="container mx-auto px-4 py-16">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
                className="text-center mb-10"
            >
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card border border-white/10 mb-5">
                    <BookOpen className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-300">5 Models · 5 Notebooks · Progression from Classical to HPQRC</span>
                </div>
                <h2 className="text-3xl font-bold mb-3">
                    Models & Notebooks Explained
                </h2>
                <p className="text-gray-400 max-w-2xl mx-auto">
                    Each notebook represents a step in the research progression: starting from a classical LSTM baseline,
                    introducing photonic quantum features, then scaling to the full Hybrid Photonic-Quantum Reservoir
                    Computing (HPQRC) model described in the paper. Click any card for full details.
                </p>
            </motion.div>

            {/* Progress arrow */}
            <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="flex items-center justify-center gap-2 mb-8 text-xs text-gray-500"
            >
                {['Classical', '2-photon QML', '3-photon QRC', '5-photon QRC', 'HPQRC'].map((label, i) => (
                    <span key={i} className="flex items-center gap-2">
                        <span className="px-2 py-1 rounded glass-card">{label}</span>
                        {i < 4 && <span className="text-gray-600">→</span>}
                    </span>
                ))}
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {notebooks.map((nb, i) => (
                    <NotebookCard key={nb.key} nb={nb} index={i} />
                ))}
            </div>

            {/* R² improvement callout */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="mt-8 glass-card rounded-2xl p-6 text-center border border-amber-500/20 bg-gradient-to-r from-amber-900/10 to-amber-800/5"
            >
                <p className="text-gray-300 text-sm">
                    <span className="text-amber-400 font-bold text-lg">R² improvement: 0.687 → 0.998</span>
                    {' '}— from Classical LSTM to HPQRC. The hybrid photonic-quantum architecture achieves
                    {' '}<span className="text-green-400 font-semibold">45.1% better accuracy</span> and
                    {' '}<span className="text-blue-400 font-semibold">99.99% reduction in MSE</span> compared to the baseline.
                </p>
            </motion.div>
        </section>
    );
}
