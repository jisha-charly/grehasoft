import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
);

interface Props {
  notStarted: number;
  inProgress: number;
  completed: number;
}

const ProjectStatusChart = ({
  notStarted,
  inProgress,
  completed,
}: Props) => {
  const data = {
    labels: ["Not Started", "In Progress", "Completed"],
    datasets: [
      {
        label: "Projects",
        data: [notStarted, inProgress, completed],
        backgroundColor: ["#6366f1", "#22c55e", "#f97316"],
        borderRadius: 8,
        barThickness: 40,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
      },
    },
  };

  return (
    <div className="chart-card">
      <h3>Project Status</h3>
      <div style={{ height: "260px" }}>
        <Bar data={data} options={options} />
      </div>
    </div>
  );
};

export default ProjectStatusChart;
