"use client";
import { signIn, signOut, useSession } from "next-auth/react";
import { Appbar } from "@repo/ui/appbar";
import { useRouter } from "next/navigation";

export function AppbarClient() {
  const { data: session } = useSession();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut({ redirect: false }); // Prevent automatic redirect
    router.push("/api/auth/signin"); // Manually redirect after signing out
  };

  return (
    <Appbar 
      onSignin={signIn} 
      onSignout={handleSignOut} 
      user={session?.user} 
    />
  );
}
