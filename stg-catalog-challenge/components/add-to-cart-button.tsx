'use client'

import { useState } from 'react'
import { useSession } from '@supabase/auth-helpers-react'
import { useRouter } from 'next/navigation'
import supabase from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { ShoppingCart, Check } from 'lucide-react'

interface Props {
  productId: number
}

export default function AddToCartButton({ productId }: Props) {
  const [loading, setLoading] = useState(false)
  const [added, setAdded] = useState(false)
  const session = useSession()
  const router = useRouter()

  const handleClick = async () => {
    if (!session?.user?.id) {
      router.push('/auth/login')
      return
    }

    setLoading(true)
    
    try {
      // Primeiro, verifica se o item já existe no carrinho
      const { data: existingItem } = await supabase
        .from('cart_items')
        .select('id, quantity')
        .eq('user_id', session.user.id)
        .eq('product_id', productId)
        .single()

      if (existingItem) {
        // Se já existe, incrementa a quantidade
        const { error } = await supabase
          .from('cart_items')
          .update({ quantity: existingItem.quantity + 1 })
          .eq('id', existingItem.id)

        if (error) throw error
      } else {
        // Se não existe, cria um novo item
        const { error } = await supabase
          .from('cart_items')
          .insert([
            {
              user_id: session.user.id,
              product_id: productId,
              quantity: 1,
            },
          ])

        if (error) throw error
      }

      setAdded(true)
      setTimeout(() => setAdded(false), 2000) // Remove o feedback após 2 segundos
      
    } catch (error) {
      console.error('Erro ao adicionar ao carrinho:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button 
      onClick={handleClick} 
      disabled={loading}
      className="w-full py-3 text-lg"
      variant={added ? "default" : "outline"}
    >
      {loading ? (
        <>
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
          Adicionando...
        </>
      ) : added ? (
        <>
          <Check className="w-5 h-5 mr-2" />
          Adicionado ao Carrinho!
        </>
      ) : (
        <>
          <ShoppingCart className="w-5 h-5 mr-2" />
          Adicionar ao Carrinho
        </>
      )}
    </Button>
  )
}