import api from "../axios";

/* =========================
   UPDATE PROFILE
========================= */
export const updateProfile = (data: {
  username?: string;
  email?: string;
}) => {
  return api.put("/profile/update/", data);
};

/* =========================
   CHANGE PASSWORD
========================= */
export const changePassword = (data: {
  old_password: string;
  new_password: string;
}) => {
  return api.post("/profile/change-password/", data);
};
