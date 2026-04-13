"use server";

import { query } from "@/lib/db";

export interface UOM {
  id: string;
  name: string;
  description: string;
}

export async function getUOMs(): Promise<UOM[]> {
  try {
    const { rows } = await query<UOM>('SELECT * FROM uom ORDER BY name ASC');
    return rows;
  } catch (error) {
    console.error("[DB Error] Failed to fetch UOMs:", error);
    throw new Error("Failed to fetch Units of Measure.");
  }
}