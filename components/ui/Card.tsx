
import React from 'react';

interface CardProps {
  title: string;
  children: React.ReactNode;
}

const Card: React.FC<CardProps> = ({ title, children }) => {
  return (
    <div className="bg-gray-800 rounded-lg shadow-xl overflow-hidden">
      <div className="p-5 border-b border-gray-700">
        <h2 className="text-xl font-semibold text-white">{title}</h2>
      </div>
      <div className="p-5">
        {children}
      </div>
    </div>
  );
};

export default Card;
