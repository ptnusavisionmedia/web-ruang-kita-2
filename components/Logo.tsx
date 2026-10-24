import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function Logo({
  className,
  priority = false,
  light = false,
}: {
  className?: string;
  priority?: boolean;
  /** Versi putih untuk latar gelap. */
  light?: boolean;
}) {
  return (
    <Link href="/" className="inline-flex items-center" aria-label="RuangKita — beranda">
      <Image
        src={light ? "/ruangkita-logo-white.png" : "/ruangkita-logo.png"}
        alt="RuangKita"
        width={900}
        height={192}
        priority={priority}
        className={cn("h-9 w-auto", className)}
      />
    </Link>
  );
}
