"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";

export default function ErrorComponent({home}: {
  home: string;
}): JSX.Element  {
  const searchParams = useSearchParams();
  const errorCode = searchParams.get("error") || "";

  const errorMessages: { [key: string]: string } = {
  default: "An unexpected error occurred. Please try again.",
  configuration: "There is a configuration issue. Please contact support.",
  accessdenied: "Access denied. You do not have permission to access this resource.",
  verification: "Email verification failed. Please try again.",
  sessionexpired: "Your session has expired. Please sign in again.",
};

  const errorMessage = errorMessages[errorCode?.toLowerCase()] || errorMessages.default;


  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="p-6 bg-white shadow-md rounded-md max-w-md text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
        <p className="text-gray-700 mb-6">{errorMessage}</p>
        <Link
          href={"/"+ home}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          Go to Home
        </Link>
      </div>
    </div>
  );
}
