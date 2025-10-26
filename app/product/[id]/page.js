"use client";

import { useEffect, useState, use } from 'react';
import { getProductById } from '@/app/models/products';
import ProductDetail from '@/app/components/ProductDetail';
import { notFound } from 'next/navigation';

export default function ProductPage({ params }) {
  // Unwrap the params Promise using React.use()
  const unwrappedParams = use(params);
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, this would fetch from an API
    const fetchProduct = () => {
      setLoading(true);
      try {
        const productData = getProductById(unwrappedParams.id);
        if (!productData) {
          notFound();
        }
        setProduct(productData);
      } catch (error) {
        console.error('Error fetching product:', error);
        notFound();
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [unwrappedParams.id]); // ← Changed this line

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-500">Loading product...</p>
      </div>
    );
  }

  if (!product) {
    return notFound();
  }

  return <ProductDetail product={product} />;
}