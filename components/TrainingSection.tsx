'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, Zap, TrendingUp, AlertCircle, CheckCircle2, Brain } from 'lucide-react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts';

interface TrainingResult {
    status: string;
    message: string;
    model_path: string;
    scaler_path: string;
    train_losses: number[];
    val_losses: number[];
    final_train_loss: number;
    final_val_loss: number;
    epochs: number;
    n_features: number;
}

export default function TrainingSection() {
    const [trainingFile, setTrainingFile] = useState<File | null>(null);
    const [isTraining, setIsTraining] = useState(false);
    const [trainingResult, setTrainingResult] = useState<TrainingResult | null>(null);
    const [error, setError] = useState<string>('');
    const [epochs, setEpochs] = useState(10);
    const [batchSize, setBatchSize] = useState(8);
    const [learningRate, setLearningRate] = useState(0.001);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setTrainingFile(e.target.files[0]);
            setError('');
            setTrainingResult(null);
        }
    };

    const handleTrain = async () => {
        if (!trainingFile) {
            setError('Please select a training file');
            return;
        }

        setIsTraining(true);
        setError('');

        try {
            const formData = new FormData();
            formData.append('file', trainingFile);
            formData.append('epochs', epochs.toString());
            formData.append('batch_size', batchSize.toString());
            formData.append('learning_rate', learningRate.toString());

            const response = await fetch('/api/train', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Training failed');
            }

            const result: TrainingResult = await response.json();
            setTrainingResult(result);
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Training failed';
            setError(message);
        } finally {
            setIsTraining(false);
        }
    };

    // Prepare chart data
    const chartData = trainingResult
        ? trainingResult.train_losses.map((loss, idx) => ({
            epoch: idx + 1,
            'Training Loss': loss,
            'Validation Loss': trainingResult.val_losses[idx] || 0,
        }))
        : [];

    return (
        <section className="py-20" id="train">
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                >
                    {/* Header */}
                    <div className="text-center mb-12">
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                            className="inline-block mb-4"
                        >
                            <Brain className="w-12 h-12 text-purple-400" />
                        </motion.div>
                        <h2 className="text-4xl md:text-5xl font-bold mb-4">
                            <span className="gradient-text">Train Your Model</span>
                        </h2>
                        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                            Upload your training data and train a custom Quantum TCN model
                        </p>
                    </div>

                    <div className="max-w-4xl mx-auto">
                        {/* Upload Section */}
                        <div className="glass-card p-8 rounded-3xl mb-8">
                            <h3 className="text-2xl font-semibold mb-6 flex items-center gap-2">
                                <Upload className="w-6 h-6 text-purple-400" />
                                Training Data
                            </h3>

                            <div className="space-y-6">
                                {/* File Upload */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Upload Training Excel File
                                    </label>
                                    <input
                                        type="file"
                                        accept=".xlsx,.xls"
                                        onChange={handleFileSelect}
                                        className="block w-full text-sm text-gray-300
                                            file:mr-4 file:py-2 file:px-4
                                            file:rounded-full file:border-0
                                            file:text-sm file:font-semibold
                                            file:bg-purple-600 file:text-white
                                            hover:file:bg-purple-700
                                            cursor-pointer"
                                    />
                                    {trainingFile && (
                                        <p className="mt-2 text-sm text-green-400">
                                            ✓ {trainingFile.name}
                                        </p>
                                    )}
                                </div>

                                {/* Training Parameters */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">
                                            Epochs
                                        </label>
                                        <input
                                            type="number"
                                            min="1"
                                            max="100"
                                            value={epochs}
                                            onChange={(e) => setEpochs(parseInt(e.target.value))}
                                            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">
                                            Batch Size
                                        </label>
                                        <input
                                            type="number"
                                            min="1"
                                            max="64"
                                            value={batchSize}
                                            onChange={(e) => setBatchSize(parseInt(e.target.value))}
                                            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">
                                            Learning Rate
                                        </label>
                                        <input
                                            type="number"
                                            min="0.0001"
                                            max="0.1"
                                            step="0.0001"
                                            value={learningRate}
                                            onChange={(e) => setLearningRate(parseFloat(e.target.value))}
                                            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple-500"
                                        />
                                    </div>
                                </div>

                                {/* Train Button */}
                                <motion.button
                                    onClick={handleTrain}
                                    disabled={!trainingFile || isTraining}
                                    whileHover={{ scale: trainingFile && !isTraining ? 1.02 : 1 }}
                                    whileTap={{ scale: trainingFile && !isTraining ? 0.98 : 1 }}
                                    className={`w-full py-4 rounded-2xl font-semibold text-lg flex items-center justify-center gap-2 ${trainingFile && !isTraining
                                            ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white glow-effect'
                                            : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                                        }`}
                                >
                                    {isTraining ? (
                                        <>
                                            <Zap className="w-5 h-5 animate-pulse" />
                                            Training Model... {epochs} epochs
                                        </>
                                    ) : (
                                        <>
                                            <Brain className="w-5 h-5" />
                                            Start Training
                                        </>
                                    )}
                                </motion.button>
                            </div>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="glass-card p-4 rounded-2xl mb-8 border-2 border-red-500/50"
                            >
                                <div className="flex items-center gap-3">
                                    <AlertCircle className="w-5 h-5 text-red-400" />
                                    <p className="text-red-400">{error}</p>
                                </div>
                            </motion.div>
                        )}

                        {/* Training Results */}
                        {trainingResult && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="space-y-6"
                            >
                                {/* Success Message */}
                                <div className="glass-card p-6 rounded-3xl border-2 border-green-500/50">
                                    <div className="flex items-center gap-3 mb-4">
                                        <CheckCircle2 className="w-6 h-6 text-green-400" />
                                        <h3 className="text-2xl font-semibold text-green-400">
                                            Training Complete!
                                        </h3>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <p className="text-gray-400">Final Train Loss</p>
                                            <p className="text-xl font-semibold text-purple-400">
                                                {trainingResult.final_train_loss.toFixed(10)}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-gray-400">Final Val Loss</p>
                                            <p className="text-xl font-semibold text-pink-400">
                                                {trainingResult.final_val_loss.toFixed(10)}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-gray-400">Epochs Trained</p>
                                            <p className="text-xl font-semibold">{trainingResult.epochs}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-400">Features</p>
                                            <p className="text-xl font-semibold">{trainingResult.n_features}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Training Loss Chart */}
                                <div className="glass-card p-6 rounded-3xl">
                                    <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                                        <TrendingUp className="w-5 h-5 text-purple-400" />
                                        Training Progress
                                    </h3>
                                    <ResponsiveContainer width="100%" height={300}>
                                        <LineChart data={chartData}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                            <XAxis
                                                dataKey="epoch"
                                                stroke="#9CA3AF"
                                                label={{ value: 'Epoch', position: 'insideBottom', offset: -5 }}
                                            />
                                            <YAxis
                                                stroke="#9CA3AF"
                                                label={{ value: 'Loss', angle: -90, position: 'insideLeft' }}
                                            />
                                            <Tooltip
                                                contentStyle={{
                                                    backgroundColor: '#1F2937',
                                                    border: '1px solid #374151',
                                                    borderRadius: '8px',
                                                }}
                                            />
                                            <Legend />
                                            <Line
                                                type="monotone"
                                                dataKey="Training Loss"
                                                stroke="#A855F7"
                                                strokeWidth={2}
                                                dot={{ fill: '#A855F7', r: 4 }}
                                            />
                                            <Line
                                                type="monotone"
                                                dataKey="Validation Loss"
                                                stroke="#EC4899"
                                                strokeWidth={2}
                                                dot={{ fill: '#EC4899', r: 4 }}
                                            />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>

                                {/* Model Info */}
                                <div className="glass-card p-6 rounded-3xl">
                                    <h3 className="text-xl font-semibold mb-4">Model Saved</h3>
                                    <div className="space-y-2 text-sm">
                                        <div>
                                            <p className="text-gray-400">Model Path:</p>
                                            <p className="text-purple-400 font-mono break-all">
                                                {trainingResult.model_path}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-gray-400">Scaler Path:</p>
                                            <p className="text-pink-400 font-mono break-all">
                                                {trainingResult.scaler_path}
                                            </p>
                                        </div>
                                        <p className="text-green-400 mt-4">
                                            ✓ Model is now loaded and ready for predictions!
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
