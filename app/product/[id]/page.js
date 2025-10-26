"use client";

import { useEffect, useState, use } from 'react';
import ProductDetail from '@/app/components/ProductDetail';
import { notFound } from 'next/navigation';

export default function ProductPage({ params }) {
  // Unwrap the params Promise using React.use()
  const unwrappedParams = use(params);
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/admin/products/${unwrappedParams.id}`);
        const result = await response.json();
        
        if (!result.success) {
          throw new Error(result.error || 'Failed to fetch product');
        }
        
        setProduct(result.data);
      } catch (error) {
        console.error('Error fetching product:', error);
        setError(error.message);
        // We'll handle the notFound in the render phase
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [unwrappedParams.id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-500">Loading product...</p>
      </div>
    );
  }

  if (error || !product) {
    return notFound();
  }

  return <ProductDetail product={product} />;
}