import { NextRequest, NextResponse } from 'next/server';

const FASTAPI_URL = process.env.FASTAPI_URL || '';

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;
        const modelType = formData.get('model_type') as string;
        const noiseLevel = formData.get('noise_level') as string || '0';

        if (!file || !modelType) {
            return NextResponse.json(
                { error: 'Missing required fields: file and model_type' },
                { status: 400 }
            );
        }

        // Backend integration note:
        // To connect this website to your notebook-backed FastAPI service, forward:
        // POST /predict
        // FormData:
        //   - file: uploaded .xlsx dataset
        //   - model_type: ML | QML | QRC | HPQRC
        //   - noise_level: number (0.0 to 0.3)
        //
        // Preferred FastAPI response contract:
        // {
        //   "predictions": { "call": number[], "put": number[] },
        //   "metrics": {
        //     "accuracy": number,
        //     "mae": number,
        //     "rmse": number,
        //     "mse": number,
        //     "r2": number,
        //     "inference_time": number,
        //     "throughput": number
        //   }
        // }
        //
        // The frontend also supports notebook-style fallbacks such as:
        // - call_predictions / put_predictions
        // - y_pred_call / y_pred_put
        // - predictions as number[] or number[][]
        // but returning the preferred contract is recommended.
        //
        // Set FASTAPI_URL in your Next.js environment to activate backend proxy mode.
        if (FASTAPI_URL) {
            try {
                const backendFormData = new FormData();
                backendFormData.append('file', file);
                backendFormData.append('model_type', modelType);
                backendFormData.append('noise_level', noiseLevel);

                const response = await fetch(`${FASTAPI_URL}/predict`, {
                    method: 'POST',
                    body: backendFormData,
                });

                if (!response.ok) {
                    const text = await response.text();
                    throw new Error(`Backend prediction failed: ${text}`);
                }

                const data = await response.json();
                return NextResponse.json(data);
            } catch (backendError) {
                console.warn('Backend unavailable:', backendError);
                return NextResponse.json(
                    { error: 'Backend service is unavailable. Please ensure the FastAPI backend is running and FASTAPI_URL is configured correctly.' },
                    { status: 503 }
                );
            }
        }

        // No backend configured – return an actionable error instead of mock data.
        return NextResponse.json(
            { error: 'No backend configured. Set the FASTAPI_URL environment variable to point to your FastAPI prediction service.' },
            { status: 503 }
        );
    } catch (error) {
        console.error('Prediction API error:', error);
        return NextResponse.json(
            { error: 'Internal server error during prediction' },
            { status: 500 }
        );
    }
}
