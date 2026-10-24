"use client";

import { useState, useTransition } from "react";
import { cancelBooking } from "@/app/actions/bookings";
import Modal from "./Modal";
import { useToast } from "./Toast";

export default function CancelBookingButton({ bookingId }: { bookingId: string }) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const toast = useToast();

  function confirm() {
    startTransition(async () => {
      const res = await cancelBooking(bookingId);
      setOpen(false);
      toast(res.ok ? "Booking dibatalkan" : (res.message ?? "Gagal membatalkan"), res.ok ? "success" : "info");
    });
  }

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className="text-sm font-medium text-muted hover:text-ink hover:underline">
        Batalkan
      </button>
      <Modal open={open} title="Batalkan booking?" confirmLabel="Ya, batalkan" cancelLabel="Tidak" loading={pending} onClose={() => setOpen(false)} onConfirm={confirm}>
        Jadwal survei ini akan dibatalkan dan slot waktunya dibuka kembali.
      </Modal>
    </>
  );
}
