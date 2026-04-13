"use server";

import { query } from "@/lib/db";

export interface TestCategory {
    id: number;
    name: string;
    description: string;
}

export async function getTestCategories(): Promise<TestCategory[]> {
    try {
        const { rows } = await query<TestCategory>(
            'SELECT id, name, description FROM public.testcategories ORDER BY id ASC'
        );
        return rows;
    } catch (error) {
        console.error("Database Error:", error);
        throw new Error("Failed to fetch test categories.");
    }
}