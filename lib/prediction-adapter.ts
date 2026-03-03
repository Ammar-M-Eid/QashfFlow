import { BackendPredictionResponse, PredictionMetrics, PredictionResult } from '@/lib/types';

function toNumberArray(value: unknown): number[] {
    if (!Array.isArray(value)) return [];
    return value
        .map((item) => Number(item))
        .filter((item) => Number.isFinite(item));
}

function buildMetrics(raw: BackendPredictionResponse): PredictionMetrics {
    const metricsSource =
        typeof raw === 'object' && raw !== null && 'metrics' in raw && raw.metrics
            ? raw.metrics
            : {};

    const accuracy = Number(
        (metricsSource as any).accuracy ?? (raw as any).accuracy ?? 0.0
    );
    const mae = Number((metricsSource as any).mae ?? (raw as any).mae ?? 0.0);
    const rmse = Number((metricsSource as any).rmse ?? (raw as any).rmse ?? 0.0);
    const mse = Number((metricsSource as any).mse ?? (raw as any).mse ?? 0.0);
    const r2 = Number((metricsSource as any).r2 ?? (raw as any).r2 ?? 0.0);
    const inference_time = Number(
        (metricsSource as any).inference_time ??
        (raw as any).inference_time ??
        (raw as any).inference_ms ??
        0.0
    );
    const throughput = Number(
        (metricsSource as any).throughput ?? (raw as any).throughput ?? 0.0
    );

    const mapeRaw = (metricsSource as any).mape ?? (raw as any).mape;
    const mape = mapeRaw != null ? Number(mapeRaw) : undefined;

    return {
        accuracy: Number.isFinite(accuracy) ? accuracy : 0,
        mae: Number.isFinite(mae) ? mae : 0,
        rmse: Number.isFinite(rmse) ? rmse : 0,
        mse: Number.isFinite(mse) ? mse : 0,
        r2: Number.isFinite(r2) ? r2 : 0,
        mape: mape != null && Number.isFinite(mape) ? mape : undefined,
        inference_time: Number.isFinite(inference_time) ? inference_time : 0,
        throughput: Number.isFinite(throughput) ? throughput : 0,
    };
}

export function normalizePredictionResponse(raw: BackendPredictionResponse): PredictionResult {
    let call: number[] = [];
    let put: number[] = [];

    const predictions = (raw as any).predictions;

    if (predictions && typeof predictions === 'object' && !Array.isArray(predictions)) {
        call = toNumberArray((predictions as any).call);
        put = toNumberArray((predictions as any).put);
    }

    if (Array.isArray(predictions) && predictions.length > 0) {
        if (Array.isArray(predictions[0])) {
            call = toNumberArray((predictions as number[][]).map((row) => row[0]));
            put = toNumberArray((predictions as number[][]).map((row) => row[1]));
        } else {
            const oneDim = toNumberArray(predictions);
            call = oneDim;
            put = oneDim;
        }
    }

    if (call.length === 0) {
        call = toNumberArray(
            (raw as any).call_predictions ?? (raw as any).y_pred_call
        );
    }

    if (put.length === 0) {
        put = toNumberArray(
            (raw as any).put_predictions ?? (raw as any).y_pred_put
        );
    }

    if (put.length === 0 && call.length > 0) {
        put = [...call];
    }

    const metrics = buildMetrics(raw);

    return {
        predictions: {
            call,
            put,
        },
        metrics,
    };
}
