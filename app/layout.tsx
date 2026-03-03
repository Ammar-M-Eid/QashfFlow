import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: "QashFlow",
    description: "Hybrid Classical & Quantum Machine Learning for Financial Prediction",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" className="dark">
            <body>
                <div className="particles-bg" />
                {children}
            </body>
        </html>
    );
}
