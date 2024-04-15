import React, { useState, useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import { useLocation } from 'react-router-dom';

function Graph() {
  const location = useLocation();

  if (!location.state) {
    return <div>Error: Location state is not available</div>;
  }

  const { username, repoName } = location.state;
  const chartRef = useRef(null);
  const [chartImage, setChartImage] = useState(null);
  const chartInstanceRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`https://api.github.com/repos/${username}/${repoName}/stats/commit_activity`);
        if (!response.ok) {
          throw new Error('Failed to fetch commit activity');
        }
        const data = await response.json();
        createChart(data);
      } catch (error) {
        console.error('Error fetching commit activity:', error);
      }
    };

    const createChart = (commitData) => {
      const ctx = chartRef.current.getContext('2d');
      const chart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: commitData.map((weekData) => new Date(weekData.week * 1000).toLocaleDateString()),
          datasets: [{
            label: 'Commit Activity',
            data: commitData.map((weekData) => weekData.total),
            fill: false,
            borderColor: '#9A3412',
            tension: 0.1,
          }],
        },
      });

      // Export chart as image
      const exportChartAsImage = () => {
        const base64Image = chart.toBase64Image();
        setChartImage(base64Image);
      };

      exportChartAsImage();
      chartInstanceRef.current = chart;
    };

    fetchData();

    return () => {
      // Cleanup function
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, [username, repoName]);

  return (
    <div>
      <h1 className='font-bold text-lg'>Commit Activity Graph for {username}/{repoName}</h1>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <canvas ref={chartRef}></canvas>
      </div>
      {chartImage && (
        <div>
          <img src={chartImage} alt="Chart" />
        </div>
      )}
    </div>
  );
}

export default Graph;
