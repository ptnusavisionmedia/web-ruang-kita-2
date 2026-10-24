import { z } from "zod";
import type { ActionResult } from "@/types";

/** Ubah ZodError menjadi { namaField: pesanPertama }. */
export function fieldErrorsFrom(error: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? "form");
    if (!out[key]) out[key] = issue.message;
  }
  return out;
}

export function invalid<T = undefined>(error: z.ZodError): ActionResult<T> {
  return { ok: false, message: "Periksa kembali data yang ditandai", fieldErrors: fieldErrorsFrom(error) };
}
