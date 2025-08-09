import supabase from '@/lib/supabase/client';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import AddToCartButton from '@/components/add-to-cart-button';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Star, Truck, Shield, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import Header from '@/components/header';
import { Metadata } from 'next';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import ProductCard from '@/components/product-card';

interface Params {
  params: Promise<{
    id: string;
  }>;
}

// Função para gerar metadata dinâmica
export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { id } = await params;

  const { data: product, error } = await supabase
    .from('products')
    .select('name, description')
    .eq('id', id)
    .single();

  if (error || !product) {
    return {
      title: 'Produto não encontrado | STG Catalog',
      description: 'O produto que você está procurando não foi encontrado.'
    };
  }

  return {
    title: `${product.name} | STG Catalog`,
    description: product.description || `Confira os detalhes de ${product.name} no STG Catalog.`,
    openGraph: {
      title: `${product.name} | STG Catalog`,
      description: product.description || `Confira os detalhes de ${product.name} no STG Catalog.`,
      type: 'website',
    },
  };
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

  const { data: relatedProducts } = await supabase
    .from('products')
    .select('id, name, price, image_url, description, category')
    .eq('category', product.category)
    .neq('id', product.id)
    .limit(8);

  return (
    <main className="min-h-screen bg-background">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-8">
          <Link 
            href="/" 
            className="flex items-center gap-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors duration-200"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Voltar ao Catálogo</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Imagem do Produto */}
          <Card className="overflow-hidden shadow-xl border-0">
            <CardContent className="p-0">
              {product.image_url ? (
                <div className="relative aspect-square overflow-hidden">
                  <Image
                    src={product.image_url}
                    alt={product.name}
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
              ) : (
                <div className="aspect-square bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center">
                  <span className="text-gray-500 dark:text-gray-400 font-medium">Imagem indisponível</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Informações do Produto */}
          <div className="space-y-6">
            {/* Título e Categoria */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 text-xs font-medium rounded-full">
                  {product.category}
                </span>
              </div>
              <h1 className="text-4xl font-bold text-foreground leading-tight">
                {product.name}
              </h1>
            </div>

            {/* Preço */}
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-bold text-green-600 dark:text-green-400">
                {product.price ? `R$ ${product.price.toFixed(2)}` : 'Preço não disponível'}
              </span>
              {product.price && (
                <span className="text-sm text-gray-500 dark:text-gray-400">à vista</span>
              )}
            </div>

            {/* Avaliação */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <span className="text-sm text-gray-600 dark:text-gray-400">(4.8 - 127 avaliações)</span>
            </div>

            {/* Descrição */}
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-3">
                <h3 className="text-lg font-semibold text-foreground">Descrição</h3>
              </CardHeader>
              <CardContent>
                <p className="leading-relaxed text-foreground/80">
                  {product.description || 'Descrição não disponível para este produto.'}
                </p>
              </CardContent>
            </Card>

            {/* Benefícios */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex items-center gap-3 p-4 bg-card rounded-lg shadow-sm border">
                <Truck className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-sm font-medium text-foreground">Entrega Grátis</p>
                  <p className="text-xs text-muted-foreground">Acima de R$ 50</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-card rounded-lg shadow-sm border">
                <Shield className="w-5 h-5 text-green-600" />
                <div>
                  <p className="text-sm font-medium text-foreground">Garantia</p>
                  <p className="text-xs text-muted-foreground">30 dias</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-card rounded-lg shadow-sm border">
                <RefreshCw className="w-5 h-5 text-purple-600" />
                <div>
                  <p className="text-sm font-medium text-foreground">Troca Fácil</p>
                  <p className="text-xs text-muted-foreground">7 dias</p>
                </div>
              </div>
            </div>

            {/* Ações */}
            <div className="space-y-4 pt-4">
              <AddToCartButton productId={product.id} />
              
              <Link href="/" className="block">
                <Button 
                  variant="outline" 
                  className="w-full py-3 text-lg border-2 hover:bg-gray-50 transition-colors duration-200 hover:text-black"
                >
                  Continuar Comprando
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Produtos Relacionados */}
        <div className="mt-16">
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <h2 className="text-2xl font-bold text-foreground">Produtos Relacionados</h2>
              <p className="text-muted-foreground">Você também pode gostar destes produtos</p>
            </CardHeader>
            <CardContent>
              {relatedProducts && relatedProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-stretch">
                 {relatedProducts.slice(0, 4).map((p) => (
                    <ProductCard
                      key={p.id}
                      id={p.id}
                      name={p.name}
                      price={p.price}
                      image_url={p.image_url}
                      description={p.description}
                    />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="aspect-square bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse"></div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}

