import React, { useState, useCallback, useEffect } from 'react';
import { ApiSpec, ManagedApi } from './types';
import { generateApiCode } from './services/geminiService';
import { apiManagementService } from './services/apiManagementService';
import ApiSpecForm from './components/ApiSpecForm';
import ApiManagement from './components/ApiManagement';
import Header from './components/Header';
import LoadingSpinner from './components/LoadingSpinner';

type View = 'generator' | 'manager';

const App: React.FC = () => {
  const [generatedCode, setGeneratedCode] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<View>('generator');
  const [managedApis, setManagedApis] = useState<ManagedApi[]>([]);
  const [isFetchingApis, setIsFetchingApis] = useState<boolean>(true);

  const fetchApis = useCallback(async () => {
    setIsFetchingApis(true);
    try {
      const apis = await apiManagementService.getApis();
      setManagedApis(apis);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not fetch APIs.');
    } finally {
      setIsFetchingApis(false);
    }
  }, []);

  useEffect(() => {
    fetchApis();
  }, [fetchApis]);

  const handleCreateAndDeploy = useCallback(async (spec: ApiSpec) => {
    setIsLoading(true);
    setError(null);
    try {
      const code = await generateApiCode(spec);
      await apiManagementService.saveApi(spec, code);
      await fetchApis();
      setView('manager'); // Switch to manager view after successful creation
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [fetchApis]);
  
  const handleDeleteApi = useCallback(async (apiId: string) => {
    try {
      await apiManagementService.deleteApi(apiId);
      await fetchApis();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete API.');
    }
  },[fetchApis]);

  return (
    <div className="min-h-screen bg-gray-900 font-sans">
      <Header activeView={view} onViewChange={setView} />
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        {isLoading && (
          <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex flex-col items-center justify-center z-50">
            <LoadingSpinner />
            <p className="text-teal-400 mt-4 text-lg animate-pulse">Deploying your new API endpoint...</p>
          </div>
        )}

        {error && (
          <div className="my-4 p-4 bg-red-900 border border-red-500 rounded-lg text-red-200" role="alert">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-bold">An Error Occurred</h3>
                <p>{error}</p>
              </div>
              <button onClick={() => setError(null)} className="font-bold text-2xl">&times;</button>
            </div>
          </div>
        )}

        {view === 'generator' && (
          <>
            <p className="text-gray-400 mb-8 text-center text-lg max-w-2xl mx-auto">
              Define your API, describe the logic, and let AI generate, save, and deploy the Python FastAPI code for you instantly.
            </p>
            <ApiSpecForm onGenerate={handleCreateAndDeploy} isLoading={isLoading} />
          </>
        )}
        
        {view === 'manager' && (
          <ApiManagement 
            apis={managedApis}
            isLoading={isFetchingApis}
            onDelete={handleDeleteApi}
            onRefresh={fetchApis}
          />
        )}

      </main>
      <footer className="text-center py-6 text-gray-600">
        <p>Powered by Gemini API & React</p>
      </footer>
    </div>
  );
};

export default App;
