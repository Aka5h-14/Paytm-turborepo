"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { signInInputs } from "@repo/zodtypes/types"

const SignIN = () => {
  const phoneRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const handleSignIn = async () => {
    const phoneNum = phoneRef.current?.value || "";
    const password = passwordRef.current?.value || "";

    //zod
    const typeCheck  = signInInputs.safeParse({phoneNum , password });

    if (!typeCheck.success){
      console.log(typeCheck.error);
      return typeCheck.error;
    }

    const result = await signIn("credentials", {
      redirect: true,
      phone: phoneNum,
      password: password,
    });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-6 bg-white shadow-md rounded-lg">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Sign In
        </h2>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSignIn();
          }}
          className="space-y-4"
        >
          <input
            type="number"
            name="phoneNumber"
            placeholder="Phone Number"
            id="phone"
            ref={phoneRef}
            className="w-full p-3 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              id="password"
              ref={passwordRef}
              className="w-full p-3 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-gray-600 hover:text-blue-600 focus:outline-none"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
            </button>
          </div>

          <span
            onClick={() => router.push("/forgotPass")}
            className="text-gray-600 pt-2 cursor-pointer hover:text-blue-600"
          >
            Forgot Password?
          </span>

          <button
            type="submit"
            className="w-full p-3 bg-[#6a51a6] text-white font-semibold rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            Login with credentials
          </button>
        </form>

        <div className="mt-4 text-center">
          <p className="text-gray-600">Don't have an account?</p>
          <button
            onClick={() => router.push("/signup")}
            className="mt-2 text-[#6a51a6] font-semibold hover:text-blue-600 focus:outline-none"
          >
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignIN;
