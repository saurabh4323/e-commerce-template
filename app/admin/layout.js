"use client";

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export default function AdminLayout({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Check if user is authenticated
    const adminAuthenticated = sessionStorage.getItem('adminAuthenticated');
    
    // If on login page, don't redirect
    if (pathname === '/admin') {
      setIsLoading(false);
      return;
    }
    
    if (adminAuthenticated !== 'true') {
      router.push('/admin');
    } else {
      setIsAuthenticated(true);
    }
    
    setIsLoading(false);
  }, [pathname, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  // If on login page or not authenticated, just render children
  if (pathname === '/admin' || !isAuthenticated) {
    return <>{children}</>;
  }

  // Admin layout for authenticated users
  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <div className="w-64 bg-gray-800 text-white p-4">
        <div className="text-xl font-bold mb-8">Woila Admin</div>
        <nav>
          <ul className="space-y-2">
            <li>
              <a 
                href="/admin/dashboard" 
                className={`block p-2 rounded ${pathname === '/admin/dashboard' ? 'bg-gray-700' : 'hover:bg-gray-700'}`}
              >
                Dashboard
              </a>
            </li>
            <li>
              <a 
                href="/admin/products" 
                className={`block p-2 rounded ${pathname === '/admin/products' ? 'bg-gray-700' : 'hover:bg-gray-700'}`}
              >
                Products
              </a>
            </li>
            <li>
              <a 
                href="/admin/orders" 
                className={`block p-2 rounded ${pathname === '/admin/orders' ? 'bg-gray-700' : 'hover:bg-gray-700'}`}
              >
                Orders
              </a>
            </li>
            <li>
              <button 
                onClick={() => {
                  sessionStorage.removeItem('adminAuthenticated');
                  router.push('/admin');
                }}
                className="block w-full text-left p-2 rounded hover:bg-gray-700"
              >
                Logout
              </button>
            </li>
          </ul>
        </nav>
      </div>
      
      {/* Main content */}
      <div className="flex-1 p-8 bg-gray-100">
        {children}
      </div>
    </div>
  );
}