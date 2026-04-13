"use client";

import { useEffect, useState, useCallback } from "react";
import { getMedicalTests, MedicalTest } from "./actions";
import PageGuardWrapper from "@/components/PageGuardWrapper";

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

    return (
        <PageGuardWrapper requiredRoles={["ADMINISTRATOR"]}>
            <div className="p-6 space-y-4">
                <div className="flex justify-between items-center bg-white p-4 rounded shadow border">
                    <h1 className="text-xl font-bold">Medical Test Management</h1>
                    <div className="flex gap-2">
                        <button className="bg-green-600 text-white px-4 py-2 rounded text-sm font-semibold">Download Excel</button>
                        <button className="bg-red-600 text-white px-4 py-2 rounded text-sm font-semibold">Print PDF (A4)</button>
                    </div>
                </div>

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