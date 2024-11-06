"use client";
import React from 'react';
import { useQuery } from '@tanstack/react-query'; 
import { getAllProducts } from '../../../lib/apiWrapper';
import Card from '../../../components/cards/Card';

interface Product {
  id:number;
  name: string;
  price: number;
  category: string;
}

export default function Dashboard() {
  const { data: products, isLoading, isError, error } = useQuery<Product[], Error>({ queryKey: ['products'], queryFn: getAllProducts,  staleTime: 1000 * 60 * 5, });
  if (isLoading) return <div>Loading...</div>;
  if (isError && error instanceof Error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h1 className="mt-4 text-2xl text-center">Dashboard</h1>
      <div className="flex flex-wrap justify-center gap-4 mt-8">
        {products?.map((product) => (
          <div className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/4 flex justify-center" key={product.id}>
            <Card name={product.name} price={product.price} category={product.category} />
          </div>
        ))}
      </div>
    </div>
  );
}
