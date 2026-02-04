import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

const TaskStatusChart = () => {
  // ✅ CHART DATA
  const data = {
    labels: ["To Do", "In Progress", "Done"],
    datasets: [
      {
        data: [12, 8, 22], // temporary values
        backgroundColor: [
          "#6366f1", // purple
          "#22c55e", // green
          "#f97316", // orange
        ],
        borderWidth: 0,
      },
    ],
  };

  // ✅ ADD OPTIONS HERE (THIS IS THE ANSWER)
  const options = {
    responsive: true,
    maintainAspectRatio: false, // 🔑 THIS FIXES THE HUGE CHART
    plugins: {
      legend: {
        position: "bottom" as const,
      },
    },
    cutout: "70%",
  };

  return (
    <div className="chart-card">
      <h3>Task Status</h3>

      {/* ✅ options passed HERE */}
      <Doughnut data={data} options={options} />
    </div>
  );
};

export default TaskStatusChart;
