import type { Department } from "../types/department";

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


/* ================================
   COMMON TYPES
================================ */
export interface ValidationErrors {
  name?: string;
}

/* ================================
   DEPARTMENT VALIDATION
================================ */
export const validateDepartment = (
  name: string,
  departments: Department[],
  currentId?: number
): ValidationErrors => {
  const errors: ValidationErrors = {};

  const value = (name ?? "").trim();

  // Required
  if (value.length === 0) {
    errors.name = "Department name is required";
    return errors;
  }

  // Min length
  if (value.length < 3) {
    errors.name = "Department name must be at least 3 characters";
    return errors;
  }

  // Duplicate (case-insensitive)
  const exists = departments.some(
    (d) =>
      d.name.trim().toLowerCase() === value.toLowerCase() &&
      d.id !== currentId
  );

  if (exists) {
    errors.name = "Department already exists";
  }

  return errors;
};