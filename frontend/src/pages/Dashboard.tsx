import { useEffect, useState } from "react";
import { getDashboardAnalytics } from "../../src/api/services/dashboardService";

const Dashboard = () => {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    getDashboardAnalytics().then(setData);
  }, []);

  if (!data) return <p>Loading...</p>;

  return (
    <div className="grid grid-cols-4 gap-4">
      <div className="card">Total Projects: {data.total_projects}</div>
      <div className="card">Ongoing Projects: {data.ongoing_projects}</div>
      <div className="card">Completed Projects: {data.completed_projects}</div>

      <div className="card">Active Clients: {data.active_clients}</div>
      <div className="card">Total Clients: {data.total_clients}</div>

      <div className="card">Users: {data.total_users}</div>

      <div className="card">Tasks To Do: {data.tasks_todo}</div>
      <div className="card">Tasks In Progress: {data.tasks_in_progress}</div>
      <div className="card">Tasks Done: {data.tasks_done}</div>
    </div>
  );
};

export default Dashboard;
