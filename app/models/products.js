// Dummy product data for the Woila Silver e-commerce site

export const products = [
  {
    id: '1',
    name: 'The Northern Star',
    price: 1699.00,
    description: 'You are always drawn to the North Star. Its been your guiding light through the darkest of nights. This piece is a reminder that you will always find your way.',
    images: ['https://www.woilasilver.com/cdn/shop/files/Website_Images_25.png?v=1760373027&width=1200', 'https://www.woilasilver.com/cdn/shop/files/Website_Images_26.png?v=1760373027&width=1200'],
    category: ['best-sellers', 'love'],
    reviews: 45,
    rating: 4.8,
    inStock: true,
    variants: [
      { name: 'Sterling Silver', price: 1699.00 },
      { name: '18k Gold', price: 1999.00 }
    ]
  },
  {
    id: 'the-moon',
    name: 'The Moon',
    price: 1699.00,
    description: "'You're mysterious and ever-changing, just like the phases of the moon. This piece is a reminder of your ability to adapt and evolve through life's journey.'",
    images: ['https://www.woilasilver.com/cdn/shop/files/Website_Images_27.png?v=1760373027&width=1200', 'https://www.woilasilver.com/cdn/shop/files/Website_Images_28.png?v=1760373027&width=1200'],
    category: ['best-sellers'],
    reviews: 49,
    rating: 4.9,
    inStock: true,
    variants: [
      { name: 'Sterling Silver', price: 1699.00 },
      { name: '18k Gold', price: 1999.00 }
    ]
  },
  {
    id: 'to-infinity-and-beyond',
    name: 'To Infinity and Beyond',
    price: 1999.00,
    description: 'For bonds that feel like no other, for the love that runs deeper than words. This piece is a quiet flame, a burning reminder of your infinity and beyond.',
    images: ['https://www.woilasilver.com/cdn/shop/files/Website_Images_29.png?v=1760373027&width=1200', 'https://www.woilasilver.com/cdn/shop/files/Website_Images_30.png?v=1760373027&width=1200'],
    category: ['love', 'sisters'],
    reviews: 39,
    rating: 4.9,
    inStock: true,
    variants: [
      { name: 'Sterling Silver', price: 1999.00 },
      { name: '18k Gold', price: 2299.00 }
    ]
  },
  {
    id: 'the-olive-leaf',
    name: 'The Olive Leaf',
    price: 1599.00,
    description: "'You're a peacemaker and healer. The olive leaf has been a symbol of peace and victory since ancient times. This piece is a reminder of your gentle and kind spirit.'",
    images: ['https://www.woilasilver.com/cdn/shop/files/Website_Images_31.png?v=1760373027&width=1200', 'https://www.woilasilver.com/cdn/shop/files/Website_Images_32.png?v=1760373027&width=1200'],
    category: ['best-sellers', 'self-love'],
    reviews: 49,
    rating: 4.7,
    inStock: true,
    variants: [
      { name: 'Sterling Silver', price: 1599.00 },
      { name: '18k Gold', price: 1899.00 }
    ]
  },
  {
    id: 'the-whale-tail',
    name: 'The Whale Tail',
    price: 1899.00,
    description: "'You're a free spirit who loves adventure and exploration. The whale tail symbolizes freedom and the vast ocean of possibilities. This piece is a reminder to dive deep and explore.'",
    images: ['https://www.woilasilver.com/cdn/shop/files/Website_Images_33.png?v=1760373027&width=1200', 'https://www.woilasilver.com/cdn/shop/files/Website_Images_34.png?v=1760373027&width=1200'],
    category: ['self-love'],
    reviews: 85,
    rating: 4.6,
    inStock: true,
    variants: [
      { name: 'Sterling Silver', price: 1899.00 },
      { name: '18k Gold', price: 2199.00 }
    ]
  },
  {
    id: 'the-butterfly',
    name: 'The Butterfly',
    price: 1599.00,
    description: "'The butterfly symbolizes transformation and growth. This piece is a reminder of your journey and the beautiful changes you've undergone.'",
    images: ['https://www.woilasilver.com/cdn/shop/files/Website_Images_35.png?v=1760373027&width=1200', 'https://www.woilasilver.com/cdn/shop/files/Website_Images_36.png?v=1760373027&width=1200'],
    category: ['self-love', 'gifts'],
    reviews: 42,
    rating: 4.8,
    inStock: true,
    variants: [
      { name: 'Sterling Silver', price: 1599.00 },
      { name: '18k Gold', price: 1899.00 }
    ]
  },
  {
    id: 'the-magnolia',
    name: 'The Magnolia',
    price: 1599.00,
    description: 'The magnolia flower symbolizes purity, dignity, and beauty. This piece is a reminder of your inner strength and grace.',
    images: ['https://www.woilasilver.com/cdn/shop/files/Website_Images_37.png?v=1760373027&width=1200', 'https://www.woilasilver.com/cdn/shop/files/Website_Images_38.png?v=1760373027&width=1200'],
    category: ['mom', 'gifts'],
    reviews: 36,
    rating: 4.9,
    inStock: true,
    variants: [
      { name: 'Sterling Silver', price: 1599.00 },
      { name: '18k Gold', price: 1899.00 }
    ]
  },
  {
    id: 'infinity-ring',
    name: 'Infinity Ring',
    price: 1099.00,
    description: 'A symbol of eternal love and connection, this infinity ring represents the endless bond you share with someone special.',
    images: ['https://www.woilasilver.com/cdn/shop/files/Website_Images_39.png?v=1760373027&width=1200', 'https://www.woilasilver.com/cdn/shop/files/Website_Images_40.png?v=1760373027&width=1200'],
    category: ['rings', 'love'],
    reviews: 33,
    rating: 4.7,
    inStock: true,
    variants: [
      { name: 'Sterling Silver', price: 1099.00 },
      { name: '18k Gold', price: 1399.00 }
    ]
  }
];

// Helper functions to work with products
export const getProductById = (id) => {
  return products.find(product => product.id === id);
};

export const getProductsByCategory = (category) => {
  return products.filter(product => product.category.includes(category));
};

export const getBestSellers = () => {
  return getProductsByCategory('best-sellers');
};

export const getProductsBySearch = (searchTerm) => {
  const term = searchTerm.toLowerCase();
  return products.filter(product => 
    product.name.toLowerCase().includes(term) || 
    product.description.toLowerCase().includes(term)
  );
};