import Link from "next/link";
import FaqBrowser, { type Faq } from "@/components/FaqBrowser";
import IconTile from "@/components/IconTile";
import SectionLabel from "@/components/SectionLabel";
import { IconClipboard, IconClock, IconMail } from "@/components/icons";
import { BOOKING_FEE } from "@/lib/constants";
import { btnPrimary } from "@/lib/ui";
import { formatRupiah } from "@/lib/utils";

export const metadata = {
  title: "Bantuan — RuangKita",
  description: "Jawaban untuk pertanyaan seputar survei, pembayaran, dan akun RuangKita.",
};

const categories = ["Survei", "Pembayaran", "Akun"];

const faqs: Faq[] = [
  { category: "Survei", q: "Apakah survei dikenakan biaya?", a: "Tidak. Menjadwalkan survei gratis dan tanpa komitmen. Pembayaran baru dilakukan setelah Anda memutuskan." },
  { category: "Survei", q: "Bagaimana cara menjadwalkan survei?", a: "Buka halaman detail properti, tekan Booking Survei, lalu pilih kamar, tanggal, dan jam. Anda perlu masuk ke akun terlebih dahulu." },
  { category: "Survei", q: "Bisakah saya membatalkan jadwal survei?", a: "Bisa. Buka Dashboard, bagian Jadwal survei, lalu pilih Batalkan selama statusnya masih menunggu konfirmasi. Slot waktunya akan dibuka kembali." },
  { category: "Survei", q: "Kenapa jam yang saya pilih tidak bisa dipakai?", a: "Satu slot survei per kamar hanya bisa diambil satu orang. Jika slot sudah terisi, pilih jam atau tanggal lain." },
  { category: "Pembayaran", q: "Bagaimana cara membayar booking?", a: "Setelah survei dijadwalkan, lanjut ke halaman pembayaran. Pilih jenis pembayaran dan metode: transfer bank, e-wallet, atau virtual account." },
  { category: "Pembayaran", q: "Berapa biaya booking dan DP sewa?", a: `Biaya booking tetap ${formatRupiah(BOOKING_FEE)} dan mengamankan kamar selama 7 hari. DP sewa sebesar harga sewa satu bulan kamar yang dipilih.` },
  { category: "Pembayaran", q: "Di mana saya melihat status pembayaran?", a: "Di Dashboard, bagian Status pembayaran dan Riwayat transaksi. Setiap tagihan menampilkan status Menunggu atau Berhasil." },
  { category: "Pembayaran", q: "Apakah pembayaran di situs ini sungguhan?", a: "Belum. Versi demo ini mensimulasikan pembayaran sehingga tidak ada uang yang ditarik dari rekening Anda." },
  { category: "Akun", q: "Kenapa saya perlu mendaftar?", a: "Akun diperlukan untuk menjadwalkan survei, membayar, dan menyimpan properti agar datanya tercatat rapi dan aman." },
  { category: "Akun", q: "Saya lupa kata sandi. Apa yang harus dilakukan?", a: "Buka halaman Masuk, pilih Lupa kata sandi, lalu masukkan email Anda. Kami mengirim link untuk membuat kata sandi baru." },
  { category: "Akun", q: "Email konfirmasi tidak masuk, bagaimana?", a: "Periksa folder spam, lalu gunakan tombol Kirim ulang email konfirmasi di halaman Masuk. Tunggu satu menit di antara percobaan." },
];

const contacts = [
  { icon: IconMail, title: "Email", text: "halo@ruangkita.id", note: "Dibalas dalam 1 hari kerja" },
  { icon: IconClock, title: "Jam layanan", text: "Senin – Sabtu", note: "09.00 – 17.00 WIB" },
  { icon: IconClipboard, title: "Status booking", text: "Cek di dashboard", note: "Jadwal dan pembayaran Anda" },
];

export default function HelpPage() {
  return (
    <>
      <section className="border-b border-line bg-paper">
        <div className="mx-auto max-w-6xl px-5 py-16 md:py-24">
          <nav className="text-sm text-muted" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-brand-700">Beranda</Link>
            <span className="mx-2 text-ink/30">/</span>
            <span className="text-ink">Bantuan</span>
          </nav>
          <SectionLabel className="mt-8">Pusat bantuan</SectionLabel>
          <h1 className="mt-4 max-w-3xl font-display text-5xl leading-[1] tracking-tight text-ink md:text-7xl">Ada yang bisa kami bantu?</h1>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-16 md:py-20">
        <FaqBrowser faqs={faqs} categories={categories} />
      </section>

      <section className="bg-paper-2">
        <div className="mx-auto max-w-6xl px-5 py-20">
          <SectionLabel index="A">Hubungi kami</SectionLabel>
          <h2 className="mt-4 font-display text-4xl tracking-tight text-ink md:text-5xl">Belum ketemu jawabannya?</h2>
          <div className="mt-12 grid gap-0 divide-y-2 divide-ink overflow-hidden rounded-md border-2 border-ink shadow-brut md:grid-cols-3 md:divide-x-2 md:divide-y-0">
            {contacts.map((c) => (
              <div key={c.title} className="bg-paper-2 p-8">
                <IconTile icon={c.icon} />
                <p className="mt-6 text-xs font-semibold uppercase tracking-[0.16em] text-muted">{c.title}</p>
                <p className="mt-1 text-xl font-semibold text-ink">{c.text}</p>
                <p className="mt-1 text-sm text-muted">{c.note}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Link href="/properties" className={btnPrimary}>Cari properti</Link>
            <Link href="/dashboard" className="text-sm font-semibold text-brand-800 underline decoration-accent-500 decoration-2 underline-offset-[6px]">Buka dashboard</Link>
          </div>
        </div>
      </section>
    </>
  );
}
