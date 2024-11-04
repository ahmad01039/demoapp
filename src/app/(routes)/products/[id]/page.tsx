
interface ProductDetailProps {
    params: {
      id: string; 
    };
  }
  
 
  export default async function ProductDetail({ params }: ProductDetailProps) {
    const { id } = await params; 
  
    return (
      <div>
        <h1>Product ID: {id}</h1>
      </div>
    );
  }

