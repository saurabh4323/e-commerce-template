"use client";
import Link from 'next/link';
import { useState } from 'react';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);

  const categories = [
    { 
      name: "LOVE", 
      path: "/love", 
      image: "https://prettiq.in/cdn/shop/files/b35f3313-f80a-45fa-9725-4cc015f4bd4d.jpg?v=1731842688" 
    },
    { 
      name: "BEST SELLERS", 
      path: "/best-sellers", 
      image: "https://rubans.in/cdn/shop/files/18kt-gold-plated-stainless-steel-tarnish-free-waterproof-curved-hoop-earrings-earrings-36848040542382.jpg?v=1755720077" 
    },
    { 
      name: "SISTERS", 
      path: "/sisters", 
      image: "https://foreverchiquestore.com/cdn/shop/files/IMG-3643.jpg?v=1724314731&width=800" 
    },
   
    { 
      name: "MOM", 
      path: "/mom", 
      image: 'https://www.gehnaindia.com/_next/image?url=https%3A%2F%2Fcdn-assets.gehnaindia.com%2F7rkl8s8zbael5xun1i50ijpmuoqv&w=3840&q=75'  
    },
    { 
      name: "RINGS", 
      path: "/rings", 
      image: "https://cdn.shopify.com/s/files/1/0562/3447/5587/files/Twinkling_Titan_Ring_-_Bold_N_Italic-4010678.jpg?v=1760718331&width=533" 
    }
  ];

  const toggleDropdown = (dropdownName) => {
    setOpenDropdown(openDropdown === dropdownName ? null : dropdownName);
  };

  const closeDropdowns = () => {
    setOpenDropdown(null);
  };

  return (
    <>
      <div className="bg-black text-white text-center py-2 text-sm">
        FREE SHIPPING | FLAT 100 OFF ON PREPAID ORDERS
      </div>
      <header className="bg-white py-4 px-6 flex items-center justify-between relative">
        <Link href="/" className="text-2xl font-semibold">
          CELVE
          <span className="block text-xs text-center">SILVER</span>
        </Link>

        <nav className="hidden md:flex items-center space-x-6">
          <div className="relative">
            <button 
              onClick={() => toggleDropdown('categories')}
              className="hover:text-gray-600 flex items-center"
            >
              Categories
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {openDropdown === 'categories' && (
              <div className="absolute bg-white shadow-lg p-6 z-10 left-0 w-[600px] grid grid-cols-3 gap-4 mt-2">
                {categories.map((category, index) => (
                  <Link 
                    href={category.path} 
                    key={index} 
                    className="flex flex-col hover:opacity-80 transition-opacity"
                    onClick={closeDropdowns}
                  >
                    <div className="h-40 w-full relative mb-2 overflow-hidden">
                      <img 
                        src={category.image} 
                        alt={category.name}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <span className="text-center font-medium">{category.name}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>

          <div className="relative">
            <button 
              onClick={() => toggleDropdown('love')}
              className="hover:text-gray-600 flex items-center"
            >
              Love
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {openDropdown === 'love' && (
              <div className="absolute bg-white shadow-lg p-6 z-10 left-0 w-[300px] mt-2">
                <div className="grid grid-cols-1 gap-4">
                  <Link href="/love/necklaces" className="hover:text-gray-600" onClick={closeDropdowns}>Necklaces</Link>
                  <Link href="/love/bracelets" className="hover:text-gray-600" onClick={closeDropdowns}>Bracelets</Link>
                  <Link href="/love/earrings" className="hover:text-gray-600" onClick={closeDropdowns}>Earrings</Link>
                  <Link href="/love/rings" className="hover:text-gray-600" onClick={closeDropdowns}>Rings</Link>
                </div>
              </div>
            )}
          </div>

          <div className="relative">
            <button 
              onClick={() => toggleDropdown('bestsellers')}
              className="hover:text-gray-600 flex items-center"
            >
              Best Sellers
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {openDropdown === 'bestsellers' && (
              <div className="absolute bg-white shadow-lg p-6 z-10 left-0 w-[300px] mt-2">
                <div className="grid grid-cols-1 gap-4">
                  <Link href="/best-sellers/necklaces" className="hover:text-gray-600" onClick={closeDropdowns}>Necklaces</Link>
                  <Link href="/best-sellers/bracelets" className="hover:text-gray-600" onClick={closeDropdowns}>Bracelets</Link>
                  <Link href="/best-sellers/earrings" className="hover:text-gray-600" onClick={closeDropdowns}>Earrings</Link>
                  <Link href="/best-sellers/rings" className="hover:text-gray-600" onClick={closeDropdowns}>Rings</Link>
                </div>
              </div>
            )}
          </div>

          <div className="relative">
            <button 
              onClick={() => toggleDropdown('rings')}
              className="hover:text-gray-600 flex items-center"
            >
              Rings
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {openDropdown === 'rings' && (
              <div className="absolute bg-white shadow-lg p-6 z-10 left-0 w-[300px] mt-2">
                <div className="grid grid-cols-1 gap-4">
                  <Link href="/rings/silver" className="hover:text-gray-600" onClick={closeDropdowns}>Silver Rings</Link>
                  <Link href="/rings/gold" className="hover:text-gray-600" onClick={closeDropdowns}>Gold Plated</Link>
                  <Link href="/rings/gemstone" className="hover:text-gray-600" onClick={closeDropdowns}>Gemstone</Link>
                  <Link href="/rings/adjustable" className="hover:text-gray-600" onClick={closeDropdowns}>Adjustable</Link>
                </div>
              </div>
            )}
          </div>
        </nav>

        <div className="flex items-center space-x-4">
          <button className="hover:text-gray-600">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
          <Link href="/account" className="hover:text-gray-600">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </Link>
          <Link href="/cart" className="hover:text-gray-600">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </Link>
          <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Overlay to close dropdowns when clicking outside */}
        {openDropdown && (
          <div 
            className="fixed inset-0 z-0" 
            onClick={closeDropdowns}
          />
        )}
      </header>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white p-4 shadow-lg">
          <nav className="flex flex-col space-y-4">
            <div className="py-2 border-b border-gray-200">
              <div className="font-medium mb-2">Categories</div>
              <div className="grid grid-cols-2 gap-2">
                {categories.map((category, index) => (
                  <Link href={category.path} key={index} className="flex items-center p-2 hover:bg-gray-50 rounded">
                    <div className="h-10 w-10 relative mr-2 overflow-hidden rounded">
                      <img 
                        src={category.image} 
                        alt={category.name}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <span className="text-sm">{category.name}</span>
                  </Link>
                ))}
              </div>
            </div>
            <Link href="/love" className="hover:text-gray-600">Love</Link>
            <Link href="/best-sellers" className="hover:text-gray-600">Best Sellers</Link>
            <Link href="/rings" className="hover:text-gray-600">Rings</Link>
          </nav>
        </div>
      )}
    </>
  );
}