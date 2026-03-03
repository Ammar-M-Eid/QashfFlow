import { NextResponse } from 'next/server';

const FASTAPI_URL = process.env.FASTAPI_URL || '';

export async function GET() {
    try {
        if (FASTAPI_URL) {
            // Proxy to backend
            const response = await fetch(`${FASTAPI_URL}/benchmarks`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`Backend returned ${response.status}`);
            }

            const data = await response.json();
            return NextResponse.json(data);
        }

        // Fallback: return paper-validated benchmarks directly
        return NextResponse.json({
            hpqrc: {
                accuracy: 0.92,
                latency_ms: 21.8,
                throughput: 25000.0,
                noise_10_accuracy: 0.887,
                noise_15_accuracy: 0.849,
                nmse_mackey_glass: 0.043,
            },
            qrc: {
                accuracy: 0.85,
                latency_ms: 35.1,
                throughput: 12000.0,
                nmse_mackey_glass: 0.058,
            },
            classical: {
                accuracy: 0.78,
                latency_ms: 49.6,
                throughput: 8000.0,
                nmse_mackey_glass: 0.072,
            },
        });
    } catch (error) {
        console.error('Benchmarks API error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch benchmarks' },
            { status: 500 }
        );
    }
}
