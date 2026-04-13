"use server";

import { query } from "@/lib/db";

export interface MedicalTest {
  id: string;
  name: string;
  category_name: string;
  uom_name: string;
  idcategory: string;
  iduom: string;
  normalmin: number;
  normalmax: number;
}

export async function getMedicalTests(): Promise<MedicalTest[]> {
  const sql = `
    SELECT 
      mt.id, mt.name, mt.normalmin, mt.normalmax,
      tc.name AS category_name, tc.id AS idcategory,
      u.name AS uom_name, u.id AS iduom
    FROM medicaltests mt
    JOIN testcategories tc ON mt.idcategory = tc.id
    JOIN uom u ON mt.iduom = u.id
    ORDER BY mt.name ASC
  `;
  const { rows } = await query<MedicalTest>(sql);
  return rows;
}

// Additional actions for UOM and Categories would follow a similar pattern