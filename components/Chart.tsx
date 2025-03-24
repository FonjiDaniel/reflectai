import { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import { getRelativePosition } from 'chart.js/helpers';

const ChartComponent = () => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (chartRef.current) {
      const ctx = chartRef.current.getContext("2d");

      // Destroy the previous chart instance if it exists
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }

      const labels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"];
      const data = {
        labels: labels,
        yAxisID: "WordCount",
        xAxisID: "Date",
        datasets: [{
          label: 'My First Dataset',
          data: [65, 59, 80, 81, 56, 55, 40],
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
          borderWidth: 1
        }]
      };

      chartInstance.current = new Chart(ctx, {
        type: 'bar',
        data: data,
        options: {
          onClick: (e) => {
            const canvasPosition = getRelativePosition(e, chartInstance.current);

            // Substitute the appropriate scale IDs
            const dataX = chartInstance.current.scales.x.getValueForPixel(canvasPosition.x);
            const dataY = chartInstance.current.scales.y.getValueForPixel(canvasPosition.y);

            console.log(`Clicked at: X=${dataX}, Y=${dataY}`);
          }
        }
      });
    }

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, []);

  return <canvas ref={chartRef} />;
};

export default ChartComponent;
