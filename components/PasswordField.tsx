"use client";

import { useId, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { IconKey } from "@/components/icons";
import { field } from "@/lib/ui";
import { cn } from "@/lib/utils";


export default function PasswordField({
  name,
  label,
  autoComplete,
  error,
  value,
  onChange,
}: {
  name: string;
  label: string;
  autoComplete: string;
  error?: string;
  value: string;
  onChange: (v: string) => void;
}) {
  const id = useId();
  const [visible, setVisible] = useState(false);

  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm font-medium text-ink">{label}</label>
      <div className="relative">
        <IconKey size={22} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-700" />
        <input
          id={id}
          name={name}
          type={visible ? "text" : "password"}
          autoComplete={autoComplete}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-err` : undefined}
          className={cn(field, "pl-12 pr-12", error && "!border-red-600")}
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-muted hover:text-ink"
        >
          {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
      {error && <p id={`${id}-err`} className="mt-1.5 text-xs text-red-700">{error}</p>}
    </div>
  );
}
