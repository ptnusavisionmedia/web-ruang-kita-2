import "server-only";
import type { Client, InValue, Row } from "@libsql/client";
import { STATIC_FACILITIES, STATIC_PROPERTIES } from "@/lib/static-data";

/**
 * Database SQLite lewat libSQL (dialek SQLite yang sama).
 * - Lokal: berkas `file:./data/ruangkita.db` (otomatis dibuat).
 * - Netlify/Vercel: filesystem-nya sementara, jadi isi DATABASE_URL (libsql://...) dan
 *   DATABASE_AUTH_TOKEN dari Turso (SQLite terkelola, ada paket gratis).
 */
// Di hosting serverless (Netlify/Vercel) filesystem-nya sementara, jadi berkas lokal tidak dipakai.
const serverless = !!(process.env.NETLIFY || process.env.VERCEL);
const url = process.env.DATABASE_URL?.trim() || (serverless ? "" : "file:./data/ruangkita.db");

export const DB_NOT_CONFIGURED_MESSAGE =
  "Database belum dikonfigurasi. Isi DATABASE_URL dan DATABASE_AUTH_TOKEN (Turso) di environment variables.";

const SCHEMA = [
  `create table if not exists users (
    id text primary key,
    username text not null unique,
    password_hash text not null,
    failed_attempts integer not null default 0,
    locked_until integer not null default 0,
    created_at text not null default (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
  )`,
  `create table if not exists sessions (
    token_hash text primary key,
    user_id text not null references users (id) on delete cascade,
    expires_at integer not null
  )`,
  `create table if not exists facilities (
    id text primary key,
    name text not null unique,
    icon text
  )`,
  `create table if not exists properties (
    id text primary key,
    name text not null,
    slug text not null unique,
    description text,
    property_type text not null,
    address text,
    city text not null,
    area text,
    cover_image text,
    rules text not null default '[]',
    status text not null default 'active' check (status in ('active', 'inactive', 'draft')),
    created_at text not null,
    updated_at text not null
  )`,
  `create table if not exists rooms (
    id text primary key,
    property_id text not null references properties (id) on delete cascade,
    name text not null,
    description text,
    price_monthly integer not null check (price_monthly >= 0),
    size text,
    floor text,
    available integer not null default 1,
    status text not null default 'available' check (status in ('available', 'booked', 'maintenance')),
    created_at text not null,
    updated_at text not null
  )`,
  `create table if not exists property_facilities (
    property_id text not null references properties (id) on delete cascade,
    facility_id text not null references facilities (id) on delete cascade,
    primary key (property_id, facility_id)
  )`,
  `create table if not exists bookings (
    id text primary key,
    user_id text not null references users (id) on delete cascade,
    property_id text not null references properties (id) on delete cascade,
    room_id text not null references rooms (id) on delete cascade,
    survey_date text not null,
    survey_time text not null,
    full_name text not null,
    whatsapp text not null,
    email text not null default '',
    notes text,
    status text not null default 'pending' check (status in ('pending', 'confirmed', 'completed', 'cancelled')),
    created_at text not null default (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
    updated_at text not null default (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
  )`,
  `create table if not exists payments (
    id text primary key,
    booking_id text not null references bookings (id) on delete cascade,
    user_id text not null references users (id) on delete cascade,
    payment_type text not null default 'booking_fee' check (payment_type in ('booking_fee', 'rent_deposit')),
    amount integer not null check (amount >= 0),
    payment_method text not null check (payment_method in ('bank_transfer', 'e_wallet', 'virtual_account')),
    payment_status text not null default 'pending' check (payment_status in ('pending', 'paid', 'failed', 'expired')),
    transaction_id text,
    paid_at text,
    created_at text not null default (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
    updated_at text not null default (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
  )`,
  `create table if not exists saved_properties (
    user_id text not null references users (id) on delete cascade,
    property_id text not null references properties (id) on delete cascade,
    created_at text not null default (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
    primary key (user_id, property_id)
  )`,
  `create index if not exists rooms_property_idx on rooms (property_id)`,
  `create index if not exists bookings_user_idx on bookings (user_id)`,
  `create index if not exists payments_user_idx on payments (user_id)`,
  `create index if not exists sessions_user_idx on sessions (user_id)`,
  // Satu slot survei per kamar hanya untuk satu booking aktif (lintas pengguna).
  `create unique index if not exists bookings_unique_slot
     on bookings (room_id, survey_date, survey_time) where status in ('pending', 'confirmed')`,
  // Satu pengguna tidak boleh punya dua booking aktif untuk kamar yang sama.
  `create unique index if not exists bookings_unique_user_room
     on bookings (user_id, room_id) where status in ('pending', 'confirmed')`,
  `drop view if exists property_listings`,
  `create view property_listings as
     select p.id, p.slug, p.name, p.description, p.property_type, p.address, p.city, p.area,
            p.cover_image, p.status, p.created_at,
            coalesce(
              (select min(r.price_monthly) from rooms r
                 where r.property_id = p.id and r.available = 1 and r.status = 'available'),
              (select min(r.price_monthly) from rooms r where r.property_id = p.id)
            ) as min_price,
            (select count(*) from rooms r
               where r.property_id = p.id and r.available = 1 and r.status = 'available') as rooms_available,
            (select count(*) from rooms r where r.property_id = p.id) as rooms_total,
            (select coalesce(json_group_array(pf.facility_id), '[]')
               from property_facilities pf where pf.property_id = p.id) as facility_ids
       from properties p`,
];

async function open(): Promise<Client> {
  if (!url) throw new Error(DB_NOT_CONFIGURED_MESSAGE);
  // Turso lewat HTTPS lebih andal di serverless daripada websocket (libsql://).
  const config = {
    url: url.replace(/^libsql:\/\//, "https://"),
    authToken: process.env.DATABASE_AUTH_TOKEN?.trim() || undefined,
  };
  if (url.startsWith("file:")) {
    const { mkdirSync } = await import("node:fs");
    const { dirname } = await import("node:path");
    mkdirSync(dirname(url.slice("file:".length)), { recursive: true });
    return (await import("@libsql/client")).createClient(config);
  }
  // Klien web murni JS (tanpa binary native) -> aman di serverless Netlify.
  return (await import("@libsql/client/web")).createClient(config);
}

async function seed(db: Client) {
  const count = await db.execute("select count(*) as n from properties");
  if (Number(count.rows[0].n) > 0) return;

  const stmts: Array<{ sql: string; args: InValue[] }> = [];
  for (const f of STATIC_FACILITIES) {
    stmts.push({ sql: "insert or ignore into facilities (id, name, icon) values (?, ?, ?)", args: [f.id, f.name, f.icon] });
  }
  const base = Date.now();
  for (const p of STATIC_PROPERTIES) {
    // Properti pertama paling baru.
    const stamp = new Date(base - p.order * 60_000).toISOString();
    stmts.push({
      sql: `insert or ignore into properties
              (id, name, slug, description, property_type, address, city, area, rules, status, created_at, updated_at)
            values (?, ?, ?, ?, ?, ?, ?, ?, ?, 'active', ?, ?)`,
      args: [p.id, p.name, p.slug, p.description, p.type, p.address, p.city, p.area, JSON.stringify(p.rules), stamp, stamp],
    });
    for (const f of p.facilities) {
      stmts.push({ sql: "insert or ignore into property_facilities (property_id, facility_id) values (?, ?)", args: [p.id, f.id] });
    }
    for (const r of p.rooms) {
      stmts.push({
        sql: `insert or ignore into rooms
                (id, property_id, name, description, price_monthly, size, floor, available, status, created_at, updated_at)
              values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        args: [r.id, p.id, r.name, r.description, r.price_monthly, r.size, r.floor, r.available ? 1 : 0, r.status, stamp, stamp],
      });
    }
  }
  await db.batch(stmts, "write");
}

let ready: Promise<Client> | undefined;

/** Klien database (skema & data contoh dibuat otomatis pada pemakaian pertama). */
export function getDb(): Promise<Client> {
  ready ??= (async () => {
    const db = await open();
    await db.execute("pragma foreign_keys = on");
    await db.batch(SCHEMA, "write");
    await seed(db);
    return db;
  })().catch((e) => {
    ready = undefined;
    throw e;
  });
  return ready;
}

/** Jalankan SELECT dan kembalikan baris sebagai objek. */
export async function query<T = Row>(sql: string, args: InValue[] = []): Promise<T[]> {
  const db = await getDb();
  const res = await db.execute({ sql, args });
  return res.rows.map((r) => ({ ...r })) as unknown as T[];
}

/** Jalankan INSERT/UPDATE/DELETE; mengembalikan jumlah baris yang berubah. */
export async function run(sql: string, args: InValue[] = []): Promise<number> {
  const db = await getDb();
  return (await db.execute({ sql, args })).rowsAffected;
}

export const newId = () => crypto.randomUUID();
