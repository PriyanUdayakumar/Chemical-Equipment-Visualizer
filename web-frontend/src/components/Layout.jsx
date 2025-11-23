import React, { useContext } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { ThemeContext } from '../App';

const Layout = () => {
    const { theme, toggleTheme } = useContext(ThemeContext);

    return (
        <div className={`flex h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100'}`}>
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Navbar toggleTheme={toggleTheme} theme={theme} />
                <main className={`flex-1 overflow-x-hidden overflow-y-auto ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-200'}`}>
                    <div className="container mx-auto px-6 py-8">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Layout;


