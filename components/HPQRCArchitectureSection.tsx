'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

// Animated photon travelling through waveguide
function PhotonBurst({ cx, delay, color }: { cx: number; delay: number; color: string }) {
    return (
        <motion.circle
            cx={cx}
            cy={75}
            r={4}
            fill={color}
            initial={{ opacity: 0, cx }}
            animate={{ opacity: [0, 1, 1, 0], cx: cx + 90 }}
            transition={{ duration: 1.8, delay, repeat: Infinity, repeatDelay: 1 }}
        />
    );
}

// Animated qubit gate block
function QubitGate({ x, y, label, delay }: { x: number; y: number; label: string; delay: number }) {
    return (
        <motion.g
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, delay, repeat: Infinity }}
        >
            <rect x={x} y={y} width={28} height={22} rx={4} fill="#8b5cf6" />
            <text x={x + 14} y={y + 15} fontSize={9} fill="white" textAnchor="middle">
                {label}
            </text>
        </motion.g>
    );
}

export default function HPQRCArchitectureSection() {
    const [activeStep, setActiveStep] = useState(0);

    useEffect(() => {
        const t = setInterval(() => setActiveStep((p) => (p + 1) % 5), 2500);
        return () => clearInterval(t);
    }, []);

    const steps = [
        {
            label: 'Input Data',
            sublabel: 'Time-series normalized to [0,π]',
            color: 'text-blue-400',
            ring: 'ring-blue-500/50',
            bg: 'bg-blue-900/30',
        },
        {
            label: 'Photonic Reservoir',
            sublabel: 'Si3N4 waveguide 1mm @ 1550nm · Kerr nonlinearity',
            color: 'text-cyan-400',
            ring: 'ring-cyan-500/50',
            bg: 'bg-cyan-900/30',
        },
        {
            label: 'Quantum Reservoir',
            sublabel: '5-qubit transmon · T1=50µs · weak measurements',
            color: 'text-purple-400',
            ring: 'ring-purple-500/50',
            bg: 'bg-purple-900/30',
        },
        {
            label: 'Feature Fusion',
            sublabel: 'Quantum + photonic outputs combined via custom API',
            color: 'text-pink-400',
            ring: 'ring-pink-500/50',
            bg: 'bg-pink-900/30',
        },
        {
            label: 'Prediction',
            sublabel: 'Ridge regression (λ=0.01) · 5-fold cross-validation',
            color: 'text-green-400',
            ring: 'ring-green-500/50',
            bg: 'bg-green-900/30',
        },
    ];

    return (
        <section className="container mx-auto px-4 py-16">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
            >
                <h2 className="text-3xl font-bold text-center mb-3">HPQRC Architecture</h2>
                <p className="text-center text-gray-400 mb-10 max-w-2xl mx-auto">
                    A superconducting quantum circuit coupled to a silicon-nitride photonic waveguide array,
                    achieving quantum coherence with photonic parallelism for real-time time-series prediction.
                </p>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                    {/* Left: Animated Architecture Diagram */}
                    <div className="glass-card rounded-2xl p-6 overflow-hidden">
                        <h3 className="text-lg font-semibold text-center mb-6 text-purple-300">
                            Live Architecture Animation
                        </h3>

                        {/* Photonic Reservoir SVG */}
                        <div className="mb-6">
                            <p className="text-xs text-cyan-400 font-semibold mb-2 uppercase tracking-widest">
                                Photonic Reservoir — Si3N4 waveguide array
                            </p>
                            <div className="bg-black/30 rounded-xl p-2">
                                <svg viewBox="0 0 300 150" className="w-full h-28">
                                    {/* 6 waveguide lines */}
                                    {[0, 1, 2, 3, 4, 5].map((i) => (
                                        <line
                                            key={i}
                                            x1={10}
                                            y1={20 + i * 22}
                                            x2={290}
                                            y2={20 + i * 22}
                                            stroke="#06b6d4"
                                            strokeWidth={1.5}
                                            opacity={0.5}
                                        />
                                    ))}
                                    {/* Traveling photons */}
                                    {[0, 1, 2, 3, 4, 5].map((i) => (
                                        <motion.circle
                                            key={i}
                                            cy={20 + i * 22}
                                            r={3}
                                            fill="#67e8f9"
                                            initial={{ cx: 10, opacity: 0 }}
                                            animate={{ cx: [10, 290], opacity: [0, 1, 1, 0] }}
                                            transition={{
                                                duration: 2,
                                                delay: i * 0.3,
                                                repeat: Infinity,
                                                repeatDelay: 0.5,
                                            }}
                                        />
                                    ))}
                                    {/* Non-linear coupling marks */}
                                    {[80, 150, 220].map((x) =>
                                        [0, 1, 2, 3, 4].map((i) => (
                                            <motion.line
                                                key={`${x}-${i}`}
                                                x1={x}
                                                y1={20 + i * 22}
                                                x2={x}
                                                y2={20 + (i + 1) * 22}
                                                stroke="#a78bfa"
                                                strokeWidth={1}
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: [0, 0.8, 0] }}
                                                transition={{
                                                    duration: 1.5,
                                                    delay: (x / 80 - 1) * 0.5 + i * 0.1,
                                                    repeat: Infinity,
                                                }}
                                            />
                                        ))
                                    )}
                                    <text x={10} y={145} fontSize={9} fill="#9ca3af">1mm Si3N4 · 1550nm · Kerr nonlinearity · 0.5 dB/cm loss</text>
                                </svg>
                            </div>
                        </div>

                        {/* Quantum Circuit SVG */}
                        <div>
                            <p className="text-xs text-purple-400 font-semibold mb-2 uppercase tracking-widest">
                                Quantum Reservoir — 5-qubit superconducting transmon
                            </p>
                            <div className="bg-black/30 rounded-xl p-2">
                                <svg viewBox="0 0 310 165" className="w-full h-36">
                                    {/* Signal-flow dots travelling left → right on each qubit wire */}
                                    {[0, 1, 2, 3, 4].map((i) => (
                                        <motion.circle
                                            key={`sig-${i}`}
                                            cy={20 + i * 28}
                                            r={2.5}
                                            fill="#a855f7"
                                            initial={{ cx: 22, opacity: 0 }}
                                            animate={{ cx: [22, 290], opacity: [0, 1, 1, 0] }}
                                            transition={{
                                                duration: 2.8,
                                                delay: i * 0.4,
                                                repeat: Infinity,
                                                repeatDelay: 0.4,
                                                ease: 'linear',
                                            }}
                                        />
                                    ))}

                                    {/* 5 qubit lines with |0⟩ labels */}
                                    {[0, 1, 2, 3, 4].map((i) => (
                                        <g key={i}>
                                            {/* |0⟩ state label */}
                                            <text
                                                x={1}
                                                y={24 + i * 28}
                                                fontSize={8}
                                                fill="#9ca3af"
                                                fontFamily="monospace"
                                            >
                                                |0⟩
                                            </text>
                                            {/* Qubit wire */}
                                            <line
                                                x1={22}
                                                y1={20 + i * 28}
                                                x2={290}
                                                y2={20 + i * 28}
                                                stroke="#8b5cf6"
                                                strokeWidth={1.5}
                                                opacity={0.6}
                                            />
                                        </g>
                                    ))}

                                    {/* Column 1 — rotation gates */}
                                    <QubitGate x={30} y={8}   label="Rx" delay={0}   />
                                    <QubitGate x={30} y={36}  label="Ry" delay={0.2} />
                                    <QubitGate x={30} y={64}  label="Rx" delay={0.4} />
                                    <QubitGate x={30} y={92}  label="Rz" delay={0.6} />
                                    <QubitGate x={30} y={120} label="Ry" delay={0.8} />

                                    {/* Column 2 — Hadamard + CNOT gates */}
                                    <QubitGate x={100} y={8}   label="H"    delay={0.1} />
                                    <QubitGate x={100} y={36}  label="CNOT" delay={0.3} />
                                    <QubitGate x={100} y={64}  label="H"    delay={0.5} />
                                    <QubitGate x={100} y={92}  label="CNOT" delay={0.7} />
                                    <QubitGate x={100} y={120} label="H"    delay={0.9} />

                                    {/* Column 3 — rotation gates */}
                                    <QubitGate x={170} y={8}   label="Rz"   delay={0.2} />
                                    <QubitGate x={170} y={36}  label="Rx"   delay={0.4} />
                                    <QubitGate x={170} y={64}  label="CNOT" delay={0.6} />
                                    <QubitGate x={170} y={92}  label="Ry"   delay={0.8} />
                                    <QubitGate x={170} y={120} label="Rz"   delay={0}   />

                                    {/* Nearest-neighbor CNOT entanglement lines at col-2 centre (x=114) */}
                                    {[0, 1, 2, 3].map((i) => (
                                        <motion.g key={`ent-${i}`}>
                                            <motion.line
                                                x1={114}
                                                y1={20 + i * 28}
                                                x2={114}
                                                y2={20 + (i + 1) * 28}
                                                stroke="#ec4899"
                                                strokeWidth={2}
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: [0, 1, 0] }}
                                                transition={{
                                                    duration: 1.5,
                                                    delay: i * 0.25,
                                                    repeat: Infinity,
                                                }}
                                            />
                                            {/* Control dot */}
                                            <motion.circle
                                                cx={114}
                                                cy={20 + i * 28}
                                                r={3}
                                                fill="#ec4899"
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: [0, 1, 0] }}
                                                transition={{
                                                    duration: 1.5,
                                                    delay: i * 0.25,
                                                    repeat: Infinity,
                                                }}
                                            />
                                        </motion.g>
                                    ))}

                                    {/* Measurement boxes (M) at x=250 */}
                                    {[0, 1, 2, 3, 4].map((i) => (
                                        <motion.g key={`m-${i}`}>
                                            <motion.rect
                                                x={243}
                                                y={12 + i * 28}
                                                width={16}
                                                height={16}
                                                fill="none"
                                                stroke="#f59e0b"
                                                strokeWidth={1.5}
                                                rx={2}
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: [0, 1, 0] }}
                                                transition={{
                                                    duration: 1,
                                                    delay: 1.5 + i * 0.2,
                                                    repeat: Infinity,
                                                    repeatDelay: 1,
                                                }}
                                            />
                                            <motion.text
                                                x={251}
                                                y={23 + i * 28}
                                                fontSize={7}
                                                fill="#f59e0b"
                                                textAnchor="middle"
                                                fontWeight="bold"
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: [0, 1, 0] }}
                                                transition={{
                                                    duration: 1,
                                                    delay: 1.5 + i * 0.2,
                                                    repeat: Infinity,
                                                    repeatDelay: 1,
                                                }}
                                            >
                                                M
                                            </motion.text>
                                        </motion.g>
                                    ))}

                                    <text x={10} y={160} fontSize={8} fill="#9ca3af">
                                        T1=50µs · T2=35µs · nearest-neighbor coupling · weak projective measurement
                                    </text>
                                </svg>
                            </div>
                        </div>
                    </div>

                    {/* Right: Step-by-step pipeline */}
                    <div className="space-y-3">
                        {steps.map((step, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: 30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.12 }}
                                className={`rounded-xl p-4 border transition-all duration-500 ${
                                    activeStep === i
                                        ? `${step.bg} ring-2 ${step.ring} border-transparent`
                                        : 'glass-card border-white/5'
                                }`}
                            >
                                <div className="flex items-start gap-3">
                                    <div
                                        className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${
                                            activeStep === i ? 'bg-white/20 text-white' : 'bg-white/5 text-gray-500'
                                        }`}
                                    >
                                        {i + 1}
                                    </div>
                                    <div>
                                        <div className={`font-semibold text-sm ${activeStep === i ? step.color : 'text-gray-300'}`}>
                                            {step.label}
                                        </div>
                                        <div className="text-xs text-gray-400 mt-0.5">{step.sublabel}</div>
                                    </div>
                                    {activeStep === i && (
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            className={`ml-auto w-2.5 h-2.5 rounded-full shrink-0 mt-1 ${step.color.replace('text-', 'bg-')}`}
                                        >
                                            <motion.div
                                                animate={{ scale: [1, 1.8, 1], opacity: [1, 0, 1] }}
                                                transition={{ duration: 1.5, repeat: Infinity }}
                                                className={`w-full h-full rounded-full ${step.color.replace('text-', 'bg-')}`}
                                            />
                                        </motion.div>
                                    )}
                                </div>
                            </motion.div>
                        ))}

                        {/* Key hyperparameters */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.7 }}
                            className="glass-card rounded-xl p-4 mt-4 border border-white/10"
                        >
                            <p className="text-xs text-gray-400 font-semibold uppercase tracking-widest mb-3">
                                Training Configuration
                            </p>
                            <div className="grid grid-cols-2 gap-2 text-xs">
                                {[
                                    ['Epochs', '100'],
                                    ['Optimizer', 'Adam lr=0.001'],
                                    ['Validation', '5-fold CV'],
                                    ['Split', '80:20 train/test'],
                                    ['Regression', 'Ridge λ=0.01'],
                                    ['Quantum sim', 'Qiskit 0.45.0'],
                                    ['Photonic sim', 'Lumerical 2023 R2'],
                                    ['Precision', '32-bit float'],
                                ].map(([k, v]) => (
                                    <div key={k} className="flex justify-between gap-1">
                                        <span className="text-gray-500">{k}</span>
                                        <span className="text-gray-300 font-mono">{v}</span>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                </div>
            </motion.div>
        </section>
    );
}
