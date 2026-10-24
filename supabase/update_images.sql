-- Mengganti gambar contoh dengan foto bangunan lokal (public/photos). Jalankan di SQL Editor (aman diulang).
-- Catatan: aplikasi sudah memakai foto lokal secara otomatis; skrip ini hanya menyelaraskan isi database.

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
