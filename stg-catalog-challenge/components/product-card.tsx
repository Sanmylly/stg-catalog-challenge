'use client'

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Eye } from 'lucide-react';
import { useState } from 'react';
import { useSession } from '@supabase/auth-helpers-react';
import { useRouter } from 'next/navigation';
import supabase from '@/lib/supabase/client';

export interface ProductCardProps {
  id: number;
  name: string;
  price: number;
  image_url: string;
  description: string;
}

export default function ProductCard({ id, name, price, image_url, description }: ProductCardProps) {
  const [loading, setLoading] = useState(false);
  const session = useSession();
  const router = useRouter();

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault(); // Previne a navegação do Link
    
    if (!session?.user?.id) {
      router.push('/auth/login');
      return;
    }

    setLoading(true);
    
    try {
      // Verifica se o item já existe no carrinho
      const { data: existingItem } = await supabase
        .from('cart_items')
        .select('id, quantity')
        .eq('user_id', session.user.id)
        .eq('product_id', id)
        .single();

      if (existingItem) {
        // Se já existe, incrementa a quantidade
        const { error } = await supabase
          .from('cart_items')
          .update({ quantity: existingItem.quantity + 1 })
          .eq('id', existingItem.id);

        if (error) throw error;
      } else {
        // Se não existe, cria um novo item
        const { error } = await supabase
          .from('cart_items')
          .insert([
            {
              user_id: session.user.id,
              product_id: id,
              quantity: 1,
            },
          ]);

        if (error) throw error;
      }
      
    } catch (error) {
      console.error('Erro ao adicionar ao carrinho:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow m-3 h-full flex flex-col">
      <Link href={`/product/${id}`}>
        <Image
          src={image_url}
          alt={name}
          width={600}
          height={210}
          className="w-full h-48 object-cover"
        />
      </Link>
      
      <div className="p-4 flex flex-col flex-1">
        <div className="flex-1 flex flex-col">
          <div className="flex-1 flex flex-col">
            <Link href={`/product/${id}`}>
              <h3 className="text-lg font-semibold mb-3 hover:text-blue-600 transition-colors line-clamp-2 min-h-[3.5rem]">
                {name}
              </h3>
            </Link>
            
            <p className="text-gray-600 text-sm mb-2 line-clamp-3 min-h-[4.5rem]">
              {description}
            </p>
            <p className="text-xl font-bold text-green-600">
              R$ {price.toFixed(2)}
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-2 mt-auto">
          <Link href={`/product/${id}`} className="w-full">
            <Button
              variant="outline"
              size="sm"
              className="w-full flex items-center justify-center gap-2"
            >
              <Eye className="w-4 h-4" />
              Detalhes
            </Button>
          </Link>
          
          <Button
            onClick={handleAddToCart}
            disabled={loading}
            size="sm"
            className="w-full flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                Adicionando...
              </>
            ) : (
              <>
                <ShoppingCart className="w-4 h-4" />
                Adicionar
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}