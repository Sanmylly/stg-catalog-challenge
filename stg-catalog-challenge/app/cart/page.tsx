'use client'

import { useEffect, useState } from 'react'
import supabase from '@/lib/supabase/client'
import { useSession } from '@supabase/auth-helpers-react'
import { Button } from '@/components/ui/button'

export default function CarrinhoPage() {
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
  const session = useSession()

  useEffect(() => {
    if (!session) return

    async function fetchCarrinho() {
      if (!session?.user?.id) return

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
    }

    fetchCarrinho()
  }, [session])

  const total = items.reduce(
    (acc, item) => acc + item.quantity * item.products.price,
    0
  )

  async function atualizarQuantidade(id: number, novaQtd: number) {
    if (novaQtd <= 0) return removerItem(id)

    const { error } = await supabase
      .from('cart_items')
      .update({ quantity: novaQtd })
      .eq('id', id)

    if (!error) setItems(items.map(i => i.id === id ? { ...i, quantity: novaQtd } : i))
  }

  async function removerItem(id: number) {
    const { error } = await supabase.from('cart_items').delete().eq('id', id)
    if (!error) setItems(items.filter(i => i.id !== id))
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Seu Carrinho</h1>
      {items.length === 0 && <p className="text-gray-600">Seu carrinho está vazio.</p>}
      {items.map(item => (
        <div
          key={item.id}
          className="flex items-center justify-between border-b py-4"
        >
          <div>
            <p className="font-semibold">{item.products.name}</p>
            <p className="text-gray-500">R$ {item.products.price.toFixed(2)}</p>
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={() => atualizarQuantidade(item.id, item.quantity - 1)} size="sm">-</Button>
            <span>{item.quantity}</span>
            <Button onClick={() => atualizarQuantidade(item.id, item.quantity + 1)} size="sm">+</Button>
            <Button onClick={() => removerItem(item.id)} variant="destructive" size="sm">Remover</Button>
          </div>
        </div>
      ))}

      {items.length > 0 && (
        <div className="mt-6">
          <p className="text-lg font-semibold mb-4">
            Total: R$ {total.toFixed(2)}
          </p>
          <Button className="w-full py-2 text-lg" variant="default">
            Finalizar Pedido
          </Button>
        </div>
      )}
    </div>
  )
}
