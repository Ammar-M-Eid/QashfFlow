'use client';

import { motion } from 'framer-motion';
import { ModelType } from '@/lib/types';
import { Brain, Zap, Activity, Sparkles, Atom } from 'lucide-react';

interface ModelSelectorProps {
    selectedModel: ModelType;
    onModelChange: (model: ModelType) => void;
    disabled?: boolean;
}

// Model definitions with exact architecture params from training notebooks
const models: {
    value: ModelType;
    label: string;
    icon: any;
    description: string;
    params: string[];
    metrics: { mse: string; mae?: string; r2: string };
}[] = [
    {
        value: 'ML',
        label: 'Classical ML',
        icon: Brain,
        description: 'Classical LSTM — baseline',
        // Exact params from Classical LSTM.ipynb
        params: ['LSTM: input=224 → hidden=32 → output=224', 'Layers: 1, Dropout: 0.3', 'Seq length: 20, Batch: 32', 'Epochs: 200, Adam lr=1e-3'],
        metrics: { mse: '0.31333', r2: '0.687' },
    },
    {
        value: 'QML',
        label: 'Quantum ML',
        icon: Zap,
        description: 'Hybrid Quantum LSTM — 2-photon',
        // Exact params from Hybrid-Quantum LSTM.ipynb
        params: ['LSTM: hidden=128, 6 modes, 2 photons', 'Quantum output: C(7,2)=21 dims', 'Compress: 224→32→6 features', 'Epochs: 20, Adam lr=1e-3'],
        metrics: { mse: '0.207653', mae: '0.3658', r2: '0.792' },
    },
    {
        value: 'QRC',
        label: 'QRC (3-photon)',
        icon: Activity,
        description: 'Quantum TCN — 3-photon, 6 modes',
        // Exact params from 3photons_Hybrid_Quantum_TCN.ipynb
        params: ['TCN: channels=[64,128,64], k=3', '6 modes, 3 photons → C(8,3)=56 dims', 'Compress: 224→64→6 features', 'Epochs: 20, Adam lr=1e-5, dropout=0.1'],
        metrics: { mse: '0.099971', mae: '0.2401', r2: '0.900' },
    },
    {
        value: 'QRC5',
        label: 'QRC (5-photon)',
        icon: Atom,
        description: 'Quantum TCN — 5-photon, 6 modes',
        // Exact params from 5photons_Hybrid_Quantum_TCN.ipynb
        params: ['TCN: channels=[64,128,64], k=3', '6 modes, 5 photons → C(10,5)=252 dims', 'Compress: 224→64→6 features', 'Epochs: 10, Adam lr=1e-5, dropout=0.1'],
        metrics: { mse: '0.074820', mae: '0.2133', r2: '0.925' },
    },
    {
        value: 'HPQRC',
        label: 'HPQRC',
        icon: Sparkles,
        description: 'Hybrid Photonic QRC — 5 reservoirs',
        // Exact params from HP-QR.ipynb CFG dict
        params: ['PCA=5, window=5, 8 modes, 3 photons', '5 reservoirs × 5 layers, ph_units=64', 'Feature vec: 139 (Q=50,P=64,raw=25)', 'Ridge α=0.01, R²=0.998003'],
        metrics: { mse: '1.93e-5', mae: '0.00326', r2: '0.998' },
    },
];

export default function ModelSelector({ selectedModel, onModelChange, disabled }: ModelSelectorProps) {
    return (
        <section className="container mx-auto px-4 py-12">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
            >
                <h2 className="text-3xl font-bold mb-6 text-center">Select Model</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 max-w-7xl mx-auto">
                    {models.map((model) => {
                        const Icon = model.icon;
                        const isSelected = selectedModel === model.value;

                        return (
                            <motion.button
                                key={model.value}
                                onClick={() => !disabled && onModelChange(model.value)}
                                disabled={disabled}
                                whileHover={!disabled ? { scale: 1.03 } : {}}
                                whileTap={!disabled ? { scale: 0.98 } : {}}
                                className={`flex-1 relative overflow-hidden rounded-2xl p-5 transition-all text-left ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                                    } ${isSelected
                                        ? 'glass-card border-2 border-purple-500 glow-effect'
                                        : 'glass-card glass-card-hover'
                                    }`}
                            >
                                {/* Selected indicator */}
                                {isSelected && (
                                    <motion.div
                                        layoutId="selected-model"
                                        className="absolute inset-0 bg-purple-500/10"
                                        transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                                    />
                                )}

                                <div className="relative z-10">
                                    {/* Icon */}
                                    <motion.div
                                        animate={isSelected ? { rotate: [0, 360] } : {}}
                                        transition={{ duration: 1, ease: 'easeInOut' }}
                                    >
                                        <Icon
                                            className={`w-10 h-10 mx-auto mb-2 ${isSelected ? 'text-purple-400' : 'text-gray-400'
                                                }`}
                                        />
                                    </motion.div>

                                    {/* Label */}
                                    <h3
                                        className={`text-base font-semibold mb-1 text-center ${isSelected ? 'text-purple-300' : 'text-gray-300'
                                            }`}
                                    >
                                        {model.label}
                                    </h3>

                                    {/* Description */}
                                    <p className="text-xs text-gray-400 text-center mb-3">{model.description}</p>

                                    {/* Architecture params */}
                                    <div className="space-y-1">
                                        {model.params.map((p, i) => (
                                            <p key={i} className="text-xs text-gray-500 leading-tight">{p}</p>
                                        ))}
                                    </div>

                                    {/* Key metrics */}
                                    <div className="mt-3 pt-2 border-t border-white/10 grid grid-cols-2 gap-1 text-center">
                                        <div>
                                            <p className="text-xs text-gray-500">MSE</p>
                                            <p className={`text-xs font-semibold ${isSelected ? 'text-purple-300' : 'text-gray-300'}`}>{model.metrics.mse}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500">R²</p>
                                            <p className={`text-xs font-semibold ${isSelected ? 'text-purple-300' : 'text-gray-300'}`}>{model.metrics.r2}</p>
                                        </div>
                                    </div>

                                    {/* Active indicator */}
                                    {isSelected && (
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            className="absolute top-3 right-3 w-3 h-3 bg-purple-500 rounded-full"
                                        >
                                            <motion.div
                                                animate={{ scale: [1, 1.5, 1], opacity: [1, 0, 1] }}
                                                transition={{ duration: 2, repeat: Infinity }}
                                                className="absolute inset-0 bg-purple-500 rounded-full"
                                            />
                                        </motion.div>
                                    )}
                                </div>
                            </motion.button>
                        );
                    })}
                </div>

                {/* Info text */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="text-center text-gray-400 mt-6"
                >
                    Switch models without re-uploading your dataset
                </motion.p>
            </motion.div>
        </section>
    );
}
