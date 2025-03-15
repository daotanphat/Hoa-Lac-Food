import React from 'react';
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
    Title
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(
    ArcElement,
    Tooltip,
    Legend,
    Title
);

const ShopStatusChart = () => {
    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom',
            },
            title: {
                display: true,
                text: 'Order Status Distribution'
            }
        }
    };

    const data = {
        labels: ['Completed Orders', 'Pending Orders', 'Cancelled Orders'],
        datasets: [
            {
                data: [65, 25, 10],
                backgroundColor: [
                    'rgba(16, 185, 129, 0.8)',
                    'rgba(245, 158, 11, 0.8)',
                    'rgba(239, 68, 68, 0.8)'
                ],
                borderColor: [
                    'rgba(16, 185, 129, 1)',
                    'rgba(245, 158, 11, 1)',
                    'rgba(239, 68, 68, 1)'
                ],
                borderWidth: 1,
            }
        ]
    };

    return (
        <div className="bg-gray-800 p-6 rounded-lg shadow-md h-[400px]">
            <Doughnut options={options} data={data} />
        </div>
    );
};

export default ShopStatusChart;
