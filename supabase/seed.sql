-- RuangKita — data contoh (tanpa pengguna / password).
-- Jalankan SETELAH 001_schema.sql. Aman dijalankan sekali; untuk menghapus lihat bagian bawah.

insert into public.facilities (name, icon) values
  ('WiFi', 'wifi'),
  ('AC', 'snowflake'),
  ('Kamar mandi dalam', 'bath'),
  ('Parkir', 'car'),
  ('Dapur bersama', 'cooking-pot'),
  ('Laundry', 'shirt'),
  ('Kasur & lemari', 'bed-double'),
  ('Keamanan 24 jam', 'shield-check'),
  ('Listrik termasuk', 'zap'),
  ('TV', 'tv')
on conflict (name) do nothing;

insert into public.properties
  (slug, name, property_type, area, city, address, description, rules, status)
values
  ('melati-residence', 'Melati Residence', 'Kos Putri', 'Dago', 'Bandung',
   'Jl. Dago Asri No. 12, Coblong, Bandung',
   'Kos putri bernuansa tenang di kawasan Dago, hanya 10 menit dari kampus ITB dan Unpad. Kamar luas dengan jendela besar, sirkulasi udara baik, dan lingkungan yang aman.',
   array['Tamu lawan jenis tidak diperkenankan masuk kamar','Jam malam pukul 23.00 untuk pintu gerbang utama','Dilarang merokok di dalam kamar','Menjaga kebersihan dan ketenangan bersama'],
   'active'),
  ('kenanga-house', 'Kenanga House', 'Kos Campur', 'Tebet', 'Jakarta Selatan',
   'Jl. Tebet Barat Dalam VI No. 7, Jakarta Selatan',
   'Hunian modern di Tebet dengan akses mudah ke stasiun dan pusat kota. Listrik sudah termasuk dan area parkir motor luas. Cocok untuk pekerja dan mahasiswa.',
   array['Jam malam pukul 23.00 untuk pintu gerbang utama','Dilarang merokok di dalam kamar','Menjaga kebersihan dan ketenangan bersama'],
   'active'),
  ('teratai-suites', 'Teratai Suites', 'Apartemen', 'Kemang', 'Jakarta Selatan',
   'Jl. Kemang Raya No. 45, Jakarta Selatan',
   'Studio apartemen fully furnished dengan pemandangan kota. Dilengkapi dapur kecil, ruang kerja, dan akses kolam renang.',
   array['Minimal sewa 6 bulan','Dilarang membawa hewan peliharaan','Tamu menginap wajib lapor ke resepsionis'],
   'active'),
  ('anggrek-putra', 'Anggrek Putra', 'Kos Putra', 'Condongcatur', 'Yogyakarta',
   'Jl. Anggajaya II No. 3, Sleman, Yogyakarta',
   'Kos putra sederhana dan bersih, dekat UPN dan UIN. Harga terjangkau dengan parkir luas dan area jemur.',
   array['Jam malam pukul 23.00 untuk pintu gerbang utama','Dilarang merokok di dalam kamar'],
   'active'),
  ('sakura-living', 'Sakura Living', 'Kos Putri', 'Setiabudi', 'Jakarta Selatan',
   'Jl. Setiabudi Utara No. 18, Jakarta Selatan',
   'Kos putri premium dengan dapur bersama yang bersih dan ruang santai di lantai atas. Dekat perkantoran Kuningan dan halte TransJakarta.',
   array['Tamu lawan jenis tidak diperkenankan masuk kamar','Jam malam pukul 23.00 untuk pintu gerbang utama','Dilarang merokok di dalam kamar'],
   'active'),
  ('bukit-hijau', 'Rumah Bukit Hijau', 'Rumah', 'Lowokwaru', 'Malang',
   'Jl. Bukit Hijau Blok C No. 9, Malang',
   'Rumah dua kamar tidur dengan halaman kecil di lingkungan perumahan yang asri. Dekat kampus UB dan pusat kuliner.',
   array['Minimal sewa 12 bulan','Perawatan taman menjadi tanggung jawab penyewa','Dilarang mengubah struktur bangunan'],
   'active'),
  ('lotus-tower', 'Lotus Tower', 'Apartemen', 'Gubeng', 'Surabaya',
   'Jl. Raya Gubeng No. 88, Surabaya',
   'Apartemen studio di pusat Surabaya, tersambung langsung dengan mal dan stasiun. Fasilitas gym, kolam renang, dan keamanan 24 jam.',
   array['Minimal sewa 6 bulan','Dilarang merokok di area unit','Maksimal dua penghuni per unit'],
   'active'),
  ('dahlia-kost', 'Dahlia Kost', 'Kos Putri', 'Jatinangor', 'Sumedang',
   'Jl. Raya Jatinangor No. 140, Sumedang',
   'Kos putri dekat kampus Unpad Jatinangor dengan suasana kekeluargaan. Saat ini seluruh kamar terisi.',
   array['Tamu lawan jenis tidak diperkenankan masuk kamar','Jam malam pukul 23.00 untuk pintu gerbang utama'],
   'active')
on conflict (slug) do nothing;

-- Kamar
insert into public.rooms (property_id, name, description, price_monthly, size, floor, available, status)
select p.id, v.name, v.description, v.price, v.size, v.floor, v.available, v.status
from (values
  ('melati-residence', 'Kamar Standar A2', 'Jendela besar, kasur dan lemari tersedia.', 1850000, '3 × 4 m', 'Lantai 2', true, 'available'),
  ('melati-residence', 'Kamar Standar A3', 'Menghadap taman belakang.', 1850000, '3 × 4 m', 'Lantai 2', true, 'available'),
  ('melati-residence', 'Kamar Deluxe B1', 'Lebih luas, dengan meja kerja.', 2100000, '4 × 4 m', 'Lantai 3', true, 'available'),
  ('kenanga-house', 'Kamar 101', 'Lantai dasar, dekat area parkir.', 2300000, '3,5 × 4 m', 'Lantai 1', true, 'available'),
  ('kenanga-house', 'Kamar 102', 'Lantai dasar.', 2300000, '3,5 × 4 m', 'Lantai 1', true, 'available'),
  ('teratai-suites', 'Studio 12A', 'Studio furnished pemandangan kota.', 5400000, '28 m²', 'Lantai 12', true, 'available'),
  ('teratai-suites', 'Studio 12C', 'Studio furnished sudut.', 5600000, '30 m²', 'Lantai 12', true, 'available'),
  ('anggrek-putra', 'Kamar 5', 'Kamar sederhana lantai dasar.', 950000, '3 × 3 m', 'Lantai 1', true, 'available'),
  ('anggrek-putra', 'Kamar 6', 'Sudah terisi.', 950000, '3 × 3 m', 'Lantai 1', false, 'booked'),
  ('sakura-living', 'Kamar S3', 'Dekat dapur bersama.', 2750000, '4 × 4 m', 'Lantai 3', true, 'available'),
  ('sakura-living', 'Kamar S5', 'Menghadap jalan, tenang.', 2750000, '4 × 4 m', 'Lantai 3', true, 'available'),
  ('bukit-hijau', 'Rumah utuh 2 KT', 'Rumah dua kamar tidur dengan halaman.', 4200000, '72 m²', '1 lantai', true, 'available'),
  ('lotus-tower', 'Studio 8B', 'Studio di lantai 8.', 3900000, '24 m²', 'Lantai 8', true, 'available'),
  ('lotus-tower', 'Studio 8D', 'Sudah terisi.', 3900000, '24 m²', 'Lantai 8', false, 'booked'),
  ('dahlia-kost', 'Kamar 1', 'Sudah terisi.', 1100000, '3 × 3 m', 'Lantai 1', false, 'booked')
) as v(slug, name, description, price, size, floor, available, status)
join public.properties p on p.slug = v.slug;

-- Fasilitas per properti
insert into public.property_facilities (property_id, facility_id)
select p.id, f.id
from (values
  ('melati-residence','WiFi'),('melati-residence','AC'),('melati-residence','Kamar mandi dalam'),('melati-residence','Kasur & lemari'),('melati-residence','Laundry'),('melati-residence','Keamanan 24 jam'),
  ('kenanga-house','WiFi'),('kenanga-house','AC'),('kenanga-house','Kamar mandi dalam'),('kenanga-house','Kasur & lemari'),('kenanga-house','Parkir'),('kenanga-house','Listrik termasuk'),
  ('teratai-suites','WiFi'),('teratai-suites','AC'),('teratai-suites','Kamar mandi dalam'),('teratai-suites','Dapur bersama'),('teratai-suites','Parkir'),('teratai-suites','Keamanan 24 jam'),('teratai-suites','TV'),
  ('anggrek-putra','WiFi'),('anggrek-putra','Kasur & lemari'),('anggrek-putra','Parkir'),('anggrek-putra','Laundry'),
  ('sakura-living','WiFi'),('sakura-living','AC'),('sakura-living','Kamar mandi dalam'),('sakura-living','Kasur & lemari'),('sakura-living','Dapur bersama'),('sakura-living','Laundry'),('sakura-living','Keamanan 24 jam'),
  ('bukit-hijau','WiFi'),('bukit-hijau','Kamar mandi dalam'),('bukit-hijau','Dapur bersama'),('bukit-hijau','Parkir'),('bukit-hijau','Listrik termasuk'),
  ('lotus-tower','WiFi'),('lotus-tower','AC'),('lotus-tower','Kamar mandi dalam'),('lotus-tower','Dapur bersama'),('lotus-tower','Parkir'),('lotus-tower','Keamanan 24 jam'),('lotus-tower','TV'),
  ('dahlia-kost','WiFi'),('dahlia-kost','Kasur & lemari'),('dahlia-kost','Laundry'),('dahlia-kost','Keamanan 24 jam')
) as v(slug, facility)
join public.properties p on p.slug = v.slug
join public.facilities f on f.name = v.facility
on conflict do nothing;

-- Foto bangunan lokal (public/photos). Foto utama = foto properti, galeri ditambah dua foto pelengkap.
delete from public.property_images
 where property_id in (select id from public.properties where slug in ('melati-residence','kenanga-house','teratai-suites','anggrek-putra','sakura-living','bukit-hijau','lotus-tower','dahlia-kost'));

insert into public.property_images (property_id, image_url, sort_order)
select p.id, v.url, v.ord
from public.properties p
cross join lateral (values
  ('/photos/' || p.slug || '.jpg', 1),
  ('/photos/extra-tropical-villa.jpg', 2),
  ('/photos/extra-brick-apartment.jpg', 3)
) as v(url, ord)
where p.slug in ('melati-residence','kenanga-house','teratai-suites','anggrek-putra','sakura-living','bukit-hijau','lotus-tower','dahlia-kost');

update public.properties p
   set cover_image = '/photos/' || p.slug || '.jpg'
 where p.slug in ('melati-residence','kenanga-house','teratai-suites','anggrek-putra','sakura-living','bukit-hijau','lotus-tower','dahlia-kost');

-- ------------------------------------------------------------
-- Menghapus data contoh (hapus tanda komentar bila diperlukan):
-- delete from public.properties where slug in
--   ('melati-residence','kenanga-house','teratai-suites','anggrek-putra','sakura-living','bukit-hijau','lotus-tower','dahlia-kost');
-- ------------------------------------------------------------
