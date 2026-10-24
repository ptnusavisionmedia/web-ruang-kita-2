"use server";

import { redirect } from "next/navigation";
import { getCurrentUser, loginUser, logout, registerUser } from "@/lib/auth";
import { invalid, safeNext, signInSchema, signUpSchema } from "@/lib/validation";
import type { ActionResult } from "@/types";

export type AuthResult = ActionResult;

const GENERIC_ERROR = "Terjadi kesalahan pada server. Coba lagi beberapa saat.";

export async function signIn(formData: FormData): Promise<AuthResult> {
  const parsed = signInSchema.safeParse({
    username: formData.get("username"),
    password: formData.get("password"),
  });
  if (!parsed.success) return invalid(parsed.error);

  let outcome;
  try {
    outcome = await loginUser(parsed.data.username, parsed.data.password);
  } catch (e) {
    console.error("signIn", e);
    return { ok: false, message: GENERIC_ERROR };
  }
  if ("error" in outcome) {
    return {
      ok: false,
      message:
        outcome.error === "locked"
          ? "Terlalu banyak percobaan gagal. Coba lagi dalam 10 menit."
          : "Username atau kata sandi salah.",
    };
  }
  redirect(safeNext(String(formData.get("next") ?? "")));
}

export async function signUp(formData: FormData): Promise<AuthResult> {
  const parsed = signUpSchema.safeParse({
    username: formData.get("username"),
    password: formData.get("password"),
  });
  if (!parsed.success) return invalid(parsed.error);

  let user;
  try {
    user = await registerUser(parsed.data.username, parsed.data.password);
  } catch (e) {
    console.error("signUp", e);
    return { ok: false, message: GENERIC_ERROR };
  }
  if (!user) {
    return { ok: false, message: "Username ini sudah dipakai.", fieldErrors: { username: "Username sudah dipakai" } };
  }
  redirect(safeNext(String(formData.get("next") ?? "")));
}

export async function signOut() {
  await logout();
  redirect("/");
}

/** Username pengguna yang sedang login (untuk tombol di navbar). */
export async function currentUsername(): Promise<string | null> {
  try {
    return (await getCurrentUser())?.username ?? null;
  } catch {
    return null;
  }
}
