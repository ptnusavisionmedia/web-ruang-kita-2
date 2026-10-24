import "server-only";
import { localCover, localGallery } from "@/lib/photos";
import { STATIC_FACILITIES, STATIC_PROPERTIES, type StaticProperty } from "@/lib/static-data";
import type { FacilityRow } from "@/types/database";
import type { Property, PropertyDetail, RoomStatus } from "@/types";

/** Data properti dibaca dari lib/static-data.ts, jadi situs berjalan tanpa database. */

export const PAGE_SIZE = 9;

export function roomStatusOf(available: number, total: number): RoomStatus {
  if (total === 0 || available === 0) return "Penuh";
  return available === 1 ? "Segera Penuh" : "Tersedia";
}

function availableRooms(p: StaticProperty) {
  return p.rooms.filter((r) => r.available && r.status === "available");
}

function toProperty(p: StaticProperty): Property {
  const available = availableRooms(p);
  const prices = (available.length ? available : p.rooms).map((r) => Number(r.price_monthly));
  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    type: p.type,
    area: p.area,
    city: p.city,
    address: p.address,
    price: prices.length ? Math.min(...prices) : 0,
    status: roomStatusOf(available.length, p.rooms.length),
    roomsAvailable: available.length,
    coverImage: localCover(p.slug),
    facilities: p.facilities,
  };
}

function toDetail(p: StaticProperty): PropertyDetail {
  return {
    ...toProperty(p),
    description: p.description,
    rules: p.rules,
    images: localGallery(p.slug) ?? [],
    rooms: [...p.rooms].sort((a, b) => a.price_monthly - b.price_monthly),
    owner: { name: "Pengelola RuangKita", role: "Pengelola" },
  };
}

export async function fetchFacilities(): Promise<FacilityRow[]> {
  return [...STATIC_FACILITIES].sort((a, b) => a.name.localeCompare(b.name));
}

export interface SearchParams {
  q?: string;
  type?: string;
  min?: number;
  max?: number;
  facilityIds?: string[];
  status?: "" | "Tersedia" | "Penuh";
  sort?: "newest" | "price-asc" | "price-desc";
  page?: number;
}

export async function searchProperties(params: SearchParams) {
  const page = Math.max(1, params.page ?? 1);
  const q = params.q?.trim().toLowerCase();

  let items = STATIC_PROPERTIES.map((p) => ({ p, prop: toProperty(p) })).filter(({ p, prop }) => {
    if (q && ![p.name, p.city, p.area, p.address].some((v) => v.toLowerCase().includes(q))) return false;
    if (params.type && p.type !== params.type) return false;
    if (params.min !== undefined && prop.price < params.min) return false;
    if (params.max !== undefined && prop.price > params.max) return false;
    if (params.facilityIds?.length && !params.facilityIds.every((id) => p.facilities.some((f) => f.id === id))) return false;
    if (params.status === "Tersedia" && prop.roomsAvailable === 0) return false;
    if (params.status === "Penuh" && prop.roomsAvailable > 0) return false;
    return true;
  });

  if (params.sort === "price-asc") items = items.sort((a, b) => a.prop.price - b.prop.price);
  else if (params.sort === "price-desc") items = items.sort((a, b) => b.prop.price - a.prop.price);
  else items = items.sort((a, b) => a.p.order - b.p.order);

  const from = (page - 1) * PAGE_SIZE;
  return {
    items: items.slice(from, from + PAGE_SIZE).map((x) => x.prop),
    total: items.length,
    page,
    pageSize: PAGE_SIZE,
  };
}

export async function fetchPopularProperties(limit = 3): Promise<Property[]> {
  return STATIC_PROPERTIES.map(toProperty)
    .filter((p) => p.roomsAvailable > 0)
    .slice(0, limit);
}

export async function fetchPropertyBySlug(slug: string): Promise<PropertyDetail | null> {
  const found = STATIC_PROPERTIES.find((p) => p.slug === slug);
  return found ? toDetail(found) : null;
}

/** Angka ringkas untuk beranda, dihitung dari data properti. */
export async function fetchHomeStats() {
  return {
    properties: STATIC_PROPERTIES.length,
    rooms: STATIC_PROPERTIES.reduce((sum, p) => sum + availableRooms(p).length, 0),
    cities: new Set(STATIC_PROPERTIES.map((p) => p.city)).size,
  };
}
