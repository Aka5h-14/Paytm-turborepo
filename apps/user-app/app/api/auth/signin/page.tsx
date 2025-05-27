"use server";

import SignIN from "../../../components/SignIn";

export default async function SignInPage() {
      // const session = await getServerSession(authOptions);
      // if (session?.user.verified) {
      //   redirect("/user/dashboard");
      // }
    return <SignIN /> 
}
