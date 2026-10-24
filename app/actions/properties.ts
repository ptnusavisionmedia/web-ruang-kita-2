"use server";

import { z } from "zod";
import { fetchFacilities, searchProperties, type SearchParams } from "@/lib/data";
import type { ActionResult, Facility, Property } from "@/types";

const searchSchema = z.object({
  q: z.string().max(100).optional(),
  type: z.string().max(40).optional(),
  min: z.number().min(0).optional(),
  max: z.number().min(0).optional(),
  facilityIds: z.array(z.string().min(1).max(60)).max(20).optional(),
  status: z.enum(["", "Tersedia", "Penuh"]).optional(),
  sort: z.enum(["newest", "price-asc", "price-desc"]).optional(),
  page: z.number().int().min(1).max(500).optional(),
});

export interface CatalogResult {
  items: Property[];
  total: number;
  page: number;
  pageSize: number;
  facilities: Facility[];
}

export async function searchCatalog(input: SearchParams): Promise<ActionResult<CatalogResult>> {
  const parsed = searchSchema.safeParse(input);
  if (!parsed.success) return { ok: false, message: "Parameter pencarian tidak valid" };

  try {
    const [result, facilities] = await Promise.all([searchProperties(parsed.data), fetchFacilities()]);
    return { ok: true, data: { ...result, facilities } };
  } catch (e) {
    console.error("searchCatalog", e);
    return { ok: false, message: "Gagal memuat properti. Coba lagi beberapa saat." };
  }
}
