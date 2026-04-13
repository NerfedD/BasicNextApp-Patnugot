// app/dashboard/admin/medical-tests/page.tsx
"use client";

import { useEffect, useState, useCallback } from "react";
import { getMedicalTests, MedicalTest } from "./actions";
import PageGuardWrapper from "@/components/PageGuardWrapper";
import ExcelJS from 'exceljs';
import dynamic from 'next/dynamic';
import { MedicalTestsPdf } from './MedicalTestsPdf';

// Dynamically import PDFDownloadLink to prevent Next.js server-side rendering crashes
const PDFDownloadLink = dynamic(
    () => import('@react-pdf/renderer').then((mod) => mod.PDFDownloadLink),
    { ssr: false, loading: () => <button className="bg-gray-400 text-white px-4 py-2 rounded text-sm font-semibold opacity-50 cursor-not-allowed">Loading PDF...</button> }
);

export default function MedicalTestsPage() {
    const [tests, setTests] = useState<MedicalTest[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchTests = useCallback(() => {
        setLoading(true);
        getMedicalTests()
            .then(setTests)
            .catch((err) => console.error("Frontend Error:", err))
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => { fetchTests(); }, [fetchTests]);

    // Handle Excel Generation and Download
    const handleDownloadExcel = async () => {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Medical Tests');

        // Define columns
        worksheet.columns = [
            { header: 'Test Name', key: 'name', width: 35 },
            { header: 'Category', key: 'category', width: 25 },
            { header: 'Unit', key: 'unit', width: 15 },
            { header: 'Normal Range', key: 'range', width: 20 },
        ];

        // Make header row bold
        worksheet.getRow(1).font = { bold: true };

        // Add Data Rows
        tests.forEach(test => {
            worksheet.addRow({
                name: test.name,
                category: test.category_name,
                unit: test.uom_name,
                range: `${test.normalmin} - ${test.normalmax}`
            });
        });

        // Trigger file download
        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const url = window.URL.createObjectURL(blob);
        const anchor = document.createElement('a');
        anchor.href = url;
        anchor.download = `Medical_Tests_${new Date().toISOString().split('T')[0]}.xlsx`;
        anchor.click();
        window.URL.revokeObjectURL(url);
    };

    return (
        <PageGuardWrapper requiredRoles={["ADMINISTRATOR"]}>
            <div className="p-6 space-y-4">
                <div className="flex justify-between items-center bg-white p-4 rounded shadow border">
                    <h1 className="text-xl font-bold">Medical Test Management</h1>
                    
                    {/* DOWNLOAD BUTTONS */}
                    <div className="flex gap-2">
                        <button 
                            onClick={handleDownloadExcel}
                            disabled={loading || tests.length === 0}
                            className="bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white px-4 py-2 rounded text-sm font-semibold transition-colors"
                        >
                            Download Excel
                        </button>

                        {!loading && tests.length > 0 && (
                            <PDFDownloadLink 
                                document={<MedicalTestsPdf tests={tests} />} 
                                fileName={`Medical_Tests_${new Date().toISOString().split('T')[0]}.pdf`}
                            >
                                {/* @ts-ignore - The child renderer pattern sometimes throws a loose type warning */}
                                {({ blob, url, loading: pdfLoading, error }) => (
                                    <button 
                                        disabled={pdfLoading}
                                        className="bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white px-4 py-2 rounded text-sm font-semibold transition-colors"
                                    >
                                        {pdfLoading ? 'Preparing PDF...' : 'Print PDF (A4)'}
                                    </button>
                                )}
                            </PDFDownloadLink>
                        )}
                    </div>
                </div>

                {/* TABLE REMAINS THE SAME */}
                <div className="bg-white border rounded shadow overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-bold uppercase text-gray-500">Test Name</th>
                                <th className="px-4 py-3 text-left text-xs font-bold uppercase text-gray-500">Category</th>
                                <th className="px-4 py-3 text-left text-xs font-bold uppercase text-gray-500">Unit</th>
                                <th className="px-4 py-3 text-left text-xs font-bold uppercase text-gray-500">Range</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {loading ? (
                                <tr><td colSpan={4} className="p-4 text-center">Loading from database...</td></tr>
                            ) : tests.length === 0 ? (
                                <tr><td colSpan={4} className="p-4 text-center text-red-500">No data found. Check your SQL JOINs and Seed data.</td></tr>
                            ) : tests.map((test) => (
                                <tr key={test.id} className="hover:bg-gray-50">
                                    <td className="px-4 py-2 text-sm">{test.name}</td>
                                    <td className="px-4 py-2 text-sm">{test.category_name}</td>
                                    <td className="px-4 py-2 text-sm">{test.uom_name}</td>
                                    <td className="px-4 py-2 text-sm text-gray-600">
                                        {test.normalmin} - {test.normalmax}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </PageGuardWrapper>
    );
}