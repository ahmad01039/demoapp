const API_BASE_URL = 'http://localhost:3000/api/'; 
type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';
interface ApiRequestOptions {
  method: HttpMethod;
  body?: any; 
  headers?: HeadersInit;
}
const apiRequest = async (endpoint: string, options: ApiRequestOptions) => {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'An error occurred');
  }
  return response.json();
};
export const signup = (data: any) => apiRequest('signup', { method: 'POST', body: JSON.stringify(data) });
