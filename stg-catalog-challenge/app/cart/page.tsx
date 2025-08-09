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
      <main className="min-h-screen bg-background flex flex-col items-center">
        <div className="flex-1 w-full flex flex-col items-center">
          <Header />
          <div className="max-w-3xl mx-auto p-6 w-full">
            <div className="flex items-center justify-center py-12">
              <div className="text-lg text-foreground">Carregando...</div>
            </div>
          </div>
        </div>
      </main>
    )
  }

  return (
    <AuthGuard>
      <main className="min-h-screen bg-background flex flex-col items-center">
        <div className="flex-1 w-full flex flex-col items-center">
          <Header />
          
          <div className="max-w-5xl mx-auto p-6 w-full">
            <div className="flex items-center gap-2 mb-6">
              <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <h1 className="text-2xl font-bold text-foreground">Seu Carrinho</h1>
            </div>

            {items.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingBag className="w-16 h-16 text-gray-300 dark:text-gray-700 mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-muted-foreground mb-2">Seu carrinho está vazio</h2>
                <p className="text-muted-foreground mb-6">
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
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2 space-y-2">
                    {items.map(item => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between bg-card border rounded-lg p-4"
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
                            <p className="font-semibold text-foreground">{item.products.name}</p>
                            <p className="text-muted-foreground">R$ {item.products.price.toFixed(2)}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button onClick={() => attQuantity(item.id, item.quantity - 1)} size="sm" variant="outline">-</Button>
                          <span className="w-8 text-center text-foreground">{item.quantity}</span>
                          <Button onClick={() => attQuantity(item.id, item.quantity + 1)} size="sm" variant="outline">+</Button>
                          <Button onClick={() => removeItem(item.id)} variant="destructive" size="sm">Remover</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="space-y-4">
                    <div className="bg-card border rounded-lg p-4 shadow-sm">
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-semibold text-foreground">Total</span>
                        <span className="text-2xl font-bold text-green-600 dark:text-green-400">R$ {total.toFixed(2)}</span>
                      </div>
                      <Link href="/checkout">
                        <Button className="w-full mt-4 py-3 text-lg">Finalizar Pedido</Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </main>
    </AuthGuard>
  )
}
