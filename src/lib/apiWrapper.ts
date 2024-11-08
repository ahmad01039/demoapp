import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

interface ApiRequestOptions {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: any;
  headers?: HeadersInit;
}

export const apiRequest = async (endpoint: string, options: ApiRequestOptions) => {
  try {
    const response = await axios({
      url: `${API_BASE_URL}${endpoint}`,
      method: options.method,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      data: options.body,
    });

    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.error || error.message || 'An error occurred');
  }
};

export const signup = (data: any) =>
  apiRequest('signup', { method: 'POST', body: JSON.stringify(data) });


interface Product {
  id:number;
  name: string;
  price: number;
  category: string;
}

export const getAllProducts = async (): Promise<Product[]> => {
  return apiRequest('products', { method: 'GET' });
};
export const getProductById = async (id: number): Promise<Product> => {
  return apiRequest(`products?id=${id}`, { method: 'GET' });
};
