import React from 'react';

const Navbar = ({ toggleTheme, theme }) => {
    return (
        <header className={`flex justify-between items-center py-4 px-6 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} border-b-4 ${theme === 'dark' ? 'border-indigo-500' : 'border-indigo-600'}`}>
            <div className="flex items-center">
                <h2 className={`text-2xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>Chemical Equipment Visualizer</h2>
            </div>
            <div className="flex items-center">
                <button onClick={toggleTheme} className="mr-4 text-gray-500 hover:text-gray-600 focus:outline-none font-semibold">
                    {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
                </button>
                <button className={`text-gray-500 hover:text-gray-600 focus:outline-none focus:text-gray-600 ${theme === 'dark' ? 'text-gray-300' : ''}`}>
                    Logout
                </button>
            </div>
        </header>
    );
};

export default Navbar;


