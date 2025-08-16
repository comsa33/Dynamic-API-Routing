
import React, { useState, useEffect } from 'react';

interface CodeDisplayProps {
  code: string;
  endpoint: string;
}

const CodeDisplay: React.FC<CodeDisplayProps> = ({ code, endpoint }) => {
  const [copyText, setCopyText] = useState('Copy');

  useEffect(() => {
    if (copyText === 'Copied!') {
      const timer = setTimeout(() => setCopyText('Copy'), 2000);
      return () => clearTimeout(timer);
    }
  }, [copyText]);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopyText('Copied!');
  };

  return (
    <div className="mt-10 bg-gray-800 rounded-xl shadow-2xl overflow-hidden animate-fade-in">
      <div className="p-4 bg-gray-700/50 border-b border-gray-600">
          <h3 className="text-xl font-bold text-white">Generated API Code</h3>
          <p className="text-sm text-gray-400 mt-1">
            Save this as a <code className="bg-gray-900 px-1 rounded">.py</code> file and add it to your FastAPI application's routers.
          </p>
          <div className="mt-3 bg-gray-900 rounded-md p-2 text-center">
            <span className="text-gray-400">Your new endpoint will be available at: </span>
            <code className="text-teal-400 font-mono text-sm break-all">
                {`{your_domain}/api/user${endpoint}`}
            </code>
          </div>
      </div>
      <div className="relative">
        <button
          onClick={handleCopy}
          className="absolute top-3 right-3 bg-gray-700 hover:bg-teal-500 text-white py-1 px-3 rounded-md text-sm transition-all duration-200"
        >
          {copyText}
        </button>
        <pre className="p-6 text-sm overflow-x-auto text-left">
          <code className="language-python font-mono whitespace-pre-wrap break-all">
            {code}
          </code>
        </pre>
      </div>
    </div>
  );
};

export default CodeDisplay;
