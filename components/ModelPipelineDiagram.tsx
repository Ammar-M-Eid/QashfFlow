'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { ModelType } from '@/lib/types';

interface ModelPipelineDiagramProps {
    modelType: ModelType;
}

// ─── Shared types ────────────────────────────────────────────────────────────

interface PipelineStep {
    id: string;
    label: string;
    sublabel: string;
    color: string;   // Tailwind gradient classes
    ring: string;    // Tailwind ring / border colour class
}

// ─── Per-model pipeline definitions (exact from notebooks) ───────────────────

const PIPELINES: Record<ModelType, { title: string; subtitle: string; steps: PipelineStep[] }> = {
    ML: {
        title: 'Classical LSTM Pipeline',
        subtitle:
            'Classical LSTM.ipynb  ·  input=224 → hidden=32 → output=224  ·  seq=20  ·  200 epochs',
        steps: [
            {
                id: 'raw',
                label: 'Excel Data',
                sublabel: '224 swaption features',
                color: 'from-blue-600 to-blue-500',
                ring: 'ring-blue-500',
            },
            {
                id: 'scaler',
                label: 'StandardScaler',
                sublabel: 'zero-mean unit-variance',
                color: 'from-indigo-600 to-indigo-500',
                ring: 'ring-indigo-400',
            },
            {
                id: 'seq',
                label: 'Sliding Windows',
                sublabel: 'seq_length = 20',
                color: 'from-violet-600 to-violet-500',
                ring: 'ring-violet-400',
            },
            {
                id: 'lstm',
                label: 'LSTM Layer',
                sublabel: '224 → hidden=32, 1 layer, dropout=0.3',
                color: 'from-purple-600 to-purple-500',
                ring: 'ring-purple-400',
            },
            {
                id: 'dropout',
                label: 'Dropout (0.3)',
                sublabel: 'regularisation',
                color: 'from-fuchsia-600 to-fuchsia-500',
                ring: 'ring-fuchsia-400',
            },
            {
                id: 'fc',
                label: 'Linear Layer',
                sublabel: '32 → 224 outputs',
                color: 'from-pink-600 to-pink-500',
                ring: 'ring-pink-400',
            },
            {
                id: 'out',
                label: 'Option Prices',
                sublabel: 'MSE = 0.31333  ·  R² = 0.687',
                color: 'from-rose-600 to-rose-500',
                ring: 'ring-rose-400',
            },
        ],
    },

    QML: {
        title: 'Hybrid Quantum-LSTM Pipeline',
        subtitle:
            'Hybrid-Quantum LSTM.ipynb  ·  6 modes, 2 photons, C(7,2)=21 quantum dims  ·  hidden=128  ·  20 epochs',
        steps: [
            {
                id: 'raw',
                label: 'Excel Data',
                sublabel: '224 swaption features',
                color: 'from-blue-600 to-blue-500',
                ring: 'ring-blue-500',
            },
            {
                id: 'scaler',
                label: 'StandardScaler',
                sublabel: 'zero-mean unit-variance',
                color: 'from-indigo-600 to-indigo-500',
                ring: 'ring-indigo-400',
            },
            {
                id: 'seq',
                label: 'Sliding Windows',
                sublabel: 'seq_length = 10',
                color: 'from-violet-600 to-violet-500',
                ring: 'ring-violet-400',
            },
            {
                id: 'compress',
                label: 'Classical Compressor',
                sublabel: '224 → 32 → 6 features',
                color: 'from-purple-600 to-purple-500',
                ring: 'ring-purple-400',
            },
            {
                id: 'scale',
                label: 'Learned ScaleLayer',
                sublabel: 'maps to [0, π] for encoding',
                color: 'from-fuchsia-600 to-fuchsia-500',
                ring: 'ring-fuchsia-400',
            },
            {
                id: 'quantum',
                label: 'QuantumLayer',
                sublabel: '6 modes · 2 photons · C(7,2)=21 out',
                color: 'from-pink-600 to-pink-500',
                ring: 'ring-pink-500',
            },
            {
                id: 'concat',
                label: 'Concatenate',
                sublabel: 'raw (224) + quantum (21) = 245',
                color: 'from-rose-600 to-rose-500',
                ring: 'ring-rose-400',
            },
            {
                id: 'lstm',
                label: 'LSTM Layer',
                sublabel: 'hidden=128, dropout=0.2',
                color: 'from-orange-600 to-orange-500',
                ring: 'ring-orange-400',
            },
            {
                id: 'fc',
                label: 'Linear Layer',
                sublabel: '128 → 64 → 224 outputs',
                color: 'from-amber-600 to-amber-500',
                ring: 'ring-amber-400',
            },
            {
                id: 'out',
                label: 'Option Prices',
                sublabel: 'MSE = 0.2077  ·  R² = 0.792',
                color: 'from-yellow-600 to-yellow-500',
                ring: 'ring-yellow-400',
            },
        ],
    },

    QRC: {
        title: '3-Photon Quantum TCN Pipeline',
        subtitle:
            '3photons_Hybrid_Quantum_TCN.ipynb  ·  6 modes, 3 photons, C(8,3)=56 quantum dims  ·  TCN [64,128,64]',
        steps: [
            {
                id: 'raw',
                label: 'Excel Data',
                sublabel: '224 swaption features',
                color: 'from-blue-600 to-blue-500',
                ring: 'ring-blue-500',
            },
            {
                id: 'scaler',
                label: 'StandardScaler',
                sublabel: 'zero-mean unit-variance',
                color: 'from-indigo-600 to-indigo-500',
                ring: 'ring-indigo-400',
            },
            {
                id: 'seq',
                label: 'Sliding Windows',
                sublabel: 'seq_length = 10',
                color: 'from-violet-600 to-violet-500',
                ring: 'ring-violet-400',
            },
            {
                id: 'compress',
                label: 'Classical Compressor',
                sublabel: '224 → 64 → 6 features',
                color: 'from-purple-600 to-purple-500',
                ring: 'ring-purple-400',
            },
            {
                id: 'scale',
                label: 'Learned ScaleLayer',
                sublabel: 'maps to [0, π] for photon encoding',
                color: 'from-fuchsia-600 to-fuchsia-500',
                ring: 'ring-fuchsia-400',
            },
            {
                id: 'quantum',
                label: 'QuantumLayer (3-photon)',
                sublabel: '6 modes · 3 photons · C(8,3)=56 out',
                color: 'from-pink-600 to-pink-500',
                ring: 'ring-pink-500',
            },
            {
                id: 'concat',
                label: 'Concatenate',
                sublabel: 'raw (224) + quantum (56) = 280',
                color: 'from-rose-600 to-rose-500',
                ring: 'ring-rose-400',
            },
            {
                id: 'tcn',
                label: 'Temporal Conv. Net (TCN)',
                sublabel: 'channels=[64,128,64]  kernel=3  dropout=0.1',
                color: 'from-orange-600 to-orange-500',
                ring: 'ring-orange-400',
            },
            {
                id: 'fc',
                label: 'Output Projection',
                sublabel: '64 → 32 → 224',
                color: 'from-amber-600 to-amber-500',
                ring: 'ring-amber-400',
            },
            {
                id: 'out',
                label: 'Option Prices',
                sublabel: 'MSE = 0.0999  ·  R² = 0.900',
                color: 'from-green-600 to-green-500',
                ring: 'ring-green-400',
            },
        ],
    },

    QRC5: {
        title: '5-Photon Quantum TCN Pipeline',
        subtitle:
            '5photons_Hybrid_Quantum_TCN.ipynb  ·  6 modes, 5 photons, C(10,5)=252 quantum dims  ·  TCN [64,128,64]',
        steps: [
            {
                id: 'raw',
                label: 'Excel Data',
                sublabel: '224 swaption features',
                color: 'from-blue-600 to-blue-500',
                ring: 'ring-blue-500',
            },
            {
                id: 'scaler',
                label: 'StandardScaler',
                sublabel: 'zero-mean unit-variance',
                color: 'from-indigo-600 to-indigo-500',
                ring: 'ring-indigo-400',
            },
            {
                id: 'seq',
                label: 'Sliding Windows',
                sublabel: 'seq_length = 10',
                color: 'from-violet-600 to-violet-500',
                ring: 'ring-violet-400',
            },
            {
                id: 'compress',
                label: 'Classical Compressor',
                sublabel: '224 → 64 → 6 features',
                color: 'from-purple-600 to-purple-500',
                ring: 'ring-purple-400',
            },
            {
                id: 'scale',
                label: 'Learned ScaleLayer',
                sublabel: 'maps to [0, π] for photon encoding',
                color: 'from-fuchsia-600 to-fuchsia-500',
                ring: 'ring-fuchsia-400',
            },
            {
                id: 'quantum',
                label: 'QuantumLayer (5-photon)',
                sublabel: '6 modes · 5 photons · C(10,5)=252 out',
                color: 'from-pink-600 to-pink-500',
                ring: 'ring-pink-500',
            },
            {
                id: 'concat',
                label: 'Concatenate',
                sublabel: 'raw (224) + quantum (252) = 476',
                color: 'from-rose-600 to-rose-500',
                ring: 'ring-rose-400',
            },
            {
                id: 'tcn',
                label: 'Temporal Conv. Net (TCN)',
                sublabel: 'channels=[64,128,64]  kernel=3  dropout=0.1',
                color: 'from-orange-600 to-orange-500',
                ring: 'ring-orange-400',
            },
            {
                id: 'fc',
                label: 'Output Projection',
                sublabel: '64 → 32 → 224',
                color: 'from-amber-600 to-amber-500',
                ring: 'ring-amber-400',
            },
            {
                id: 'out',
                label: 'Option Prices',
                sublabel: 'MSE = 0.0748  ·  R² = 0.925',
                color: 'from-emerald-600 to-emerald-500',
                ring: 'ring-emerald-400',
            },
        ],
    },

    HPQRC: {
        title: 'Hybrid Photonic-QRC Pipeline',
        subtitle:
            'HP-QR.ipynb  ·  PCA(5)→windows(5)→8 modes·3 photons·5 reservoirs  ‖  Photonic Reservoir(64)  →  Ridge(α=0.01)  ·  R²=0.998',
        steps: [
            {
                id: 'raw',
                label: 'Excel Data',
                sublabel: '224 swaption prices',
                color: 'from-blue-600 to-blue-500',
                ring: 'ring-blue-500',
            },
            {
                id: 'ss',
                label: 'StandardScaler',
                sublabel: 'zero-mean unit-variance',
                color: 'from-indigo-600 to-indigo-500',
                ring: 'ring-indigo-400',
            },
            {
                id: 'pca',
                label: 'PCA  (n=5)',
                sublabel: '224 → 5 principal components',
                color: 'from-violet-600 to-violet-500',
                ring: 'ring-violet-400',
            },
            {
                id: 'win',
                label: 'Time Windows',
                sublabel: 'window = 5  →  shape (N, 25)',
                color: 'from-purple-600 to-purple-500',
                ring: 'ring-purple-400',
            },
            {
                id: 'mms',
                label: 'MinMaxScaler',
                sublabel: 'rescale to [0, π] for encoding',
                color: 'from-fuchsia-600 to-fuchsia-500',
                ring: 'ring-fuchsia-400',
            },
            {
                id: 'qe',
                label: 'Quantum Ensemble (×5)',
                sublabel: '8 modes · 3 photons · 5 layers → 50 dims',
                color: 'from-pink-600 to-pink-500',
                ring: 'ring-pink-500',
            },
            {
                id: 'pr',
                label: 'Photonic Reservoir',
                sublabel: 'ph_units=64  delay=5  spectral_r=0.95',
                color: 'from-rose-600 to-rose-500',
                ring: 'ring-rose-400',
            },
            {
                id: 'cat',
                label: 'Concatenate',
                sublabel: 'quantum(50) + photonic(64) + raw(25) = 139',
                color: 'from-orange-600 to-orange-500',
                ring: 'ring-orange-400',
            },
            {
                id: 'ridge',
                label: 'Ridge Regression',
                sublabel: 'α = 0.01  (only trainable layer)',
                color: 'from-amber-600 to-amber-500',
                ring: 'ring-amber-400',
            },
            {
                id: 'inv',
                label: 'PCA⁻¹  +  Scaler⁻¹',
                sublabel: 'inverse-transform → original scale',
                color: 'from-yellow-600 to-yellow-500',
                ring: 'ring-yellow-400',
            },
            {
                id: 'out',
                label: 'Option Prices',
                sublabel: 'MSE = 1.93e-5  ·  R² = 0.998',
                color: 'from-teal-600 to-teal-500',
                ring: 'ring-teal-400',
            },
        ],
    },
};

// ─── Animated quantum circuit SVG for QRC models ─────────────────────────────

function QuantumCircuitSVG({ nPhotons }: { nPhotons: number }) {
    const nModes = 6;
    const colors = { 3: '#ec4899', 5: '#10b981' };
    const accent = nPhotons === 5 ? colors[5] : colors[3];

    return (
        <svg viewBox="0 0 260 160" className="w-full h-full" aria-label="Quantum circuit diagram">
            {/* Mode lines */}
            {Array.from({ length: nModes }, (_, m) => (
                <g key={m}>
                    <line x1={8} y1={20 + m * 24} x2={252} y2={20 + m * 24} stroke="#6d28d9" strokeWidth={1.5} />
                    {/* Mode label */}
                    <text x={2} y={24 + m * 24} fill="#a78bfa" fontSize={7}>
                        m{m + 1}
                    </text>
                </g>
            ))}

            {/* 5 encoding layers */}
            {Array.from({ length: 5 }, (_, layer) => {
                const x = 22 + layer * 46;
                return (
                    <g key={layer}>
                        {/* Beam splitter gates (pairs) */}
                        {[0, 2, 4].map((m) => (
                            <motion.g
                                key={m}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: [0.4, 1, 0.4] }}
                                transition={{
                                    duration: 1.8,
                                    repeat: Infinity,
                                    delay: layer * 0.25 + m * 0.1,
                                }}
                            >
                                {/* Beam-splitter box */}
                                <rect x={x} y={12 + m * 24} width={16} height={20} rx={3} fill={accent} opacity={0.8} />
                                <text x={x + 8} y={25 + m * 24} textAnchor="middle" fill="#fff" fontSize={6} fontWeight="bold">BS</text>
                                {/* Vertical coupler */}
                                <motion.line
                                    x1={x + 8}
                                    y1={32 + m * 24}
                                    x2={x + 8}
                                    y2={32 + (m + 1) * 24}
                                    stroke={accent}
                                    strokeWidth={1.5}
                                    strokeDasharray="3 2"
                                    animate={{ strokeDashoffset: [0, -10] }}
                                    transition={{ duration: 1, repeat: Infinity, ease: 'linear', delay: layer * 0.3 }}
                                />
                            </motion.g>
                        ))}

                        {/* Phase shifters on first encode_modes=5 */}
                        {Array.from({ length: 5 }, (_, m) => (
                            <motion.g
                                key={m}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: [0.3, 0.9, 0.3] }}
                                transition={{ duration: 2, repeat: Infinity, delay: layer * 0.2 + m * 0.15 }}
                            >
                                <circle cx={x + 26} cy={20 + m * 24} r={5} fill="none" stroke={accent} strokeWidth={1.2} />
                                <text x={x + 26} y={23 + m * 24} textAnchor="middle" fill={accent} fontSize={5}>φ</text>
                            </motion.g>
                        ))}
                    </g>
                );
            })}

            {/* Measurement indicators (right side) */}
            {Array.from({ length: nModes }, (_, m) => (
                <motion.g
                    key={m}
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2.5, repeat: Infinity, delay: m * 0.2 }}
                >
                    <rect x={238} y={13 + m * 24} width={14} height={14} rx={2} fill="#7c3aed" />
                    <text x={245} y={23 + m * 24} textAnchor="middle" fill="#fff" fontSize={5}>M</text>
                </motion.g>
            ))}

            {/* Photon count label */}
            <text x={130} y={155} textAnchor="middle" fill={accent} fontSize={8} fontWeight="bold">
                {nPhotons}-photon  ·  6 modes  ·  C({nModes + nPhotons},{nPhotons}) = {nPhotons === 3 ? 56 : 252} output dims
            </text>
        </svg>
    );
}

// ─── HPQRC dual-path SVG ─────────────────────────────────────────────────────

function HPQRCArchSVG() {
    return (
        <svg viewBox="0 0 300 200" className="w-full h-full" aria-label="HPQRC architecture">
            {/* Input node */}
            <rect x={115} y={4} width={70} height={22} rx={5} fill="#6d28d9" />
            <text x={150} y={19} textAnchor="middle" fill="#fff" fontSize={8} fontWeight="bold">PCA features (25)</text>

            {/* Split lines */}
            <line x1={150} y1={26} x2={75} y2={56} stroke="#a78bfa" strokeWidth={1.5} />
            <line x1={150} y1={26} x2={225} y2={56} stroke="#a78bfa" strokeWidth={1.5} />

            {/* Quantum Ensemble box */}
            <motion.rect
                x={20} y={56} width={110} height={60} rx={6}
                fill="none" stroke="#ec4899" strokeWidth={1.5}
                animate={{ strokeOpacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
            />
            <text x={75} y={72} textAnchor="middle" fill="#ec4899" fontSize={7} fontWeight="bold">Quantum Ensemble ×5</text>
            <text x={75} y={84} textAnchor="middle" fill="#d1d5db" fontSize={6}>8 modes · 3 photons</text>
            <text x={75} y={94} textAnchor="middle" fill="#d1d5db" fontSize={6}>5 layers × lex_out=10</text>
            <text x={75} y={104} textAnchor="middle" fill="#a78bfa" fontSize={6}>→ 50 quantum features</text>

            {/* Photonic Reservoir box */}
            <motion.rect
                x={170} y={56} width={110} height={60} rx={6}
                fill="none" stroke="#10b981" strokeWidth={1.5}
                animate={{ strokeOpacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
            />
            <text x={225} y={72} textAnchor="middle" fill="#10b981" fontSize={7} fontWeight="bold">Photonic Reservoir</text>
            <text x={225} y={84} textAnchor="middle" fill="#d1d5db" fontSize={6}>ph_units=64</text>
            <text x={225} y={94} textAnchor="middle" fill="#d1d5db" fontSize={6}>delay=5  spectral_r=0.95</text>
            <text x={225} y={104} textAnchor="middle" fill="#a78bfa" fontSize={6}>→ 64 photonic features</text>

            {/* Merge lines */}
            <line x1={75} y1={116} x2={140} y2={146} stroke="#a78bfa" strokeWidth={1.5} />
            <line x1={225} y1={116} x2={160} y2={146} stroke="#a78bfa" strokeWidth={1.5} />
            <line x1={150} y1={51} x2={150} y2={146} stroke="#a78bfa" strokeWidth={1} strokeDasharray="3 2" />

            {/* Concatenate + Ridge */}
            <rect x={85} y={146} width={130} height={22} rx={5} fill="#7c3aed" />
            <text x={150} y={161} textAnchor="middle" fill="#fff" fontSize={7} fontWeight="bold">Concat(50+64+25=139) → Ridge</text>

            {/* Output */}
            <motion.rect
                x={110} y={176} width={80} height={20} rx={5}
                fill="#0d9488"
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 2, repeat: Infinity }}
            />
            <line x1={150} y1={168} x2={150} y2={176} stroke="#a78bfa" strokeWidth={1.5} />
            <text x={150} y={189} textAnchor="middle" fill="#fff" fontSize={7} fontWeight="bold">Option Prices (R²=0.998)</text>
        </svg>
    );
}

// ─── LSTM / QML architecture SVG ─────────────────────────────────────────────

function LSTMArchSVG({ nPhotons }: { nPhotons?: number }) {
    const isQuantum = nPhotons != null;
    const accent = isQuantum ? '#8b5cf6' : '#3b82f6';

    return (
        <svg viewBox="0 0 260 180" className="w-full h-full" aria-label={isQuantum ? 'Quantum LSTM architecture' : 'Classical LSTM architecture'}>
            {/* Input */}
            <rect x={90} y={6} width={80} height={20} rx={4} fill={accent} opacity={0.9} />
            <text x={130} y={19} textAnchor="middle" fill="#fff" fontSize={8}>Input (224 feats)</text>

            <line x1={130} y1={26} x2={130} y2={42} stroke={accent} strokeWidth={1.5} />

            {/* Compressor (quantum only) */}
            {isQuantum && (
                <>
                    <motion.rect
                        x={75} y={42} width={110} height={22} rx={4}
                        fill="#7c3aed" opacity={0.9}
                        animate={{ opacity: [0.7, 1, 0.7] }}
                        transition={{ duration: 2, repeat: Infinity }}
                    />
                    <text x={130} y={57} textAnchor="middle" fill="#fff" fontSize={7}>Compressor  224→32→6</text>
                    <line x1={130} y1={64} x2={130} y2={76} stroke={accent} strokeWidth={1.5} />

                    <motion.rect
                        x={85} y={76} width={90} height={20} rx={4}
                        fill="#ec4899" opacity={0.9}
                        animate={{ opacity: [0.6, 1, 0.6] }}
                        transition={{ duration: 2, repeat: Infinity, delay: 0.4 }}
                    />
                    <text x={130} y={89} textAnchor="middle" fill="#fff" fontSize={7}>QuantumLayer ({nPhotons}ph)</text>
                    <line x1={130} y1={96} x2={130} y2={108} stroke={accent} strokeWidth={1.5} />

                    <rect x={80} y={108} width={100} height={20} rx={4} fill="#6d28d9" />
                    <text x={130} y={121} textAnchor="middle" fill="#fff" fontSize={7}>Concat raw + quantum</text>
                    <line x1={130} y1={128} x2={130} y2={140} stroke={accent} strokeWidth={1.5} />
                </>
            )}

            {/* LSTM cell */}
            <motion.rect
                x={60} y={isQuantum ? 140 : 42} width={140} height={30} rx={6}
                fill={accent} opacity={0.85}
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
            />
            {/* LSTM internal gates indicator */}
            {['f', 'i', 'c', 'o'].map((gate, gi) => (
                <g key={gate}>
                    <rect x={70 + gi * 30} y={(isQuantum ? 140 : 42) + 6} width={20} height={18} rx={3} fill="#ffffff30" />
                    <text x={80 + gi * 30} y={(isQuantum ? 140 : 42) + 18} textAnchor="middle" fill="#fff" fontSize={7}>{gate}</text>
                </g>
            ))}
            <text x={200} y={(isQuantum ? 140 : 42) + 19} fill="#e2e8f0" fontSize={6}>LSTM</text>

            <line x1={130} y1={isQuantum ? 170 : 72} x2={130} y2={isQuantum ? 182 : 84} stroke={accent} strokeWidth={1.5} />

            {/* Output */}
            <motion.rect
                x={90} y={isQuantum ? 182 : 84} width={80} height={20} rx={4}
                fill="#059669" opacity={0.9}
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.6 }}
            />
            <text x={130} y={isQuantum ? 195 : 97} textAnchor="middle" fill="#fff" fontSize={7}>
                {isQuantum ? `R²=${nPhotons === 2 ? '0.792' : '0.687'}` : 'Option Prices R²=0.687'}
            </text>
        </svg>
    );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function ModelPipelineDiagram({ modelType }: ModelPipelineDiagramProps) {
    const pipeline = PIPELINES[modelType];
    if (!pipeline) return null;

    // Compute active "pulse" index cycling through all steps every 2 s
    // We use CSS animation via framer-motion with stagger
    const isQRC = modelType === 'QRC' || modelType === 'QRC5';
    const isHPQRC = modelType === 'HPQRC';
    const isQML = modelType === 'QML';
    const isML = modelType === 'ML';

    return (
        <section className="container mx-auto px-4 py-12">
            <motion.div
                key={modelType}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -24 }}
                transition={{ duration: 0.45 }}
            >
                {/* Header */}
                <h2 className="text-3xl font-bold mb-2 text-center">{pipeline.title}</h2>
                <p className="text-center text-gray-400 text-sm mb-10 max-w-3xl mx-auto">{pipeline.subtitle}</p>

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">

                    {/* ── Left: animated step-by-step pipeline ── */}
                    <div className="space-y-2">
                        <h3 className="text-lg font-semibold text-gray-300 mb-4">Data Flow</h3>
                        {pipeline.steps.map((step, idx) => (
                            <div key={step.id}>
                                {/* Step card */}
                                <motion.div
                                    initial={{ opacity: 0, x: -40 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.07, duration: 0.4 }}
                                    className="glass-card rounded-xl p-4 flex items-center gap-4"
                                >
                                    {/* Pulsing step number */}
                                    <motion.div
                                        animate={{ scale: [1, 1.15, 1], opacity: [0.7, 1, 0.7] }}
                                        transition={{
                                            duration: 2,
                                            repeat: Infinity,
                                            delay: idx * 0.18,
                                        }}
                                        className={`flex-shrink-0 w-9 h-9 rounded-full bg-gradient-to-br ${step.color} flex items-center justify-center text-white text-sm font-bold ring-2 ${step.ring}`}
                                    >
                                        {idx + 1}
                                    </motion.div>

                                    {/* Labels */}
                                    <div className="flex-1 min-w-0">
                                        <p className="font-semibold text-sm text-gray-100 leading-tight">{step.label}</p>
                                        <p className="text-xs text-gray-400 leading-tight mt-0.5">{step.sublabel}</p>
                                    </div>

                                    {/* Animated data flow pulse */}
                                    <motion.div
                                        className={`w-2 h-2 rounded-full bg-gradient-to-br ${step.color}`}
                                        animate={{ scale: [1, 2, 1], opacity: [0.5, 1, 0.5] }}
                                        transition={{
                                            duration: 1.5,
                                            repeat: Infinity,
                                            delay: idx * 0.15 + 0.5,
                                        }}
                                    />
                                </motion.div>

                                {/* Flow arrow */}
                                {idx < pipeline.steps.length - 1 && (
                                    <motion.div
                                        initial={{ opacity: 0, scaleY: 0 }}
                                        animate={{ opacity: 1, scaleY: 1 }}
                                        transition={{ delay: idx * 0.07 + 0.35 }}
                                        className="flex justify-center py-0.5"
                                    >
                                        <motion.div
                                            animate={{ y: [0, 4, 0] }}
                                            transition={{ duration: 1.2, repeat: Infinity, delay: idx * 0.1 }}
                                        >
                                            <svg width="16" height="16" viewBox="0 0 16 16">
                                                <path d="M8 0 L8 10 M4 6 L8 12 L12 6" stroke="#7c3aed" strokeWidth="2" fill="none" strokeLinecap="round" />
                                            </svg>
                                        </motion.div>
                                    </motion.div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* ── Right: architecture visualisation ── */}
                    <div className="space-y-6">

                        {/* Architecture SVG panel */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.92 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.3, duration: 0.5 }}
                            className="glass-card rounded-2xl p-5"
                        >
                            <h3 className="text-lg font-semibold text-gray-300 mb-3">
                                {isQRC ? 'Photonic Quantum Circuit' :
                                    isHPQRC ? 'Dual-Path Architecture' :
                                        isQML ? 'Quantum-LSTM Architecture' :
                                            'LSTM Architecture'}
                            </h3>
                            <div className="relative h-96 bg-gradient-to-br from-purple-900/30 to-pink-900/20 rounded-xl p-3 overflow-hidden">
                                {isQRC && <QuantumCircuitSVG nPhotons={modelType === 'QRC5' ? 5 : 3} />}
                                {isHPQRC && <HPQRCArchSVG />}
                                {isQML && <LSTMArchSVG nPhotons={2} />}
                                {isML && <LSTMArchSVG />}
                            </div>
                        </motion.div>

                        {/* Key design decisions */}
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.55, duration: 0.45 }}
                            className="glass-card rounded-2xl p-5"
                        >
                            <h3 className="text-lg font-semibold text-gray-300 mb-3">Design Highlights</h3>
                            <div className="space-y-2">
                                {DESIGN_HIGHLIGHTS[modelType].map((item, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, x: 16 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.6 + i * 0.08 }}
                                        className="flex items-start gap-2"
                                    >
                                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-purple-400 flex-shrink-0" />
                                        <p className="text-sm text-gray-300">{item}</p>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>

                        {/* Metric summary */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.8 }}
                            className="glass-card rounded-2xl p-5 bg-gradient-to-br from-purple-900/20 to-indigo-900/20"
                        >
                            <h3 className="text-sm font-semibold text-purple-300 mb-2">📊 Notebook Results</h3>
                            <div className="grid grid-cols-2 gap-3">
                                {MODEL_METRICS[modelType].map((m, i) => (
                                    <div key={i} className="text-center">
                                        <p className="text-xs text-gray-500">{m.label}</p>
                                        <motion.p
                                            className="text-base font-bold text-gray-100"
                                            animate={{ opacity: [0.8, 1, 0.8] }}
                                            transition={{ duration: 3, repeat: Infinity, delay: i * 0.4 }}
                                        >
                                            {m.value}
                                        </motion.p>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                </div>
            </motion.div>
        </section>
    );
}

// ─── Design highlights per model ─────────────────────────────────────────────

const DESIGN_HIGHLIGHTS: Record<ModelType, string[]> = {
    ML: [
        'Vanilla LSTM baseline — no quantum components',
        '1 LSTM layer, hidden=32; avoids overfitting on small dataset',
        'Seq length 20 captures monthly seasonality patterns',
        '200 epochs with early stopping on val_loss',
        'Best val MSE = 0.31333 sets the classical benchmark',
    ],
    QML: [
        'Compressor (224→32→6) reduces features before quantum encoding',
        'Learned ScaleLayer avoids hard-coded angle range assumptions',
        'QuantumLayer: 6 modes, 2 photons → C(7,2)=21 boson-sampling features',
        'Concatenation of raw + quantum improves gradient flow',
        'LSTM hidden=128 with dropout=0.2 handles temporal dependencies',
    ],
    QRC: [
        'Quantum reservoir is FIXED (non-trainable) — only classical TCN trains',
        '6 modes, 3 photons → C(8,3)=56 Fock-basis measurement outputs',
        'TCN with dilated convolutions captures long-range time dependencies',
        'Compressor (224→64→6) pre-conditions data for photon encoding',
        'Concat(224+56=280) preserves raw signal alongside quantum features',
    ],
    QRC5: [
        'Same architecture as QRC but 5 photons raises expressibility significantly',
        '6 modes, 5 photons → C(10,5)=252 Fock-basis features (4.5× more than 3-photon)',
        'Larger quantum feature space reduces final MSE from 0.0999 → 0.0748 (R² 0.900→0.925)',
        'MAPE rises to 172.93 % vs 160.28 % — richer reservoir amplifies relative spread on small values',
        '10 training epochs (vs 20 for QRC) — still achieves better absolute accuracy',
    ],
    HPQRC: [
        'PCA(5) reduces 224 features → 5 principal components before any encoding',
        'Windowed (window=5) input fed to BOTH quantum ensemble AND photonic reservoir in parallel',
        'Quantum Ensemble: 5 × Perceval circuits (8 modes, 3 photons) → 50 concatenated features',
        'Photonic Reservoir: time-delay echo state network (ph_units=64, spectral_r=0.95)',
        'Ridge regression (α=0.01) is the ONLY trainable layer — no quantum gradient needed',
    ],
};

// ─── Key metrics per model ────────────────────────────────────────────────────

const MODEL_METRICS: Record<ModelType, { label: string; value: string }[]> = {
    ML: [
        { label: 'MSE', value: '0.31333' },
        { label: 'RMSE', value: '0.5598' },
        { label: 'R²', value: '0.687' },
        { label: 'Epochs', value: '200' },
    ],
    QML: [
        { label: 'Test MSE', value: '0.2077' },
        { label: 'Test MAE', value: '0.3658' },
        { label: 'MAPE', value: '378.54 %' },
        { label: 'R²', value: '0.792' },
    ],
    QRC: [
        { label: 'Test MSE', value: '0.0999' },
        { label: 'Test MAE', value: '0.2401' },
        { label: 'MAPE', value: '160.28 %' },
        { label: 'R²', value: '0.900' },
    ],
    QRC5: [
        { label: 'Test MSE', value: '0.0748' },
        { label: 'Test MAE', value: '0.2133' },
        { label: 'MAPE', value: '172.93 %' },
        { label: 'R²', value: '0.925' },
    ],
    HPQRC: [
        { label: 'Val MSE', value: '1.93e-05' },
        { label: 'Val MAE', value: '0.00326' },
        { label: 'RelErr%', value: '~2.04 %' },
        { label: 'R²', value: '0.998' },
    ],
};
