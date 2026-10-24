import "server-only";
import { createHash, randomBytes, scrypt as scryptCb, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";
import { cache } from "react";
import { cookies } from "next/headers";
import { newId, query, run } from "@/lib/db";

const scrypt = promisify(scryptCb) as (pw: string, salt: Buffer, len: number) => Promise<Buffer>;

export const SESSION_COOKIE = "rk_session";
const SESSION_DAYS = 30;
const MAX_FAILED = 5;
const LOCK_MS = 10 * 60_000;

export interface SessionUser {
  id: string;
  username: string;
}

interface UserRow extends SessionUser {
  password_hash: string;
  failed_attempts: number;
  locked_until: number;
}

async function hashPassword(password: string) {
  const salt = randomBytes(16);
  const key = await scrypt(password, salt, 64);
  return `${salt.toString("hex")}:${key.toString("hex")}`;
}

async function checkPassword(password: string, stored: string) {
  const [salt, key] = stored.split(":");
  const expected = Buffer.from(key, "hex");
  const actual = await scrypt(password, Buffer.from(salt, "hex"), expected.length);
  return timingSafeEqual(actual, expected);
}

// Hash palsu agar waktu respons sama baik username ada maupun tidak.
const DUMMY_HASH = `${"00".repeat(16)}:${"00".repeat(64)}`;

const sha256 = (s: string) => createHash("sha256").update(s).digest("hex");

async function startSession(userId: string) {
  const token = randomBytes(32).toString("base64url");
  const expires = Date.now() + SESSION_DAYS * 86_400_000;
  await run("delete from sessions where expires_at < ?", [Date.now()]);
  await run("insert into sessions (token_hash, user_id, expires_at) values (?, ?, ?)", [sha256(token), userId, expires]);
  (await cookies()).set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: new Date(expires),
  });
}

/** Buat akun lalu langsung login. null bila username sudah dipakai. */
export async function registerUser(username: string, password: string): Promise<SessionUser | null> {
  const id = newId();
  try {
    await run("insert into users (id, username, password_hash) values (?, ?, ?)", [id, username, await hashPassword(password)]);
  } catch (e) {
    if (String((e as Error).message).includes("UNIQUE")) return null;
    throw e;
  }
  await startSession(id);
  return { id, username };
}

export type LoginOutcome = { user: SessionUser } | { error: "invalid" | "locked" };

export async function loginUser(username: string, password: string): Promise<LoginOutcome> {
  const [row] = await query<UserRow>("select * from users where username = ?", [username]);
  const ok = await checkPassword(password, row?.password_hash ?? DUMMY_HASH);
  if (row && row.locked_until > Date.now()) return { error: "locked" };
  if (!row || !ok) {
    if (row) {
      // Setelah MAX_FAILED kali salah, akun dikunci sementara.
      const failed = row.failed_attempts + 1;
      const lock = failed >= MAX_FAILED;
      await run("update users set failed_attempts = ?, locked_until = ? where id = ?", [
        lock ? 0 : failed,
        lock ? Date.now() + LOCK_MS : 0,
        row.id,
      ]);
    }
    return { error: "invalid" };
  }
  await run("update users set failed_attempts = 0, locked_until = 0 where id = ?", [row.id]);
  await startSession(row.id);
  return { user: { id: row.id, username: row.username } };
}

export async function logout() {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  if (token) await run("delete from sessions where token_hash = ?", [sha256(token)]);
  jar.delete(SESSION_COOKIE);
}

/** Pengguna yang sedang login (divalidasi ke database), atau null. */
export const getCurrentUser = cache(async (): Promise<SessionUser | null> => {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) return null;
  const [user] = await query<SessionUser>(
    `select u.id, u.username from sessions s join users u on u.id = s.user_id
      where s.token_hash = ? and s.expires_at > ?`,
    [sha256(token), Date.now()],
  );
  return user ?? null;
});
