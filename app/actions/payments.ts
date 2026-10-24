"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth";
import { newId, query, run } from "@/lib/db";
import { BOOKING_FEE } from "@/lib/constants";
import { invalid, paymentSchema, type PaymentInput } from "@/lib/validation";
import type { ActionResult } from "@/types";
import type { PaymentDbStatus } from "@/types/database";

export interface CreatedPayment {
  id: string;
  amount: number;
  status: PaymentDbStatus;
  transactionId: string;
}

const NOW = "strftime('%Y-%m-%dT%H:%M:%fZ', 'now')";
const MARK_PAID = `update payments set payment_status = 'paid', paid_at = ${NOW}, updated_at = ${NOW}
  where id = ? and user_id = ? and payment_status = 'pending'`;

/**
 * Membuat tagihan. Nominal dihitung di server dari data kamar, bukan dari client.
 * SIMULASI: tidak ada payment gateway. E-wallet langsung dianggap lunas;
 * ganti dengan webhook gateway di production.
 */
export async function createPayment(input: PaymentInput): Promise<ActionResult<CreatedPayment>> {
  const parsed = paymentSchema.safeParse(input);
  if (!parsed.success) return invalid(parsed.error);
  const v = parsed.data;

  const user = await getCurrentUser();
  if (!user) return { ok: false, message: "Silakan masuk terlebih dahulu." };

  try {
    const [booking] = await query<{ id: string; room_id: string; status: string }>(
      "select id, room_id, status from bookings where id = ? and user_id = ?",
      [v.bookingId, user.id],
    );
    if (!booking) return { ok: false, message: "Booking tidak ditemukan." };
    if (booking.status === "cancelled") return { ok: false, message: "Booking ini sudah dibatalkan." };

    const [room] = await query<{ price_monthly: number }>("select price_monthly from rooms where id = ?", [booking.room_id]);
    if (!room) return { ok: false, message: "Data kamar tidak ditemukan." };

    const amount = v.type === "rent_deposit" ? Number(room.price_monthly) : BOOKING_FEE;
    const transactionId =
      v.method === "virtual_account"
        ? `8808${Math.floor(1e10 + Math.random() * 9e10)}`
        : `RK${Date.now().toString(36).toUpperCase()}`;

    const id = newId();
    await run(
      `insert into payments (id, booking_id, user_id, payment_type, amount, payment_method, payment_status, transaction_id)
       values (?, ?, ?, ?, ?, ?, 'pending', ?)`,
      [id, booking.id, user.id, v.type, amount, v.method, transactionId],
    );

    let status: PaymentDbStatus = "pending";
    if (v.method === "e_wallet" && (await run(MARK_PAID, [id, user.id])) > 0) status = "paid";

    revalidatePath("/dashboard");
    return { ok: true, data: { id, amount, status, transactionId } };
  } catch (e) {
    console.error("createPayment", e);
    return { ok: false, message: "Pembayaran gagal dibuat. Coba lagi." };
  }
}

/** SIMULASI: tandai tagihan pending milik pengguna sebagai lunas. */
export async function simulatePaid(paymentId: string): Promise<ActionResult> {
  const user = await getCurrentUser();
  if (!user) return { ok: false, message: "Silakan masuk terlebih dahulu." };

  try {
    await run(MARK_PAID, [String(paymentId).slice(0, 60), user.id]);
  } catch (e) {
    console.error("simulatePaid", e);
    return { ok: false, message: "Gagal memperbarui status pembayaran." };
  }
  revalidatePath("/dashboard");
  return { ok: true };
}
