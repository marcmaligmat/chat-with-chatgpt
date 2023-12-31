import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

import NavBar from "@components/layout/NavBar";
import ThemeRegistry from "@components/ThemeRegistry/ThemeRegistry";
import { Toaster } from "react-hot-toast";

import { ThemeProvider } from "@/components/theme-provider-shadcn";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Toaster
          position="top-right"
          reverseOrder={false}
          toastOptions={{ duration: 2000 }}
        />
        <ThemeRegistry>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <NavBar />
            {children}
          </ThemeProvider>
        </ThemeRegistry>
      </body>
    </html>
  );
}
