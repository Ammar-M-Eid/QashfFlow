export type ModelType = 'ML' | 'QML' | 'QRC' | 'QRC5' | 'HPQRC';

export interface PredictionMetrics {
    accuracy: number;
    mae: number;
    rmse: number;
    mse: number;
    r2: number;
    mape?: number;       // Mean Absolute Percentage Error (from notebooks)
    inference_time: number;
    throughput: number;  // samples per second
}

export interface PredictionResult {
    predictions: {
        call: number[];
        put: number[];
    };
    metrics: PredictionMetrics;
    /** true when served from notebook reference data (no live backend connected) */
    demo?: boolean;
}

export type BackendPredictionResponse =
    | PredictionResult
    | {
        predictions?: {
            call?: number[];
            put?: number[];
        } | number[] | number[][];
        call_predictions?: number[];
        put_predictions?: number[];
        y_pred_call?: number[];
        y_pred_put?: number[];
        metrics?: Partial<PredictionMetrics>;
        mae?: number;
        rmse?: number;
        r2?: number;
        accuracy?: number;
        inference_time?: number;
        inference_ms?: number;
        throughput?: number;
    };

export interface ModelCache {
    ML?: PredictionResult;
    QML?: PredictionResult;
    QRC?: PredictionResult;
    QRC5?: PredictionResult;
    HPQRC?: PredictionResult;
}

export interface BenchmarkMetrics {
    accuracy: number;
    latency_ms: number;
    throughput: number;
    noise_10_accuracy?: number;
    noise_15_accuracy?: number;
    nmse_mackey_glass?: number;
}

export interface BenchmarksData {
    hpqrc: BenchmarkMetrics;
    qrc5: BenchmarkMetrics;
    qrc: BenchmarkMetrics;
    classical: BenchmarkMetrics;
}

export interface DataRow {
    [key: string]: string | number;
}
