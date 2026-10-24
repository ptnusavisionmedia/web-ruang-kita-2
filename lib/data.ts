import "server-only";
import { query } from "@/lib/db";
import { localCover, localGallery } from "@/lib/photos";
import type {
  BookingRow,
  FacilityRow,
  PaymentRow,
  PropertyListingRow,
  PropertyRow,
  RoomRow,
} from "@/types/database";
import type { Property, PropertyDetail, RoomStatus } from "@/types";

/** Semua pembacaan data (SQLite) terkumpul di sini agar mudah dipelihara. */

export const PAGE_SIZE = 9;

export function roomStatusOf(available: number, total: number): RoomStatus {
  if (total === 0 || available === 0) return "Penuh";
  return available === 1 ? "Segera Penuh" : "Tersedia";
}

type ListingDb = Omit<PropertyListingRow, "facility_ids"> & { facility_ids: string };
type RoomDb = Omit<RoomRow, "available"> & { available: number };

const toRoom = (r: RoomDb): RoomRow => ({ ...r, available: !!r.available });

const placeholders = (n: number) => Array(n).fill("?").join(", ");

function toProperty(r: ListingDb, facilities: Map<string, FacilityRow>): Property {
  const ids: string[] = JSON.parse(r.facility_ids);
  return {
    id: r.id,
    slug: r.slug,
    name: r.name,
    type: r.property_type,
    area: r.area ?? "",
    city: r.city,
    address: r.address ?? "",
    price: Number(r.min_price ?? 0),
    status: roomStatusOf(Number(r.rooms_available), Number(r.rooms_total)),
    roomsAvailable: Number(r.rooms_available),
    coverImage: localCover(r.slug) ?? r.cover_image,
    facilities: ids.map((id) => facilities.get(id)).filter((f): f is FacilityRow => !!f),
  };
}

export async function fetchFacilities(): Promise<FacilityRow[]> {
  return query<FacilityRow>("select * from facilities order by name");
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
  const where = ["status = 'active'"];
  const args: Array<string | number> = [];

  const q = params.q?.trim().replace(/[\\%_]/g, "\\$&");
  if (q) {
    where.push("(" + ["name", "city", "area", "address"].map((c) => `${c} like ? escape '\\'`).join(" or ") + ")");
    args.push(...Array(4).fill(`%${q}%`));
  }
  if (params.type) {
    where.push("property_type = ?");
    args.push(params.type);
  }
  if (params.min !== undefined) {
    where.push("min_price >= ?");
    args.push(params.min);
  }
  if (params.max !== undefined) {
    where.push("min_price <= ?");
    args.push(params.max);
  }
  if (params.facilityIds?.length) {
    where.push(
      `(select count(*) from property_facilities pf where pf.property_id = property_listings.id
          and pf.facility_id in (${placeholders(params.facilityIds.length)})) = ?`,
    );
    args.push(...params.facilityIds, params.facilityIds.length);
  }
  if (params.status === "Tersedia") where.push("rooms_available > 0");
  if (params.status === "Penuh") where.push("rooms_available = 0");

  const order =
    params.sort === "price-asc" ? "min_price asc" : params.sort === "price-desc" ? "min_price desc" : "created_at desc";
  const clause = where.join(" and ");

  const [rows, count, facilities] = await Promise.all([
    query<ListingDb>(`select * from property_listings where ${clause} order by ${order} limit ? offset ?`, [
      ...args,
      PAGE_SIZE,
      (page - 1) * PAGE_SIZE,
    ]),
    query<{ n: number }>(`select count(*) as n from property_listings where ${clause}`, args),
    fetchFacilities(),
  ]);

  const facilityMap = new Map(facilities.map((f) => [f.id, f]));
  return {
    items: rows.map((r) => toProperty(r, facilityMap)),
    total: Number(count[0].n),
    page,
    pageSize: PAGE_SIZE,
  };
}

export async function fetchPopularProperties(limit = 3): Promise<Property[]> {
  const [rows, facilities] = await Promise.all([
    query<ListingDb>(
      "select * from property_listings where status = 'active' and rooms_available > 0 order by created_at desc limit ?",
      [limit],
    ),
    fetchFacilities(),
  ]);
  const facilityMap = new Map(facilities.map((f) => [f.id, f]));
  return rows.map((r) => toProperty(r, facilityMap));
}

async function fetchPropertyWhere(column: "slug" | "id", value: string): Promise<PropertyDetail | null> {
  const [row] = await query<Omit<PropertyRow, "rules"> & { rules: string }>(
    `select * from properties where ${column} = ? and status = 'active'`,
    [value],
  );
  if (!row) return null;

  const [rooms, links, allFacilities] = await Promise.all([
    query<RoomDb>("select * from rooms where property_id = ? order by price_monthly", [row.id]),
    query<{ facility_id: string }>("select facility_id from property_facilities where property_id = ?", [row.id]),
    fetchFacilities(),
  ]);

  const roomRows = rooms.map(toRoom);
  const availableRooms = roomRows.filter((r) => r.available && r.status === "available");
  const facilityIds = new Set(links.map((l) => l.facility_id));
  const prices = (availableRooms.length ? availableRooms : roomRows).map((r) => Number(r.price_monthly));

  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    type: row.property_type,
    area: row.area ?? "",
    city: row.city,
    address: row.address ?? "",
    price: prices.length ? Math.min(...prices) : 0,
    status: roomStatusOf(availableRooms.length, roomRows.length),
    roomsAvailable: availableRooms.length,
    coverImage: localCover(row.slug) ?? row.cover_image,
    facilities: allFacilities.filter((f) => facilityIds.has(f.id)),
    description: row.description ?? "",
    rules: JSON.parse(row.rules) as string[],
    images: localGallery(row.slug) ?? [],
    rooms: roomRows,
    owner: { name: "Pengelola RuangKita", role: "Pengelola" },
  };
}

export const fetchPropertyBySlug = (slug: string) => fetchPropertyWhere("slug", slug);
export const fetchPropertyById = (id: string) => fetchPropertyWhere("id", id);

export async function fetchSavedIds(userId: string): Promise<string[]> {
  const rows = await query<{ property_id: string }>("select property_id from saved_properties where user_id = ?", [userId]);
  return rows.map((r) => r.property_id);
}

/** Booking milik pengguna. Tanpa id: booking terbaru yang belum dibatalkan. */
export async function fetchBookingForPayment(userId: string, bookingId?: string) {
  const [booking] = await query<BookingRow>(
    bookingId
      ? "select * from bookings where user_id = ? and status != 'cancelled' and id = ?"
      : "select * from bookings where user_id = ? and status != 'cancelled' order by created_at desc limit 1",
    bookingId ? [userId, bookingId] : [userId],
  );
  if (!booking) return null;

  const [property, rooms] = await Promise.all([
    fetchPropertyById(booking.property_id),
    query<RoomDb>("select * from rooms where id = ?", [booking.room_id]),
  ]);
  if (!property || !rooms[0]) return null;
  return { booking, property, room: toRoom(rooms[0]) };
}

export async function fetchDashboard(userId: string) {
  const [bookings, payments, saved] = await Promise.all([
    query<BookingRow>("select * from bookings where user_id = ? order by created_at desc", [userId]),
    query<PaymentRow>("select * from payments where user_id = ? order by created_at desc", [userId]),
    query<{ property_id: string }>(
      "select property_id from saved_properties where user_id = ? order by created_at desc",
      [userId],
    ),
  ]);

  const propertyIds = [...new Set([...bookings.map((b) => b.property_id), ...saved.map((s) => s.property_id)])];
  const roomIds = [...new Set(bookings.map((b) => b.room_id))];

  const [props, rooms, facilities] = await Promise.all([
    propertyIds.length
      ? query<ListingDb>(`select * from property_listings where id in (${placeholders(propertyIds.length)})`, propertyIds)
      : Promise.resolve([] as ListingDb[]),
    roomIds.length
      ? query<RoomDb>(`select * from rooms where id in (${placeholders(roomIds.length)})`, roomIds)
      : Promise.resolve([] as RoomDb[]),
    fetchFacilities(),
  ]);

  const facilityMap = new Map(facilities.map((f) => [f.id, f]));
  const propertyMap = new Map(props.map((p) => [p.id, toProperty(p, facilityMap)]));
  const roomMap = new Map(rooms.map((r) => [r.id, toRoom(r)]));

  return {
    bookings,
    payments,
    savedProperties: saved.map((s) => propertyMap.get(s.property_id)).filter((p): p is Property => !!p),
    propertyMap,
    roomMap,
  };
}

/** Angka ringkas untuk beranda, dihitung dari data nyata (bukan angka karangan). */
export async function fetchHomeStats() {
  const rows = await query<{ city: string; rooms_available: number }>(
    "select city, rooms_available from property_listings where status = 'active'",
  );
  return {
    properties: rows.length,
    rooms: rows.reduce((sum, r) => sum + Number(r.rooms_available), 0),
    cities: new Set(rows.map((r) => r.city)).size,
  };
}
