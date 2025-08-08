'use client'

import { useEffect, useState } from 'react'
import supabase from '@/lib/supabase/client'
import { useSession } from '@supabase/auth-helpers-react'
import { Button } from '@/components/ui/button'
import AuthGuard from '@/components/auth-guard'
import Link from 'next/link'
import { ShoppingBag, ArrowLeft } from 'lucide-react'
import Header from '@/components/header'
import Image from 'next/image'

export default function CartPage() {
  type Product = {
    id: number
    name: string
    price: number
    image_url: string
    description: string
  }

  type CartItem = {
    id: number
    quantity: number
    products: Product
  }

  const [items, setItems] = useState<CartItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const session = useSession()

  useEffect(() => {
    if (!session) {
      setIsLoading(false)
      return
    }

    async function fetchCart() {
      if (!session?.user?.id) {
        setIsLoading(false)
        return
      }

      const { data, error } = await supabase
        .from('cart_items')
        .select('id, quantity, products(*)')
        .eq('user_id', session.user.id)

      if (error) console.error('Erro ao buscar carrinho:', error)
      else setItems(
        Array.isArray(data)
          ? data.map((item: { id: number; quantity: number; products: Product[] }) => ({
              id: item.id,
              quantity: item.quantity,
              products: Array.isArray(item.products) ? item.products[0] : item.products
            }))
          : []
      )
      setIsLoading(false)
    }

    fetchCart()
  }, [session])

  const total = items.reduce(
    (acc, item) => acc + item.quantity * item.products.price,
    0
  )

  async function attQuantity(id: number, novaQtd: number) {
    if (novaQtd <= 0) return removeItem(id)

    const { error } = await supabase
      .from('cart_items')
      .update({ quantity: novaQtd })
      .eq('id', id)

    if (!error) setItems(items.map(i => i.id === id ? { ...i, quantity: novaQtd } : i))
  }

  async function removeItem(id: number) {
    const { error } = await supabase.from('cart_items').delete().eq('id', id)
    if (!error) setItems(items.filter(i => i.id !== id))
  }

  // Se está carregando, mostra loading
  if (isLoading) {
    return (
      <main className="min-h-screen flex flex-col items-center">
        <div className="flex-1 w-full flex flex-col items-center">
          <Header />
          <div className="max-w-3xl mx-auto p-6 w-full">
            <div className="flex items-center justify-center py-12">
              <div className="text-lg">Carregando...</div>
            </div>
          </div>
        </div>
      </main>
    )
  }

  return (
    <AuthGuard>
      <main className="min-h-screen flex flex-col items-center">
        <div className="flex-1 w-full flex flex-col items-center">
          <Header />
          
          <div className="max-w-3xl mx-auto p-6 w-full">
            <div className="flex items-center gap-2 mb-6">
              <Link href="/" className="text-gray-500 hover:text-gray-700">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <h1 className="text-2xl font-bold">Seu Carrinho</h1>
            </div>

            {items.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-gray-600 mb-2">Seu carrinho está vazio</h2>
                <p className="text-gray-500 mb-6">
                  Adicione alguns produtos para começar suas compras!
                </p>
                <Link href="/">
                  <Button className="px-6 py-3">
                    Continuar Comprando
                  </Button>
                </Link>
              </div>
            ) : (
              <>
                {items.map(item => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between border-b py-4"
                  >
                    <div className="flex items-center gap-4">
                      {item.products.image_url && (
                        <Image
                          src={item.products.image_url}
                          alt={item.products.name}
                          className="w-16 h-16 object-cover rounded"
                          width={64}
                          height={64}

                        />
                      )}
                      <div>
                        <p className="font-semibold">{item.products.name}</p>
                        <p className="text-gray-500">R$ {item.products.price.toFixed(2)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button onClick={() => attQuantity(item.id, item.quantity - 1)} size="sm">-</Button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <Button onClick={() => attQuantity(item.id, item.quantity + 1)} size="sm">+</Button>
                      <Button onClick={() => removeItem(item.id)} variant="destructive" size="sm">Remover</Button>
                    </div>
                  </div>
                ))}

                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-lg font-semibold">Total:</span>
                    <span className="text-2xl font-bold text-green-600">
                      R$ {total.toFixed(2)}
                    </span>
                  </div>
                  <Link href="/checkout">
                    <Button className="w-full py-3 text-lg" variant="default">
                      Finalizar Pedido
                    </Button>
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      </main>
    </AuthGuard>
  )
}
