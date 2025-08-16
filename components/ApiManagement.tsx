import React, { useState } from 'react';
import { ManagedApi } from '../types';
import ApiTestPanel from './ApiTestPanel';
import Card from './ui/Card';
import LoadingSpinner from './LoadingSpinner';
import ChevronRightIcon from './icons/ChevronRightIcon';
import TrashIcon from './icons/TrashIcon';

interface ApiManagementProps {
  apis: ManagedApi[];
  isLoading: boolean;
  onDelete: (apiId: string) => void;
  onRefresh: () => void;
}

const getMethodColor = (method: string) => {
    switch (method) {
        case 'GET': return 'text-sky-400';
        case 'POST': return 'text-green-400';
        case 'PUT': return 'text-yellow-400';
        case 'PATCH': return 'text-orange-400';
        case 'DELETE': return 'text-red-400';
        default: return 'text-gray-400';
    }
}

const ApiManagement: React.FC<ApiManagementProps> = ({ apis, isLoading, onDelete }) => {
  const [selectedApi, setSelectedApi] = useState<ManagedApi | null>(null);

  const handleDelete = (e: React.MouseEvent, apiId: string) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this API? This cannot be undone.')) {
        if (selectedApi?.id === apiId) {
            setSelectedApi(null);
        }
        onDelete(apiId);
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-1">
        <Card title="Deployed APIs">
            <div className="space-y-3 max-h-[70vh] overflow-y-auto">
                {isLoading && (
                    <div className="flex justify-center items-center p-8">
                        <LoadingSpinner />
                    </div>
                )}
                {!isLoading && apis.length === 0 && (
                    <div className="text-center text-gray-500 p-8">
                        <p className="font-semibold">No APIs Created Yet</p>
                        <p className="text-sm">Use the 'API Generator' to create your first endpoint.</p>
                    </div>
                )}
                {!isLoading && apis.map((api) => (
                    <div
                        key={api.id}
                        onClick={() => setSelectedApi(api)}
                        className={`p-4 rounded-lg cursor-pointer transition-all duration-200 flex items-center justify-between ${selectedApi?.id === api.id ? 'bg-teal-500/20 ring-2 ring-teal-500' : 'bg-gray-700/50 hover:bg-gray-700'}`}
                    >
                        <div>
                            <span className={`font-bold text-sm mr-2 ${getMethodColor(api.spec.method)}`}>
                                {api.spec.method}
                            </span>
                            <span className="font-mono text-sm break-all">/api/user{api.spec.endpoint}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                             <button
                                onClick={(e) => handleDelete(e, api.id)}
                                className="p-2 text-gray-500 hover:text-red-400 transition-colors rounded-full hover:bg-red-500/10"
                                aria-label={`Delete API ${api.spec.endpoint}`}
                            >
                                <TrashIcon />
                            </button>
                            <ChevronRightIcon className={`transition-transform ${selectedApi?.id === api.id ? 'translate-x-1' : ''}`} />
                        </div>
                    </div>
                ))}
            </div>
        </Card>
      </div>

      <div className="lg:col-span-2">
        {selectedApi ? (
          <ApiTestPanel key={selectedApi.id} api={selectedApi} />
        ) : (
          <div className="flex items-center justify-center h-full bg-gray-800 rounded-lg shadow-xl p-8">
             <div className="text-center text-gray-500">
                <p className="font-semibold text-lg">Select an API to test</p>
                <p>Choose an endpoint from the list on the left to start a test request.</p>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApiManagement;
