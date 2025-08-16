
import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  prefix?: string;
}

const Input: React.FC<InputProps> = ({ label, prefix, ...props }) => {
  return (
    <div className="w-full">
      {label && <label className="block text-sm font-medium text-gray-300 mb-1">{label}</label>}
      <div className="flex rounded-md shadow-sm">
        {prefix && (
          <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-600 bg-gray-700 text-gray-400 text-sm">
            {prefix}
          </span>
        )}
        <input
          className={`block w-full bg-gray-900 border-gray-600 text-white placeholder-gray-500 focus:ring-teal-500 focus:border-teal-500 sm:text-sm ${prefix ? 'rounded-r-md' : 'rounded-md'}`}
          {...props}
        />
      </div>
    </div>
  );
};

export default Input;
