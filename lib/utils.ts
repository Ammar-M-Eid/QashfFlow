import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function downloadCSV(data: any[], filename: string) {
    const headers = Object.keys(data[0]);
    const csvContent = [
        headers.join(','),
        ...data.map(row => headers.map(header => row[header]).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
}

export function formatNumber(num: number | undefined | null, decimals: number = 4): string {
    if (num === undefined || num === null || isNaN(num)) {
        return '0';
    }
    return num.toFixed(decimals);
}

export function generateRandomMetrics() {
    return {
        accuracy: Math.random() * 0.15 + 0.85, // 85-100%
        mae: Math.random() * 0.5 + 0.1, // 0.1-0.6
        rmse: Math.random() * 0.7 + 0.2, // 0.2-0.9
        r2: Math.random() * 0.15 + 0.80, // 80-95%
        inference_time: Math.random() * 200 + 50, // 50-250ms
    };
}
