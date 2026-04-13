"use client";
import { useEffect, useState } from "react";
import { getUOMs, UOM } from "./actions";
import PageGuardWrapper from "@/components/PageGuardWrapper";

export default function UOMPage() {
    const [uoms, setUoms] = useState<UOM[]>([]);

    useEffect(() => {
        getUOMs().then(setUoms);
    }, []);

    return (
        <PageGuardWrapper requiredRoles={["ADMINISTRATOR"]}>
            <div className="space-y-4">
                <h1 className="text-xl font-bold p-4 bg-white rounded shadow">Units of Measure</h1>
                <div className="bg-white rounded border shadow">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-2 text-left text-xs font-bold uppercase">Name</th>
                                <th className="px-4 py-2 text-left text-xs font-bold uppercase">Description</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {uoms.map(u => (
                                <tr key={u.id}>
                                    <td className="px-4 py-2 text-sm">{u.name}</td>
                                    <td className="px-4 py-2 text-sm">{u.description}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </PageGuardWrapper>
    );
}