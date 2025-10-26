"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { products } from '../models/products';
import ProductCard from './ProductCard';

export default function BestSellers() {
  const [bestSellers, setBestSellers] = useState([]);
  
  useEffect(() => {
    // Filter products that are in the best-sellers category
    const bestSellerProducts = products.filter(product => 
      product.category.includes('best-sellers')
    ).slice(0, 4); // Limit to 4 products
    
    setBestSellers(bestSellerProducts);
  }, []);

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-semibold mb-2">Best Sellers</h2>
          <p className="text-gray-600">Our most loved pieces that customers can't get enough of</p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {bestSellers.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        
        <div className="text-center mt-10">
          <Link href="/category/best-sellers" className="inline-block border border-black px-6 py-3 hover:bg-black hover:text-white transition-colors">
            View All Best Sellers
          </Link>
        </div>
      </div>
    </section>
  );
}