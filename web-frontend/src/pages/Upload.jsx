import React, { useCallback, useContext } from 'react';
import { useDropzone } from 'react-dropzone';
import apiClient from '../api/apiClient';
import toast from 'react-hot-toast';
import { ThemeContext, DataContext } from '../App';

const Upload = () => {
    const { theme } = useContext(ThemeContext);
    const { setDataUpdated } = useContext(DataContext);

    const onDrop = useCallback(async (acceptedFiles) => {
        const file = acceptedFiles[0];
        const formData = new FormData();
        formData.append('file', file);

        const toastId = toast.loading('Uploading file...');

        try {
            await apiClient.post('/upload-csv/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            toast.success('File uploaded successfully!', { id: toastId });
            setDataUpdated(prev => !prev);
        } catch (error) {
            toast.error('Error uploading file.', { id: toastId });
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: {'text/csv': ['.csv']} });

    return (
        <div className="container mx-auto p-4">
            <div {...getRootProps()} className={`p-10 border-4 border-dashed rounded-lg text-center cursor-pointer transition-colors ${isDragActive ? 'border-indigo-600 bg-indigo-100 dark:bg-indigo-900' : 'border-gray-300 dark:border-gray-600'} ${theme === 'dark' ? 'text-gray-300' : ''}`}>
                <input {...getInputProps()} type="file" />
                {isDragActive ? (
                    <p className="text-indigo-600 dark:text-indigo-400">Drop the files here ...</p>
                ) : (
                    <p>Drag 'n' drop a CSV file here, or click to select files</p>
                )}
            </div>
        </div>
    );
};

export default Upload;
