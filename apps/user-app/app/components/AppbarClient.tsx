"use client";
import { signIn, signOut, useSession } from "next-auth/react";
import { Appbar } from "@repo/ui/appbar";
import { useRouter } from "next/navigation";
import { changeLoading } from "@repo/store/LoadingSlice";
import { useDispatch } from "react-redux";

export function AppbarClient() {
  const { data: session } = useSession();
  const router = useRouter();
  const dispatch = useDispatch();

  const handleSignOut = async () => {
    dispatch(changeLoading());
    await signOut({ redirect: false });
    router.push("/api/auth/signin");
    dispatch(changeLoading());
  }; 

  return (
    <Appbar
      onSignin={signIn}
      onSignout={handleSignOut}
      user={session?.user}
    />
  );
}
