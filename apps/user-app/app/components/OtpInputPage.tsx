"use client";

import { useState, useRef, KeyboardEvent, ClipboardEvent } from "react";
import { otpEmailValidate } from "../lib/actions/otpEmailsend";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";

const OtpInput = () => {
  const [otp, setOtp] = useState<string>("");
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const router = useRouter();

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) {
      // Handle paste
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

    // Move to next input if value is entered
    if (value !== "" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      // Move to previous input on backspace if current input is empty
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
    if (otp.length === 6) {
      // Handle OTP verification logic here
      const res = await otpEmailValidate(otp);
      console.log(res);
      if (res.success) {
        setIsSubmitted(true);
        await signOut({ redirect: false });
        router.push("/");
      }
    } else {
      console.log("Please enter a valid 6-digit OTP");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-6">
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
                }} // No return value here
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
            className="w-full py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            Verify OTP
          </button>
          {isSubmitted && (
            <p className="text-center text-green-600 mt-4">
              OTP verified successfully!
            </p>
          )}
        </form>
        <div className="mt-6 text-center text-sm text-gray-600">
          Check Spam and Junk folders
        </div>
      </div>
    </div>
  );
};

export default OtpInput;
