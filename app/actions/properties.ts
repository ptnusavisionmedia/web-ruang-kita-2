"use server";

import { z } from "zod";
import { fetchFacilities, fetchSavedIds, searchProperties, type SearchParams } from "@/lib/data";
import { getCurrentUser } from "@/lib/auth";
import { query, run } from "@/lib/db";
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
  savedIds: string[];
}

export async function searchCatalog(input: SearchParams): Promise<ActionResult<CatalogResult>> {
  const parsed = searchSchema.safeParse(input);
  if (!parsed.success) return { ok: false, message: "Parameter pencarian tidak valid" };

  try {
    const [result, facilities, user] = await Promise.all([
      searchProperties(parsed.data),
      fetchFacilities(),
      getCurrentUser(),
    ]);
    const savedIds = user ? await fetchSavedIds(user.id) : [];
    return { ok: true, data: { ...result, facilities, savedIds } };
  } catch (e) {
    console.error("searchCatalog", e);
    return { ok: false, message: "Gagal memuat properti. Coba lagi beberapa saat." };
  }
}

/** Simpan / hapus properti dari daftar simpanan milik pengguna yang login. */
export async function toggleSavedProperty(propertyId: string): Promise<ActionResult<{ saved: boolean }>> {
  const id = z.string().min(1).max(60).safeParse(propertyId);
  if (!id.success) return { ok: false, message: "Properti tidak valid" };

  const user = await getCurrentUser();
  if (!user) return { ok: false, message: "UNAUTHENTICATED" };

  try {
    const removed = await run("delete from saved_properties where user_id = ? and property_id = ?", [user.id, id.data]);
    if (removed > 0) return { ok: true, data: { saved: false } };

    const [exists] = await query("select 1 from properties where id = ?", [id.data]);
    if (!exists) return { ok: false, message: "Properti tidak ditemukan" };
    await run("insert or ignore into saved_properties (user_id, property_id) values (?, ?)", [user.id, id.data]);
    return { ok: true, data: { saved: true } };
  } catch (e) {
    console.error("toggleSavedProperty", e);
    return { ok: false, message: "Gagal memperbarui simpanan" };
  }
}
