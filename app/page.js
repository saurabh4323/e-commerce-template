
import Hero from './components/Hero';
import CategorySection from './components/CategorySection';
import FeaturedProducts from './components/FeaturedProducts';
import Testimonials from './components/Testimonials';
import HeroCarousel from './components/Corosal';

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
    
<Hero></Hero>
    {/* <HeroCarousel></HeroCarousel> */}
      {/* <Hero /> */}
      <CategorySection />
       {/* <Hero></Hero> */}
       <HeroCarousel></HeroCarousel>
      <FeaturedProducts />
      {/* <HeroCarousel></HeroCarousel>
       */}
      
      <Testimonials />
      
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gray-50 p-8 flex flex-col items-center justify-center">
              <h3 className="text-xl font-semibold mb-4">INTENTIONAL, UNRUSHED.</h3>
              <p className="text-center text-gray-600">
                We value intention over impulse that's why cancellations aren't part of how we work.
              </p>
            </div>
            
            <div className="bg-gray-50 p-8 flex flex-col items-center justify-center">
              <h3 className="text-xl font-semibold mb-4">CHARMS THAT STAY CLOSE TO YOU</h3>
              <p className="text-center text-gray-600 mb-4">
                A perfect collection for you and the people you've made memories, moments with.
              </p>
              <a href="/jewelry" className="inline-block border border-black px-6 py-2 hover:bg-black hover:text-white transition-colors">
                Shop Necklaces
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
