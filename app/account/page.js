"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AccountPage() {
  const [activeTab, setActiveTab] = useState('login');
  const [formData, setFormData] = useState({
    login: {
      email: '',
      password: ''
    },
    register: {
      name: '',
      email: '',
      password: '',
      confirmPassword: ''
    }
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e, formType) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [formType]: {
        ...prev[formType],
        [name]: value
      }
    }));
  };

  const validateLoginForm = () => {
    const newErrors = {};
    const { email, password } = formData.login;

    if (!email) newErrors.loginEmail = 'Email is required';
    if (!password) newErrors.loginPassword = 'Password is required';

    return newErrors;
  };

  const validateRegisterForm = () => {
    const newErrors = {};
    const { name, email, password, confirmPassword } = formData.register;

    if (!name) newErrors.registerName = 'Name is required';
    if (!email) newErrors.registerEmail = 'Email is required';
    if (!password) newErrors.registerPassword = 'Password is required';
    if (password.length < 6) newErrors.registerPassword = 'Password must be at least 6 characters';
    if (password !== confirmPassword) newErrors.registerConfirmPassword = 'Passwords do not match';

    return newErrors;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    
    const formErrors = validateLoginForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData.login),
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Store user data in localStorage
        localStorage.setItem('userAuthenticated', 'true');
        localStorage.setItem('userData', JSON.stringify(data.data));
        router.push('/');
      } else {
        setErrors({ loginForm: data.error || 'Login failed' });
      }
    } catch (err) {
      setErrors({ loginForm: 'An error occurred. Please try again.' });
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    
    const formErrors = validateRegisterForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData.register),
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Auto login after successful registration
        localStorage.setItem('userAuthenticated', 'true');
        localStorage.setItem('userData', JSON.stringify(data.data));
        router.push('/');
      } else {
        setErrors({ registerForm: data.error || 'Registration failed' });
      }
    } catch (err) {
      setErrors({ registerForm: 'An error occurred. Please try again.' });
      console.error('Registration error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white py-12">
      <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-sm border border-gray-100">
        <h1 className="text-3xl font-light text-center mb-8">My Account</h1>
        
        {/* Tab Navigation */}
        <div className="flex mb-8 border-b">
          <button
            className={`flex-1 py-3 font-light ${activeTab === 'login' ? 'border-b-2 border-black text-black' : 'text-gray-400'}`}
            onClick={() => setActiveTab('login')}
          >
            Sign In
          </button>
          <button
            className={`flex-1 py-3 font-light ${activeTab === 'register' ? 'border-b-2 border-black text-black' : 'text-gray-400'}`}
            onClick={() => setActiveTab('register')}
          >
            Create Account
          </button>
        </div>
        
        {/* Login Form */}
        {activeTab === 'login' && (
          <form onSubmit={handleLogin} className="space-y-6">
            {errors.loginForm && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {errors.loginForm}
              </div>
            )}
            
            <div>
              <label htmlFor="login-email" className="block text-sm font-light text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                id="login-email"
                name="email"
                value={formData.login.email}
                onChange={(e) => handleChange(e, 'login')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black"
              />
              {errors.loginEmail && <p className="mt-1 text-sm text-red-600">{errors.loginEmail}</p>}
            </div>
            
            <div>
              <label htmlFor="login-password" className="block text-sm font-light text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                id="login-password"
                name="password"
                value={formData.login.password}
                onChange={(e) => handleChange(e, 'login')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black"
              />
              {errors.loginPassword && <p className="mt-1 text-sm text-red-600">{errors.loginPassword}</p>}
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-black focus:ring-black border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                  Remember me
                </label>
              </div>
              
              <div className="text-sm">
                <a href="#" className="font-light text-gray-600 hover:text-black">
                  Forgot password?
                </a>
              </div>
            </div>
            
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-black text-white py-2 px-4 rounded-md hover:bg-gray-800 transition-colors disabled:opacity-70"
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        )}
        
        {/* Register Form */}
        {activeTab === 'register' && (
          <form onSubmit={handleRegister} className="space-y-6">
            {errors.registerForm && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {errors.registerForm}
              </div>
            )}
            
            <div>
              <label htmlFor="register-name" className="block text-sm font-light text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                id="register-name"
                name="name"
                value={formData.register.name}
                onChange={(e) => handleChange(e, 'register')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black"
              />
              {errors.registerName && <p className="mt-1 text-sm text-red-600">{errors.registerName}</p>}
            </div>
            
            <div>
              <label htmlFor="register-email" className="block text-sm font-light text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                id="register-email"
                name="email"
                value={formData.register.email}
                onChange={(e) => handleChange(e, 'register')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black"
              />
              {errors.registerEmail && <p className="mt-1 text-sm text-red-600">{errors.registerEmail}</p>}
            </div>
            
            <div>
              <label htmlFor="register-password" className="block text-sm font-light text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                id="register-password"
                name="password"
                value={formData.register.password}
                onChange={(e) => handleChange(e, 'register')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black"
              />
              {errors.registerPassword && <p className="mt-1 text-sm text-red-600">{errors.registerPassword}</p>}
            </div>
            
            <div>
              <label htmlFor="register-confirm-password" className="block text-sm font-light text-gray-700 mb-1">
                Confirm Password
              </label>
              <input
                type="password"
                id="register-confirm-password"
                name="confirmPassword"
                value={formData.register.confirmPassword}
                onChange={(e) => handleChange(e, 'register')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black"
              />
              {errors.registerConfirmPassword && <p className="mt-1 text-sm text-red-600">{errors.registerConfirmPassword}</p>}
            </div>
            
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-black text-white py-2 px-4 rounded-md hover:bg-gray-800 transition-colors disabled:opacity-70"
            >
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>
        )}
        
        <div className="mt-8 text-center">
          <Link href="/" className="text-sm font-light text-gray-600 hover:text-black">
            Return to Store
          </Link>
        </div>
      </div>
    </div>
  );
}