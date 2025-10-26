"use client";

import { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import { getProductsByCategory } from '../models/products';

export default function CategoryPage({ category }) {
  const [products, setProducts] = useState([]);
  const [sortBy, setSortBy] = useState('featured');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, this would fetch from an API
    const fetchProducts = () => {
      setLoading(true);
      const categoryProducts = getProductsByCategory(category);
      
      // Sort products based on selected option
      let sortedProducts = [...categoryProducts];
      if (sortBy === 'price-low') {
        sortedProducts.sort((a, b) => a.price - b.price);
      } else if (sortBy === 'price-high') {
        sortedProducts.sort((a, b) => b.price - a.price);
      } else if (sortBy === 'rating') {
        sortedProducts.sort((a, b) => b.rating - a.rating);
      }
      
      setProducts(sortedProducts);
      setLoading(false);
    };

    fetchProducts();
  }, [category, sortBy]);

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  const categoryTitle = category.charAt(0).toUpperCase() + category.slice(1);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-semibold mb-6 text-center">{categoryTitle}</h1>
      
      <div className="flex justify-between items-center mb-6">
        <p className="text-gray-600">{products.length} products</p>
        
        <div className="flex items-center">
          <label htmlFor="sort" className="mr-2 text-gray-600">Sort by:</label>
          <select 
            id="sort" 
            value={sortBy}
            onChange={handleSortChange}
            className="border border-gray-300 rounded px-3 py-1"
          >
            <option value="featured">Featured</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Best Rating</option>
          </select>
        </div>
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-500">Loading products...</p>
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No products found in this category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-8">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}