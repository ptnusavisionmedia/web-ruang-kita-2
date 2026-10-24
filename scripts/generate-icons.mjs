// Mengubah assets/icons/*.svg menjadi komponen React di components/icons/index.tsx.
// Jalankan: npm run icons   (setiap kali SVG di assets/icons diubah atau ditambah)
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const srcDir = path.join(root, "assets", "icons");
const outFile = path.join(root, "components", "icons", "index.tsx");

const pascal = (s) => s.split("-").map((p) => p[0].toUpperCase() + p.slice(1)).join("");

const files = fs.readdirSync(srcDir).filter((f) => f.endsWith(".svg")).sort();
const entries = files.map((f) => {
  const name = f.replace(/\.svg$/, "");
  const raw = fs.readFileSync(path.join(srcDir, f), "utf8");
  let inner = raw.replace(/^[\s\S]*?<svg[^>]*>/, "").replace(/<\/svg>\s*$/, "").trim();

  inner = inner
    .replace(/stroke-width=/g, "strokeWidth=")
    .replace(/stroke-linecap=/g, "strokeLinecap=")
    .replace(/stroke-linejoin=/g, "strokeLinejoin=")
    // warna utama mengikuti `color` CSS (text-brand-700 dst), aksen emas bisa diganti lewat --icon-accent
    .replace(/#104437/gi, "currentColor")
    .replace(/#D2A34F/gi, "var(--icon-accent, #D2A34F)")
    // ketebalan garis utama dapat diatur lewat prop strokeWidth
    .replace(/(<g[^>]*?)strokeWidth="2"/, "$1strokeWidth={strokeWidth}")
    // elemen yang boleh diisi saat prop `filled` aktif (mis. bookmark tersimpan)
    .replace(/data-fill="1"/g, 'fill={filled ? "currentColor" : "none"}');

  return { name, component: `Icon${pascal(name)}`, inner };
});

const body = entries
  .map(
    (e) => `export function ${e.component}({ size = 24, strokeWidth = 2, filled, ...props }: IconProps) {
  return (
    <svg viewBox="0 0 32 32" width={size} height={size} fill="none" aria-hidden="true" focusable="false" data-filled={filled ? true : undefined} {...props}>
      ${e.inner.replace(/\n\s*/g, "\n      ")}
    </svg>
  );
}`,
  )
  .join("\n\n");

const map = entries.map((e) => `  "${e.name}": ${e.component},`).join("\n");

const out = `// BERKAS OTOMATIS — jangan diedit manual.
// Sumber: assets/icons/*.svg  ·  Perbarui dengan: npm run icons
import type { ComponentType, SVGProps } from "react";

export type IconProps = Omit<SVGProps<SVGSVGElement>, "ref"> & {
  size?: number | string;
  strokeWidth?: number;
  /** Mengisi bentuk utama (dipakai ikon bookmark). */
  filled?: boolean;
};

export type IconComponent = ComponentType<IconProps>;

${body}

export const icons = {
${map}
} as const satisfies Record<string, IconComponent>;

export type IconName = keyof typeof icons;
`;

fs.mkdirSync(path.dirname(outFile), { recursive: true });
fs.writeFileSync(outFile, out);
console.log(`Menghasilkan ${entries.length} ikon -> ${path.relative(root, outFile)}`);
