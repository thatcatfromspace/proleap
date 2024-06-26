import {
  Chart,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { useState } from "react";
import { Bar } from "react-chartjs-2";

export function PollingCharts({ questionOptions }) {
  Chart.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
  );
  const [votes, setVotes] = useState(null);

  const options = [];
  questionOptions.options.forEach((element) => {
    options.push(element.option);
  });

  // return votes && ()
  return (
    <div className="w-1/2 bg-inherit ms-2 rounded-md flex items-center p-2">
      <div className="w-full h-full flex items-center">
        <Bar
          data={{
            labels: options,
            datasets: [
              {
                label: questionOptions.question,
                data: [10, 15, 21, 16],
                borderWidth: 1,
                backgroundColor: "#0055F2",
              },
            ],
          }}
          options={{
            scales: {
              y: {
                beginAtZero: true,
              },
            },
          }}
        />
      </div>
    </div>
  );
}

export default PollingCharts;
