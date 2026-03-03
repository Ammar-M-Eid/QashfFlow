'use client';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion } from 'framer-motion';
import { Upload, File, X, CheckCircle2 } from 'lucide-react';
import * as XLSX from 'xlsx';
import { DataRow } from '@/lib/types';

interface FileUploaderProps {
    onFileUpload: (file: File, previewData: DataRow[]) => void;
    uploadedFile: File | null;
    onClearFile: () => void;
}

export default function FileUploader({ onFileUpload, uploadedFile, onClearFile }: FileUploaderProps) {
    const [preview, setPreview] = useState<DataRow[]>([]);
    const [error, setError] = useState<string>('');

    const onDrop = useCallback(
        (acceptedFiles: File[]) => {
            setError('');
            const file = acceptedFiles[0];

            if (!file) return;

            // Validate file type
            if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
                setError('Please upload an Excel file (.xlsx or .xls)');
                return;
            }

            // Read and preview file
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const data = new Uint8Array(e.target?.result as ArrayBuffer);
                    const workbook = XLSX.read(data, { type: 'array' });
                    const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
                    const jsonData = XLSX.utils.sheet_to_json(firstSheet) as DataRow[];

                    // Get first 5 rows for preview
                    const previewData = jsonData.slice(0, 5);
                    setPreview(previewData);
                    onFileUpload(file, previewData);
                } catch (err) {
                    setError('Error reading file. Please ensure it is a valid Excel file.');
                }
            };
            reader.readAsArrayBuffer(file);
        },
        [onFileUpload]
    );

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
            'application/vnd.ms-excel': ['.xls'],
        },
        maxFiles: 1,
    });

    return (
        <section className="container mx-auto px-4 py-12">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <h2 className="text-3xl font-bold mb-6 text-center">Upload Dataset</h2>

                {/* Dropzone */}
                {!uploadedFile ? (
                    <div {...getRootProps()}>
                        <motion.div
                            whileHover={{ scale: 1.01 }}
                            className={`glass-card rounded-2xl p-12 text-center cursor-pointer transition-all ${isDragActive ? 'border-purple-500 bg-purple-500/10' : 'glass-card-hover'
                                }`}
                        >
                            <input {...getInputProps()} />
                            <Upload className="w-16 h-16 mx-auto mb-4 text-purple-400" />
                            {isDragActive ? (
                                <p className="text-xl text-purple-400">Drop the Excel file here...</p>
                            ) : (
                                <>
                                    <p className="text-xl mb-2">Drag & drop an Excel file here</p>
                                    <p className="text-gray-400">or click to select (.xlsx only)</p>
                                </>
                            )}
                        </motion.div>
                    </div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="glass-card rounded-2xl p-6"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <CheckCircle2 className="w-6 h-6 text-green-400" />
                                <File className="w-6 h-6 text-purple-400" />
                                <span className="text-lg">{uploadedFile.name}</span>
                            </div>
                            <button
                                onClick={onClearFile}
                                className="p-2 hover:bg-red-500/20 rounded-lg transition-colors"
                            >
                                <X className="w-5 h-5 text-red-400" />
                            </button>
                        </div>

                        {/* Preview Table */}
                        {preview.length > 0 && (
                            <div className="mt-6">
                                <h3 className="text-lg font-semibold mb-3">Preview (First 5 rows)</h3>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="border-b border-white/10">
                                                {Object.keys(preview[0]).map((key) => (
                                                    <th key={key} className="px-4 py-2 text-left text-purple-400">
                                                        {key}
                                                    </th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {preview.map((row, idx) => (
                                                <tr key={idx} className="border-b border-white/5">
                                                    {Object.values(row).map((val, i) => (
                                                        <td key={i} className="px-4 py-2 text-gray-300">
                                                            {String(val)}
                                                        </td>
                                                    ))}
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </motion.div>
                )}

                {/* Error Message */}
                {error && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400"
                    >
                        {error}
                    </motion.div>
                )}
            </motion.div>
        </section>
    );
}
