import type { FacilityRow, RoomRow } from "@/types/database";

/**
 * Data properti awal. Dimasukkan otomatis ke database SQLite saat tabel properti masih kosong (lihat lib/db.ts).
 */

const FACILITY_LIST: Array<[string, string]> = [
  ["WiFi", "wifi"],
  ["AC", "snowflake"],
  ["Kamar mandi dalam", "bath"],
  ["Parkir", "car"],
  ["Dapur bersama", "cooking-pot"],
  ["Laundry", "shirt"],
  ["Kasur & lemari", "bed-double"],
  ["Keamanan 24 jam", "shield-check"],
  ["Listrik termasuk", "zap"],
  ["TV", "tv"],
];

export const STATIC_FACILITIES: FacilityRow[] = FACILITY_LIST.map(([name, icon], i) => ({
  id: `fac-${i + 1}`,
  name,
  icon,
}));

const facilityByName = new Map(STATIC_FACILITIES.map((f) => [f.name, f]));

type RoomSeed = [name: string, description: string, price: number, size: string, floor: string, available: boolean];

interface PropertySeed {
  slug: string;
  name: string;
  type: string;
  area: string;
  city: string;
  address: string;
  description: string;
  rules: string[];
  facilities: string[];
  rooms: RoomSeed[];
}

const SEEDS: PropertySeed[] = [
  {
    slug: "melati-residence",
    name: "Melati Residence",
    type: "Kos Putri",
    area: "Dago",
    city: "Bandung",
    address: "Jl. Dago Asri No. 12, Coblong, Bandung",
    description:
      "Kos putri bernuansa tenang di kawasan Dago, hanya 10 menit dari kampus ITB dan Unpad. Kamar luas dengan jendela besar, sirkulasi udara baik, dan lingkungan yang aman.",
    rules: [
      "Tamu lawan jenis tidak diperkenankan masuk kamar",
      "Jam malam pukul 23.00 untuk pintu gerbang utama",
      "Dilarang merokok di dalam kamar",
      "Menjaga kebersihan dan ketenangan bersama",
    ],
    facilities: ["WiFi", "AC", "Kamar mandi dalam", "Kasur & lemari", "Laundry", "Keamanan 24 jam"],
    rooms: [
      ["Kamar Standar A2", "Jendela besar, kasur dan lemari tersedia.", 1850000, "3 × 4 m", "Lantai 2", true],
      ["Kamar Standar A3", "Menghadap taman belakang.", 1850000, "3 × 4 m", "Lantai 2", true],
      ["Kamar Deluxe B1", "Lebih luas, dengan meja kerja.", 2100000, "4 × 4 m", "Lantai 3", true],
    ],
  },
  {
    slug: "kenanga-house",
    name: "Kenanga House",
    type: "Kos Campur",
    area: "Tebet",
    city: "Jakarta Selatan",
    address: "Jl. Tebet Barat Dalam VI No. 7, Jakarta Selatan",
    description:
      "Hunian modern di Tebet dengan akses mudah ke stasiun dan pusat kota. Listrik sudah termasuk dan area parkir motor luas. Cocok untuk pekerja dan mahasiswa.",
    rules: [
      "Jam malam pukul 23.00 untuk pintu gerbang utama",
      "Dilarang merokok di dalam kamar",
      "Menjaga kebersihan dan ketenangan bersama",
    ],
    facilities: ["WiFi", "AC", "Kamar mandi dalam", "Kasur & lemari", "Parkir", "Listrik termasuk"],
    rooms: [
      ["Kamar 101", "Lantai dasar, dekat area parkir.", 2300000, "3,5 × 4 m", "Lantai 1", true],
      ["Kamar 102", "Lantai dasar.", 2300000, "3,5 × 4 m", "Lantai 1", true],
    ],
  },
  {
    slug: "teratai-suites",
    name: "Teratai Suites",
    type: "Apartemen",
    area: "Kemang",
    city: "Jakarta Selatan",
    address: "Jl. Kemang Raya No. 45, Jakarta Selatan",
    description:
      "Studio apartemen fully furnished dengan pemandangan kota. Dilengkapi dapur kecil, ruang kerja, dan akses kolam renang.",
    rules: ["Minimal sewa 6 bulan", "Dilarang membawa hewan peliharaan", "Tamu menginap wajib lapor ke resepsionis"],
    facilities: ["WiFi", "AC", "Kamar mandi dalam", "Dapur bersama", "Parkir", "Keamanan 24 jam", "TV"],
    rooms: [
      ["Studio 12A", "Studio furnished pemandangan kota.", 5400000, "28 m²", "Lantai 12", true],
      ["Studio 12C", "Studio furnished sudut.", 5600000, "30 m²", "Lantai 12", true],
    ],
  },
  {
    slug: "anggrek-putra",
    name: "Anggrek Putra",
    type: "Kos Putra",
    area: "Condongcatur",
    city: "Yogyakarta",
    address: "Jl. Anggajaya II No. 3, Sleman, Yogyakarta",
    description:
      "Kos putra sederhana dan bersih, dekat UPN dan UIN. Harga terjangkau dengan parkir luas dan area jemur.",
    rules: ["Jam malam pukul 23.00 untuk pintu gerbang utama", "Dilarang merokok di dalam kamar"],
    facilities: ["WiFi", "Kasur & lemari", "Parkir", "Laundry"],
    rooms: [
      ["Kamar 5", "Kamar sederhana lantai dasar.", 950000, "3 × 3 m", "Lantai 1", true],
      ["Kamar 6", "Sudah terisi.", 950000, "3 × 3 m", "Lantai 1", false],
    ],
  },
  {
    slug: "sakura-living",
    name: "Sakura Living",
    type: "Kos Putri",
    area: "Setiabudi",
    city: "Jakarta Selatan",
    address: "Jl. Setiabudi Utara No. 18, Jakarta Selatan",
    description:
      "Kos putri premium dengan dapur bersama yang bersih dan ruang santai di lantai atas. Dekat perkantoran Kuningan dan halte TransJakarta.",
    rules: [
      "Tamu lawan jenis tidak diperkenankan masuk kamar",
      "Jam malam pukul 23.00 untuk pintu gerbang utama",
      "Dilarang merokok di dalam kamar",
    ],
    facilities: ["WiFi", "AC", "Kamar mandi dalam", "Kasur & lemari", "Dapur bersama", "Laundry", "Keamanan 24 jam"],
    rooms: [
      ["Kamar S3", "Dekat dapur bersama.", 2750000, "4 × 4 m", "Lantai 3", true],
      ["Kamar S5", "Menghadap jalan, tenang.", 2750000, "4 × 4 m", "Lantai 3", true],
    ],
  },
  {
    slug: "bukit-hijau",
    name: "Rumah Bukit Hijau",
    type: "Rumah",
    area: "Lowokwaru",
    city: "Malang",
    address: "Jl. Bukit Hijau Blok C No. 9, Malang",
    description:
      "Rumah dua kamar tidur dengan halaman kecil di lingkungan perumahan yang asri. Dekat kampus UB dan pusat kuliner.",
    rules: ["Minimal sewa 12 bulan", "Perawatan taman menjadi tanggung jawab penyewa", "Dilarang mengubah struktur bangunan"],
    facilities: ["WiFi", "Kamar mandi dalam", "Dapur bersama", "Parkir", "Listrik termasuk"],
    rooms: [["Rumah utuh 2 KT", "Rumah dua kamar tidur dengan halaman.", 4200000, "72 m²", "1 lantai", true]],
  },
  {
    slug: "lotus-tower",
    name: "Lotus Tower",
    type: "Apartemen",
    area: "Gubeng",
    city: "Surabaya",
    address: "Jl. Raya Gubeng No. 88, Surabaya",
    description:
      "Apartemen studio di pusat Surabaya, tersambung langsung dengan mal dan stasiun. Fasilitas gym, kolam renang, dan keamanan 24 jam.",
    rules: ["Minimal sewa 6 bulan", "Dilarang merokok di area unit", "Maksimal dua penghuni per unit"],
    facilities: ["WiFi", "AC", "Kamar mandi dalam", "Dapur bersama", "Parkir", "Keamanan 24 jam", "TV"],
    rooms: [
      ["Studio 8B", "Studio di lantai 8.", 3900000, "24 m²", "Lantai 8", true],
      ["Studio 8D", "Sudah terisi.", 3900000, "24 m²", "Lantai 8", false],
    ],
  },
  {
    slug: "dahlia-kost",
    name: "Dahlia Kost",
    type: "Kos Putri",
    area: "Jatinangor",
    city: "Sumedang",
    address: "Jl. Raya Jatinangor No. 140, Sumedang",
    description:
      "Kos putri dekat kampus Unpad Jatinangor dengan suasana kekeluargaan. Saat ini seluruh kamar terisi.",
    rules: ["Tamu lawan jenis tidak diperkenankan masuk kamar", "Jam malam pukul 23.00 untuk pintu gerbang utama"],
    facilities: ["WiFi", "Kasur & lemari", "Laundry", "Keamanan 24 jam"],
    rooms: [["Kamar 1", "Sudah terisi.", 1100000, "3 × 3 m", "Lantai 1", false]],
  },
];

export interface StaticProperty {
  id: string;
  slug: string;
  name: string;
  type: string;
  area: string;
  city: string;
  address: string;
  description: string;
  rules: string[];
  facilities: FacilityRow[];
  rooms: RoomRow[];
  /** Urutan "terbaru": properti pertama dianggap paling baru. */
  order: number;
}

export const STATIC_PROPERTIES: StaticProperty[] = SEEDS.map((s, idx) => {
  const id = `prop-${s.slug}`;
  const stamp = "2026-01-01T00:00:00.000Z";
  return {
    id,
    slug: s.slug,
    name: s.name,
    type: s.type,
    area: s.area,
    city: s.city,
    address: s.address,
    description: s.description,
    rules: s.rules,
    facilities: s.facilities.map((n) => facilityByName.get(n)).filter((f): f is FacilityRow => !!f),
    rooms: s.rooms.map(([name, description, price, size, floor, available], i) => ({
      id: `${id}-room-${i + 1}`,
      property_id: id,
      name,
      description,
      price_monthly: price,
      size,
      floor,
      available,
      status: available ? "available" : "booked",
      created_at: stamp,
      updated_at: stamp,
    })),
    order: idx,
  };
});
