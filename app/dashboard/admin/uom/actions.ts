"use server";
import { query } from "@/lib/db";

export interface UOM {
  id: string;
  name: string;
  description: string;
}

export async function getUOMs(): Promise<UOM[]> {
  const { rows } = await query<UOM>('SELECT * FROM uom ORDER BY name ASC');
  return rows;
}