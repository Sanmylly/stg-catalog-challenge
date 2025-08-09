'use client'

import { useEffect, useState } from 'react'
import supabase from '@/lib/supabase/client'
import { useSession } from '@supabase/auth-helpers-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import AuthGuard from '@/components/auth-guard'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, MapPin, MessageCircle, ShoppingBag } from 'lucide-react'
import Header from '@/components/header'
import { useRouter } from 'next/navigation'

export default function CheckoutPage() {
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
  const [isProcessing, setIsProcessing] = useState(false)
  const session = useSession()
  const router = useRouter()

  // Form states
  const [shippingInfo, setShippingInfo] = useState({
    fullName: '',
    email: session?.user?.email || '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'Brasil'
  })

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

      if (error) {
        console.error('Erro ao buscar carrinho:', error)
      } else {
        const cartItems = Array.isArray(data)
          ? data.map((item: { id: number; quantity: number; products: Product[] }) => ({
              id: item.id,
              quantity: item.quantity,
              products: Array.isArray(item.products) ? item.products[0] : item.products
            }))
          : []
        setItems(cartItems)
      }
      setIsLoading(false)
    }

    fetchCart()
  }, [session])

  // Calculate total
  const total = items.reduce((acc, item) => acc + item.quantity * item.products.price, 0)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setShippingInfo(prev => ({ ...prev, [name]: value }))
  }

  const handleWhatsAppOrder = async () => {
    if (!session?.user?.id) return

    // Validate required fields
    const requiredFields = ['fullName', 'email', 'phone', 'address', 'city', 'state', 'zipCode']
    const missingFields = requiredFields.filter(field => !shippingInfo[field as keyof typeof shippingInfo])
    
    if (missingFields.length > 0) {
      alert(`Por favor, preencha os campos obrigatórios: ${missingFields.join(', ')}`)
      return
    }

    setIsProcessing(true)

    try {
      // Format message according to requirements
      const productsList = items.map(item => 
        `•⁠  ⁠${item.products.name} - Qtd: ${item.quantity} - R$ ${(item.quantity * item.products.price).toFixed(2)}`
      ).join('\n')

      const message = `🛍️ NOVO PEDIDO - STG CATALOG
👤 Cliente: ${shippingInfo.fullName}
📧 Email: ${shippingInfo.email}
📱 Telefone: ${shippingInfo.phone}
📍 Endereço: ${shippingInfo.address}, ${shippingInfo.city} - ${shippingInfo.state} - CEP: ${shippingInfo.zipCode}
🛒 PRODUTOS:
${productsList}
💵 TOTAL: R$ ${total.toFixed(2)}
---
Pedido via STG Catalog`

      // Encode message for WhatsApp
      const encodedMessage = encodeURIComponent(message)
      const whatsappNumber = '5511999999999' // Replace with actual WhatsApp number
      const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`

      // Clear cart after opening WhatsApp
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', session.user.id)

      if (error) throw error
      
      // Open WhatsApp
      window.open(whatsappUrl, '_blank')
      
      // Show success message
      alert('Pedido enviado para o WhatsApp! ')
      router.push('/')
      
    } catch (error) {
      console.error('Erro ao processar pedido:', error)
      alert('Erro ao processar pedido. Tente novamente.')
    } finally {
      setIsProcessing(false)
    }
  }

  if (isLoading) {
    return (
      <main className="min-h-screen bg-background flex flex-col items-center">
        <div className="flex-1 w-full flex flex-col items-center">
          <Header />
          <div className="max-w-6xl mx-auto p-6 w-full">
            <div className="flex items-center justify-center py-12">
              <div className="text-lg text-foreground">Carregando...</div>
            </div>
          </div>
        </div>
      </main>
    )
  }

  // Redirect to cart if empty
  if (items.length === 0) {
    return (
      <main className="min-h-screen flex flex-col items-center">
        <div className="flex-1 w-full flex flex-col items-center">
          <Header />
          <div className="max-w-6xl mx-auto p-6 w-full">
            <div className="text-center py-12">
              <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-600 mb-2">Carrinho vazio</h2>
              <p className="text-gray-500 mb-6">
                Adicione alguns produtos antes de finalizar o pedido.
              </p>
              <Link href="/">
                <Button className="px-6 py-3">
                  Continuar Comprando
                </Button>
              </Link>
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
          
          <div className="max-w-6xl mx-auto p-6 w-full">
            <div className="flex items-center gap-2 mb-8">
              <Link href="/cart" className="text-muted-foreground hover:text-foreground transition-colors">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <h1 className="text-3xl font-bold text-foreground">Finalizar Pedido</h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column - Forms */}
              <div className="lg:col-span-2 space-y-6">
                {/* Shipping Information */}
                <Card className="bg-card border shadow-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-foreground">
                      <MapPin className="w-5 h-5" />
                      Informações de Entrega
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="fullName">Nome Completo *</Label>
                        <Input
                          id="fullName"
                          name="fullName"
                          value={shippingInfo.fullName}
                          onChange={handleInputChange}
                          placeholder="Seu nome completo"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={shippingInfo.email}
                          onChange={handleInputChange}
                          placeholder="seu@email.com"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">Telefone *</Label>
                        <Input
                          id="phone"
                          name="phone"
                          value={shippingInfo.phone}
                          onChange={handleInputChange}
                          placeholder="(11) 99999-9999"
                          required
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="address">Endereço *</Label>
                      <Input
                        id="address"
                        name="address"
                        value={shippingInfo.address}
                        onChange={handleInputChange}
                        placeholder="Rua, número, complemento"
                        required
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="city">Cidade *</Label>
                        <Input
                          id="city"
                          name="city"
                          value={shippingInfo.city}
                          onChange={handleInputChange}
                          placeholder="São Paulo"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="state">Estado *</Label>
                        <Input
                          id="state"
                          name="state"
                          value={shippingInfo.state}
                          onChange={handleInputChange}
                          placeholder="SP"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="zipCode">CEP *</Label>
                        <Input
                          id="zipCode"
                          name="zipCode"
                          value={shippingInfo.zipCode}
                          onChange={handleInputChange}
                          placeholder="00000-000"
                          required
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>


              </div>

              {/* Right Column - Order Summary */}
              <div className="space-y-6">
                {/* Cart Items */}
                <Card className="bg-card border shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-foreground">Resumo do Pedido</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {items.map(item => (
                        <div key={item.id} className="flex items-center gap-3 pb-3 border-b last:border-b-0">
                          {item.products.image_url && (
                            <Image
                              src={item.products.image_url}
                              alt={item.products.name}
                              className="w-12 h-12 object-cover rounded"
                              width={48}
                              height={48}
                            />
                          )}
                          <div className="flex-1">
                            <p className="font-medium text-sm">{item.products.name}</p>
                            <p className="text-gray-500 text-sm">
                              Qtd: {item.quantity} × R$ {item.products.price.toFixed(2)}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold">
                              R$ {(item.quantity * item.products.price).toFixed(2)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Order Totals */}
                <Card className="bg-card border shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-foreground">Detalhes do Pagamento</CardTitle>
                  </CardHeader>
                  <CardContent>
                                         <div className="space-y-3">
                       <div className="flex justify-between text-lg font-bold">
                         <span>Total ({items.length} {items.length === 1 ? 'item' : 'itens'})</span>
                         <span className="text-green-600 dark:text-green-400">
                           R$ {total.toFixed(2)}
                         </span>
                       </div>
                     </div>
                    
                    <Button 
                      onClick={handleWhatsAppOrder}
                      disabled={isProcessing}
                      className="w-full mt-6 py-3 text-lg bg-green-600 hover:bg-green-700" 
                      size="lg"
                    >
                      {isProcessing ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Processando...
                        </>
                      ) : (
                        <>
                          <MessageCircle className="w-5 h-5 mr-2" />
                          Finalizar via WhatsApp
                        </>
                      )}
                    </Button>
                    
                     <p className="text-xs text-muted-foreground mt-3 text-center">
                      Ao finalizar o pedido, você concorda com nossos termos e condições.
                    </p>
                  </CardContent>
                </Card>

                {/* Security Notice */}
                <Card className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-900/40">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-2 text-green-700 dark:text-green-400">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm font-medium">Compra 100% Segura</span>
                    </div>
                    <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                      Seus dados estão protegidos com criptografia SSL
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </main>
    </AuthGuard>
  )
}
