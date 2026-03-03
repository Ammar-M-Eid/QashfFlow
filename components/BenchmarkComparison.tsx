'use client';

import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Award } from 'lucide-react';
import { BenchmarksData, PredictionMetrics, ModelType } from '@/lib/types';

interface BenchmarkComparisonProps {
    liveMetrics: PredictionMetrics;
    benchmarks: BenchmarksData;
    modelType: ModelType;
}

export default function BenchmarkComparison({
    liveMetrics,
    benchmarks,
    modelType,
}: BenchmarkComparisonProps) {
    const getBenchmarkForModel = () => {
        switch (modelType) {
            case 'HPQRC':
                return benchmarks.hpqrc;
            case 'QRC5':
                return benchmarks.qrc5;
            case 'QRC':
            case 'QML':
                return benchmarks.qrc;
            case 'ML':
            default:
                return benchmarks.classical;
        }
    };

    const benchmark = getBenchmarkForModel();
    
    const accuracyDiff = liveMetrics.accuracy - benchmark.accuracy;
    const latencyDiff = liveMetrics.inference_time - benchmark.latency_ms;
    const throughputDiff = liveMetrics.throughput - benchmark.throughput;
    
    const isOutperforming = accuracyDiff > 0 && latencyDiff < 0;

    return (
        <section className="container mx-auto px-4 py-12">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="glass-card p-8 rounded-2xl"
            >
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-3xl font-bold">Benchmark Comparison</h2>
                    {isOutperforming && (
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="flex items-center gap-2 bg-green-500/20 text-green-400 px-4 py-2 rounded-full border border-green-500/40"
                        >
                            <Award className="w-5 h-5" />
                            <span className="font-semibold">Outperforming Benchmark</span>
                        </motion.div>
                    )}
                    {!isOutperforming && (
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="flex items-center gap-2 bg-orange-500/20 text-orange-400 px-4 py-2 rounded-full border border-orange-500/40"
                        >
                            <span className="font-semibold">Below Benchmark — Dataset Dependent</span>
                        </motion.div>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Accuracy Comparison */}
                    <div className="glass-card p-6 rounded-xl">
                        <h3 className="text-lg font-semibold mb-4 text-purple-300">Accuracy</h3>
                        <div className="space-y-3">
                            <div>
                                <div className="flex justify-between mb-1">
                                    <span className="text-sm text-gray-400">Live Dataset</span>
                                    <span className="text-sm font-semibold text-white">
                                        {(liveMetrics.accuracy * 100).toFixed(10)}%
                                    </span>
                                </div>
                                <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${liveMetrics.accuracy * 100}%` }}
                                        transition={{ duration: 1, delay: 0.2 }}
                                        className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                                    />
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between mb-1">
                                    <span className="text-sm text-gray-400">Research Benchmark</span>
                                    <span className="text-sm font-semibold text-white">
                                        {(benchmark.accuracy * 100).toFixed(10)}%
                                    </span>
                                </div>
                                <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${benchmark.accuracy * 100}%` }}
                                        transition={{ duration: 1, delay: 0.4 }}
                                        className="h-full bg-gradient-to-r from-blue-500 to-cyan-500"
                                    />
                                </div>
                            </div>
                            <div className="flex items-center gap-2 pt-2">
                                {accuracyDiff > 0 ? (
                                    <>
                                        <TrendingUp className="w-4 h-4 text-green-400" />
                                        <span className="text-sm text-green-400">
                                            +{(accuracyDiff * 100).toFixed(10)}% better
                                        </span>
                                    </>
                                ) : (
                                    <>
                                        <TrendingDown className="w-4 h-4 text-orange-400" />
                                        <span className="text-sm text-orange-400">
                                            {(accuracyDiff * 100).toFixed(10)}%
                                        </span>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Latency Comparison */}
                    <div className="glass-card p-6 rounded-xl">
                        <h3 className="text-lg font-semibold mb-4 text-purple-300">Latency (ms)</h3>
                        <div className="space-y-3">
                            <div>
                                <div className="flex justify-between mb-1">
                                    <span className="text-sm text-gray-400">Live Dataset</span>
                                    <span className="text-sm font-semibold text-white">
                                        {liveMetrics.inference_time.toFixed(10)} ms
                                    </span>
                                </div>
                                <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${Math.min(100, (liveMetrics.inference_time / 100) * 100)}%` }}
                                        transition={{ duration: 1, delay: 0.2 }}
                                        className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                                    />
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between mb-1">
                                    <span className="text-sm text-gray-400">Research Benchmark</span>
                                    <span className="text-sm font-semibold text-white">
                                        {benchmark.latency_ms.toFixed(10)} ms
                                    </span>
                                </div>
                                <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${Math.min(100, (benchmark.latency_ms / 100) * 100)}%` }}
                                        transition={{ duration: 1, delay: 0.4 }}
                                        className="h-full bg-gradient-to-r from-blue-500 to-cyan-500"
                                    />
                                </div>
                            </div>
                            <div className="flex items-center gap-2 pt-2">
                                {latencyDiff < 0 ? (
                                    <>
                                        <TrendingUp className="w-4 h-4 text-green-400" />
                                        <span className="text-sm text-green-400">
                                            {Math.abs(latencyDiff).toFixed(10)} ms faster
                                        </span>
                                    </>
                                ) : (
                                    <>
                                        <TrendingDown className="w-4 h-4 text-orange-400" />
                                        <span className="text-sm text-orange-400">
                                            +{latencyDiff.toFixed(10)} ms slower
                                        </span>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Throughput Comparison */}
                    <div className="glass-card p-6 rounded-xl">
                        <h3 className="text-lg font-semibold mb-4 text-purple-300">Throughput (pts/sec)</h3>
                        <div className="space-y-3">
                            <div>
                                <div className="flex justify-between mb-1">
                                    <span className="text-sm text-gray-400">Live Dataset</span>
                                    <span className="text-sm font-semibold text-white">
                                        {liveMetrics.throughput.toFixed(10)}
                                    </span>
                                </div>
                                <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${Math.min(100, (liveMetrics.throughput / 30000) * 100)}%` }}
                                        transition={{ duration: 1, delay: 0.2 }}
                                        className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                                    />
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between mb-1">
                                    <span className="text-sm text-gray-400">Research Benchmark</span>
                                    <span className="text-sm font-semibold text-white">
                                        {benchmark.throughput.toFixed(10)}
                                    </span>
                                </div>
                                <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${Math.min(100, (benchmark.throughput / 30000) * 100)}%` }}
                                        transition={{ duration: 1, delay: 0.4 }}
                                        className="h-full bg-gradient-to-r from-blue-500 to-cyan-500"
                                    />
                                </div>
                            </div>
                            <div className="flex items-center gap-2 pt-2">
                                {throughputDiff > 0 ? (
                                    <>
                                        <TrendingUp className="w-4 h-4 text-green-400" />
                                        <span className="text-sm text-green-400">
                                            +{throughputDiff.toFixed(10)} pts/sec faster
                                        </span>
                                    </>
                                ) : (
                                    <>
                                        <TrendingDown className="w-4 h-4 text-orange-400" />
                                        <span className="text-sm text-orange-400">
                                            {Math.abs(throughputDiff).toFixed(10)} pts/sec slower
                                        </span>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Research footnote */}
                <div className="mt-6 p-4 bg-blue-500/10 rounded-lg border border-blue-500/30">
                    <p className="text-sm text-blue-300">
                        <strong>Research Benchmark:</strong> Validated metrics from HPQRC paper. 
                        Live results may vary based on dataset characteristics, preprocessing, and hardware.
                    </p>
                </div>
            </motion.div>
        </section>
    );
}
