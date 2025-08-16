import { ApiSpec, ManagedApi } from "../types";

// --- Mock Backend Service ---
// This service simulates a backend that would store, manage, and route the generated APIs.
// In a real application, this would be a server (e.g., Node.js or Python) that interacts
// with a file system and a web server like FastAPI or Express.

// Mock in-memory storage for our APIs. This persists for the lifetime of the browser tab.
let managedApis: ManagedApi[] = [];
let idCounter = 0;

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

const saveApi = async (spec: ApiSpec, code: string): Promise<ManagedApi> => {
    await delay(1000); // Simulate network and file system latency

    // In a real backend, you would:
    // 1. Sanitize the filename.
    // 2. Write the `code` to the file.
    // 3. Signal the server to load the new route.
    // 4. Store metadata in a database.
    
    const filename = `${spec.endpoint.replace(/[\/{}]/g, '_').slice(1)}_${spec.method.toLowerCase()}.py`;
    
    const newApi: ManagedApi = {
        id: `api_${Date.now()}_${idCounter++}`,
        filename,
        spec,
    };
    
    // Avoid duplicates based on method and endpoint
    managedApis = managedApis.filter(api => !(api.spec.method === spec.method && api.spec.endpoint === spec.endpoint));
    managedApis.push(newApi);

    console.log(`[Mock] API code saved to ${filename}`);
    console.log(code);
    
    return newApi;
}

const getApis = async (): Promise<ManagedApi[]> => {
    await delay(500); // Simulate network latency
    // In a real backend, you'd fetch this from a database.
    return [...managedApis];
}

const deleteApi = async (apiId: string): Promise<{ success: boolean }> => {
    await delay(500); // Simulate network and file system latency
    
    const initialLength = managedApis.length;
    managedApis = managedApis.filter(api => api.id !== apiId);

    if (managedApis.length < initialLength) {
        console.log(`[Mock] Deleted API with ID: ${apiId}`);
        return { success: true };
    } else {
        throw new Error("API not found for deletion.");
    }
}

interface TestApiParams {
    api: ManagedApi;
    pathParams: Record<string, string>;
    queryParams: Record<string, string>;
    headers: Record<string, string>;
    body: string;
}

interface TestApiResponse {
    status: number;
    statusText: string;
    headers: Record<string, string>;
    body: string;
}

const testApi = async (params: TestApiParams): Promise<TestApiResponse> => {
    await delay(750); // Simulate API execution time

    console.log("[Mock] Testing API with params:", params);
    
    // This is a simplified mock response. A real backend test harness would
    // actually execute the generated Python code in a sandboxed environment
    // and capture the real response.
    // For this simulation, we'll just return the example response body from the spec.
    
    const responseHeaders: Record<string, string> = {
        'Content-Type': 'application/json',
        'X-Served-By': 'Dynamic-API-Studio-Mock-Server',
    };
    
    params.api.spec.responseHeaders.forEach(h => {
        responseHeaders[h.key] = h.value;
    });

    try {
        // Try to parse the body to make it pretty, but fall back to string if it's not JSON
        const responseBody = JSON.stringify(JSON.parse(params.api.spec.responseBody), null, 2);
        return {
            status: 200,
            statusText: 'OK',
            headers: responseHeaders,
            body: responseBody,
        };
    } catch (e) {
         return {
            status: 200,
            statusText: 'OK',
            headers: responseHeaders,
            body: params.api.spec.responseBody, // Return as-is if not valid JSON
        };
    }
}


export const apiManagementService = {
    saveApi,
    getApis,
    deleteApi,
    testApi,
};
