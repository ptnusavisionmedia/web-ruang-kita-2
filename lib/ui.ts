/**
 * Kelas bersama untuk tombol dan kolom isian (neo-brutalism lunak):
 * garis tinta 2px, bayangan keras tanpa blur, bergeser saat di-hover dan "menekan" saat diklik.
 */
const base =
  "inline-flex items-center justify-center gap-2 rounded-md border-2 border-ink px-5 py-3 text-sm font-bold shadow-brut-sm transition-all duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-brut active:translate-x-[3px] active:translate-y-[3px] active:shadow-none disabled:pointer-events-none disabled:opacity-50";

export const btnPrimary = `${base} bg-brand-700 text-white hover:bg-brand-600`;
export const btnGold = `${base} bg-accent-500 text-ink hover:bg-accent-400`;
export const btnOutline = `${base} bg-white text-ink hover:bg-accent-100`;
export const btnGhost = `${base} border-transparent bg-transparent text-ink shadow-none hover:bg-accent-100 hover:shadow-none`;

export const field =
  "w-full rounded-md border-2 border-ink bg-white px-4 py-3.5 text-[15px] text-ink outline-none transition-all duration-150 placeholder:text-muted/70 focus:-translate-y-px focus:shadow-brut-sm";
