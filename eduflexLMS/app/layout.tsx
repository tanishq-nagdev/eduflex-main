// eduflexlms/app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers"; // relative path to providers.tsx


import { ThemeProvider } from "@/context/theme-context";
import { AuthProvider } from "@/context/auth-context";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "EduFlex LMS",
  description: "Your Learning Management System",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* Client-side providers */}
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
