"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "../auth";
import axios, { AxiosResponse } from "axios";
const bcrypt = require("bcryptjs")

interface ApiResponse {
  success: boolean;
  msg: string;
}

export async function otpEmailSend() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user.id) {
      console.log("send session " + JSON.stringify(session?.user))
      throw new Error("User session is not valid.");
    }

    const res: AxiosResponse<ApiResponse> = await axios.post(process.env.BACKEND_URL + '/sendEmail' || "", {
      timeout: 10000, data: {
        id: session.user.id
      }
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

    if (!session || !session.user.id) {
      throw new Error("User session is not valid.");
    }

    const res: AxiosResponse<ApiResponse> = await axios.post(process.env.BACKEND_URL + '/validateOtp' || "", {
      timeout: 10000, data: {
        otp: otp,
        id: session.user.id,
      }
    });

    return res.data;
  } catch (error) {
    console.error("Error validating OTP:", error);
    throw error;
  }
}

export async function otpEmailSendPass(email: string) {
  try {

    if (!email) {
      console.log("No email provided")
      throw new Error("No email provided.");
    }

    const res: AxiosResponse<ApiResponse> = await axios.post(process.env.BACKEND_URL + '/sendEmailPass' || "", {
      timeout: 10000, data: {
        email: email
      }
    });

    return res.data;
  } catch (error) {
    console.error("Error sending OTP email for Pass:", error);
    throw error;
  }
}

export async function otpEmailValidatePass(otp: string, email: string, password: string) {
  try {

    if (!email || !password) {
      throw new Error("Invalid email or password.");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const res: AxiosResponse<ApiResponse> = await axios.post(process.env.BACKEND_URL + '/validateOtpPass' || "", {
      timeout: 10000, data: {
        otp: otp,
        email: email,
        password: hashedPassword
      }
    });

    return res.data;
  } catch (error) {
    console.error("Error validating OTP:", error);
    throw error;
  }
}
