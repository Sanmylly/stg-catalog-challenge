import { AuthButton } from "@/components/auth-button";
import { ThemeSwitcher } from "@/components/theme-switcher";
import Link from "next/link";
//import Image from "next/image";
import ProductList from "@/components/ProductList";

export default async function Home() {

  return (
    <main className="min-h-screen flex flex-col items-center">
      <div className="flex-1 w-full flex flex-col gap-20 items-center">
        <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
          <Link href="/" className="flex items-center gap-2">
            <ThemeSwitcher />
            <span className="text-lg font-bold">Catalog Challenge</span>
          </Link>
          <div className="ml-auto flex items-center gap-4">
            <AuthButton />
          </div>
        </nav>
        <div className="flex-1 flex flex-col gap-20 max-w-5xl p-5">
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
