'use client'

import Link from "next/link";
import { Button } from "./ui/button";
import { useSession } from "@supabase/auth-helpers-react";
import { LogoutButton } from "./logout-button";

export function AuthButton() {
  const session = useSession();

  return session ? (
    <div className="flex items-center gap-4">
      Hey, {session.user.email}!
      <LogoutButton />
    </div>
  ) : (
    <div className="flex gap-2 mr-5">
      <Button asChild size="sm" variant={"outline"}>
        <Link href="/auth/login">Sign in</Link>
      </Button>
      <Button asChild size="sm" variant={"default"}>
        <Link href="/auth/sign-up">Sign up</Link>
      </Button>
    </div>
  );
}
