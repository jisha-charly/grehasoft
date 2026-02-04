import api from "../axios";

export const getDashboardAnalytics = async () => {
  const res = await api.get("/api/dashboard/analytics/");
  return res.data;
};
