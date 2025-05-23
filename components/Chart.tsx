"use client";

import { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";
import { getUserWritingStats } from "@/lib/actions/library";
import { useMyAuth } from "@/hooks/useAuth";
import { WritingStats } from "@/types";

const ChartComponent = () => {
  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstance = useRef <Chart | null >(null);
  const [stat, setStat] = useState<WritingStats[]>([]);
  const { user, token } = useMyAuth();
  const [loadingData, setLoadingData] = useState(false);
  

  useEffect(() => {
    const getStats = async () => {
      try {
        setLoadingData(true)
        const stats = await getUserWritingStats(token!);
        if (!stats) {
          console.error("Invalid stats response:", stats);
          return;
        }
         setLoadingData(false)
        setStat(stats);

      } catch (error) {
        console.error("Error fetching user stats:", error);
        setLoadingData(false);
      }
    };

    getStats();
  }, [token, user?.id]);

  useEffect(() => {
    if (chartRef.current && stat.length > 0) {
      const ctx = chartRef.current.getContext("2d");
      if (!ctx) return; 

  // destroy the chartInstance if it already exists
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }

      const labels = stat.map((item) => {
        const date = new Date(item.entry_date);
        return !isNaN(date.getTime()) ? date.toLocaleDateString() : "Invalid Date";
      });
      const dataValues = stat.map((item) => item.word_count);

      chartInstance.current = new Chart(ctx, {
        type: "bar",
        data: {
          labels: labels,
          datasets: [
            {
              label: "Daily writing stats",
              data: dataValues,
              backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(255, 159, 64, 0.2)',
                'rgba(255, 205, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(201, 203, 207, 0.2)'
              ],
              borderColor: [
                'rgb(255, 99, 132)',
                'rgb(255, 159, 64)',
                'rgb(255, 205, 86)',
                'rgb(75, 192, 192)',
                'rgb(54, 162, 235)',
                'rgb(153, 102, 255)',
                'rgb(201, 203, 207)'
              ],
              borderWidth: 1,
              barThickness: 30
            },
          ],
        },
        options: {
          responsive: true,
          scales: {
            x: {
              title: {
                display: true,
                text: "Date",
              },
            },
            y: {
              title: {
                display: true,
                text: "Word Count",
              },
              beginAtZero: true,
            },
          },
        },
      });
    }

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [stat]);

  return  loadingData ?  <div className="text-brand">Loading..</div> : stat.length>0 &&  <canvas ref={chartRef} />
};

export default ChartComponent;
