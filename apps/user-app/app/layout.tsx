import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Providers } from "../provider";
import { AppbarClient } from "./components/AppbarClient";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Paytm User",
  description: "Simple wallet app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {



  return (
    <html lang="en">
      <Providers>
        <body>
        <AppbarClient/>
          <div className={inter.className}>
            {children}
          </div>
        </body>
      </Providers>
    </html>
  );
}