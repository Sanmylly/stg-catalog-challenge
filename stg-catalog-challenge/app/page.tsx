import { DeployButton } from "@/components/deploy-button";
import { EnvVarWarning } from "@/components/env-var-warning";
import { AuthButton } from "@/components/auth-button";
import { ThemeSwitcher } from "@/components/theme-switcher";
import Link from "next/link";
import Image from "next/image";
import ProductList from "@/components/ProductList";

export default async function Home() {

  return (
    <main className="min-h-screen flex flex-col items-center">
      <div className="flex-1 w-full flex flex-col gap-20 items-center">
        <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src=""
              alt="Logo"
              className="h-8 w-auto"
              width={32}
              height={32}
            />
            <span className="text-lg font-bold">Catalog Challenge</span>
          </Link>
          <div className="flex-1">
            <ProductList />
          </div>
          <div className="ml-auto flex items-center gap-4">
            <AuthButton />
            <DeployButton />
            <EnvVarWarning />
          </div>
            
        </nav>
        <div className="flex-1 flex flex-col gap-20 max-w-5xl p-5">

          
        </div>

        <footer className="w-full flex items-center justify-center border-t mx-auto text-center text-xs gap-8 py-16">
          <p>
            Powered by{" "}
            <a
              href="https://supabase.com/?utm_source=create-next-app&utm_medium=template&utm_term=nextjs"
              target="_blank"
              className="font-bold hover:underline"
              rel="noreferrer noopener"
            >
              Supabase
            </a>
          </p>
          <ThemeSwitcher />
        </footer>
      </div>
    </main>
  );
}
