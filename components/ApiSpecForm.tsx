import React, { useState } from 'react';
import type { ApiSpec, KeyValuePair } from '../types';
import Card from './ui/Card';
import Input from './ui/Input';
import Select from './ui/Select';
import Textarea from './ui/Textarea';
import Button from './ui/Button';
import PlusIcon from './icons/PlusIcon';
import TrashIcon from './icons/TrashIcon';

interface ApiSpecFormProps {
  onGenerate: (spec: ApiSpec) => void;
  isLoading: boolean;
}

const KeyValueInput: React.FC<{
  title: string;
  pairs: KeyValuePair[];
  setPairs: (pairs: KeyValuePair[]) => void;
  keyPlaceholder?: string;
  valuePlaceholder?: string;
}> = ({ title, pairs, setPairs, keyPlaceholder = "Key", valuePlaceholder = "Value" }) => {
  const addPair = () => {
    setPairs([...pairs, { id: Date.now(), key: '', value: '' }]);
  };

  const removePair = (id: number) => {
    setPairs(pairs.filter(p => p.id !== id));
  };

  const updatePair = (id: number, field: 'key' | 'value', fieldValue: string) => {
    setPairs(pairs.map(p => p.id === id ? { ...p, [field]: fieldValue } : p));
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-2">{title}</label>
      {pairs.map((pair) => (
        <div key={pair.id} className="flex items-center space-x-2 mb-2">
          <Input
            placeholder={keyPlaceholder}
            value={pair.key}
            onChange={(e) => updatePair(pair.id, 'key', e.target.value)}
            className="flex-grow"
          />
          <Input
            placeholder={valuePlaceholder}
            value={pair.value}
            onChange={(e) => updatePair(pair.id, 'value', e.target.value)}
            className="flex-grow"
          />
          <button
            type="button"
            onClick={() => removePair(pair.id)}
            className="p-2 text-gray-500 hover:text-red-400 transition-colors"
            aria-label={`Remove ${title.slice(0,-1)}`}
          >
            <TrashIcon />
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={addPair}
        className="mt-2 flex items-center text-sm text-teal-400 hover:text-teal-300 transition-colors"
      >
        <PlusIcon />
        <span className="ml-2">Add {title.slice(0, -1)}</span>
      </button>
    </div>
  );
};

const ApiSpecForm: React.FC<ApiSpecFormProps> = ({ onGenerate, isLoading }) => {
  const [spec, setSpec] = useState<ApiSpec>({
    method: 'GET',
    endpoint: '/items',
    queryParams: [],
    pathParams: [],
    requestHeaders: [],
    requestBody: '',
    responseHeaders: [],
    responseBody: '{\n  "message": "Success"\n}',
    isSse: false,
    businessLogic: 'Return a simple success message.',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalSpec = {...spec, endpoint: spec.endpoint.startsWith('/') ? spec.endpoint : `/${spec.endpoint}`};
    onGenerate(finalSpec);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
      <div className="space-y-6">
        <Card title="1. Endpoint Details">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Select
              label="HTTP Method"
              value={spec.method}
              onChange={(e) => setSpec({ ...spec, method: e.target.value as ApiSpec['method'] })}
            >
              <option>GET</option>
              <option>POST</option>
              <option>PUT</option>
              <option>DELETE</option>
              <option>PATCH</option>
            </Select>
            <div className="md:col-span-2">
              <Input
                label="Endpoint Path"
                value={spec.endpoint}
                onChange={(e) => setSpec({ ...spec, endpoint: e.target.value })}
                placeholder="/users/{user_id}"
                prefix="/api/user"
                required
              />
            </div>
          </div>
        </Card>

        <Card title="2. Request Specification">
          <div className="space-y-4">
            <KeyValueInput
              title="Query Parameters"
              pairs={spec.queryParams}
              setPairs={(pairs) => setSpec({ ...spec, queryParams: pairs })}
              keyPlaceholder="paramName"
              valuePlaceholder="description (e.g., page number)"
            />
             <KeyValueInput
              title="Request Headers"
              pairs={spec.requestHeaders}
              setPairs={(pairs) => setSpec({ ...spec, requestHeaders: pairs })}
              keyPlaceholder="X-Custom-Header"
              valuePlaceholder="description"
            />
            <Textarea
              label="Request Body (JSON Schema or Description)"
              value={spec.requestBody}
              onChange={(e) => setSpec({ ...spec, requestBody: e.target.value })}
              placeholder={'e.g., {\n  "name": "string",\n  "price": "float"\n}'}
              rows={5}
            />
          </div>
        </Card>

        <Card title="3. Response Specification">
           <div className="space-y-4">
            <KeyValueInput
              title="Response Headers"
              pairs={spec.responseHeaders}
              setPairs={(pairs) => setSpec({ ...spec, responseHeaders: pairs })}
              keyPlaceholder="X-RateLimit-Limit"
              valuePlaceholder="description"
            />
            <Textarea
              label="Response Body (JSON Schema or Description)"
              value={spec.responseBody}
              onChange={(e) => setSpec({ ...spec, responseBody: e.target.value })}
              placeholder={'e.g., {\n  "id": "integer",\n  "name": "string"\n}'}
              rows={5}
            />
            <div className="flex items-center">
              <input
                id="sse"
                type="checkbox"
                checked={spec.isSse}
                onChange={(e) => setSpec({ ...spec, isSse: e.target.checked })}
                className="h-4 w-4 rounded border-gray-600 bg-gray-700 text-teal-500 focus:ring-teal-500"
              />
              <label htmlFor="sse" className="ml-2 block text-sm text-gray-300">
                Use Server-Sent Events (SSE) for streaming response
              </label>
            </div>
          </div>
        </Card>

        <Card title="4. Business Logic">
          <Textarea
            label="Describe the API's logic"
            value={spec.businessLogic}
            onChange={(e) => setSpec({ ...spec, businessLogic: e.target.value })}
            placeholder="Describe what this API should do. For example: 'Fetch user data from a database, filter by active status, and return the result.'"
            rows={6}
            required
          />
        </Card>

        <div className="flex justify-end pt-4">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Deploying...' : 'Create & Deploy API'}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default ApiSpecForm;
