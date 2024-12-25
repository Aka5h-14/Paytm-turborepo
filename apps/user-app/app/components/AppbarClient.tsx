"use client";
import { signIn, signOut, useSession } from "next-auth/react";
import { Appbar } from "@repo/ui/appbar";
import { useRouter } from "next/navigation";
import { useHamburger } from "@repo/store/hamburger";

export function AppbarClient() {
  const { data: session } = useSession();
  // const { hamburger, setHamburger } = useHamburger();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push("/api/auth/signin"); // Manually redirect after signing out
  }; 

  return (
    <Appbar
      onSignin={signIn}
      onSignout={handleSignOut}
      user={session?.user}
      // hamburger={hamburger}
      // setHamburger={setHamburger}
    />
  );
}
