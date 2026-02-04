import { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Line, Doughnut } from "react-chartjs-2";
import { getDashboardAnalytics } from "../../src/api/services/dashboardService";
import "../css/Dashboard.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    getDashboardAnalytics()
      .then(setData)
      .catch(() => {});
  }, []);

  if (!data) return <p className="text-light">Loading...</p>;

  const taskChart = {
    labels: ["To Do", "In Progress", "Done"],
    datasets: [
      {
        data: [
          data.tasks_todo,
          data.tasks_in_progress,
          data.tasks_done,
        ],
        backgroundColor: ["#6366f1", "#22d3ee", "#22c55e"],
      },
    ],
  };

  const projectChart = {
    labels: ["Projects"],
    datasets: [
      {
        label: "Projects Overview",
        data: [
          data.total_projects,
          data.ongoing_projects,
          data.completed_projects,
        ],
        borderColor: "#22d3ee",
        backgroundColor: "rgba(34,211,238,0.2)",
        tension: 0.4,
      },
    ],
  };

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">Dashboard</h2>

      {/* ===== STAT CARDS ===== */}
      <div className="stat-grid">
        <div className="stat-card purple">
          <h6>Total Projects</h6>
          <h2>{data.total_projects}</h2>
        </div>

        <div className="stat-card blue">
          <h6>Ongoing Projects</h6>
          <h2>{data.ongoing_projects}</h2>
        </div>

        <div className="stat-card green">
          <h6>Active Clients</h6>
          <h2>{data.active_clients}</h2>
        </div>

        <div className="stat-card pink">
          <h6>Total Tasks</h6>
          <h2>{data.total_tasks}</h2>
        </div>
      </div>

      {/* ===== CHARTS ===== */}
      <div className="chart-grid">
        <div className="chart-card">
          <h6>Projects Overview</h6>
          <Line data={projectChart} />
        </div>

        <div className="chart-card">
          <h6>Task Status</h6>
          <Doughnut data={taskChart} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
