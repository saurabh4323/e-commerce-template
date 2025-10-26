"use client";

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Testimonials from './Testimonials';

export default function ProductDetail({ product }) {
  const [selectedVariant, setSelectedVariant] = useState(product.variants[0]);
  const [quantity, setQuantity] = useState(1);
  const router = useRouter();

  const handleAddToCart = () => {
    // Get existing cart from localStorage or initialize empty array
    const existingCart = JSON.parse(localStorage.getItem('cart') || '[]');
    
    // Create cart item with selected options
    const cartItem = {
      id: product.id,
      name: product.name,
      price: selectedVariant.price || product.price,
      variant: selectedVariant.name,
      quantity: quantity,
      image: product.images[0]
    };
    
    // Add to cart
    existingCart.push(cartItem);
    localStorage.setItem('cart', JSON.stringify(existingCart));
    
    // Show confirmation and redirect to cart
    alert('Product added to cart!');
    router.push('/cart');
  };

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (value > 0 && value <= 10) {
      setQuantity(value);
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} className={`text-xl ${i <= rating ? 'text-yellow-400' : 'text-gray-300'}`}>
          ★
        </span>
      );
    }
    return stars;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="relative h-96 w-full bg-gray-100 rounded-lg overflow-hidden">
            {product.images && product.images.length > 0 && (
              <div className="carousel w-full h-full">
                {product.images.map((image, index) => (
                  <div id={`slide${index}`} key={index} className="carousel-item relative w-full">
                    <img 
                      src={image} 
                      alt={`${product.name} - Image ${index + 1}`}
                      fill
                      style={{ objectFit: 'cover' }}
                      priority={index === 0}
                    />
                    <div className="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
                      <a href={`#slide${index === 0 ? product.images.length - 1 : index - 1}`} className="btn btn-circle bg-white/70 hover:bg-white/90">❮</a> 
                      <a href={`#slide${index === product.images.length - 1 ? 0 : index + 1}`} className="btn btn-circle bg-white/70 hover:bg-white/90">❯</a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Thumbnail Images */}
          {product.images && product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {product.images.map((image, index) => (
                <a href={`#slide${index}`} key={index} className="relative h-24 bg-gray-100 rounded-md overflow-hidden cursor-pointer">
                  <img 
                    src={image} 
                    alt={`${product.name} - Image ${index + 1}`}
                    fill
                    style={{ objectFit: 'cover' }}
                  />
                </a>
              ))}
            </div>
          )}
        </div>
        
        {/* Product Info */}
        <div>
          <h1 className="text-3xl font-semibold mb-2">{product.name}</h1>
          
          <div className="flex items-center mb-4">
            <div className="flex mr-2">
              {renderStars(product.rating)}
            </div>
            <span className="text-gray-600">({product.reviews} reviews)</span>
          </div>
          
          <div className="text-2xl font-medium mb-6">
            ₹{selectedVariant.price || product.price}
          </div>
          
          <div className="mb-6">
            <p className="text-gray-700">{product.description}</p>
          </div>
          
          {/* Variants Selection */}
          {product.variants && product.variants.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-900 mb-2">Material</h3>
              <div className="flex space-x-2">
                {product.variants.map((variant, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedVariant(variant)}
                    className={`px-4 py-2 border rounded-md ${
                      selectedVariant.name === variant.name
                        ? 'border-black bg-black text-white'
                        : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {variant.name}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {/* Quantity Selector */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-900 mb-2">Quantity</h3>
            <div className="flex items-center">
              <button 
                onClick={() => quantity > 1 && setQuantity(quantity - 1)}
                className="w-10 h-10 border border-gray-300 flex items-center justify-center rounded-l-md"
              >
                -
              </button>
              <input
                type="number"
                min="1"
                max="10"
                value={quantity}
                onChange={handleQuantityChange}
                className="w-16 h-10 border-t border-b border-gray-300 text-center"
              />
              <button 
                onClick={() => quantity < 10 && setQuantity(quantity + 1)}
                className="w-10 h-10 border border-gray-300 flex items-center justify-center rounded-r-md"
              >
                +
              </button>
            </div>
          </div>
          
          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            disabled={!product.inStock}
            className={`w-full py-3 px-6 text-white rounded-md ${
              product.inStock
                ? 'bg-black hover:bg-gray-800'
                : 'bg-gray-400 cursor-not-allowed'
            }`}
          >
            {product.inStock ? 'Add to Cart' : 'Out of Stock'}
          </button>
          
          {/* Product Details */}
          <div className="mt-8 border-t border-gray-200 pt-6">
            <h3 className="text-lg font-medium mb-4">Product Details</h3>
            <ul className="list-disc pl-5 space-y-2 text-gray-600">
              <li>92.5 Sterling Silver Jewelry</li>
              <li>6 Months Warranty</li>
              <li>Handcrafted in India</li>
              <li>Free Shipping</li>
            </ul>
          </div>
        </div>
      </div>
      
      {/* Product Carousel with provided images */}
      <div className="mt-16 bg-[#5f2125] py-12">
        <h2 className="text-2xl font-semibold mb-8 text-center text-white">Why Choose Our Products</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-8 max-w-7xl mx-auto">
          <div className="bg-white rounded-lg p-6 h-full shadow-lg">
            <img src="https://www.woilasilver.com/cdn/shop/files/Website_Images_27.png?v=1760426779&width=1200" 
                 alt="Premium Quality" 
                 className="h-48 object-contain mx-auto mb-4" />
            <div className="text-center">
              <h3 className="text-xl font-semibold">Premium Quality Materials</h3>
              <p className="mt-2 text-gray-600">Our jewelry is crafted with the finest 92.5 Sterling Silver, ensuring durability and lasting shine.</p>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-6 h-full shadow-lg">
            <img src="https://www.woilasilver.com/cdn/shop/files/Website_Images_25.png?v=1760373027&width=1200" 
                 alt="Handcrafted Excellence" 
                 className="h-48 object-contain mx-auto mb-4" />
            <div className="text-center">
              <h3 className="text-xl font-semibold">Handcrafted Excellence</h3>
              <p className="mt-2 text-gray-600">Each piece is meticulously handcrafted by skilled artisans, ensuring attention to detail and unique character.</p>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-6 h-full shadow-lg">
            <img src="https://www.woilasilver.com/cdn/shop/files/Website_Images_26.png?v=1760426776&width=1200" 
                 alt="Ethical Sourcing" 
                 className="h-48 object-contain mx-auto mb-4" />
            <div className="text-center">
              <h3 className="text-xl font-semibold">Ethical Sourcing</h3>
              <p className="mt-2 text-gray-600">We are committed to ethical sourcing and sustainable practices, ensuring our jewelry is as beautiful in its creation as it is in appearance.</p>
            </div>
          </div>
        </div>
      </div>
      
     <Testimonials></Testimonials>
    </div>
  );
}