'use client';

import React from 'react';

export default function JewelryShowcase() {
  const images = [
    {
      id: 1,
      url: 'https://images.pexels.com/photos/15017676/pexels-photo-15017676.jpeg?_gl=1*17kf5xo*_ga*MTE5Mjc4NTE3Mi4xNzYxNDk3MTc0*_ga_8JE65Q40S6*czE3NjE0OTcxNzQkbzEkZzEkdDE3NjE0OTc1MDAkajQzJGwwJGgw',
      alt: 'Pearl bracelet',
      size: 'large'
    },
     {
      id: 2,
      url: 'https://images.pexels.com/photos/19288649/pexels-photo-19288649.jpeg?_gl=1*1mzstw*_ga*MTE5Mjc4NTE3Mi4xNzYxNDk3MTc0*_ga_8JE65Q40S6*czE3NjE0OTcxNzQkbzEkZzEkdDE3NjE0OTcyNTMkajU2JGwwJGgw',
      alt: 'Pink gemstone ring',
      size: 'small'
    },
    {
      id: 3,
      url: 'https://images.pexels.com/photos/14353729/pexels-photo-14353729.jpeg?_gl=1*1mu0trv*_ga*MTE5Mjc4NTE3Mi4xNzYxNDk3MTc0*_ga_8JE65Q40S6*czE3NjE0OTcxNzQkbzEkZzAkdDE3NjE0OTcxNzQkajYwJGwwJGgw',
      alt: 'Gold bracelet design',
      size: 'small'
    },
   
    {
      id: 4,
      url: 'https://www.woilasilver.com/cdn/shop/files/Website_Images_31.png?v=1760373027&width=1200',
      alt: 'Blue pendant necklace',
      size: 'large'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 to-stone-100">
      <div className="max-w-[1800px] mx-auto">
        {/* Image Grid */}
        <div className="grid grid-cols-4 gap-3">
          {images.map((image) => (
            <div
              key={image.id}
              className={`relative overflow-hidden rounded-sm group cursor-pointer ${
                image.size === 'large' ? 'h-[550px]' : 'h-[450px]'
              }`}
            >
              <img
                src={image.url}
                alt={image.alt}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>
          ))}
        </div>

        {/* Text Section */}
        <div className="text-center space-y-2 px-8 pt-8 animate-fadeIn">
          <h1 
            className="text-4xl md:text-5xl lg:text-6xl font-normal tracking-wider text-stone-700 leading-tight"
            style={{ fontFamily: 'Playfair Display, serif' }}
          >
            FOR PIECES THAT SPARKLE LIKE YOU DO
          </h1>
         
        </div>
      </div>

      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@300;400;500;600;700&display=swap');

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 1.2s ease-out;
        }

        @media (max-width: 1024px) {
          .grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 640px) {
          .grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}