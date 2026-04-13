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
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => { fetchTests(); }, [fetchTests]);

    return (
        <PageGuardWrapper requiredRoles={["ADMINISTRATOR"]}>
            <div className="space-y-4">
                <div className="flex items-center justify-between bg-white p-4 rounded-lg shadow border">
                    <h1 className="text-xl font-bold">Medical Test Management</h1>
                    {/* Requirement D: Download Buttons */}
                    <div className="flex gap-2">
                        <button className="rounded-md bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700">
                            Download Excel
                        </button>
                        <button className="rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700">
                            Print PDF (A4)
                        </button>
                    </div>
                </div>

                <div className="overflow-auto rounded border bg-white shadow">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-bold uppercase">Test Name</th>
                                <th className="px-4 py-3 text-left text-xs font-bold uppercase">Category</th>
                                <th className="px-4 py-3 text-left text-xs font-bold uppercase">Unit</th>
                                <th className="px-4 py-3 text-left text-xs font-bold uppercase text-right">Min</th>
                                <th className="px-4 py-3 text-left text-xs font-bold uppercase text-right">Max</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                            {tests.map((test) => (
                                <tr key={test.id} className="hover:bg-gray-50">
                                    <td className="px-4 py-2 text-sm">{test.name}</td>
                                    {/* Requirement C: Show names, not iduom or idcategory */}
                                    <td className="px-4 py-2 text-sm">{test.category_name}</td>
                                    <td className="px-4 py-2 text-sm">{test.uom_name}</td>
                                    <td className="px-4 py-2 text-sm text-right">{test.normalmin}</td>
                                    <td className="px-4 py-2 text-sm text-right">{test.normalmax}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </PageGuardWrapper>
    );
}