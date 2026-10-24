import Link from "next/link";
import EmptyState from "@/components/EmptyState";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl px-5 py-24">
      <EmptyState
        title="Halaman tidak ditemukan"
        description="Properti atau halaman yang Anda cari tidak tersedia."
        action={
          <Link href="/properties" className="rounded-full bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-700">
            Cari properti
          </Link>
        }
      />
    </div>
  );
}
