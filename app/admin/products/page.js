"use client";

import { useState } from 'react';
import { products } from '../../models/products';

export default function AdminProducts() {
  const [productList, setProductList] = useState(products);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  
  const openModal = (product = null) => {
    setCurrentProduct(product || {
      id: '',
      name: '',
      price: 0,
      description: '',
      images: [],
      category: [],
      reviews: 0,
      rating: 5,
      inStock: true,
      variants: [
        { name: 'Sterling Silver', price: 0 },
        { name: '18k Gold', price: 0 }
      ]
    });
    setIsModalOpen(true);
  };
  
  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentProduct(null);
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentProduct({
      ...currentProduct,
      [name]: value
    });
  };
  
  const handleCategoryChange = (e) => {
    const categories = e.target.value.split(',').map(cat => cat.trim());
    setCurrentProduct({
      ...currentProduct,
      category: categories
    });
  };
  
  const handleVariantChange = (index, field, value) => {
    const updatedVariants = [...currentProduct.variants];
    updatedVariants[index] = {
      ...updatedVariants[index],
      [field]: field === 'price' ? parseFloat(value) : value
    };
    
    setCurrentProduct({
      ...currentProduct,
      variants: updatedVariants
    });
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // In a real app, this would send data to an API
    if (currentProduct.id) {
      // Update existing product
      setProductList(productList.map(p => 
        p.id === currentProduct.id ? currentProduct : p
      ));
    } else {
      // Add new product with generated ID
      const newProduct = {
        ...currentProduct,
        id: currentProduct.name.toLowerCase().replace(/\s+/g, '-'),
        reviews: 0,
        rating: 5
      };
      setProductList([...productList, newProduct]);
    }
    
    closeModal();
  };
  
  const handleDelete = (id) => {
    // In a real app, this would send a delete request to an API
    setProductList(productList.filter(p => p.id !== id));
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Products</h1>
        <button 
          onClick={() => openModal()}
          className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
        >
          Add New Product
        </button>
      </div>
      
      <div className="bg-white rounded shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {productList.map((product) => (
              <tr key={product.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{product.name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">₹{product.price.toFixed(2)}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{product.category.join(', ')}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${product.inStock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {product.inStock ? 'In Stock' : 'Out of Stock'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button 
                    onClick={() => openModal(product)}
                    className="text-indigo-600 hover:text-indigo-900 mr-4"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDelete(product.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-2xl w-full max-h-screen overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">
              {currentProduct.id ? 'Edit Product' : 'Add New Product'}
            </h2>
            
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Product Name</label>
                <input
                  type="text"
                  name="name"
                  value={currentProduct.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Price (₹)</label>
                <input
                  type="number"
                  name="price"
                  value={currentProduct.price}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Description</label>
                <textarea
                  name="description"
                  value={currentProduct.description}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                  rows="3"
                  required
                ></textarea>
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Categories (comma-separated)</label>
                <input
                  type="text"
                  value={currentProduct.category.join(', ')}
                  onChange={handleCategoryChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">In Stock</label>
                <select
                  name="inStock"
                  value={currentProduct.inStock}
                  onChange={(e) => handleInputChange({
                    target: {
                      name: 'inStock',
                      value: e.target.value === 'true'
                    }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                >
                  <option value={true}>Yes</option>
                  <option value={false}>No</option>
                </select>
              </div>
              
              <h3 className="font-medium mb-2">Variants</h3>
              {currentProduct.variants.map((variant, index) => (
                <div key={index} className="mb-4 p-3 border border-gray-200 rounded">
                  <div className="mb-2">
                    <label className="block text-gray-700 mb-1">Variant Name</label>
                    <input
                      type="text"
                      value={variant.name}
                      onChange={(e) => handleVariantChange(index, 'name', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-1">Price (₹)</label>
                    <input
                      type="number"
                      value={variant.price}
                      onChange={(e) => handleVariantChange(index, 'price', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded"
                    />
                  </div>
                </div>
              ))}
              
              <div className="flex justify-end mt-6">
                <button
                  type="button"
                  onClick={closeModal}
                  className="bg-gray-200 text-gray-800 px-4 py-2 rounded mr-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-black text-white px-4 py-2 rounded"
                >
                  {currentProduct.id ? 'Update Product' : 'Add Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}