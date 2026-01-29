// src/utils/validators.ts
export const clientValidators = {
  name: /^[A-Za-z\s]{3,50}$/,
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone: /^[6-9]\d{9}$/,
  gst: /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/,
};
/* ================= VALIDATORS ================= */
export const userValidators = {
  username: /^[A-Za-z0-9_]{3,}$/,
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  password: /^.{6,}$/,
};