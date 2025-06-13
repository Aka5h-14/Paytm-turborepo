"use server";

import SignIN from "../../../components/SignIn";
import axios from "axios";

export default async function SignInPage() {
  axios.get(process.env.BACKEND_URL + '/' || "");
    return <SignIN /> 
}
