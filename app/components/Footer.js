import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-zinc-900 text-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="text-center md:text-left">
            <h3 className="text-xl font-semibold mb-4">INTENTIONAL, UNRUSHED.</h3>
            <p className="text-gray-300">
              We value intention over impulse that's why cancellations aren't part of how we work.
            </p>
          </div>
          
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-4">CHARMS THAT STAY CLOSE TO YOU</h3>
            <p className="text-gray-300 mb-4">
              A perfect collection for you and the people you've made memories, moments with.
            </p>
            <Link href="/jewelry" className="inline-block border border-white px-6 py-2 hover:bg-white hover:text-black transition-colors">
              Shop Necklaces
            </Link>
          </div>
          
          <div className="text-center md:text-right">
            <div className="flex flex-col space-y-4">
              <div className="flex items-center justify-center md:justify-end">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5 mr-2">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Handcrafted in India</span>
              </div>
              <div className="flex items-center justify-center md:justify-end">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5 mr-2">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <span>6 Months Warranty</span>
              </div>
              <div className="flex items-center justify-center md:justify-end">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5 mr-2">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
                <span>92.5 Sterling Silver Jewellery</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-700 pt-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="text-lg font-medium mb-4">Subscribe to our emails</h3>
              <p className="text-gray-300 mb-4">Be the first to know about new collections and exclusive offers.</p>
              <div className="flex">
                <input 
                  type="email" 
                  placeholder="Email" 
                  className="flex-grow border border-gray-600 bg-zinc-800 text-white px-4 py-2 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white"
                />
                <button className="bg-white text-black px-6 py-2 hover:bg-gray-200">
                  Subscribe
                </button>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-4">Our Story</h3>
              <p className="text-gray-300">
                Our mission is to create minimalist and affordable sterling silver jewelry that empowers individuals to express their unique style with confidence and ease, while prioritizing sustainability and ethical practices in every aspect of our business.
              </p>
            </div>
          </div>
          
          <div className="text-center text-sm text-gray-400">
            <p>© {new Date().getFullYear()} Woila Silver. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}