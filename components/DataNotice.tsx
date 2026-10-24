import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import EmptyState from "./EmptyState";

/** Pesan seragam bila query database gagal. */
export default function DataNotice({ error }: { error?: string | null }) {
  return (
    <EmptyState
      icon={<AlertTriangle className="h-6 w-6" />}
      title="Data tidak dapat dimuat"
      description={error ?? "Terjadi kesalahan. Coba muat ulang halaman."}
      action={
        <Link href="/" className="rounded-full border-2 border-ink px-5 py-2.5 text-sm font-semibold text-ink hover:bg-surface">
          Kembali ke beranda
        </Link>
      }
    />
  );
}
