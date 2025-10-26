export default function Testimonials() {
  const testimonials = [
    {
      image: "https://www.woilasilver.com/cdn/shop/files/IMG_3883.jpg?v=1760264165&width=750",
      text: "It felt personal without being over the top",
      author: "Sakshi Raman",
      rating: 5
    },
    {
      image: "https://silvermerc.com/cdn/shop/files/85D_7395.jpg?v=1704368228&width=1445",
      text: "Gifted it randomly and she was genuinely touched",
      author: "Ria Kapoor",
      rating: 5
    },
    {
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT_CZHzzN3jO3mlvWIVW98cj2284Uv8O0yudQ&s",
      text: "She called it the sweetest surprise ever!",
      author: "Ahana Ahuja",
      rating: 5
    },
    {
      image: "https://i.pinimg.com/564x/a3/12/af/a312afc81c5359ca3e29a070d3f2d201.jpg",
      text: "Obsessed with how dainty and pretty this necklace looks on me",
      author: "Avneet Kaur",
      rating: 5
    },   {
      image: "https://www.woilasilver.com/cdn/shop/files/IMG_3883.jpg?v=1760264165&width=750",
      text: "It felt personal without being over the top",
      author: "Sakshi Raman",
      rating: 5
    }
  ];

  return (
    <section className="py-20 bg-neutral-100">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-light text-gray-800 mb-3">
            Loved by everyone, everywhere. Don't miss out!
          </h2>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index}
              className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300"
            >
              <div className="p-4">
                <div className="relative mb-4 rounded-xl overflow-hidden">
                  <img 
                    src={testimonial.image}
                    alt={testimonial.author}
                    className="w-full h-64 object-cover"
                  />
                </div>
                
                <div className="flex justify-center mb-3">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <svg 
                      key={i}
                      className="w-5 h-5 text-gray-800 fill-current"
                      viewBox="0 0 20 20"
                    >
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                    </svg>
                  ))}
                </div>
                
                <p className="text-gray-700 text-center text-sm mb-4 leading-relaxed">
                  {testimonial.text}
                </p>
                
                <p className="text-gray-900 text-center font-medium text-sm">
                  - {testimonial.author}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}