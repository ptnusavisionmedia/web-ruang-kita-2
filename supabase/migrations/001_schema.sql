-- RuangKita — skema database Supabase (PostgreSQL)
-- Jalankan seluruh file ini di Supabase Dashboard > SQL Editor.

create extension if not exists pgcrypto;

-- ============================================================
-- Helper: updated_at
-- ============================================================
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ============================================================
-- Tabel
-- ============================================================

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  phone text,
  avatar_url text,
  role text not null default 'user' check (role in ('user', 'owner', 'admin')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.properties (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references public.profiles (id) on delete set null,
  name text not null,
  slug text not null unique,
  description text,
  property_type text not null
    check (property_type in ('Kos Putra', 'Kos Putri', 'Kos Campur', 'Apartemen', 'Rumah')),
  address text,
  city text not null,
  area text,
  latitude double precision,
  longitude double precision,
  cover_image text,
  rules text[] not null default '{}',
  status text not null default 'draft' check (status in ('active', 'inactive', 'draft')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.rooms (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references public.properties (id) on delete cascade,
  name text not null,
  description text,
  price_monthly numeric(12, 0) not null check (price_monthly >= 0),
  size text,
  floor text,
  available boolean not null default true,
  status text not null default 'available' check (status in ('available', 'booked', 'maintenance')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.facilities (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  icon text
);

create table public.property_facilities (
  property_id uuid not null references public.properties (id) on delete cascade,
  facility_id uuid not null references public.facilities (id) on delete cascade,
  primary key (property_id, facility_id)
);

create table public.property_images (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references public.properties (id) on delete cascade,
  image_url text not null,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table public.bookings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  property_id uuid not null references public.properties (id) on delete cascade,
  room_id uuid not null references public.rooms (id) on delete cascade,
  survey_date date not null,
  survey_time time not null,
  full_name text not null,
  whatsapp text not null,
  email text not null,
  notes text,
  status text not null default 'pending'
    check (status in ('pending', 'confirmed', 'completed', 'cancelled')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.payments (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null references public.bookings (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  payment_type text not null default 'booking_fee' check (payment_type in ('booking_fee', 'rent_deposit')),
  amount numeric(12, 0) not null check (amount >= 0),
  payment_method text not null check (payment_method in ('bank_transfer', 'e_wallet', 'virtual_account')),
  payment_status text not null default 'pending'
    check (payment_status in ('pending', 'paid', 'failed', 'expired')),
  transaction_id text,
  paid_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.saved_properties (
  user_id uuid not null references public.profiles (id) on delete cascade,
  property_id uuid not null references public.properties (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, property_id)
);

-- ============================================================
-- Index
-- ============================================================
create index properties_city_idx on public.properties (lower(city));
create index properties_type_idx on public.properties (property_type);
create index properties_status_idx on public.properties (status);
create index properties_owner_idx on public.properties (owner_id);
create index rooms_property_idx on public.rooms (property_id);
create index rooms_price_idx on public.rooms (price_monthly);
create index rooms_available_idx on public.rooms (available);
create index property_images_property_idx on public.property_images (property_id, sort_order);
create index property_facilities_facility_idx on public.property_facilities (facility_id);
create index bookings_user_idx on public.bookings (user_id);
create index bookings_room_idx on public.bookings (room_id);
create index payments_user_idx on public.payments (user_id);
create index payments_booking_idx on public.payments (booking_id);
create index saved_properties_property_idx on public.saved_properties (property_id);

-- Mencegah double booking: satu slot survei per kamar hanya boleh dipakai satu booking aktif
-- (berlaku lintas pengguna, tidak terpengaruh RLS).
create unique index bookings_unique_slot
  on public.bookings (room_id, survey_date, survey_time)
  where status in ('pending', 'confirmed');

-- Satu pengguna tidak boleh punya dua booking aktif untuk kamar yang sama.
create unique index bookings_unique_user_room
  on public.bookings (user_id, room_id)
  where status in ('pending', 'confirmed');

-- ============================================================
-- Trigger updated_at
-- ============================================================
create trigger set_updated_at before update on public.profiles
  for each row execute function public.set_updated_at();
create trigger set_updated_at before update on public.properties
  for each row execute function public.set_updated_at();
create trigger set_updated_at before update on public.rooms
  for each row execute function public.set_updated_at();
create trigger set_updated_at before update on public.bookings
  for each row execute function public.set_updated_at();
create trigger set_updated_at before update on public.payments
  for each row execute function public.set_updated_at();

-- ============================================================
-- Profil otomatis saat user baru mendaftar
-- ============================================================
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, phone)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', split_part(new.email, '@', 1)),
    new.raw_user_meta_data ->> 'phone'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================================
-- Fungsi bantu untuk RLS (security definer agar tidak rekursif)
-- ============================================================
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles where id = auth.uid() and role = 'admin'
  );
$$;

create or replace function public.owns_property(p_property_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.properties where id = p_property_id and owner_id = auth.uid()
  );
$$;

-- Mencegah pengguna menaikkan role sendiri.
create or replace function public.protect_profile_role()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  -- Pengguna biasa tidak boleh menaikkan role sendiri. Perubahan dari SQL Editor / Table Editor /
  -- service role (auth.uid() null) dan dari admin tetap diizinkan.
  if new.role is distinct from old.role and auth.uid() is not null and not public.is_admin() then
    new.role = old.role;
  end if;
  return new;
end;
$$;

create trigger protect_role before update on public.profiles
  for each row execute function public.protect_profile_role();

-- ============================================================
-- View untuk katalog (security_invoker: RLS pemanggil tetap berlaku)
-- ============================================================
create or replace view public.property_listings
with (security_invoker = true) as
select
  p.id,
  p.slug,
  p.name,
  p.description,
  p.property_type,
  p.address,
  p.city,
  p.area,
  p.cover_image,
  p.status,
  p.created_at,
  (select min(r.price_monthly) from public.rooms r where r.property_id = p.id) as min_price,
  (select count(*) from public.rooms r
     where r.property_id = p.id and r.available and r.status = 'available') as rooms_available,
  (select count(*) from public.rooms r where r.property_id = p.id) as rooms_total,
  coalesce(
    (select array_agg(pf.facility_id) from public.property_facilities pf where pf.property_id = p.id),
    '{}'::uuid[]
  ) as facility_ids
from public.properties p;

-- Nama pemilik yang boleh dilihat publik (tanpa nomor telepon dsb.).
create or replace view public.public_owner_profiles as
select pr.id, pr.full_name, pr.avatar_url
from public.profiles pr
where exists (
  select 1 from public.properties p where p.owner_id = pr.id and p.status = 'active'
);

-- ============================================================
-- Row Level Security
-- ============================================================
alter table public.profiles enable row level security;
alter table public.properties enable row level security;
alter table public.rooms enable row level security;
alter table public.facilities enable row level security;
alter table public.property_facilities enable row level security;
alter table public.property_images enable row level security;
alter table public.bookings enable row level security;
alter table public.payments enable row level security;
alter table public.saved_properties enable row level security;

-- profiles
create policy "profiles: baca milik sendiri" on public.profiles
  for select using (id = auth.uid() or public.is_admin());
create policy "profiles: ubah milik sendiri" on public.profiles
  for update using (id = auth.uid()) with check (id = auth.uid());
create policy "profiles: admin kelola" on public.profiles
  for all using (public.is_admin()) with check (public.is_admin());

-- properties
create policy "properties: publik lihat yang aktif" on public.properties
  for select using (status = 'active');
create policy "properties: owner lihat miliknya" on public.properties
  for select using (owner_id = auth.uid());
create policy "properties: owner buat" on public.properties
  for insert with check (
    owner_id = auth.uid()
    and exists (select 1 from public.profiles where id = auth.uid() and role in ('owner', 'admin'))
  );
create policy "properties: owner ubah" on public.properties
  for update using (owner_id = auth.uid()) with check (owner_id = auth.uid());
create policy "properties: owner hapus" on public.properties
  for delete using (owner_id = auth.uid());
create policy "properties: admin kelola" on public.properties
  for all using (public.is_admin()) with check (public.is_admin());

-- rooms
create policy "rooms: publik lihat kamar properti aktif" on public.rooms
  for select using (
    exists (select 1 from public.properties p where p.id = property_id and p.status = 'active')
  );
create policy "rooms: owner kelola" on public.rooms
  for all using (public.owns_property(property_id)) with check (public.owns_property(property_id));
create policy "rooms: admin kelola" on public.rooms
  for all using (public.is_admin()) with check (public.is_admin());

-- facilities (referensi, publik baca)
create policy "facilities: publik baca" on public.facilities
  for select using (true);
create policy "facilities: admin kelola" on public.facilities
  for all using (public.is_admin()) with check (public.is_admin());

-- property_facilities
create policy "property_facilities: publik baca properti aktif" on public.property_facilities
  for select using (
    exists (select 1 from public.properties p where p.id = property_id and p.status = 'active')
  );
create policy "property_facilities: owner kelola" on public.property_facilities
  for all using (public.owns_property(property_id)) with check (public.owns_property(property_id));
create policy "property_facilities: admin kelola" on public.property_facilities
  for all using (public.is_admin()) with check (public.is_admin());

-- property_images
create policy "property_images: publik baca properti aktif" on public.property_images
  for select using (
    exists (select 1 from public.properties p where p.id = property_id and p.status = 'active')
  );
create policy "property_images: owner kelola" on public.property_images
  for all using (public.owns_property(property_id)) with check (public.owns_property(property_id));
create policy "property_images: admin kelola" on public.property_images
  for all using (public.is_admin()) with check (public.is_admin());

-- bookings
create policy "bookings: baca milik sendiri" on public.bookings
  for select using (user_id = auth.uid());
create policy "bookings: buat milik sendiri" on public.bookings
  for insert with check (user_id = auth.uid());
create policy "bookings: ubah milik sendiri" on public.bookings
  for update using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "bookings: owner lihat booking propertinya" on public.bookings
  for select using (public.owns_property(property_id));
create policy "bookings: admin kelola" on public.bookings
  for all using (public.is_admin()) with check (public.is_admin());

-- payments: user hanya baca miliknya dan boleh membuat tagihan berstatus pending.
create policy "payments: baca milik sendiri" on public.payments
  for select using (user_id = auth.uid());
create policy "payments: buat tagihan pending milik sendiri" on public.payments
  for insert with check (
    user_id = auth.uid()
    and payment_status = 'pending'
    and exists (select 1 from public.bookings b where b.id = booking_id and b.user_id = auth.uid())
  );
create policy "payments: admin kelola" on public.payments
  for all using (public.is_admin()) with check (public.is_admin());

-- saved_properties
create policy "saved_properties: kelola milik sendiri" on public.saved_properties
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "saved_properties: admin baca" on public.saved_properties
  for select using (public.is_admin());

-- ============================================================
-- Hak akses
-- ============================================================
grant select on public.property_listings, public.public_owner_profiles to anon, authenticated;

-- ============================================================
-- SIMULASI PEMBAYARAN (khusus demo — HAPUS saat memakai payment gateway)
-- Pada production, status "paid" harus diubah oleh webhook gateway (service role),
-- bukan oleh pengguna. Fungsi ini hanya memperbolehkan pemilik tagihan.
-- ============================================================
create or replace function public.simulate_payment_success(p_payment_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.payments
     set payment_status = 'paid', paid_at = now()
   where id = p_payment_id
     and user_id = auth.uid()
     and payment_status = 'pending';
end;
$$;

revoke all on function public.simulate_payment_success(uuid) from public, anon;
grant execute on function public.simulate_payment_success(uuid) to authenticated;
