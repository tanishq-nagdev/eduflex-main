// eduflexlms/app/providers.tsx
"use client";

import React from "react";
import { AuthProvider } from "@/context/auth-context";
import { ThemeProvider } from "@/context/theme-context";
import { Navbar } from "@/components/Navbar";

export const Providers: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Navbar /> {/* Navbar appears on every page */}
        {children}</AuthProvider>
    </ThemeProvider>
  );
};
