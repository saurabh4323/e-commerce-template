import { getBestSellers } from '../models/products';
import ProductCard from './ProductCard';

export default function FeaturedProducts() {
  // Get best selling products
  const bestSellers = getBestSellers();
  
  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-semibold">BEST SELLERS</h2>
          <p className="text-sm">10,000+ ★★★★★ Reviews</p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {bestSellers.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        
        <div className="text-center mt-8">
          <a href="/best-sellers" className="inline-block border border-black px-6 py-2 hover:bg-black hover:text-white transition-colors">
            View all
          </a>
        </div>
      </div>
    </section>
  );
}