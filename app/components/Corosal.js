"use client";

import { useState, useEffect } from 'react';

export default function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      image: "https://www.woilasilver.com/cdn/shop/files/Website_Images_27.png?v=1760426779&width=1200",
      title: "PREPAID MEANS PRIORITY",
      subtitle: "Because thoughtful gifts shouldn't be delayed. Prepaid orders are shipped faster."
    },
    {
      image: "https://www.woilasilver.com/cdn/shop/files/Website_Images_25.png?v=1760373027&width=1200",
      title: "HANDCRAFTED WITH LOVE",
      subtitle: "Each piece is meticulously crafted by skilled artisans to perfection."
    },
    {
      image: "https://www.woilasilver.com/cdn/shop/files/Website_Images_26.png?v=1760426776&width=1200",
      title: "TIMELESS ELEGANCE",
      subtitle: "Sterling silver jewelry that tells your unique story."
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  // Auto-play carousel
  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => clearInterval(timer);
  }, [currentSlide]);

  return (
    <div className="relative w-full h-[500px] md:h-[650px] overflow-hidden bg-[#5f2125]">
      {/* Slides */}
      <div className="relative w-full h-full">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-700 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            {/* Content Container */}
            <div className="relative w-full h-full flex items-center justify-center px-4 md:px-8">
              <div className="max-w-6xl w-full flex flex-col md:flex-row items-center gap-8">
                
                {/* Image Section */}
                <div className="w-full md:w-1/2 flex items-center justify-center">
                  <div className="relative w-full max-w-md aspect-square">
                    <img
                      src={slide.image}
                      alt={slide.title}
                      className="w-full h-full object-contain drop-shadow-2xl"
                    />
                  </div>
                </div>

                {/* Text Section */}
                <div className="w-full md:w-1/2 text-center md:text-left">
                  <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-4 md:mb-6 tracking-wider leading-tight">
                    {slide.title}
                  </h2>
                  <p className="text-base md:text-xl text-white text-opacity-90 leading-relaxed">
                    {slide.subtitle}
                  </p>
                </div>

              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white bg-opacity-70 hover:bg-opacity-90 flex items-center justify-center transition-all duration-300 z-10"
        aria-label="Previous slide"
      >
        <span className="text-xl md:text-2xl text-gray-800">‹</span>
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white bg-opacity-70 hover:bg-opacity-90 flex items-center justify-center transition-all duration-300 z-10"
        aria-label="Next slide"
      >
        <span className="text-xl md:text-2xl text-gray-800">›</span>
      </button>

      {/* Dot Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-2 h-2 md:w-3 md:h-3 rounded-full transition-all duration-300 ${
              index === currentSlide
                ? 'bg-white w-8 md:w-10'
                : 'bg-white bg-opacity-50 hover:bg-opacity-75'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          ></button>
        ))}
      </div>
    </div>
  );
}