export interface KeyValuePair {
  id: number;
  key: string;
  value: string;
}

export interface ApiSpec {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  endpoint: string;
  queryParams: KeyValuePair[];
  pathParams: KeyValuePair[];
  requestHeaders: KeyValuePair[];
  requestBody: string;
  responseHeaders: KeyValuePair[];
  responseBody: string;
  isSse: boolean;
  businessLogic: string;
}

export interface ManagedApi {
  id: string; 
  filename: string;
  spec: ApiSpec;
}
