import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { ThemeContext } from '../App';

const Sidebar = () => {
    const { theme } = useContext(ThemeContext);

    const linkClasses = `flex items-center px-4 py-2 mt-2 rounded-md transition-colors duration-200 ${
        theme === 'dark' 
            ? 'text-gray-300 hover:bg-gray-700' 
            : 'text-gray-600 hover:bg-gray-200'
    }`;
    const activeLinkClasses = theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-700';


    return (
        <div className={`flex flex-col w-64 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} border-r ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
            <div className={`flex items-center justify-center h-16 ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100'}`}>
                <h1 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>Menu</h1>
            </div>
            <div className="flex flex-col flex-1 overflow-y-auto">
                <nav className="flex-1 px-2 py-4">
                    <NavLink 
                        to="/dashboard" 
                        className={({ isActive }) => isActive ? `${linkClasses} ${activeLinkClasses}` : linkClasses}
                    >
                        Dashboard
                    </NavLink>
                    <NavLink 
                        to="/upload" 
                        className={({ isActive }) => isActive ? `${linkClasses} ${activeLinkClasses}` : linkClasses}
                    >
                        Upload CSV
                    </NavLink>
                    <NavLink 
                        to="/table-view" 
                        className={({ isActive }) => isActive ? `${linkClasses} ${activeLinkClasses}` : linkClasses}
                    >
                        Table View
                    </NavLink>
                    <NavLink 
                        to="/history" 
                        className={({ isActive }) => isActive ? `${linkClasses} ${activeLinkClasses}` : linkClasses}
                    >
                        History
                    </NavLink>
                </nav>
            </div>
        </div>
    );
};

export default Sidebar;

