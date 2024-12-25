"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { getSession, signIn } from "next-auth/react";
import { signUpAction } from "../lib/actions/signUpAction";

const SignUP = () => {
  const nameRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);

  const handleSignUp = async () => {
    try {
      const userData = {
        name: nameRef.current?.value || "",
        phone: phoneRef.current?.value || "",
        email: emailRef.current?.value || "",
        password: passwordRef.current?.value || "",
      };

      const result = await signUpAction(userData);

      if (result.success) {
        const signInResult = await signIn("credentials", {
          phone: userData.phone,
          password: userData.password,
          redirect: true,
        });
      } else {
        console.log(result.error);
      }
    } catch (error) {
      router.push("/signup");
      if (error instanceof Error) {
        console.error("Error signing in:", error.message);
        throw new Error(error.message);
      } else {
        console.error("An unexpected error occurred");
        throw new Error("An unexpected error occurred");
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-6 bg-white shadow-md rounded-lg">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Sign Up
        </h2>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSignUp();
          }}
          className="space-y-4"
        >
          <input
            type="text"
            name="name"
            placeholder="Name"
            ref={nameRef}
            required
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            type="number"
            name="phone"
            placeholder="Phone Number"
            ref={phoneRef}
            required
            className="w-full p-3 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            ref={emailRef}
            required
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

          <button
            type="submit"
            className="w-full p-3 bg-[#6a51a6] text-white font-semibold rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            Sign Up
          </button>
        </form>

        <div className="mt-4 text-center">
          <p className="text-gray-600">Already have an account?</p>
          <button
            onClick={() => router.push("api/auth/signin")} // Add the path to your sign-in page here
            className="mt-2 text-[#6a51a6] font-semibold hover:text-blue-600 focus:outline-none"
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignUP;
