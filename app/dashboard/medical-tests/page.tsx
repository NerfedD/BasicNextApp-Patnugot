"use client";

import { useEffect, useState, useCallback } from "react";
import { getMedicalTests, MedicalTest } from "./actions";
import PageGuardWrapper from "@/components/PageGuardWrapper";
// Import your Excel and PDF components here similarly to Roles

export default function MedicalTestsPage() {
    const [tests, setTests] = useState<MedicalTest[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchTests = useCallback(async () => {
        try {
            const data = await getMedicalTests();
            setTests(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchTests(); }, [fetchTests]);

    return (
        <PageGuardWrapper requiredRoles={["ADMINISTRATOR"]}>
            <div className="space-y-4">
                <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow">
                    <h1 className="text-xl font-bold">Medical Test Management</h1>
                    <div className="flex gap-2">
                        {/* C. & D. Requirement: Download Buttons */}
                        <button className="bg-green-600 text-white px-4 py-2 rounded">Download Excel</button>
                        <button className="bg-red-600 text-white px-4 py-2 rounded">Print PDF</button>
                    </div>
                </div>

                <div className="overflow-auto rounded border bg-white shadow">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-200">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-bold uppercase">Test Name</th>
                                <th className="px-4 py-3 text-left text-xs font-bold uppercase">Category</th>
                                <th className="px-4 py-3 text-left text-xs font-bold uppercase">Unit (UOM)</th>
                                <th className="px-4 py-3 text-left text-xs font-bold uppercase">Min</th>
                                <th className="px-4 py-3 text-left text-xs font-bold uppercase">Max</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {tests.map((test) => (
                                <tr key={test.id} className="hover:bg-gray-50">
                                    <td className="px-4 py-2 text-sm font-medium">{test.name}</td>
                                    {/* Requirement: Display names, not IDs */}
                                    <td className="px-4 py-2 text-sm">{test.category_name}</td>
                                    <td className="px-4 py-2 text-sm">{test.uom_name}</td>
                                    <td className="px-4 py-2 text-sm">{test.normalmin}</td>
                                    <td className="px-4 py-2 text-sm">{test.normalmax}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </PageGuardWrapper>
    );
}