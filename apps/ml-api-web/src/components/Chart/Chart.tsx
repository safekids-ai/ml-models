import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { DoughnutChartProps } from './Chart.type';

const DoughnutChart = ({ chartLabel, chartData }: DoughnutChartProps) => {

    const data = {
        labels: chartLabel,
        datasets: [
            {
                data: chartData,
                backgroundColor: ['#0BAD37', '#FA6400', '#D52B4A'],
                borderColor: ['#ffffff', '#ffffff', '#ffffff'],
                borderWidth: 1.5,
            },
        ],
    };

    const options = {
        maintainAspectRatio: true,
        responsive: true,
        cutoutPercentage: 70,
        legend: {
            display: true,
            position: 'bottom',
            labels: {
                fontColor: '#282828',
                fontStyle: 'bold',
                usePointStyle: true,
                pointStyle: 'cross',
                boxWidth: 6,
                padding: 24,
            },
        },
    };

    return <Doughnut data={data} options={options} />;
};

export default DoughnutChart;
