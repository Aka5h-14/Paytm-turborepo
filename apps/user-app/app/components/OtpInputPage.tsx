"use client";

import { useState, useRef, KeyboardEvent, ClipboardEvent } from "react";
import { otpEmailSend, otpEmailValidate } from "../lib/actions/otpEmailsend";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useAppDispatch } from "@repo/store/hooks";
import { changeLoading } from "@repo/store/LoadingSlice";
import { errorTrue, setMessage, setSeverity } from "@repo/store/ErrorSlice";

const OtpInput = () => {
  const dispatch = useAppDispatch();
  dispatch(changeLoading(false));
  const router = useRouter();
  const { data: session, update } = useSession();

  const [otp, setOtp] = useState<string>("");
  const [showOtpInput, setShowOtpInput] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const email = session?.user?.email;

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // sendOtpEmail(email)
      dispatch(changeLoading(true));
      const res = await otpEmailSend();
      if (res.success) {
        dispatch(changeLoading(false));
        dispatch(errorTrue());
        dispatch(setMessage(res.msg));
        dispatch(setSeverity("success"));
        setShowOtpInput(true);
      } else {
        dispatch(changeLoading(false));
        dispatch(errorTrue());
        dispatch(setMessage(res.msg));
        dispatch(setSeverity("warning"));
      }
    } catch (error) {
      dispatch(changeLoading(false));
      dispatch(errorTrue());
      dispatch(setMessage("An error occurred"));
      dispatch(setSeverity("error"));
      console.error("Error while sending OTP:",error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) {
      const pastedValue = value.slice(0, 6);
      setOtp(pastedValue);
      if (pastedValue.length === 6) {
        inputRefs.current[5]?.focus();
      }
      return;
    }

    const newOtp = otp.split("");
    newOtp[index] = value;
    const updatedOtp = newOtp.join("");
    setOtp(updatedOtp);

    if (value !== "" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6);
    setOtp(pastedData);
    if (pastedData.length === 6) {
      inputRefs.current[5]?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (otp.length !== 6) {
      dispatch(errorTrue());
      dispatch(setMessage("Please enter a valid 6-digit OTP"));
      dispatch(setSeverity("warning"));
      return;
    }

    try {
      dispatch(changeLoading(true));
      setLoading(true);
      const res = await otpEmailValidate(otp);

      if (res.success) {
        dispatch(changeLoading(false));
        dispatch(errorTrue());
        dispatch(setMessage(res.msg));
        dispatch(setSeverity("success"));
        await update({ verified: true });
        router.push("/");
      } else {
        dispatch(changeLoading(false));
        dispatch(errorTrue());
        dispatch(setMessage(res.msg));
        dispatch(setSeverity("warning"));
      }
    } catch (error) {
      dispatch(changeLoading(false));
      dispatch(errorTrue());
      dispatch(setMessage("Something went wrong. Please try again."));
      dispatch(setSeverity("error"));
      console.error("Error while verifying OTP:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-6">
        {!showOtpInput ? (
          <>
            <h2 className="text-xl md:text-2xl font-semibold text-center text-gray-700 mb-3">
              Verify Email
            </h2>
            <p className="text-sm text-center text-gray-600 mb-6">{email}</p>

            <form onSubmit={handleEmailSubmit} className="space-y-6">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-[#6a51a6] text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed"
              >
                {loading ? "Sending..." : "Send OTP"}
              </button>
            </form>
          </>
        ) : (
          <>
            <h2 className="text-xl md:text-2xl font-semibold text-center text-gray-700 mb-6">
              Enter OTP
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-6 gap-2 md:gap-4">
                {[...Array(6)].map((_, index) => (
                  <input
                    key={index}
                    ref={(el) => {
                      inputRefs.current[index] = el;
                    }}
                    type="number"
                    maxLength={1}
                    value={otp[index] || ""}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={handlePaste}
                    className="w-full aspect-square text-center text-lg md:text-xl font-bold border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    autoFocus={index === 0}
                  />
                ))}
              </div>
              <button
                type="submit"
                className="w-full py-3 bg-[#6a51a6] text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
              >
                {loading ? "Validating.." : "Verify OTP"}
              </button>
            </form>
            <div className="mt-6 text-center text-sm text-gray-600">
              Check Spam and Junk folders
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default OtpInput;
