// CryptoChart.js
import React from 'react';
import Chart from 'react-apexcharts';

function CryptoChart({ data }) {
  // Processing the data for chart rendering
  const chartData = {
    series: [
      {
        name: 'Price',
        data: data.map(item => ({
          x: new Date(item.time * 1000), // Convert timestamp to Date
          y: parseFloat(item.priceUsd),
        })),
      },
    ],
    options: {
      chart: {
        type: 'line', // You can change to 'candlestick' for candlestick charts
        height: 350,
      },
      title: {
        text: 'Bitcoin Price History',
        align: 'center',
      },
      xaxis: {
        type: 'datetime', // Show date/time on X-axis
      },
      yaxis: {
        title: {
          text: 'Price (USD)',
        },
        decimalsInFloat: 2, // Limit decimals to 2
      },
      tooltip: {
        x: {
          format: 'dd MMM yyyy HH:mm',
        },
        y: {
          formatter: (value) => `$${value.toFixed(2)}`, // Format price
        },
      },
    },
  };

  return <Chart options={chartData.options} series={chartData.series} type="line" height={350} />;
}

export default CryptoChart;
