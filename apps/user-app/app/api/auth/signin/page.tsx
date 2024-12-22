"use server";

import { getServerSession } from "next-auth";
import SignIN from "../../../components/SignIn";
import { authOptions } from "../../../lib/auth";
import { redirect } from "next/navigation";

export default async function SignInPage() {
      // const session = await getServerSession(authOptions);
      // if (session?.user.verified) {
      //   redirect("/user/dashboard");
      // }
    return <SignIN /> 
}
