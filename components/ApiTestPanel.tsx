import React, { useState, useMemo } from 'react';
import { ManagedApi } from '../types';
import { apiManagementService } from '../services/apiManagementService';
import Card from './ui/Card';
import Input from './ui/Input';
import Textarea from './ui/Textarea';
import Button from './ui/Button';
import LoadingSpinner from './LoadingSpinner';

interface ApiTestPanelProps {
  api: ManagedApi;
}

interface TestResult {
    status: number;
    statusText: string;
    headers: Record<string, string>;
    body: string;
}

const ApiTestPanel: React.FC<ApiTestPanelProps> = ({ api }) => {
  const [pathParams, setPathParams] = useState<Record<string, string>>({});
  const [queryParams, setQueryParams] = useState<Record<string, string>>({});
  const [headers, setHeaders] = useState<Record<string, string>>({});
  const [body, setBody] = useState(api.spec.requestBody || '');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<TestResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const pathParamKeys = useMemo(() => {
    return (api.spec.endpoint.match(/{(\w+)}/g) || []).map(key => key.slice(1, -1));
  }, [api.spec.endpoint]);

  const handleParamChange = (
    setter: React.Dispatch<React.SetStateAction<Record<string, string>>>, 
    key: string, 
    value: string
  ) => {
    setter(prev => ({...prev, [key]: value}));
  };

  const handleTest = async () => {
    setIsLoading(true);
    setResult(null);
    setError(null);
    try {
        const response = await apiManagementService.testApi({
            api,
            pathParams,
            queryParams,
            headers,
            body
        });
        setResult(response);
    } catch(err) {
        setError(err instanceof Error ? err.message : 'Testing failed');
    } finally {
        setIsLoading(false);
    }
  }

  const getStatusColor = (status: number) => {
    if (status >= 500) return 'text-red-400';
    if (status >= 400) return 'text-orange-400';
    if (status >= 300) return 'text-yellow-400';
    if (status >= 200) return 'text-green-400';
    return 'text-gray-400';
  }

  return (
    <div className="space-y-6">
        <Card title={`Test Endpoint: ${api.spec.method} /api/user${api.spec.endpoint}`}>
            <div className="space-y-4">
                {pathParamKeys.length > 0 && (
                    <div>
                        <h4 className="font-semibold text-gray-300 mb-2">Path Parameters</h4>
                        {pathParamKeys.map(key => (
                            <Input key={key} label={key} placeholder={`Value for {${key}}`} onChange={e => handleParamChange(setPathParams, key, e.target.value)} className="mb-2"/>
                        ))}
                    </div>
                )}
                {api.spec.queryParams.length > 0 && (
                     <div>
                        <h4 className="font-semibold text-gray-300 mb-2">Query Parameters</h4>
                        {api.spec.queryParams.map(qp => (
                             <Input key={qp.key} label={qp.key} placeholder={qp.value} onChange={e => handleParamChange(setQueryParams, qp.key, e.target.value)} className="mb-2"/>
                        ))}
                    </div>
                )}
                 {api.spec.requestHeaders.length > 0 && (
                     <div>
                        <h4 className="font-semibold text-gray-300 mb-2">Request Headers</h4>
                        {api.spec.requestHeaders.map(h => (
                             <Input key={h.key} label={h.key} placeholder={h.value} onChange={e => handleParamChange(setHeaders, h.key, e.target.value)} className="mb-2"/>
                        ))}
                    </div>
                )}
                {(api.spec.method === 'POST' || api.spec.method === 'PUT' || api.spec.method === 'PATCH') && (
                     <div>
                        <Textarea label="Request Body" value={body} onChange={e => setBody(e.target.value)} rows={6} />
                    </div>
                )}
                <div className="flex justify-end pt-2">
                    <Button onClick={handleTest} disabled={isLoading}>
                        {isLoading ? 'Sending...' : 'Send Request'}
                    </Button>
                </div>
            </div>
        </Card>
        
        {isLoading && <div className="flex justify-center p-4"><LoadingSpinner/></div>}
        {error && <div className="p-4 bg-red-900/50 text-red-300 rounded-lg">{error}</div>}

        {result && (
            <Card title="Response">
                 <div className="mb-4">
                    <span className="font-semibold">Status:</span>
                    <span className={`ml-2 font-bold ${getStatusColor(result.status)}`}>{result.status} {result.statusText}</span>
                </div>
                <div>
                    <h4 className="font-semibold text-gray-300 mb-2 border-b border-gray-700 pb-1">Response Body</h4>
                    <pre className="p-4 bg-gray-900 rounded-md text-sm overflow-x-auto text-left text-teal-300">
                        <code>{result.body}</code>
                    </pre>
                </div>
                 <div className="mt-4">
                    <h4 className="font-semibold text-gray-300 mb-2 border-b border-gray-700 pb-1">Response Headers</h4>
                    <pre className="p-4 bg-gray-900 rounded-md text-sm overflow-x-auto text-left text-gray-400">
                        <code>{JSON.stringify(result.headers, null, 2)}</code>
                    </pre>
                </div>
            </Card>
        )}
    </div>
  );
};

export default ApiTestPanel;
