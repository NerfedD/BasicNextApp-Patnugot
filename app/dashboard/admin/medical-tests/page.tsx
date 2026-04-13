"use client";

import { useEffect, useState, useCallback } from "react";
import { getMedicalTests, MedicalTest } from "./actions";
import PageGuardWrapper from "@/components/PageGuardWrapper";

export default function MedicalTestsPage() {
    const [tests, setTests] = useState<MedicalTest[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchTests = useCallback(() => {
        getMedicalTests()
            .then(setTests)
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => { fetchTests(); }, [fetchTests]);

    return (
        <PageGuardWrapper requiredRoles={["ADMINISTRATOR"]}>
            <div className="space-y-4">
                <div className="flex items-center justify-between bg-white p-4 rounded-lg shadow border border-gray-100">
                    <h1 className="text-xl font-bold text-gray-900">Medical Test Management</h1>
                    {/* Requirement D: Download to Excel and PDF Buttons */}
                    <div className="flex gap-2">
                        <button className="rounded-md bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700 shadow-sm transition-colors">
                            Download Excel
                        </button>
                        <button className="rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 shadow-sm transition-colors">
                            Print PDF (A4)
                        </button>
                    </div>
                </div>

                <div className="overflow-auto rounded border bg-white shadow">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-600">Test Name</th>
                                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-600">Category</th>
                                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-600">Unit (UOM)</th>
                                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-600">Min</th>
                                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-600">Max</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {loading ? (
                                <tr><td colSpan={5} className="p-4 text-center text-gray-500">Connecting to database...</td></tr>
                            ) : tests.length === 0 ? (
                                <tr><td colSpan={5} className="p-4 text-center text-gray-500">No medical tests found. Ensure database is seeded.</td></tr>
                            ) : tests.map((test) => (
                                <tr key={test.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-4 py-2 text-sm font-medium text-gray-900">{test.name}</td>
                                    {/* Requirement C: Displaying joined Names instead of IDs */}
                                    <td className="px-4 py-2 text-sm text-gray-600">{test.category_name}</td>
                                    <td className="px-4 py-2 text-sm text-gray-600">{test.uom_name}</td>
                                    <td className="px-4 py-2 text-sm text-gray-600">{test.normalmin}</td>
                                    <td className="px-4 py-2 text-sm text-gray-600">{test.normalmax}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </PageGuardWrapper>
    );
}