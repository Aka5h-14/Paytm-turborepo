"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { signUpAction } from "../lib/actions/signUpAction";
import { changeLoading } from "@repo/store/LoadingSlice";
import { useAppDispatch } from "@repo/store/hooks";
import { signUpInputs, signUpInputsExternal } from "@repo/zodtypes/types";
import { errorTrue, setMessage, setSeverity } from "@repo/store/ErrorSlice";
import { signUpExternal } from "../lib/actions/signUpExternal";

const SignUpExternal = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useAppDispatch();

  const phoneRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  
  const handleSignUp = async () => {

    try {
      dispatch(changeLoading());
      const userData = {
        phone: phoneRef.current?.value || "",
        password: passwordRef.current?.value || "",
      };

      const typeCheck = signUpInputsExternal.safeParse(userData);
      if (!typeCheck.success) {
        dispatch(changeLoading());
        dispatch(errorTrue());
        const errorMessage =
          typeCheck.error?.errors[0]?.message || "An error occurred";
        dispatch(setMessage(errorMessage));
        dispatch(setSeverity("warning"));
        return;
      }

      const result = await signUpExternal(userData);

      if (result.success) {
        const signInResult = await signIn("credentials", {
          phone: userData.phone,
          password: userData.password,
          redirect: true,
          callbackUrl: "/",
        });
        dispatch(changeLoading());
      } else {
        dispatch(errorTrue());
        dispatch(setMessage(result.error));
        dispatch(setSeverity("warning"));
        dispatch(changeLoading());
      }
    } catch (error) {
      dispatch(changeLoading());
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
            type="number"
            name="phone"
            placeholder="Phone Number"
            ref={phoneRef}
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
      </div>
    </div>
  );
};

export default SignUpExternal;
