'use client'

import { AuthButton } from "@/components/auth-button";
import { ThemeSwitcher } from "@/components/theme-switcher";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Header() {
  return (
    <nav className="w-full flex justify-center border-b border-b-foreground bg-lightBlue dark:bg-darkBlue/10 h-16">
      <div className="flex items-center gap-2">
        
        <Link href="/" className="flex items-center gap-2">
          <span className="text-lg font-normal ml-5 text-darkText dark:text-lightText">Catalog Challenge</span>
        </Link>
      </div>
      <div className="ml-auto flex items-center gap-4">
        <ThemeSwitcher />
        <Link href="/cart">
          <Button variant="ghost" className="flex items-center gap-2 p-3 dark:text-lightText">
            <ShoppingCart className="w-4 h-4" />
          </Button>
        </Link>
        <AuthButton />

      </div>
    </nav>
  );
} 