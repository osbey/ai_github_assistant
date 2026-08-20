// app/components/SignIn.tsx
"use client";
import { signIn, signOut, useSession } from "next-auth/react";

export function AuthButton() {
  const { data: session } = useSession();
  if (session)
    return (
      <button type="button" onClick={() => signOut()}>
        Sign out ({session.user?.name})
      </button>
    );
  return (
    <button type="button" onClick={() => signIn("github")}>
      Sign in with GitHub
    </button>
  );
}
