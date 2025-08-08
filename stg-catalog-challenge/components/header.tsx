'use client'

import { AuthButton } from "@/components/auth-button";
import { ThemeSwitcher } from "@/components/theme-switcher";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Header() {
  return (
    <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
      <div className="flex items-center gap-2">
        <ThemeSwitcher />
        <Link href="/" className="flex items-center gap-2">
          <span className="text-lg font-bold">Catalog Challenge</span>
        </Link>
      </div>
      <div className="ml-auto flex items-center gap-4">
        <Link href="/cart">
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <ShoppingCart className="w-4 h-4" />
            Carrinho
          </Button>
        </Link>
        <AuthButton />
      </div>
    </nav>
  );
} 