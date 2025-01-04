import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { AppbarClient } from "./components/AppbarClient";
import { Providers } from "../provider";
import Loader  from "@repo/ui/loader";
import AutohideSnackbar from "@repo/ui/snackbar";

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
      <body>
      <Providers>
            <AppbarClient />
            <AutohideSnackbar/>
            <Loader/>
            <div className={inter.className}>{children}</div>
      </Providers>
      </body>
    </html>
  );
}
