"use client";
import { useEffect, useState } from "react";
import { getTestCategories, TestCategory } from "./actions";
import PageGuardWrapper from "@/components/PageGuardWrapper";

export default function TestCategoriesPage() {
    const [categories, setCategories] = useState<TestCategory[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getTestCategories()
            .then(setCategories)
            .finally(() => setLoading(false));
    }, []);

    return (
        <PageGuardWrapper requiredRoles={["ADMINISTRATOR"]}>
            <div className="space-y-4 p-6">
                <h1 className="text-xl font-bold p-4 bg-white rounded shadow border">Test Categories</h1>
                <div className="bg-white rounded border shadow overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-bold uppercase text-gray-500">Name</th>
                                <th className="px-4 py-3 text-left text-xs font-bold uppercase text-gray-500">Description</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {loading ? (
                                <tr><td colSpan={2} className="p-4 text-center text-sm">Loading categories...</td></tr>
                            ) : categories.length === 0 ? (
                                <tr><td colSpan={2} className="p-4 text-center text-sm text-gray-500">No categories found.</td></tr>
                            ) : categories.map(category => (
                                <tr key={category.id} className="hover:bg-gray-50">
                                    <td className="px-4 py-2 text-sm">{category.name}</td>
                                    <td className="px-4 py-2 text-sm text-gray-600">{category.description}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </PageGuardWrapper>
    );
}