import { NextRequest, NextResponse } from 'next/server';

const FASTAPI_URL = process.env.FASTAPI_URL || 'http://localhost:8001';

/**
 * Training Status Endpoint (Deprecated)
 * Training now happens automatically on backend startup.
 * This endpoint is kept for backward compatibility.
 */
export async function POST(request: NextRequest) {
    try {
        // Check if model is ready
        const statusResponse = await fetch(`${FASTAPI_URL}/training-status`);

        if (!statusResponse.ok) {
            return NextResponse.json(
                { error: 'Backend not ready yet - model still training. Please wait...' },
                { status: 503 }
            );
        }

        const status = await statusResponse.json();
        return NextResponse.json({
            status: 'info',
            message: 'Model training happens automatically on backend startup',
            model_loaded: status.model_loaded,
            info: 'Upload test data to make predictions'
        });
    } catch (error) {
        console.error('Training status check error:', error);
        return NextResponse.json(
            { error: 'Backend connection failed' },
            { status: 500 }
        );
    }
}

