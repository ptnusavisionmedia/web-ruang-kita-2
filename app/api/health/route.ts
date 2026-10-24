import { connection } from "next/server";
import { query } from "@/lib/db";

/** Cek koneksi database untuk diagnosis deploy. Tidak menampilkan URL atau token. */
export async function GET() {
  await connection();
  try {
    const [row] = await query<{ n: number }>("select count(*) as n from properties");
    return Response.json({ ok: true, properties: Number(row.n) });
  } catch (e) {
    const err = e as Error & { code?: string };
    return Response.json({ ok: false, code: err.code ?? null, error: String(err.message).slice(0, 300) }, { status: 500 });
  }
}
