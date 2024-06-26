import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  Tooltip,
} from "chart.js";

export const DirectPolling = () => {
  ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
  );
  const [tableData, setTableData] = useState([0, 0, 0, 0]);
  const [chartData, setChartData] = useState({
    labels: ["A", "B", "C", "D"],
    datasets: [
      {
        label: "My Data",
        data: tableData,
        backgroundColor: "rgba(255, 99, 132, 0.5)",
        borderWidth: 1,
      },
    ],
  });
  const options = {
    indexAxis: "y",
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Chart.js Bar Chart",
      },
    },
  };
  const handleHOTChange = (changes) => {
    const ans = tableData;
    ans[changes] = ans[changes] + 1;
    setTableData(ans);
  };
  useEffect(() => {
    const interval = setInterval(() => {
      const newData = {
        labels: chartData.labels,
        datasets: [
          {
            label: "My Data",
            data: tableData,
            backgroundColor: "rgba(255, 99, 132, 0.5)",
            borderWidth: 1,
          },
        ],
      };

      setChartData(newData);
    }, 2000);
    return () => clearInterval(interval);
  }, [tableData]);

  return (
    <div>
      <h2>Dynamic Bar Chart</h2>
      <Bar data={chartData} options={options} />
      <div className="p-4 bg-red">
        <button
          onClick={(e) => {
            handleHOTChange(0);
          }}
          className="mx-3 w-[20px] h-[10px]"
        >
          A
        </button>
        <button
          onClick={(e) => {
            handleHOTChange(1);
          }}
          className="mx-3 w-[20px] h-[10px]"
        >
          B
        </button>
        <button
          onClick={(e) => {
            handleHOTChange(2);
          }}
          className="mx-3 w-[20px] h-[10px]"
        >
          C
        </button>
        <button
          onClick={(e) => {
            handleHOTChange(3);
          }}
          className="mx-3 w-[20px] h-[10px]"
        >
          D
        </button>
      </div>
    </div>
  );
};

