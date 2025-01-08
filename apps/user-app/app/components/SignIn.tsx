"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { signInInputs } from "@repo/zodtypes/types";
import { useAppDispatch } from "@repo/store/hooks";
import { changeLoading } from "@repo/store/LoadingSlice";
import { errorTrue, setMessage, setSeverity } from "@repo/store/ErrorSlice";
import Image from "next/image";

const SignIN = () => {
  const dispatch = useAppDispatch();

  const phoneRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const handleSignIn = async () => {
    dispatch(changeLoading());
    const phoneNum = phoneRef.current?.value || "";
    const password = passwordRef.current?.value || "";

    //zod
    const typeCheck = signInInputs.safeParse({ phoneNum, password });

    if (!typeCheck.success) {
      dispatch(changeLoading());
      dispatch(errorTrue());
      const errorMessage =
        typeCheck.error?.errors[0]?.message || "An error occurred";
      dispatch(setMessage(errorMessage));
      dispatch(setSeverity("warning"));
      return;
    }

    const result = await signIn("credentials", {
      redirect: true,
      phone: phoneNum,
      password: password,
      callbackUrl: "/",
    });
    dispatch(changeLoading());
    // if(result?.error){
    //   dispatch(errorTrue());
    //   dispatch(setMessage(result.error));
    //   dispatch(setSeverity("error"));
    // }
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
              className="w-full p-3 mb-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-gray-600 hover:text-blue-600 focus:outline-none"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#000000"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
            </button>
          </div>

          <span
            onClick={() => router.push("/forgotPass")}
            className="text-gray-600 cursor-pointer hover:text-blue-600 text-sm"
          >
            Forgot Password?
          </span>

          <button
            type="submit"
            className="w-full p-3 bg-[#6a51a6] text-white font-semibold rounded-md hover:bg-blue-600 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            Login with credentials
          </button>
        </form>

        <div>
          <div className="my-4 text-gray-500 text-center">OR</div>
          <button
            onClick={() => signIn("google", { callbackUrl: "/user/dashboard" , redirect: true })}
            className="w-full items-center flex justify-center p-2 bg-white text-blue-600 font-medium rounded-md hover:scale-105 transition border-2 border-blue-600 focus:outline-none"
          >
            <Image
            width={8}
            height={8}
              src="/google.svg"
              alt="Google Logo"
              className="w-8 h-8 my-auto mr-5"
            />
            Sign in with Google
          </button>
        </div>

        <div className="mt-4 text-center">
          <p className="text-gray-600">Don't have an account?</p>
          <button
            onClick={() => {
              dispatch(changeLoading());
              router.push("/signup");
              dispatch(changeLoading());
            }}
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
