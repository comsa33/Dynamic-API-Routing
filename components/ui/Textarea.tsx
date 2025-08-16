
import React from 'react';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
}

const Textarea: React.FC<TextareaProps> = ({ label, ...props }) => {
  return (
    <div>
      {label && <label className="block text-sm font-medium text-gray-300 mb-1">{label}</label>}
      <textarea
        className="block w-full bg-gray-900 border-gray-600 text-white placeholder-gray-500 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 sm:text-sm font-mono"
        {...props}
      />
    </div>
  );
};

export default Textarea;
