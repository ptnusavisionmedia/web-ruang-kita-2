/** Bentuk baris tabel SQLite (lihat lib/db.ts). */

export type PropertyStatus = "active" | "inactive" | "draft";
export type RoomDbStatus = "available" | "booked" | "maintenance";
export type BookingStatus = "pending" | "confirmed" | "completed" | "cancelled";
export type PaymentDbMethod = "bank_transfer" | "e_wallet" | "virtual_account";
export type PaymentDbStatus = "pending" | "paid" | "failed" | "expired";
export type PaymentType = "booking_fee" | "rent_deposit";

export type PropertyRow = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  property_type: string;
  address: string | null;
  city: string;
  area: string | null;
  cover_image: string | null;
  rules: string[];
  status: PropertyStatus;
  created_at: string;
  updated_at: string;
};

export type RoomRow = {
  id: string;
  property_id: string;
  name: string;
  description: string | null;
  price_monthly: number;
  size: string | null;
  floor: string | null;
  available: boolean;
  status: RoomDbStatus;
  created_at: string;
  updated_at: string;
};

export type FacilityRow = {
  id: string;
  name: string;
  icon: string | null;
};

export type BookingRow = {
  id: string;
  user_id: string;
  property_id: string;
  room_id: string;
  survey_date: string;
  survey_time: string;
  full_name: string;
  whatsapp: string;
  email: string;
  notes: string | null;
  status: BookingStatus;
  created_at: string;
  updated_at: string;
};

export type PaymentRow = {
  id: string;
  booking_id: string;
  user_id: string;
  payment_type: PaymentType;
  amount: number;
  payment_method: PaymentDbMethod;
  payment_status: PaymentDbStatus;
  transaction_id: string | null;
  paid_at: string | null;
  created_at: string;
  updated_at: string;
};

export type SavedPropertyRow = {
  user_id: string;
  property_id: string;
  created_at: string;
};

export type PropertyListingRow = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  property_type: string;
  address: string | null;
  city: string;
  area: string | null;
  cover_image: string | null;
  status: PropertyStatus;
  created_at: string;
  min_price: number | null;
  rooms_available: number;
  rooms_total: number;
  facility_ids: string[];
};

