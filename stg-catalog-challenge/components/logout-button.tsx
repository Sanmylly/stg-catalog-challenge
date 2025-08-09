"use client";

import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export function LogoutButton() {
  const router = useRouter();

  const logout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    // Redireciona para a rota raiz após logout
    router.push("/");
  };

  return <Button onClick={logout} className=" pl-3 pr-3 pt-0 pb-0  dark:text-lightText mr-5">Logout</Button>;
}
