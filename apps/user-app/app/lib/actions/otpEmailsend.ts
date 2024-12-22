"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "../auth";
import axios, { AxiosResponse } from "axios";

interface EmailResponse {
  success: boolean;
  msg: string;
}

interface ValidateOtpResponse {
  success: boolean;
}

export async function otpEmailSend() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user.email ) {
        console.log("send session "+JSON.stringify(session?.user))
      throw new Error("User session is not valid.");
    }

    const res: AxiosResponse<EmailResponse> = await axios.post("http://localhost:3003/sendEmail", {
      email: session.user.email
    });

    return res.data; 
  } catch (error) {
    console.error("Error sending OTP email:", error);
    throw error;
  }
}

export async function otpEmailValidate(otp: string) {
  try {
    const session = await getServerSession(authOptions);

    if (!session  || !session.user.email) {
      throw new Error("User session is not valid.");
    }

    const res: AxiosResponse<ValidateOtpResponse> = await axios.post("http://localhost:3003/validateOtp", {
      otp: otp,
      email: session.user.email,
    });

    return res.data; 
  } catch (error) {
    console.error("Error validating OTP:", error);
    throw error;
  }
}

