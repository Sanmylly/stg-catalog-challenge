import ProductList from "@/components/product-list";
import Header from "@/components/header";
import { Metadata } from 'next';

   export const metadata: Metadata = {
     title: 'Product Catalog',
   };


export default async function Home() {

  return (
    <main className="min-h-screen flex flex-col items-center">
      <div className="flex-1 w-full flex flex-col gap-20 items-center">
        <Header />
        
        <div className="flex-1 flex flex-col gap-20 max-w-7xl p-5">
          <div className="flex flex-col items-center gap-4">
            <h1 className="text-3xl font-bold">Welcome to the Product Catalog</h1>
            <p className="text-lg text-muted-foreground">
              Explore our collection of products and find what you need.
            </p>
          </div>

          <ProductList />
          
        </div>

        <footer className="w-full flex items-center justify-center border-t mx-auto text-center text-xs gap-8 py-16">
          <p>
            Powered by Évora
          </p>
        </footer>
      </div>
    </main>
  );
}
