import React, { useState, useEffect, useContext } from 'react';
import apiClient from '../api/apiClient'; // Use the configured apiClient
import toast from 'react-hot-toast';
import { ThemeContext } from '../App';
import { useNavigate } from 'react-router-dom';

const History = () => {
    const [history, setHistory] = useState([]);
    const { theme } = useContext(ThemeContext);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const response = await apiClient.get('/history/');
                setHistory(response.data);
            } catch (error) {
                console.error("Error fetching history:", error);
            }
        };
        fetchHistory();
    }, []);

    const handleDownloadPDF = async (id) => {
        try {
            const response = await apiClient.get(`/generate-pdf/${id}/`, {
                responseType: 'blob', // Important
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `summary_${id}.pdf`);
            document.body.appendChild(link);
            link.click();
            toast.success('PDF downloaded!');
        } catch (error) {
            toast.error('Error downloading PDF.');
        }
    };
    
    const handleDownloadExcel = async (id) => {
        try {
            const response = await apiClient.get(`/export-excel/${id}/`, {
                responseType: 'blob', // Important
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `dataset_${id}.xlsx`);
            document.body.appendChild(link);
            link.click();
            toast.success('Excel file downloaded!');
        } catch (error) {
            toast.error('Error downloading Excel file.');
        }
    };

    const handleViewTable = (id) => {
        navigate(`/table-view/${id}`);
    };

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200">Upload History</h2>
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
                <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                    {history.map(item => (
                        <li key={item.id} className="p-4 flex justify-between items-center">
                            <div>
                                <p className="font-semibold text-gray-900 dark:text-white">{item.file.split('/').pop()}</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Uploaded at: {new Date(item.uploaded_at).toLocaleString()}</p>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleViewTable(item.id)}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                                >
                                    View Table
                                </button>
                                <button
                                    onClick={() => handleDownloadPDF(item.id)}
                                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
                                >
                                    Download PDF
                                </button>
                                <button
                                    onClick={() => handleDownloadExcel(item.id)}
                                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
                                >
                                    Download Excel
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default History;
