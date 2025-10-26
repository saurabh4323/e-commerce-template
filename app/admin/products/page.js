"use client";

import { useState, useEffect } from 'react';

export default function AdminProducts() {
  const [productList, setProductList] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [imageInput, setImageInput] = useState('');
  const [additionalImageInput, setAdditionalImageInput] = useState('');
  const [uploadMethod, setUploadMethod] = useState('url'); // 'url' or 'cloudinary'
  const [additionalUploadMethod, setAdditionalUploadMethod] = useState('url');
  const [uploading, setUploading] = useState(false);
  const [additionalUploading, setAdditionalUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    fetchProducts();
  }, []);
  
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/products');
      const data = await response.json();
      if (data.success) {
        setProductList(data.data);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const openModal = (product = null) => {
    setCurrentProduct(product || {
      name: '',
      price: 0,
      description: '',
      images: [],
      additionalImages: [],
      category: 'love',
      stock: 0,
      variants: [
        { name: 'Sterling Silver', price: 0, stock: 0 },
        { name: '18k Gold', price: 0, stock: 0 }
      ],
      featured: false
    });
    setIsModalOpen(true);
  };
  
  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentProduct(null);
    setImageInput('');
    setAdditionalImageInput('');
  };
  
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCurrentProduct({
      ...currentProduct,
      [name]: type === 'checkbox' ? checked : value
    });
  };
  
  // Main Images Functions
  const handleAddImageUrl = () => {
    if (imageInput.trim()) {
      setCurrentProduct({
        ...currentProduct,
        images: [...currentProduct.images, imageInput.trim()]
      });
      setImageInput('');
    }
  };
  
  const handleCloudinaryUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'your_upload_preset'); // Replace with your Cloudinary preset
    
    try {
      const response = await fetch(
        'https://api.cloudinary.com/v1_1/your_cloud_name/image/upload', // Replace with your cloud name
        {
          method: 'POST',
          body: formData
        }
      );
      
      const data = await response.json();
      if (data.secure_url) {
        setCurrentProduct({
          ...currentProduct,
          images: [...currentProduct.images, data.secure_url]
        });
      }
    } catch (error) {
      console.error('Error uploading to Cloudinary:', error);
      alert('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };
  
  const handleRemoveImage = (index) => {
    setCurrentProduct({
      ...currentProduct,
      images: currentProduct.images.filter((_, i) => i !== index)
    });
  };

  // Additional Images Functions
  const handleAddAdditionalImageUrl = () => {
    if (additionalImageInput.trim()) {
      setCurrentProduct({
        ...currentProduct,
        additionalImages: [...(currentProduct.additionalImages || []), additionalImageInput.trim()]
      });
      setAdditionalImageInput('');
    }
  };
  
  const handleAdditionalCloudinaryUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setAdditionalUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'your_upload_preset'); // Replace with your Cloudinary preset
    
    try {
      const response = await fetch(
        'https://api.cloudinary.com/v1_1/your_cloud_name/image/upload', // Replace with your cloud name
        {
          method: 'POST',
          body: formData
        }
      );
      
      const data = await response.json();
      if (data.secure_url) {
        setCurrentProduct({
          ...currentProduct,
          additionalImages: [...(currentProduct.additionalImages || []), data.secure_url]
        });
      }
    } catch (error) {
      console.error('Error uploading to Cloudinary:', error);
      alert('Failed to upload additional image');
    } finally {
      setAdditionalUploading(false);
    }
  };
  
  const handleRemoveAdditionalImage = (index) => {
    setCurrentProduct({
      ...currentProduct,
      additionalImages: (currentProduct.additionalImages || []).filter((_, i) => i !== index)
    });
  };
  
  const handleVariantChange = (index, field, value) => {
    const updatedVariants = [...currentProduct.variants];
    updatedVariants[index] = {
      ...updatedVariants[index],
      [field]: ['price', 'stock'].includes(field) ? parseFloat(value) || 0 : value
    };
    
    setCurrentProduct({
      ...currentProduct,
      variants: updatedVariants
    });
  };
  
  const handleAddVariant = () => {
    setCurrentProduct({
      ...currentProduct,
      variants: [...currentProduct.variants, { name: '', price: 0, stock: 0 }]
    });
  };
  
  const handleRemoveVariant = (index) => {
    setCurrentProduct({
      ...currentProduct,
      variants: currentProduct.variants.filter((_, i) => i !== index)
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const method = currentProduct._id ? 'PUT' : 'POST';
      const url = currentProduct._id 
        ? `/api/admin/products/${currentProduct._id}` 
        : '/api/admin/products';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(currentProduct),
      });
      
      const data = await response.json();
      
      if (data.success) {
        fetchProducts();
        closeModal();
        alert(currentProduct._id ? 'Product updated successfully!' : 'Product added successfully!');
      } else {
        alert('Error: ' + (data.error || 'Failed to save product'));
      }
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Failed to save product');
    }
  };
  
  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    
    try {
      const response = await fetch(`/api/admin/products/${id}`, {
        method: 'DELETE',
      });
      
      const data = await response.json();
      
      if (data.success) {
        fetchProducts();
        alert('Product deleted successfully!');
      } else {
        alert('Error: Failed to delete product');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Failed to delete product');
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading products...</div>;
  }

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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {productList.map((product) => (
              <tr key={product._id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  {product.images && product.images[0] && (
                    <img src={product.images[0]} alt={product.name} className="h-12 w-12 object-cover rounded" />
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{product.name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">₹{product.price.toFixed(2)}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{product.category}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${product.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {product.stock}
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
                    onClick={() => handleDelete(product._id)}
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-8 max-w-5xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-6">
              {currentProduct._id ? 'Edit Product' : 'Add New Product'}
            </h2>
            
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Basic Info */}
                <div className="lg:col-span-1">
                  <h3 className="text-lg font-semibold mb-4 pb-2 border-b">Basic Information</h3>
                  
                  <div className="mb-4">
                    <label className="block text-gray-700 mb-2 font-medium">Product Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={currentProduct.name}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black"
                      required
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-gray-700 mb-2 font-medium">Price (₹) *</label>
                    <input
                      type="number"
                      name="price"
                      value={currentProduct.price}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black"
                      step="0.01"
                      min="0"
                      required
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-gray-700 mb-2 font-medium">Category *</label>
                    <select
                      name="category"
                      value={currentProduct.category}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black"
                      required
                    >
                      <option value="love">Love</option>
                      <option value="best-sellers">Best Sellers</option>
                      <option value="sisters">Sisters</option>
                      <option value="self-love">Self Love</option>
                      <option value="mom">Mom</option>
                      <option value="rings">Rings</option>
                    </select>
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-gray-700 mb-2 font-medium">Stock Quantity *</label>
                    <input
                      type="number"
                      name="stock"
                      value={currentProduct.stock}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black"
                      min="0"
                      required
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="featured"
                        checked={currentProduct.featured}
                        onChange={handleInputChange}
                        className="mr-2"
                      />
                      <span className="text-gray-700">Featured Product</span>
                    </label>
                  </div>

                  <div className="mb-4">
                    <label className="block text-gray-700 mb-2 font-medium">Description *</label>
                    <textarea
                      name="description"
                      value={currentProduct.description}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black"
                      rows="5"
                      required
                    ></textarea>
                  </div>
                </div>
                
                {/* Middle Column - Main Product Images */}
                <div className="lg:col-span-1">
                  <h3 className="text-lg font-semibold mb-4 pb-2 border-b">Main Product Images *</h3>
                  
                  <div className="mb-4">
                    <div className="flex gap-2 mb-3">
                      <button
                        type="button"
                        onClick={() => setUploadMethod('url')}
                        className={`px-3 py-1 rounded text-sm ${uploadMethod === 'url' ? 'bg-black text-white' : 'bg-gray-200'}`}
                      >
                        Image URL
                      </button>
                      <button
                        type="button"
                        onClick={() => setUploadMethod('cloudinary')}
                        className={`px-3 py-1 rounded text-sm ${uploadMethod === 'cloudinary' ? 'bg-black text-white' : 'bg-gray-200'}`}
                      >
                        Upload
                      </button>
                    </div>
                    
                    {uploadMethod === 'url' ? (
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={imageInput}
                          onChange={(e) => setImageInput(e.target.value)}
                          placeholder="Enter image URL"
                          className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black text-sm"
                        />
                        <button
                          type="button"
                          onClick={handleAddImageUrl}
                          className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 text-sm"
                        >
                          Add
                        </button>
                      </div>
                    ) : (
                      <div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleCloudinaryUpload}
                          className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                          disabled={uploading}
                        />
                        {uploading && <p className="text-sm text-gray-500 mt-1">Uploading...</p>}
                      </div>
                    )}
                  </div>
                  
                  {/* Main Images Preview */}
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    {currentProduct.images.map((img, index) => (
                      <div key={index} className="relative group">
                        <img src={img} alt={`Product ${index + 1}`} className="w-full h-32 object-cover rounded border" />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(index)}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          ×
                        </button>
                        {index === 0 && (
                          <span className="absolute bottom-1 left-1 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                            Main
                          </span>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Additional Images Section */}
                  <h3 className="text-lg font-semibold mb-4 pb-2 border-b mt-6">Additional Images</h3>
                  <p className="text-sm text-gray-600 mb-3">Add more product images (optional)</p>
                  
                  <div className="mb-4">
                    <div className="flex gap-2 mb-3">
                      <button
                        type="button"
                        onClick={() => setAdditionalUploadMethod('url')}
                        className={`px-3 py-1 rounded text-sm ${additionalUploadMethod === 'url' ? 'bg-black text-white' : 'bg-gray-200'}`}
                      >
                        Image URL
                      </button>
                      <button
                        type="button"
                        onClick={() => setAdditionalUploadMethod('cloudinary')}
                        className={`px-3 py-1 rounded text-sm ${additionalUploadMethod === 'cloudinary' ? 'bg-black text-white' : 'bg-gray-200'}`}
                      >
                        Upload
                      </button>
                    </div>
                    
                    {additionalUploadMethod === 'url' ? (
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={additionalImageInput}
                          onChange={(e) => setAdditionalImageInput(e.target.value)}
                          placeholder="Enter additional image URL"
                          className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black text-sm"
                        />
                        <button
                          type="button"
                          onClick={handleAddAdditionalImageUrl}
                          className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 text-sm"
                        >
                          Add
                        </button>
                      </div>
                    ) : (
                      <div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleAdditionalCloudinaryUpload}
                          className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                          disabled={additionalUploading}
                        />
                        {additionalUploading && <p className="text-sm text-gray-500 mt-1">Uploading...</p>}
                      </div>
                    )}
                  </div>
                  
                  {/* Additional Images Preview */}
                  {currentProduct.additionalImages && currentProduct.additionalImages.length > 0 && (
                    <div className="grid grid-cols-2 gap-2">
                      {currentProduct.additionalImages.map((img, index) => (
                        <div key={index} className="relative group">
                          <img src={img} alt={`Additional ${index + 1}`} className="w-full h-32 object-cover rounded border" />
                          <button
                            type="button"
                            onClick={() => handleRemoveAdditionalImage(index)}
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                {/* Right Column - Variants */}
                <div className="lg:col-span-1">
                  <div className="flex justify-between items-center mb-4 pb-2 border-b">
                    <h3 className="text-lg font-semibold">Product Variants</h3>
                    <button
                      type="button"
                      onClick={handleAddVariant}
                      className="text-sm bg-gray-200 px-3 py-1 rounded hover:bg-gray-300"
                    >
                      + Add
                    </button>
                  </div>
                  
                  <div className="space-y-3">
                    {currentProduct.variants.map((variant, index) => (
                      <div key={index} className="p-3 border border-gray-200 rounded relative bg-gray-50">
                        <button
                          type="button"
                          onClick={() => handleRemoveVariant(index)}
                          className="absolute top-2 right-2 text-red-500 hover:text-red-700 font-bold"
                        >
                          ×
                        </button>
                        
                        <div className="mb-2">
                          <label className="block text-gray-700 text-sm mb-1">Variant Name</label>
                          <input
                            type="text"
                            value={variant.name}
                            onChange={(e) => handleVariantChange(index, 'name', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-black"
                            placeholder="e.g., Sterling Silver"
                          />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-gray-700 text-sm mb-1">Price (₹)</label>
                            <input
                              type="number"
                              value={variant.price}
                              onChange={(e) => handleVariantChange(index, 'price', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-black"
                              step="0.01"
                              min="0"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-gray-700 text-sm mb-1">Stock</label>
                            <input
                              type="number"
                              value={variant.stock}
                              onChange={(e) => handleVariantChange(index, 'stock', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-black"
                              min="0"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Form Actions */}
              <div className="flex justify-end mt-8 gap-3 pt-6 border-t">
                <button
                  type="button"
                  onClick={closeModal}
                  className="bg-gray-200 text-gray-800 px-6 py-2 rounded hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800"
                >
                  {currentProduct._id ? 'Update Product' : 'Add Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}