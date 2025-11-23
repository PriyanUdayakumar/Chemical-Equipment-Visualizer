import React, { useState, useEffect, useContext } from 'react';
import apiClient from '../api/apiClient';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import { ThemeContext, DataContext } from '../App';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const Dashboard = () => {
    const [summary, setSummary] = useState(null);
    const { theme } = useContext(ThemeContext);
    const { dataUpdated } = useContext(DataContext);

    useEffect(() => {
        const fetchSummary = async () => {
            try {
                const response = await apiClient.get('/summary/');
                setSummary(response.data);
            } catch (error) {
                console.error("Error fetching summary:", error);
            }
        };
        fetchSummary();
    }, [dataUpdated]);

    const chartOptions = {
        plugins: {
            legend: {
                labels: {
                    color: theme === 'dark' ? '#ECEFF4' : '#333',
                }
            }
        },
        scales: {
            x: {
                ticks: {
                    color: theme === 'dark' ? '#ECEFF4' : '#333',
                },
                grid: {
                    color: theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
                }
            },
            y: {
                ticks: {
                    color: theme === 'dark' ? '#ECEFF4' : '#333',
                },
                grid: {
                    color: theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
                }
            }
        }
    };
    
    const pieData = {
        labels: summary?.type_distribution ? Object.keys(summary.type_distribution) : [],
        datasets: [{
            data: summary?.type_distribution ? Object.values(summary.type_distribution) : [],
            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
        }],
    };

    const barData = {
        labels: ['Avg Flowrate', 'Avg Pressure', 'Avg Temperature'],
        datasets: [{
            label: 'Average Values',
            data: summary ? [summary.avg_flowrate || 0, summary.avg_pressure || 0, summary.avg_temperature || 0] : [],
            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
        }],
    };

    if (!summary) return <div className="text-center p-10">Loading...</div>;

    return (
        <div className="container mx-auto p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                <div className="bg-white dark:bg-gray-800 p-4 shadow rounded-lg text-center">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Total Equipment</h3>
                    <p className="text-2xl text-gray-900 dark:text-white">{summary.total_equipment}</p>
                </div>
                <div className="bg-white dark:bg-gray-800 p-4 shadow rounded-lg text-center">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Avg. Flowrate</h3>
                    <p className="text-2xl text-gray-900 dark:text-white">{(summary.avg_flowrate || 0).toFixed(2)}</p>
                </div>
                <div className="bg-white dark:bg-gray-800 p-4 shadow rounded-lg text-center">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Avg. Pressure</h3>
                    <p className="text-2xl text-gray-900 dark:text-white">{(summary.avg_pressure || 0).toFixed(2)}</p>
                </div>
                <div className="bg-white dark:bg-gray-800 p-4 shadow rounded-lg text-center">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Avg. Temperature</h3>
                    <p className="text-2xl text-gray-900 dark:text-white">{(summary.avg_temperature || 0).toFixed(2)}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="bg-white dark:bg-gray-800 p-4 shadow rounded-lg">
                    <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200">Equipment Type Distribution</h3>
                    <Pie data={pieData} options={chartOptions} />
                </div>
                <div className="bg-white dark:bg-gray-800 p-4 shadow rounded-lg">
                    <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200">Average Metrics</h3>
                    <Bar data={barData} options={chartOptions} />
                </div>
            </div>
        </div>
    );
};

export default Dashboard;


