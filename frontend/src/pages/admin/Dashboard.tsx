import "../../css/Dashboard.css";
import TaskStatusChart from "../../components/charts/TaskStatusChart";
import ProjectStatusChart from "../../components/charts/ProjectStatusChart";

const Dashboard = () => {
  return (
    <div className="dashboard">
      <h1 className="dashboard-title">Dashboard</h1>

      {/* STATS CARDS */}
      <div className="stats-grid">
        <div className="stat-card purple">
          <p>Total Projects</p>
          <h2>12</h2>
        </div>

        <div className="stat-card blue">
          <p>Ongoing Projects</p>
          <h2>5</h2>
        </div>

        <div className="stat-card pink">
          <p>Active Clients</p>
          <h2>8</h2>
        </div>

        <div className="stat-card green">
          <p>Total Tasks</p>
          <h2>42</h2>
        </div>
      </div>

      {/* CHARTS */}
      <div className="charts-grid">
        <TaskStatusChart />
    <ProjectStatusChart
    notStarted={7}
    inProgress={3}
    completed={2}
  />
</div>

    </div>
  );
};

export default Dashboard;
