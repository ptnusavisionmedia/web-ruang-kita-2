"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth";
import { newId, query, run } from "@/lib/db";
import { bookingSchema, invalid, type BookingInput } from "@/lib/validation";
import type { ActionResult } from "@/types";

export interface CreatedBooking {
  id: string;
  date: string;
  time: string;
  whatsapp: string;
  roomName: string;
}

export async function createBooking(input: BookingInput): Promise<ActionResult<CreatedBooking>> {
  const parsed = bookingSchema.safeParse(input);
  if (!parsed.success) return invalid(parsed.error);
  const v = parsed.data;

  // user_id selalu dari session, bukan dari form.
  const user = await getCurrentUser();
  if (!user) return { ok: false, message: "Silakan masuk terlebih dahulu untuk melakukan booking." };

  try {
    // Pastikan kamar milik properti tsb dan masih tersedia.
    const [room] = await query<{ id: string; name: string; available: number; status: string }>(
      "select id, name, available, status from rooms where id = ? and property_id = ?",
      [v.roomId, v.propertyId],
    );
    if (!room) return { ok: false, message: "Kamar tidak ditemukan." };
    if (!room.available || room.status !== "available") {
      return { ok: false, message: "Maaf, kamar ini sudah tidak tersedia.", fieldErrors: { roomId: "Kamar tidak tersedia" } };
    }

    const id = newId();
    await run(
      `insert into bookings (id, user_id, property_id, room_id, survey_date, survey_time, full_name, whatsapp, email, notes)
       values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, user.id, v.propertyId, v.roomId, v.date, v.time, v.name, v.whatsapp, v.email, v.notes || null],
    );

    revalidatePath("/dashboard");
    return { ok: true, data: { id, date: v.date, time: v.time, whatsapp: v.whatsapp, roomName: room.name } };
  } catch (e) {
    // Unique index: slot survei terisi, atau pengguna sudah punya booking aktif di kamar ini.
    const msg = String((e as Error).message);
    if (msg.includes("UNIQUE")) {
      const slotTaken = msg.includes("survey_date");
      return {
        ok: false,
        message: slotTaken
          ? "Slot survei pada tanggal dan jam tersebut sudah terisi. Pilih waktu lain."
          : "Anda sudah memiliki booking aktif untuk kamar ini.",
        fieldErrors: slotTaken ? { time: "Slot sudah terisi" } : undefined,
      };
    }
    console.error("createBooking", e);
    return { ok: false, message: "Booking gagal disimpan. Coba lagi." };
  }
}

export async function cancelBooking(bookingId: string): Promise<ActionResult> {
  const user = await getCurrentUser();
  if (!user) return { ok: false, message: "Silakan masuk terlebih dahulu." };

  try {
    await run(
      `update bookings set status = 'cancelled', updated_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now')
        where id = ? and user_id = ? and status = 'pending'`,
      [String(bookingId).slice(0, 60), user.id],
    );
  } catch (e) {
    console.error("cancelBooking", e);
    return { ok: false, message: "Gagal membatalkan booking." };
  }
  revalidatePath("/dashboard");
  return { ok: true };
}
