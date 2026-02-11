'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import ProductCard from '@/components/ProductCard';
import PaymentModal from '@/components/PaymentModal';
import RobuxCalculator from '@/components/RobuxCalculator';
import Hero from '@/components/Hero';
import SearchBar from '@/components/SearchBar';
import NotificationPopup from '@/components/NotificationPopup';
import { database } from '@/lib/firebase';
import { ref, onValue } from 'firebase/database';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const productsRef = ref(database, 'products');
    const unsubscribe = onValue(productsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const productList = Object.entries(data).map(([key, value]) => ({
          id: key,
          ...value
        }));
        setProducts(productList);
      } else {
        setProducts([]);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleBuy = (product) => setSelectedProduct(product);

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const premiumProducts = filteredProducts.filter(p => p.category === 'Premium');
  const regularProducts = filteredProducts.filter(p => p.category === 'Regular');
  const otherProducts = filteredProducts.filter(p => p.category === 'Other');

  return (
    <main className="min-h-screen">
      <NotificationPopup />
      <Navbar />
      <Hero />

      <div className="max-w-6xl mx-auto px-5 py-8">
        <div id="custom" className="scroll-mt-20">
          <RobuxCalculator onBuy={handleBuy} />
        </div>

        <div className="border-t border-zinc-100 pt-8">
          <div className="flex items-end justify-between mb-6">
            <h2 className="text-lg font-bold text-slate-900">All Products</h2>
          </div>

          <SearchBar value={searchQuery} onChange={setSearchQuery} />

          {loading ? (
            <div className="flex justify-center py-16">
              <div className="w-6 h-6 border-2 border-violet-200 border-t-violet-600 rounded-full animate-spin"></div>
            </div>
          ) : (
            <>
              {premiumProducts.length > 0 && (
                <section id="premium" className="mb-10 scroll-mt-20">
                  <p className="text-xs font-semibold text-violet-600 uppercase tracking-wider mb-4">Premium</p>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {premiumProducts.map(p => (
                      <ProductCard key={p.id} product={p} onBuy={handleBuy} />
                    ))}
                  </div>
                </section>
              )}

              {regularProducts.length > 0 && (
                <section id="regular" className="mb-10 scroll-mt-20">
                  <p className="text-xs font-semibold text-violet-600 uppercase tracking-wider mb-4">Regular</p>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {regularProducts.map(p => (
                      <ProductCard key={p.id} product={p} onBuy={handleBuy} />
                    ))}
                  </div>
                </section>
              )}

              {otherProducts.length > 0 && (
                <section id="other" className="mb-10 scroll-mt-20">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">Other</p>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {otherProducts.map(p => (
                      <ProductCard key={p.id} product={p} onBuy={handleBuy} />
                    ))}
                  </div>
                </section>
              )}

              {products.length === 0 && (
                <div className="text-center text-slate-500 text-sm py-16">
                  No products available yet.
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <PaymentModal
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
        product={selectedProduct}
      />
    </main>
  );
}
