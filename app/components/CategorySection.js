"use client";

export default function CategorySection() {
  const categories = [
    { 
      name: 'LOVE', 
      link: '/love', 
      image: 'https://prettiq.in/cdn/shop/files/b35f3313-f80a-45fa-9725-4cc015f4bd4d.jpg?v=1731842688' 
    },
    { 
      name: 'BEST SELLERS', 
      link: '/best-sellers', 
      image: 'https://rubans.in/cdn/shop/files/18kt-gold-plated-stainless-steel-tarnish-free-waterproof-curved-hoop-earrings-earrings-36848040542382.jpg?v=1755720077' 
    },
    { 
      name: 'SISTERS', 
      link: '/sisters', 
      image: 'https://foreverchiquestore.com/cdn/shop/files/IMG-3643.jpg?v=1724314731&width=800' 
    },
    { 
      name: 'Mom', 
      link: '/mom', 
      image: 'https://www.gehnaindia.com/_next/image?url=https%3A%2F%2Fcdn-assets.gehnaindia.com%2F7rkl8s8zbael5xun1i50ijpmuoqv&w=3840&q=75' 
    },
  
    { 
      name: 'RINGS', 
      link: '/rings', 
      image: 'https://cdn.shopify.com/s/files/1/0562/3447/5587/files/Twinkling_Titan_Ring_-_Bold_N_Italic-4010678.jpg?v=1760718331&width=533' 
    },
  ];

  return (
    <section className="py-8 md:py-10 bg-white">
      <div className="max-w-6xl mx-auto px-6 md:px-12 lg:px-16">
        <h2 className="text-lg md:text-xl font-normal text-center mb-6 md:mb-8 tracking-widest text-gray-700">
          SHOP BY CATEGORY
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
          {categories.map((category, index) => (
            <a 
              href={category.link} 
              key={index}
              className="group block"
            >
              <div className="relative aspect-square overflow-hidden bg-gray-50 rounded">
                <img 
                  src={category.image} 
                  alt={category.name}
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Category Name Below Image */}
              <div className="py-2 md:py-3">
                <h3 className="text-center text-xs md:text-sm font-normal text-gray-900 flex items-center justify-center gap-1">
                  {category.name}
                  <span className="text-xs">→</span>
                </h3>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}