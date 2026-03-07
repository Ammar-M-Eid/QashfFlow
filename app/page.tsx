'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import HeroSection from '@/components/HeroSection';
import ResearchPaperSection from '@/components/ResearchPaperSection';
import HPQRCArchitectureSection from '@/components/HPQRCArchitectureSection';
import NotebookExplainerSection from '@/components/NotebookExplainerSection';
import FileUploader from '@/components/FileUploader';
import ModelSelector from '@/components/ModelSelector';
import PredictionPanel from '@/components/PredictionPanel';
import MetricsCharts from '@/components/MetricsCharts';
import ModelPipelineDiagram from '@/components/ModelPipelineDiagram';
import { ModelType, PredictionResult, ModelCache, DataRow, BackendPredictionResponse } from '@/lib/types';
import { normalizePredictionResponse } from '@/lib/prediction-adapter';
import { RefreshCw, AlertCircle, CheckCircle2, Zap } from 'lucide-react';

export default function HomePage() {
    const [uploadedFile, setUploadedFile] = useState<File | null>(null);
    const [previewData, setPreviewData] = useState<DataRow[]>([]);
    const [selectedModel, setSelectedModel] = useState<ModelType>('ML');
    const [noiseLevel, setNoiseLevel] = useState<number>(0);
    const [modelCache, setModelCache] = useState<ModelCache>({});
    const [currentResult, setCurrentResult] = useState<PredictionResult | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string>('');
    const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

    const uploadSectionRef = useRef<HTMLDivElement>(null);

    // Scroll to upload section
    const handleUploadClick = () => {
        uploadSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    // Toast auto-dismiss
    useEffect(() => {
        if (toast) {
            const timer = setTimeout(() => setToast(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [toast]);

    // Handle file upload
    const handleFileUpload = async (file: File, preview: DataRow[]) => {
        setUploadedFile(file);
        setPreviewData(preview);
        setError('');
        setModelCache({}); // Clear cache for new file

        // Auto-run prediction for selected model
        await runPrediction(file, selectedModel, false);
    };

    // Run prediction API call
    const runPrediction = async (file: File, model: ModelType, useCache: boolean = true) => {
        // Check cache first
        if (useCache && modelCache[model] && noiseLevel === 0) {
            setCurrentResult(modelCache[model]!);
            setToast({ type: 'success', message: `Loaded cached ${model} predictions` });
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('model_type', model);
            formData.append('noise_level', noiseLevel.toString());

            const response = await fetch('/api/predict', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Prediction failed');
            }

            const rawResult: BackendPredictionResponse = await response.json();
            const result: PredictionResult = normalizePredictionResponse(rawResult);

            // Update cache and current result (only cache noise-free results)
            if (noiseLevel === 0) {
                setModelCache((prev) => ({
                    ...prev,
                    [model]: result,
                }));
            }
            setCurrentResult(result);
            const noiseMsg = noiseLevel > 0 ? ` with ${(noiseLevel * 100).toFixed(0)}% noise` : '';
            setToast({ type: 'success', message: `${model} inference completed successfully${noiseMsg}` });
        } catch (err) {
            const message = err instanceof Error ? err.message : 'An unexpected error occurred';
            setError(message);
            setToast({ type: 'error', message: `Prediction failed: ${message}` });
        } finally {
            setIsLoading(false);
        }
    };

    // Handle model change with auto-refetch
    const handleModelChange = async (model: ModelType) => {
        setSelectedModel(model);

        if (uploadedFile) {
            await runPrediction(uploadedFile, model, true);
        }
    };

    // Clear uploaded file and reset state
    const handleClearFile = () => {
        setUploadedFile(null);
        setPreviewData([]);
        setModelCache({});
        setCurrentResult(null);
        setError('');
        setSelectedModel('ML');
        setToast({ type: 'success', message: 'Reset complete' });
    };

    // Get current model accuracy
    const currentAccuracy = modelCache[selectedModel]?.metrics.accuracy;

    return (
        <main className="min-h-screen relative">
            {/* Toast Notification */}
            <AnimatePresence>
                {toast && (
                    <motion.div
                        initial={{ opacity: 0, y: -50 }}
                        animate={{ opacity: 1, y: 20 }}
                        exit={{ opacity: 0, y: -50 }}
                        className={`fixed top-4 right-4 z-50 px-6 py-4 rounded-xl glass-card border ${toast.type === 'success'
                            ? 'border-green-500/30 bg-green-500/10'
                            : 'border-red-500/30 bg-red-500/10'
                            }`}
                    >
                        <div className="flex items-center gap-3">
                            {toast.type === 'success' ? (
                                <CheckCircle2 className="w-5 h-5 text-green-400" />
                            ) : (
                                <AlertCircle className="w-5 h-5 text-red-400" />
                            )}
                            <span>{toast.message}</span>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ── PRE-UPLOAD: Educational Sections ─────────────────────────── */}

            {/* Hero Section */}
            <HeroSection onUploadClick={handleUploadClick} />

            {/* Research Paper Overview */}
            <ResearchPaperSection />

            {/* HPQRC Architecture Animation */}
            <HPQRCArchitectureSection />

            {/* Notebooks & Models Explainer */}
            <NotebookExplainerSection />

            {/* ── UPLOAD SECTION ───────────────────────────────────────────── */}
            <div ref={uploadSectionRef}>
                <FileUploader
                    onFileUpload={handleFileUpload}
                    uploadedFile={uploadedFile}
                    onClearFile={handleClearFile}
                />
            </div>

            {/* ── POST-UPLOAD: Prediction Sections ─────────────────────────── */}

            {/* Model Selection (shown after upload) */}
            {uploadedFile && (
                <ModelSelector
                    selectedModel={selectedModel}
                    onModelChange={handleModelChange}
                    disabled={isLoading}
                />
            )}

            {/* Noise Level Control */}
            {uploadedFile && (
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="container mx-auto px-4 py-6"
                >
                    <div className="glass-card rounded-xl p-6 max-w-2xl mx-auto">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <Zap className="w-5 h-5 text-purple-400" />
                                <h3 className="text-lg font-semibold">Noise Simulation</h3>
                            </div>
                            <span className="text-sm text-gray-400">
                                {noiseLevel === 0 ? 'No Noise' : `${(noiseLevel * 100).toFixed(0)}% Noise`}
                            </span>
                        </div>
                        <input
                            type="range"
                            min="0"
                            max="0.3"
                            step="0.05"
                            value={noiseLevel}
                            onChange={(e) => setNoiseLevel(parseFloat(e.target.value))}
                            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                            disabled={isLoading}
                        />
                        <div className="flex justify-between text-xs text-gray-500 mt-2">
                            <span>0%</span>
                            <span>10%</span>
                            <span>15%</span>
                            <span>30%</span>
                        </div>
                        {noiseLevel > 0 && (
                            <motion.button
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => runPrediction(uploadedFile, selectedModel, false)}
                                disabled={isLoading}
                                className="mt-4 w-full px-4 py-2 bg-purple-600/30 hover:bg-purple-600/40 border border-purple-500/40 rounded-lg transition-colors disabled:opacity-50"
                            >
                                Apply Noise & Re-predict
                            </motion.button>
                        )}
                    </div>
                </motion.section>
            )}

            {/* Selected Model Accuracy Display */}
            {currentAccuracy && (
                <motion.section
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="container mx-auto px-4 pb-6"
                >
                    <div className="glass-card rounded-xl p-4 text-center">
                        <p className="text-gray-400">Current Model Performance</p>
                        <p className="text-2xl font-bold gradient-text">
                            {selectedModel} Accuracy: {(currentAccuracy * 100).toFixed(10)}%
                        </p>
                    </div>
                </motion.section>
            )}

            {/* Error Display */}
            {error && (
                <section className="container mx-auto px-4 pb-6">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl"
                    >
                        <div className="flex items-center gap-2 text-red-400">
                            <AlertCircle className="w-5 h-5" />
                            <span>{error}</span>
                        </div>
                    </motion.div>
                </section>
            )}

            {/* Prediction Output */}
            <PredictionPanel result={currentResult} isLoading={isLoading} />

            {/* Loading Skeletons */}
            {isLoading && (
                <section className="container mx-auto px-4 py-12">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {[1, 2, 3].map((i) => (
                            <motion.div
                                key={i}
                                animate={{ opacity: [0.3, 0.6, 0.3] }}
                                transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.1 }}
                                className="h-32 glass-card rounded-xl"
                            />
                        ))}
                    </div>
                </section>
            )}

            {/* Advanced Sections (show after first prediction) */}
            {Object.keys(modelCache).length > 0 && (
                <>
                    <MetricsCharts modelCache={modelCache} />
                    <ModelPipelineDiagram modelType={selectedModel} />

                    {/* Reset Button */}
                    <section className="container mx-auto px-4 py-12 text-center">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleClearFile}
                            className="inline-flex items-center gap-2 px-8 py-4 bg-red-600/20 hover:bg-red-600/30 border border-red-500/30 rounded-xl transition-colors"
                        >
                            <RefreshCw className="w-5 h-5" />
                            Reset Platform
                        </motion.button>
                    </section>
                </>
            )}
        </main>
    );
}
