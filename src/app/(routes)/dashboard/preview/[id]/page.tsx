"use client";
import { getProductById } from '@/lib/apiWrapper';
import { useQuery } from '@tanstack/react-query'; 
import { useParams } from 'next/navigation';
import { useRouter } from 'next/navigation'
import { Product } from '@/types/otherTypes';
export default function Page() {
  const router=useRouter();
  const { id } = useParams() as { id: string };
  const productid = Number(id);
  const { data: product, isLoading, isError, error } = useQuery<Product, Error>({
    queryKey: ['productsbyid', productid],
    queryFn: () => getProductById(productid),
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="border-t-4 border-blue-500 border-solid w-16 h-16 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="bg-red-100 text-red-800 p-4 rounded-md shadow-md">
          <p>Error: {error?.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-8 md:p-12 lg:p-16">
      <h1 className="text-3xl font-semibold text-center mb-6">Product Details</h1>

      {product ? (
        <div className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <h2 className="text-2xl font-semibold text-gray-800">{product.name}</h2>
          <p className="text-gray-600 mt-2">Category: {product.category}</p>
          <p className="text-xl font-bold text-blue-600 mt-4">${product.price.toFixed(2)}</p>
        </div>
      ) : (
        <p className="text-center text-lg text-gray-700 mt-6">No product found.</p>
      )}
<div className='flex items-center w-[100vw]'>
<button 
  onClick={()=>router.back()} 
  
  className=' bg-blue-600 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-blue-700 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all duration-300'
>
  Back
</button>
</div>
    </div>
  );
}
