'use client'

import { useState } from 'react'
import supabase from '@/lib/supabase/client'

interface Props {
productId: number
userId: string
}

export default function AddToCartButton({ productId, userId }: Props) {

const [loading, setLoading] = useState(false)

const handleClick = async () => {
setLoading(true)
const { error } = await supabase
.from('cart_items')
.upsert([
{
user_id: userId,
product_id: productId,
quantity: 1, // ou incremente se já existir
},
])

if (error) {
  console.error('Erro ao adicionar ao carrinho:', error.message)
} else {
  console.log('Produto adicionado com sucesso.')
}
setLoading(false)
}

return (
<button onClick={handleClick} disabled={loading}>
{loading ? 'Adicionando...' : 'Adicionar ao Carrinho'}
</button>
)
}