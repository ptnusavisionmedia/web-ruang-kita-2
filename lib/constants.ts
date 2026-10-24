export const PROPERTY_TYPES = ["Kos Putra", "Kos Putri", "Kos Campur", "Apartemen", "Rumah"] as const;

/** Biaya booking tetap (Rp). Nominal sebenarnya dihitung ulang di server. */
export const BOOKING_FEE = 150000;

export const PAYMENT_METHODS = {
  bank_transfer: "Transfer Bank",
  e_wallet: "E-Wallet",
  virtual_account: "Virtual Account",
} as const;

export const PAYMENT_TYPES = {
  booking_fee: "Biaya booking",
  rent_deposit: "DP sewa (1 bulan)",
} as const;

export const PAYMENT_STATUS_LABEL = {
  pending: "Menunggu",
  paid: "Berhasil",
  failed: "Gagal",
  expired: "Kedaluwarsa",
} as const;

export const BOOKING_STATUS_LABEL = {
  pending: "Menunggu konfirmasi",
  confirmed: "Terjadwal",
  completed: "Selesai",
  cancelled: "Dibatalkan",
} as const;
