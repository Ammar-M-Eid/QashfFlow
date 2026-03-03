'use client';

import { motion } from 'framer-motion';
import { ModelType } from '@/lib/types';
import { Brain, Zap, Activity, Sparkles } from 'lucide-react';

interface ModelSelectorProps {
    selectedModel: ModelType;
    onModelChange: (model: ModelType) => void;
    disabled?: boolean;
}

const models: { value: ModelType; label: string; icon: any; description: string }[] = [
    {
        value: 'ML',
        label: 'Classical ML',
        icon: Brain,
        description: 'Traditional machine learning algorithms',
    },
    {
        value: 'QML',
        label: 'Quantum ML',
        icon: Zap,
        description: 'Quantum-enhanced learning',
    },
    {
        value: 'QRC',
        label: 'Quantum Reservoir',
        icon: Activity,
        description: 'Quantum reservoir computing',
    },
    {
        value: 'HPQRC',
        label: 'HPQRC',
        icon: Sparkles,
        description: 'Hybrid Photonic Quantum Reservoir',
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

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl mx-auto">
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
                                className={`flex-1 relative overflow-hidden rounded-2xl p-6 transition-all ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
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
                                            className={`w-12 h-12 mx-auto mb-3 ${isSelected ? 'text-purple-400' : 'text-gray-400'
                                                }`}
                                        />
                                    </motion.div>

                                    {/* Label */}
                                    <h3
                                        className={`text-xl font-semibold mb-2 ${isSelected ? 'text-purple-300' : 'text-gray-300'
                                            }`}
                                    >
                                        {model.label}
                                    </h3>

                                    {/* Description */}
                                    <p className="text-sm text-gray-400">{model.description}</p>

                                    {/* Active indicator */}
                                    {isSelected && (
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            className="absolute top-4 right-4 w-3 h-3 bg-purple-500 rounded-full"
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
