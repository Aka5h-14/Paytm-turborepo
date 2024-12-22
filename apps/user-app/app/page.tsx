import { getServerSession } from "next-auth";
import { redirect } from 'next/navigation'
import { authOptions } from "./lib/auth";

export default function Page() {
  // const session = await getServerSession(authOptions);
  // if (session?.user) {
    // if(session?.user?.verified){
    //   redirect('/user/dashboard')
    // }
  // } else {
    redirect('/user/dashboard')
  // }
  return <div>
    welcome to paytm
  </div>
}