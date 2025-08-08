import supabase from '@/lib/supabase/client';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import AddToCartButton from '@/components/add-to-cart-button';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import Header from '@/components/header';

interface Params {
  params: Promise<{
    id: string;
  }>;
}

export default async function ProductPage({ params }: Params) {
  const { id } = await params;

  const { data: product, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single();
      
  if (error || !product) {
    return notFound();
  }

  return (
    <main className="min-h-screen flex flex-col items-center">
      <div className="flex-1 w-full flex flex-col items-center">
        <Header />
        
        <div className="max-w-4xl mx-auto p-6 w-full">
          <div className="flex items-center gap-2 mb-6">
            <Link href="/" className="text-gray-500 hover:text-gray-700">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-2xl font-bold">Detalhes do Produto</h1>
          </div>

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
              <p className="text-gray-700 mb-6">{product.description}</p>
              
              <div className="space-y-4">
                <AddToCartButton productId={product.id} />
                
                <Link href="/">
                  <Button variant="outline" className="w-full py-3 text-lg">
                    Continuar Comprando
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

