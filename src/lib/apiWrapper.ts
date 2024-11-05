// const API_BASE_URL = 'http://localhost:3000/api/'; 

const API_BASE_URL=process.env.NEXT_PUBLIC_BASE_URL;

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

interface ApiRequestOptions {
  method: HttpMethod;
  body?: any; 
  headers?: HeadersInit;
}

const apiRequest = async (endpoint: string, options: ApiRequestOptions) => {
  try {
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

    return await response.json();
  } catch (error: any) {
    throw new Error(error?.message || 'Network error');
  }
};

export const signup = (data: any) => apiRequest('signup', { method: 'POST', body: JSON.stringify(data) });
