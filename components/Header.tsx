import React from 'react';
import Tabs from './ui/Tabs';

interface HeaderProps {
    activeView: 'generator' | 'manager';
    onViewChange: (view: 'generator' | 'manager') => void;
}

const Header: React.FC<HeaderProps> = ({ activeView, onViewChange }) => {
  return (
    <header className="bg-gray-800 shadow-lg sticky top-0 z-40">
      <div className="container mx-auto px-4 py-5 max-w-6xl">
        <div className="flex flex-col sm:flex-row items-center justify-between">
          <div className="flex items-center space-x-3 mb-4 sm:mb-0">
            <svg className="w-10 h-10 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path>
            </svg>
            <h1 className="text-3xl font-bold text-white tracking-wider">
              Dynamic API <span className="text-teal-400">Studio</span>
            </h1>
          </div>
          <Tabs activeView={activeView} onViewChange={onViewChange} />
        </div>
      </div>
    </header>
  );
};

export default Header;
