'use client';

import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Download, Clock, Target, Activity } from 'lucide-react';
import { PredictionResult } from '@/lib/types';
import { formatNumber, downloadCSV } from '@/lib/utils';

interface PredictionPanelProps {
    result: PredictionResult | null;
    isLoading: boolean;
}

export default function PredictionPanel({ result, isLoading }: PredictionPanelProps) {
    if (isLoading) {
        return (
            <section className="container mx-auto px-4 py-12">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="glass-card rounded-2xl p-12 text-center"
                >
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                        className="w-16 h-16 mx-auto mb-6 border-4 border-purple-500 border-t-transparent rounded-full"
                    />
                    <h3 className="text-2xl font-semibold mb-2">Running Quantum Inference...</h3>
                    <p className="text-gray-400">Processing your data through quantum circuits</p>
                </motion.div>
            </section>
        );
    }

    if (!result) {
        return null;
    }

    const handleDownload = () => {
        const data = result.predictions.call.map((call, idx) => ({
            index: idx + 1,
            call_price: call,
            put_price: result.predictions.put[idx],
        }));
        downloadCSV(data, 'predictions.csv');
    };

    const metrics = [
        { label: 'Accuracy', value: result.metrics.accuracy * 100, suffix: '%', icon: Target, color: 'text-green-400' },
        { label: 'MAE', value: result.metrics.mae, suffix: '', icon: Activity, color: 'text-blue-400' },
        { label: 'MSE', value: result.metrics.mse, suffix: '', icon: Activity, color: 'text-blue-300' },
        { label: 'RMSE', value: result.metrics.rmse, suffix: '', icon: TrendingDown, color: 'text-yellow-400' },
        { label: 'R² Score', value: result.metrics.r2, suffix: '', icon: TrendingUp, color: 'text-purple-400' },
        { label: 'Inference Time', value: result.metrics.inference_time, suffix: 'ms', icon: Clock, color: 'text-pink-400' },
    ];

    return (
        <section className="container mx-auto px-4 py-12">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-3xl font-bold">Prediction Results</h2>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleDownload}
                        className="flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-xl transition-colors"
                    >
                        <Download className="w-5 h-5" />
                        Download CSV
                    </motion.button>
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
                    {metrics.map((metric, idx) => {
                        const Icon = metric.icon;
                        return (
                            <motion.div
                                key={metric.label}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className="glass-card rounded-xl p-6 glass-card-hover"
                            >
                                <div className="flex items-center gap-3 mb-2">
                                    <Icon className={`w-5 h-5 ${metric.color}`} />
                                    <span className="text-sm text-gray-400">{metric.label}</span>
                                </div>
                                <div className="text-2xl font-bold">
                                    {formatNumber(metric.value, 2)}
                                    <span className="text-sm ml-1 text-gray-400">{metric.suffix}</span>
                                </div>
                                {/* Confidence bar for accuracy */}
                                {metric.label === 'Accuracy' && (
                                    <div className="mt-3 h-2 bg-white/10 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${metric.value}%` }}
                                            transition={{ duration: 1, delay: 0.5 }}
                                            className="h-full bg-gradient-to-r from-green-500 to-emerald-500"
                                        />
                                    </div>
                                )}
                            </motion.div>
                        );
                    })}
                </div>

                {/* Predictions Display */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Call Options */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6 }}
                        className="glass-card rounded-2xl p-6"
                    >
                        <div className="flex items-center gap-3 mb-4">
                            <TrendingUp className="w-6 h-6 text-green-400" />
                            <h3 className="text-xl font-semibold">Call Option Prices</h3>
                        </div>
                        <div className="space-y-2 max-h-64 overflow-y-auto">
                            {result.predictions.call.slice(0, 10).map((price, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.7 + idx * 0.05 }}
                                    className="flex justify-between items-center p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                                >
                                    <span className="text-gray-400">Sample {idx + 1}</span>
                                    <span className="font-semibold text-green-400">${formatNumber(price, 4)}</span>
                                </motion.div>
                            ))}
                        </div>
                        {result.predictions.call.length > 10 && (
                            <p className="text-sm text-gray-400 mt-3 text-center">
                                +{result.predictions.call.length - 10} more predictions
                            </p>
                        )}
                    </motion.div>

                    {/* Put Options */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6 }}
                        className="glass-card rounded-2xl p-6"
                    >
                        <div className="flex items-center gap-3 mb-4">
                            <TrendingDown className="w-6 h-6 text-red-400" />
                            <h3 className="text-xl font-semibold">Put Option Prices</h3>
                        </div>
                        <div className="space-y-2 max-h-64 overflow-y-auto">
                            {result.predictions.put.slice(0, 10).map((price, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, x: 10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.7 + idx * 0.05 }}
                                    className="flex justify-between items-center p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                                >
                                    <span className="text-gray-400">Sample {idx + 1}</span>
                                    <span className="font-semibold text-red-400">${formatNumber(price, 4)}</span>
                                </motion.div>
                            ))}
                        </div>
                        {result.predictions.put.length > 10 && (
                            <p className="text-sm text-gray-400 mt-3 text-center">
                                +{result.predictions.put.length - 10} more predictions
                            </p>
                        )}
                    </motion.div>
                </div>
            </motion.div>
        </section>
    );
}
