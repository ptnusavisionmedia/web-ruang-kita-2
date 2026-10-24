import type { BookingRow, FacilityRow, PaymentRow, RoomRow } from "./database";

export type PropertyType =
  | "Kos Putra"
  | "Kos Putri"
  | "Kos Campur"
  | "Apartemen"
  | "Rumah";

export type RoomStatus = "Tersedia" | "Segera Penuh" | "Penuh";

export type Facility = FacilityRow;

/** Properti untuk kartu katalog / ringkasan. */
export interface Property {
  id: string;
  slug: string;
  name: string;
  type: string;
  area: string;
  city: string;
  address: string;
  price: number;
  status: RoomStatus;
  roomsAvailable: number;
  coverImage: string | null;
  facilities: Facility[];
}

export interface PropertyDetail extends Property {
  description: string;
  rules: string[];
  images: string[];
  rooms: RoomRow[];
  owner: { name: string; role: string };
}

export interface BookingWithProperty extends BookingRow {
  property: Pick<Property, "id" | "slug" | "name" | "area" | "city" | "price" | "coverImage"> | null;
  room: Pick<RoomRow, "id" | "name" | "price_monthly"> | null;
}

export type PaymentMethodLabel = "Transfer Bank" | "E-Wallet" | "Virtual Account";

export type PaymentWithBooking = PaymentRow & { propertyName: string | null };

export interface ActionResult<T = undefined> {
  ok: boolean;
  message?: string;
  fieldErrors?: Record<string, string>;
  data?: T;
}
