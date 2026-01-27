export const isAdmin = () => {
  const token = localStorage.getItem("access");
  if (!token) return false;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.is_staff || payload.is_superuser;
  } catch {
    return false;
  }
};
