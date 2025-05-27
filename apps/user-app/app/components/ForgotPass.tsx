"use client";

import React, { useEffect, useState } from "react";
import {
  otpEmailSendPass,
  otpEmailValidatePass,
} from "../lib/actions/otpEmailsend";
import { useAppDispatch } from "@repo/store/hooks";
import { changeLoading } from "@repo/store/LoadingSlice";
import { errorTrue, setMessage, setSeverity } from "@repo/store/ErrorSlice";
import { useRouter } from "next/navigation";
import { signUpInputs } from "@repo/zodtypes/types";

const ForgotPass: React.FC = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    dispatch(changeLoading(false));
  }, [dispatch]);

  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOtp(e.target.value);
  };

  const handlePassChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const sendOtp = async () => {
    if (!isClient) return;
    
    // Validate email using zod
    const typeCheck = signUpInputs.pick({ email: true }).safeParse({ email });
    if (!typeCheck.success) {
      dispatch(changeLoading(false));
      dispatch(errorTrue());
      const errorMessage =
        typeCheck.error?.errors[0]?.message || "Invalid email address";
      dispatch(setMessage(errorMessage));
      dispatch(setSeverity("warning"));
      return;
    }
    try {
      dispatch(changeLoading(true));
      const res = await otpEmailSendPass(email);
      if (res.success) {
        setIsOtpSent(true);
        dispatch(changeLoading(false));
        dispatch(errorTrue());
        dispatch(setMessage(res.msg));
        dispatch(setSeverity("success"));
      } else {
        dispatch(changeLoading(false));
        dispatch(errorTrue());
        dispatch(setMessage(res.msg));
        dispatch(setSeverity("warning"));
      }
    } catch (err) {
      dispatch(changeLoading(false));
      dispatch(errorTrue());
      dispatch(setMessage("An error occurred"));
      dispatch(setSeverity("error"));
      console.error("Error while sending OTP:", err);
    }
  };

  const verifyOtp = async () => {
    if (!isClient) return;

    // Validate email and password using zod
    const typeCheck = signUpInputs.pick({ email: true, password: true }).safeParse({ email, password });
    if (!typeCheck.success) {
      dispatch(changeLoading(false));
      dispatch(errorTrue());
      const errorMessage =
        typeCheck.error?.errors[0]?.message || "Invalid input";
      dispatch(setMessage(errorMessage));
      dispatch(setSeverity("warning"));
      return;
    }
    try {
      dispatch(changeLoading(true));
      const res = await otpEmailValidatePass(otp, email, password);
      if (res.success) {
        dispatch(changeLoading(false));
        dispatch(errorTrue());
        dispatch(setMessage(res.msg));
        dispatch(setSeverity("success"));
        router.push("/api/auth/signin");
      } else {
        dispatch(changeLoading(false));
        dispatch(errorTrue());
        dispatch(setMessage(res.msg));
        dispatch(setSeverity("warning"));
      }
    } catch (err) {
      dispatch(changeLoading(false));
      dispatch(errorTrue());
      dispatch(setMessage("Something went wrong. Please try again."));
      dispatch(setSeverity("error"));
      console.error("Error while verifying OTP:", err);
    }
  };

  if (!isClient) {
    return null; // or a loading skeleton
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      {!isOtpSent ? (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            sendOtp();
          }}
          className="bg-white p-6 rounded shadow-md w-full max-w-sm"
        >
          <label className="block mb-2 text-sm font-bold text-gray-700">
            Email
            <input
              type="email"
              value={email}
              onChange={handlePhoneNumberChange}
              required
              className="w-full p-3 mt-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </label>
          <button
            type="submit"
            className="w-full px-4 py-2 mt-3 text-white bg-blue-500 rounded hover:bg-blue-700"
          >
            Send OTP
          </button>
        </form>
      ) : (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            verifyOtp();
          }}
          className="bg-white p-6 rounded shadow-md w-full max-w-sm"
        >
          <label className="block mb-2 text-sm font-bold text-gray-700">
            Enter OTP:
            <input
              type="number"
              value={otp}
              onChange={handleOtpChange}
              required
              className="w-full p-3 mt-4 mb-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </label>
          <div className="relative">
            <label className="block mb-2 text-sm font-bold text-gray-700">
              Enter New Password:
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={handlePassChange}
                required
                className="w-full p-3 mt-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </label>
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-12 text-gray-600 hover:text-blue-600 focus:outline-none"
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
            className="w-full px-4 py-2 mt-4 text-white bg-blue-500 rounded hover:bg-blue-700"
          >
            Verify OTP
          </button>
        </form>
      )}
    </div>
  );
};

export default ForgotPass;
