import { useEffect, useState } from "react";
import "../../css/Dashboard.css";

import TaskStatusChart from "../../components/charts/TaskStatusChart";
import ProjectStatusChart from "../../components/charts/ProjectStatusChart";

import { getDashboardAnalytics } from "../../api/services/dashboardService";
import type { DashboardStats } from "../../types/dashboard";

const Dashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const data = await getDashboardAnalytics();
        setStats(data);
      } catch (error) {
        console.error("Dashboard API error:", error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  if (loading) return <p>Loading dashboard...</p>;
  if (!stats) return <p>Failed to load dashboard</p>;

  return (
    <div className="dashboard">
      <h1 className="dashboard-title">Dashboard</h1>

      {/* ===== STATS CARDS ===== */}
      <div className="stats-grid">
        <div className="stat-card purple">
          <p>Total Projects</p>
          <h2>{stats.total_projects}</h2>
        </div>

        <div className="stat-card blue">
          <p>Ongoing Projects</p>
          <h2>{stats.projects_in_progress}</h2>
        </div>

        <div className="stat-card pink">
          <p>Active Clients</p>
          <h2>{stats.active_clients}</h2>
        </div>

        <div className="stat-card green">
          <p>Total Tasks</p>
          <h2>{stats.total_tasks}</h2>
        </div>
      </div>

      {/* ===== CHARTS ===== */}
      <div className="charts-grid">
        <TaskStatusChart
          todo={stats.tasks_todo}
          inProgress={stats.tasks_in_progress}
          done={stats.tasks_done}
        />

        <ProjectStatusChart
          notStarted={stats.projects_not_started}
          inProgress={stats.projects_in_progress}
          completed={stats.projects_completed}
        />
      </div>
    </div>
  );
};

export default Dashboard;
