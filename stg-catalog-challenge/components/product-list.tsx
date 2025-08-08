'use client';
import { useEffect, useState } from 'react';
import ProductCard from './product-card';
import { createClient } from '@/lib/supabase/client';
import { ProductCardProps } from './product-card';



export default function ProductList() {
  const [products, setProducts] = useState<ProductCardProps[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('products')
        .select('*')
      if (error) {
        setError(error.message);
      } else {
        setProducts(data);
      }
    };
    fetchProducts();
  }, []);

  const filteredProducts = products.filter(product =>
    product.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6">
      <input
        type="text"
        placeholder="Buscar produto..."
        className="w-full p-2 border rounded mb-4"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {error && <div className="text-red-500 mb-4">{error}</div>}

      <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 items-stretch">
        {filteredProducts.map(product => (
          <ProductCard key={product.id} {...product} />
        ))}
      </div>
    </div>
  );
}