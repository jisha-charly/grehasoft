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

export const isAuthenticated = () => {
  const token = localStorage.getItem("access");
  if (!token) return false;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp > now) return true;
    // expired -> cleanup
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    localStorage.removeItem("username");
    return false;
  } catch {
    return false;
  }
};

export const logout = () => {
  localStorage.removeItem("access");
  localStorage.removeItem("refresh");
  localStorage.removeItem("username");
};
