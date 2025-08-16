
import React from 'react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
}

const Select: React.FC<SelectProps> = ({ label, children, ...props }) => {
  return (
    <div>
      {label && <label className="block text-sm font-medium text-gray-300 mb-1">{label}</label>}
      <select
        className="block w-full bg-gray-900 border-gray-600 text-white rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 sm:text-sm py-2 px-3"
        {...props}
      >
        {children}
      </select>
    </div>
  );
};

export default Select;
