import supabase from '@/lib/supabase/client';
import Image from 'next/image';
import { notFound } from 'next/navigation';

interface Params {
  params: {
    id: string;
  };
}


export default async function ProductPage({ params }: Params) {
  const { data: product, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', params.id)
    .single();
      
  if (error || !product) {
    return notFound();
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          {product.image_url ? (
            <Image
              src={product.image_url}
              alt={product.name}
              width={500}
              height={500}
              className="w-full h-80 object-cover rounded"
            />
          ) : (
            <div className="w-full h-80 bg-gray-200 flex items-center justify-center rounded">
              <span>Imagem indisponível</span>
            </div>
          )}
        </div>

        <div>
          <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
          <p className="text-gray-500 mb-4">Categoria: {product.category}</p>
          <p className="text-2xl font-semibold text-green-600 mb-4">
            {product.price ? `R$ ${product.price.toFixed(2)}` : 'Preço não disponível'}
          </p>
          <p className="text-gray-700">{product.description}</p>
        </div>
      </div>
    </div>
  );
}
