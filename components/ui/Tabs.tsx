import React from 'react';

interface TabsProps {
  activeView: 'generator' | 'manager';
  onViewChange: (view: 'generator' | 'manager') => void;
}

const Tabs: React.FC<TabsProps> = ({ activeView, onViewChange }) => {
  const tabs = [
    { id: 'generator', label: 'API Generator' },
    { id: 'manager', label: 'API Manager' },
  ];

  return (
    <div className="bg-gray-700 p-1 rounded-lg flex space-x-1">
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => onViewChange(tab.id as 'generator' | 'manager')}
          className={`px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 focus:outline-none ${
            activeView === tab.id
              ? 'bg-teal-500 text-white shadow'
              : 'text-gray-300 hover:bg-gray-600'
          }`}
          aria-current={activeView === tab.id ? 'page' : undefined}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default Tabs;
