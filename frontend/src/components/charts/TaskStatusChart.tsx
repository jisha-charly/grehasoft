import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

/* ================= TYPES ================= */
interface Props {
  todo: number;
  inProgress: number;
  done: number;
}

const TaskStatusChart = ({ todo, inProgress, done }: Props) => {
  const data = {
    labels: ["To Do", "In Progress", "Done"],
    datasets: [
      {
        data: [todo, inProgress, done],
        backgroundColor: [
          "#6366f1", // purple
          "#22c55e", // green
          "#f97316", // orange
        ],
        borderWidth: 0,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
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

      {/* FIX SIZE */}
      <div style={{ height: 280 }}>
        <Doughnut data={data} options={options} />
      </div>
    </div>
  );
};

export default TaskStatusChart;
