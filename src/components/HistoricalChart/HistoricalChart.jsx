import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import axios from "axios";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { COINGECKO_API_URL } from "../../helpers/constants";
import axiosInstance from "../../helpers/axiosInstance";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function HistoricalChart({ coinId }) {
  let id = coinId;
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get(
          `/coins/${id}/market_chart?vs_currency=usd&days=10&interval=daily&precision=0`
        );

        if (response.data && response.data.prices) {
          const prices = response.data.prices || [];

          // Ensure prices array is not empty and contains expected data
          if (prices.length > 0 && prices[0].length === 2) {
            const labels = prices.map((price) =>
              new Date(price[0]).toLocaleDateString()
            );
            const data = prices.map((price) => price[1]);

            setChartData({
              labels: labels,
              datasets: [
                {
                  label: "Price Over Time",
                  data: prices.map((price) => price[1]),
                  borderColor: "rgba(75,192,192,1)",
                  backgroundColor: "rgba(75,192,192,0.2)",
                  fill: true,
                },
                {
                  label: "Market Cap Over Time",
                  data: response.data.market_caps.map(
                    (market_cap) => market_cap[1]
                  ),
                  borderColor: "rgba(153,102,255,1)",
                  backgroundColor: "rgba(153,102,255,0.2)",
                  fill: true,
                },
                {
                  label: "Total Volume Over Time",
                  data: response.data.total_volumes.map((volume) => volume[1]),
                  borderColor: "rgba(255,159,64,1)",
                  backgroundColor: "rgba(255,159,64,0.2)",
                  fill: true,
                },
              ],
            });
          } else {
            setError("Unexpected data format in prices array");
          }
        } else {
          setError("Invalid data format");
        }
      } catch (err) {
        setError("Error fetching historical data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h2 className="text-center">Data Chart Of Last 10 days</h2>
      {chartData ? <Line data={chartData} /> : <div>No data available</div>}
    </div>
  );
}

export default HistoricalChart;
