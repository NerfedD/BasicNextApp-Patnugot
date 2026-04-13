"use server";

import { query } from "@/lib/db";

export interface MedicalTest {
  id: string;
  name: string;
  category_name: string;
  uom_name: string;
  normalmin: number;
  normalmax: number;
}

export async function getMedicalTests(): Promise<MedicalTest[]> {
  try {
    const sql = `
      SELECT 
        mt.id, 
        mt.name, 
        tc.name AS category_name, 
        u.name AS uom_name, 
        mt.normalmin, 
        mt.normalmax
      FROM medicaltests mt
      INNER JOIN testcategories tc ON mt.idcategory = tc.id
      INNER JOIN uom u ON mt.iduom = u.id
      ORDER BY mt.name ASC
    `;
    const { rows } = await query<MedicalTest>(sql);
    return rows;
  } catch (error) {
    console.error("Database Error:", error); // Check your terminal for this!
    throw new Error("Failed to fetch medical tests.");
  }
}