'use client';

import { motion } from 'framer-motion';
import { Database, Cpu, Layers, TrendingUp, ArrowRight } from 'lucide-react';

// Gate labels per column per qubit, for a 4-qubit, 3-column reservoir circuit
const GATE_LABELS: Record<number, Record<number, string>> = {
    0: { 0: 'Rx', 1: 'Rx', 2: 'Rx', 3: 'Rx' },
    1: { 0: 'H',  1: 'CNOT', 2: 'H', 3: 'CNOT' },
    2: { 0: 'Rz', 1: 'Rz', 2: 'Rz', 3: 'Rz' },
};

// CNOT target rows for column 1 (connect control→target with a vertical line)
const CNOT_PAIRS = [
    { control: 0, target: 1 },
    { control: 2, target: 3 },
];

// x-center of each gate column inside the SVG
const GATE_COL_CX = [45, 105, 165];

export default function QRCPipeline() {
    const steps = [
        {
            icon: Database,
            title: 'Data Input',
            description: 'Financial features from uploaded dataset',
            color: 'from-blue-500 to-blue-600',
            delay: 0,
        },
        {
            icon: Cpu,
            title: 'Quantum Reservoir',
            description: 'Non-trainable quantum layer with entanglement',
            color: 'from-purple-500 to-purple-600',
            delay: 0.2,
        },
        {
            icon: Layers,
            title: 'Feature Extraction',
            description: 'Quantum measurements create rich feature space',
            color: 'from-pink-500 to-pink-600',
            delay: 0.4,
        },
        {
            icon: Layers,
            title: 'Classical Layer',
            description: 'Trainable weights on extracted features',
            color: 'from-green-500 to-green-600',
            delay: 0.6,
        },
        {
            icon: TrendingUp,
            title: 'Option Price',
            description: 'Call and Put option pricing output',
            color: 'from-orange-500 to-orange-600',
            delay: 0.8,
        },
    ];

    return (
        <section className="container mx-auto px-4 py-12">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <h2 className="text-3xl font-bold mb-6 text-center">
                    Quantum Reservoir Computing Pipeline
                </h2>
                <p className="text-center text-gray-400 mb-10 max-w-2xl mx-auto">
                    QRC leverages quantum dynamics as a computational resource without training the quantum
                    layer, reducing quantum circuit complexity.
                </p>

                {/* Horizontal left-to-right pipeline flow */}
                <div className="overflow-x-auto pb-4 mb-10">
                    <div className="flex items-center justify-center min-w-max gap-0 mx-auto">
                        {steps.map((step, index) => {
                            const Icon = step.icon;
                            return (
                                <div key={index} className="flex items-center">
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: step.delay, duration: 0.5 }}
                                        whileHover={{ scale: 1.06, y: -4 }}
                                        className="flex flex-col items-center gap-2 p-4 glass-card rounded-2xl w-36 cursor-pointer glass-card-hover"
                                    >
                                        <motion.div
                                            animate={{ scale: [1, 1.12, 1] }}
                                            transition={{ duration: 2, repeat: Infinity, delay: step.delay }}
                                            className={`p-3 rounded-xl bg-gradient-to-br ${step.color} glow-effect`}
                                        >
                                            <Icon className="w-6 h-6 text-white" />
                                        </motion.div>
                                        <div className="text-center">
                                            <p className="text-sm font-semibold leading-tight">{step.title}</p>
                                            <p className="text-xs text-gray-400 mt-1 leading-snug">{step.description}</p>
                                        </div>
                                        <div className="text-xl font-bold text-white/20">{index + 1}</div>
                                    </motion.div>

                                    {index < steps.length - 1 && (
                                        <motion.div
                                            initial={{ opacity: 0, scaleX: 0 }}
                                            animate={{ opacity: 1, scaleX: 1 }}
                                            transition={{ delay: step.delay + 0.3 }}
                                            className="flex items-center px-1"
                                        >
                                            <div className="w-6 h-px bg-purple-500/40" />
                                            <motion.div
                                                animate={{ x: [0, 4, 0] }}
                                                transition={{ duration: 1.5, repeat: Infinity, delay: step.delay }}
                                            >
                                                <ArrowRight className="w-5 h-5 text-purple-400" />
                                            </motion.div>
                                        </motion.div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Bottom: circuit + advantages */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Quantum Reservoir Circuit Visualization */}
                    <motion.div
                        initial={{ opacity: 0, x: -40 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4, duration: 0.5 }}
                        className="glass-card rounded-2xl p-6"
                    >
                        <h3 className="text-xl font-semibold mb-4">Quantum Reservoir Circuit</h3>
                        <div className="relative bg-gradient-to-br from-purple-900/30 to-pink-900/30 rounded-xl p-3 overflow-hidden">
                            <svg viewBox="0 0 220 155" className="w-full h-48">
                                {/* Signal-flow dots travelling left → right */}
                                {[0, 1, 2, 3].map((row) => (
                                    <motion.circle
                                        key={`sig-${row}`}
                                        cy={32 + row * 30}
                                        r={3}
                                        fill="#a855f7"
                                        initial={{ cx: 22, opacity: 0 }}
                                        animate={{ cx: [22, 198], opacity: [0, 1, 1, 0] }}
                                        transition={{
                                            duration: 2.6,
                                            delay: row * 0.45,
                                            repeat: Infinity,
                                            repeatDelay: 0.6,
                                            ease: 'linear',
                                        }}
                                    />
                                ))}

                                {[0, 1, 2, 3].map((row) => (
                                    <g key={row}>
                                        {/* |0⟩ input label */}
                                        <text
                                            x={2}
                                            y={36 + row * 30}
                                            fontSize={8}
                                            fill="#9ca3af"
                                            fontFamily="monospace"
                                        >
                                            |0⟩
                                        </text>

                                        {/* Qubit wire */}
                                        <line
                                            x1={22}
                                            y1={32 + row * 30}
                                            x2={198}
                                            y2={32 + row * 30}
                                            stroke="#8b5cf6"
                                            strokeWidth={1.5}
                                            opacity={0.7}
                                        />

                                        {/* Gate columns */}
                                        {[0, 1, 2].map((col) => {
                                            const gx = GATE_COL_CX[col] - 10;
                                            const gy = 22 + row * 30;
                                            const label = GATE_LABELS[col][row];
                                            const gateColor =
                                                col === 1 ? '#ec4899' : '#8b5cf6';
                                            return (
                                                <motion.g
                                                    key={col}
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: [0.55, 1, 0.55] }}
                                                    transition={{
                                                        duration: 2,
                                                        repeat: Infinity,
                                                        delay: row * 0.2 + col * 0.3,
                                                    }}
                                                >
                                                    <rect
                                                        x={gx}
                                                        y={gy}
                                                        width={20}
                                                        height={20}
                                                        fill={gateColor}
                                                        rx={3}
                                                        opacity={0.9}
                                                    />
                                                    <text
                                                        x={gx + 10}
                                                        y={gy + 13}
                                                        fontSize={6.5}
                                                        fill="white"
                                                        textAnchor="middle"
                                                        fontWeight="bold"
                                                    >
                                                        {label}
                                                    </text>
                                                </motion.g>
                                            );
                                        })}

                                        {/* Measurement box at end of wire */}
                                        <motion.g
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: [0, 1, 0] }}
                                            transition={{
                                                duration: 1.4,
                                                delay: 1.6 + row * 0.2,
                                                repeat: Infinity,
                                                repeatDelay: 1.2,
                                            }}
                                        >
                                            <rect
                                                x={200}
                                                y={23 + row * 30}
                                                width={16}
                                                height={16}
                                                fill="none"
                                                stroke="#f59e0b"
                                                strokeWidth={1.5}
                                                rx={2}
                                            />
                                            <text
                                                x={208}
                                                y={34 + row * 30}
                                                fontSize={6.5}
                                                fill="#f59e0b"
                                                textAnchor="middle"
                                                fontWeight="bold"
                                            >
                                                M
                                            </text>
                                        </motion.g>
                                    </g>
                                ))}

                                {/* CNOT entanglement lines at column-1 centre (x=105) */}
                                {CNOT_PAIRS.map(({ control, target }) => (
                                    <motion.g key={`cnot-${control}-${target}`}>
                                        {/* Vertical entanglement line */}
                                        <motion.line
                                            x1={105}
                                            y1={32 + control * 30}
                                            x2={105}
                                            y2={32 + target * 30}
                                            stroke="#ec4899"
                                            strokeWidth={2}
                                            initial={{ pathLength: 0 }}
                                            animate={{ pathLength: [0, 1, 0] }}
                                            transition={{
                                                duration: 2,
                                                repeat: Infinity,
                                                delay: control * 0.35,
                                            }}
                                        />
                                        {/* Control dot */}
                                        <motion.circle
                                            cx={105}
                                            cy={32 + control * 30}
                                            r={3}
                                            fill="#ec4899"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: [0, 1, 0] }}
                                            transition={{
                                                duration: 2,
                                                repeat: Infinity,
                                                delay: control * 0.35,
                                            }}
                                        />
                                        {/* Target ⊕ circle */}
                                        <motion.circle
                                            cx={105}
                                            cy={32 + target * 30}
                                            r={5}
                                            fill="none"
                                            stroke="#ec4899"
                                            strokeWidth={1.5}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: [0, 1, 0] }}
                                            transition={{
                                                duration: 2,
                                                repeat: Infinity,
                                                delay: control * 0.35,
                                            }}
                                        />
                                    </motion.g>
                                ))}

                                {/* Bottom label */}
                                <text x={10} y={150} fontSize={7} fill="#6b7280">
                                    4-qubit fixed reservoir · 3 gate columns · CNOT entanglement
                                </text>
                            </svg>
                        </div>
                        <p className="text-sm text-gray-400 mt-3">
                            Fixed quantum circuit with Rx/Rz rotations and CNOT entangling gates creating a
                            rich computational reservoir — no quantum training required.
                        </p>
                    </motion.div>

                    {/* Right panel: advantages + pro tip */}
                    <motion.div
                        initial={{ opacity: 0, x: 40 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5, duration: 0.5 }}
                        className="space-y-6"
                    >
                        {/* Key Advantages */}
                        <div className="glass-card rounded-2xl p-6">
                            <h3 className="text-xl font-semibold mb-4">Key Advantages</h3>
                            <div className="space-y-3">
                                {[
                                    {
                                        title: 'No Quantum Training',
                                        desc: 'Only the classical output layer requires training',
                                    },
                                    {
                                        title: 'Hardware Efficient',
                                        desc: 'Works on current NISQ devices',
                                    },
                                    {
                                        title: 'Fast Inference',
                                        desc: 'Reduced circuit depth and gate count',
                                    },
                                    {
                                        title: 'Rich Features',
                                        desc: 'Quantum dynamics create complex nonlinear feature space',
                                    },
                                ].map((item, idx) => (
                                    <motion.div
                                        key={idx}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 1 + idx * 0.1 }}
                                        className="flex items-start gap-3"
                                    >
                                        <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 shrink-0" />
                                        <div>
                                            <h4 className="font-semibold text-purple-300">{item.title}</h4>
                                            <p className="text-sm text-gray-400">{item.desc}</p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>

                        {/* Performance Note */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 1.5 }}
                            className="glass-card rounded-2xl p-6 bg-gradient-to-br from-green-900/20 to-emerald-900/20"
                        >
                            <h4 className="font-semibold text-green-400 mb-2">💡 Pro Tip</h4>
                            <p className="text-sm text-gray-300">
                                QRC achieves competitive performance with significantly fewer trainable
                                parameters than variational quantum circuits (VQC), making it ideal for
                                near-term quantum hardware.
                            </p>
                        </motion.div>
                    </motion.div>
                </div>
            </motion.div>
        </section>
    );
}
