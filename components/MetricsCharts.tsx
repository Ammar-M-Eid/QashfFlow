'use client';

import { motion } from 'framer-motion';
import {
    BarChart,
    Bar,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts';
import { ModelCache } from '@/lib/types';

interface MetricsChartsProps {
    modelCache: ModelCache;
}

export default function MetricsCharts({ modelCache }: MetricsChartsProps) {
    if (Object.keys(modelCache).length === 0) {
        return null;
    }

    // Prepare data for individual model charts
    const prepareModelData = (modelKey: keyof ModelCache) => {
        const metrics = modelCache[modelKey]?.metrics;
        if (!metrics) return [];

        return [
            { name: 'Accuracy', value: metrics.accuracy * 100 },
            { name: 'MAE', value: metrics.mae },
            { name: 'MSE', value: metrics.mse },
            { name: 'RMSE', value: metrics.rmse },
            { name: 'R²', value: metrics.r2 * 100 },
        ];
    };

    // Prepare comparison data
    const comparisonData = [
        {
            metric: 'Accuracy',
            ML: modelCache.ML ? modelCache.ML.metrics.accuracy * 100 : 0,
            QML: modelCache.QML ? modelCache.QML.metrics.accuracy * 100 : 0,
            QRC: modelCache.QRC ? modelCache.QRC.metrics.accuracy * 100 : 0,
            QRC5: modelCache.QRC5 ? modelCache.QRC5.metrics.accuracy * 100 : 0,
            HPQRC: modelCache.HPQRC ? modelCache.HPQRC.metrics.accuracy * 100 : 0,
        },
        {
            metric: 'MSE',
            ML: modelCache.ML ? modelCache.ML.metrics.mse : 0,
            QML: modelCache.QML ? modelCache.QML.metrics.mse : 0,
            QRC: modelCache.QRC ? modelCache.QRC.metrics.mse : 0,
            QRC5: modelCache.QRC5 ? modelCache.QRC5.metrics.mse : 0,
            HPQRC: modelCache.HPQRC ? modelCache.HPQRC.metrics.mse : 0,
        },
        {
            metric: 'RMSE',
            ML: modelCache.ML ? modelCache.ML.metrics.rmse : 0,
            QML: modelCache.QML ? modelCache.QML.metrics.rmse : 0,
            QRC: modelCache.QRC ? modelCache.QRC.metrics.rmse : 0,
            QRC5: modelCache.QRC5 ? modelCache.QRC5.metrics.rmse : 0,
            HPQRC: modelCache.HPQRC ? modelCache.HPQRC.metrics.rmse : 0,
        },
        {
            metric: 'R²',
            ML: modelCache.ML ? modelCache.ML.metrics.r2 * 100 : 0,
            QML: modelCache.QML ? modelCache.QML.metrics.r2 * 100 : 0,
            QRC: modelCache.QRC ? modelCache.QRC.metrics.r2 * 100 : 0,
            QRC5: modelCache.QRC5 ? modelCache.QRC5.metrics.r2 * 100 : 0,
            HPQRC: modelCache.HPQRC ? modelCache.HPQRC.metrics.r2 * 100 : 0,
        },
    ];

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="glass-card p-3 rounded-lg">
                    <p className="text-sm font-semibold mb-1">{label}</p>
                    {payload.map((entry: any, index: number) => (
                        <p key={index} className="text-sm" style={{ color: entry.color }}>
                            {entry.name}: {entry.value.toFixed(2)}
                        </p>
                    ))}
                </div>
            );
        }
        return null;
    };

    return (
        <section className="container mx-auto px-4 py-12">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <h2 className="text-3xl font-bold mb-8 text-center">Model Performance Analytics</h2>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    {/* Individual Model Charts */}
                    {(['ML', 'QML', 'QRC', 'QRC5', 'HPQRC'] as const).map((modelKey, idx) => {
                        if (!modelCache[modelKey]) return null;

                        const data = prepareModelData(modelKey);
                        const colors = {
                            ML: '#3b82f6',
                            QML: '#8b5cf6',
                            QRC: '#ec4899',
                            QRC5: '#10b981',
                            HPQRC: '#f59e0b',
                        };

                        return (
                            <motion.div
                                key={modelKey}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: idx * 0.1 }}
                                className="glass-card rounded-2xl p-6"
                            >
                                <h3 className="text-xl font-semibold mb-4">
                                    {modelKey === 'ML' && 'Classical ML Metrics'}
                                    {modelKey === 'QML' && 'Quantum ML Metrics'}
                                    {modelKey === 'QRC' && 'QRC (3-photon) Metrics'}
                                    {modelKey === 'QRC5' && 'QRC (5-photon) Metrics'}
                                    {modelKey === 'HPQRC' && 'HPQRC Metrics'}
                                </h3>
                                <ResponsiveContainer width="100%" height={250}>
                                    <BarChart data={data}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                                        <XAxis dataKey="name" stroke="#9ca3af" />
                                        <YAxis stroke="#9ca3af" />
                                        <Tooltip content={<CustomTooltip />} />
                                        <Bar
                                            dataKey="value"
                                            fill={colors[modelKey]}
                                            radius={[8, 8, 0, 0]}
                                            animationDuration={1000}
                                        />
                                    </BarChart>
                                </ResponsiveContainer>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Comparison Chart */}
                {Object.keys(modelCache).length > 1 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="glass-card rounded-2xl p-6"
                    >
                        <h3 className="text-xl font-semibold mb-4">Model Comparison</h3>
                        <ResponsiveContainer width="100%" height={350}>
                            <LineChart data={comparisonData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                                <XAxis dataKey="metric" stroke="#9ca3af" />
                                <YAxis stroke="#9ca3af" />
                                <Tooltip content={<CustomTooltip />} />
                                <Legend />
                                {modelCache.ML && (
                                    <Line
                                        type="monotone"
                                        dataKey="ML"
                                        stroke="#3b82f6"
                                        strokeWidth={2}
                                        dot={{ r: 5 }}
                                        animationDuration={1000}
                                    />
                                )}
                                {modelCache.QML && (
                                    <Line
                                        type="monotone"
                                        dataKey="QML"
                                        stroke="#8b5cf6"
                                        strokeWidth={2}
                                        dot={{ r: 5 }}
                                        animationDuration={1000}
                                    />
                                )}
                                {modelCache.QRC && (
                                    <Line
                                        type="monotone"
                                        dataKey="QRC"
                                        stroke="#ec4899"
                                        strokeWidth={2}
                                        dot={{ r: 5 }}
                                        animationDuration={1000}
                                    />
                                )}
                                {modelCache.QRC5 && (
                                    <Line
                                        type="monotone"
                                        dataKey="QRC5"
                                        stroke="#10b981"
                                        strokeWidth={2}
                                        dot={{ r: 5 }}
                                        animationDuration={1000}
                                    />
                                )}                                {modelCache.HPQRC && (
                                    <Line
                                        type="monotone"
                                        dataKey="HPQRC"
                                        stroke="#f59e0b"
                                        strokeWidth={2}
                                        dot={{ r: 5 }}
                                        animationDuration={1500}
                                    />
                                )}                            </LineChart>
                        </ResponsiveContainer>
                    </motion.div>
                )}

                {/* Runtime Comparison */}
                {Object.keys(modelCache).length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="glass-card rounded-2xl p-6 mt-6"
                    >
                        <h3 className="text-xl font-semibold mb-6">Inference Time Comparison</h3>
                        <div className="space-y-4">
                            {(['ML', 'QML', 'QRC', 'QRC5', 'HPQRC'] as const).map((modelKey) => {
                                if (!modelCache[modelKey]) return null;

                                const time = modelCache[modelKey]!.metrics.inference_time;
                                const maxTime = Math.max(
                                    modelCache.ML?.metrics.inference_time || 0,
                                    modelCache.QML?.metrics.inference_time || 0,
                                    modelCache.QRC?.metrics.inference_time || 0,
                                    modelCache.QRC5?.metrics.inference_time || 0,
                                    modelCache.HPQRC?.metrics.inference_time || 0
                                );
                                const percentage = (time / maxTime) * 100;

                                const colors = {
                                    ML: 'from-blue-500 to-blue-600',
                                    QML: 'from-purple-500 to-purple-600',
                                    QRC: 'from-pink-500 to-pink-600',
                                    QRC5: 'from-emerald-500 to-emerald-600',
                                    HPQRC: 'from-orange-500 to-orange-600',
                                };

                                return (
                                    <div key={modelKey}>
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="font-semibold">
                                                {modelKey === 'ML' && 'Classical ML'}
                                                {modelKey === 'QML' && 'Quantum ML'}
                                                {modelKey === 'QRC' && 'QRC (3-photon)'}
                                                {modelKey === 'QRC5' && 'QRC (5-photon)'}
                                                {modelKey === 'HPQRC' && 'HPQRC'}
                                            </span>
                                            <span className="text-gray-400">{time.toFixed(2)} ms</span>
                                        </div>
                                        <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${percentage}%` }}
                                                transition={{ duration: 1, delay: 0.8 }}
                                                className={`h-full bg-gradient-to-r ${colors[modelKey]}`}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </motion.div>
                )}
            </motion.div>
        </section>
    );
}
