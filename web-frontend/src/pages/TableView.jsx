import React, { useState, useEffect, useContext } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import apiClient from '../api/apiClient'; // Use the configured apiClient
import { ThemeContext, DataContext } from '../App';
import { useParams } from 'react-router-dom';

const TableView = () => {
    const [rows, setRows] = useState([]);
    const [columns, setColumns] = useState([]);
    const { theme } = useContext(ThemeContext);
    const { dataUpdated } = useContext(DataContext);
    const { id } = useParams(); // Get ID from URL parameters

    useEffect(() => {
        const fetchData = async () => {
            try {
                let datasetIdToFetch = id;

                // If no ID is provided in the URL, fetch the latest ID from the summary
                if (!datasetIdToFetch) {
                    const summaryResponse = await apiClient.get('/summary/');
                    datasetIdToFetch = summaryResponse.data.summary?.id; // Access id from summary object
                }

                if (!datasetIdToFetch) {
                    setRows([]);
                    setColumns([]);
                    return; // Exit if no ID to fetch
                }

                const datasetResponse = await apiClient.get(`/dataset/${datasetIdToFetch}/`);
                
                if (datasetResponse.data && datasetResponse.data.length > 0) {
                    const data = datasetResponse.data;
                    const generatedColumns = Object.keys(data[0]).map(key => ({
                        field: key,
                        headerName: key.charAt(0).toUpperCase() + key.slice(1),
                        width: 150
                    }));
                    setColumns(generatedColumns);
                    const rowsWithIds = data.map((row, index) => ({ id: index, ...row }));
                    setRows(rowsWithIds);
                } else {
                    setRows([]);
                    setColumns([]);
                }
            } catch (error) {
                console.error("Error fetching data:", error);
                setRows([]);
                setColumns([]);
            }
        };

        fetchData();
    }, [dataUpdated, id]);
    
    const darkStyles = {
        color: '#ECEFF4',
        borderColor: '#3B4252',
        '& .MuiDataGrid-cell': {
            borderColor: '#3B4252',
        },
        '& .MuiDataGrid-columnHeaders': {
            backgroundColor: '#3B4252',
            borderColor: '#3B4252',
        },
        '& .MuiCheckbox-root': {
            color: '#81A1C1',
        },
        '& .MuiDataGrid-footerContainer': {
            borderColor: '#3B4252',
        },
        '& .MuiTablePagination-root': {
            color: '#ECEFF4',
        },
    };

    return (
        <div style={{ height: 600, width: '100%' }} className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow">
            <DataGrid
                rows={rows}
                columns={columns}
                pageSize={10}
                rowsPerPageOptions={[10]}
                checkboxSelection
                sx={theme === 'dark' ? darkStyles : {}}
            />
        </div>
    );
};

export default TableView;
