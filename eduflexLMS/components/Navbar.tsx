// eduflexlms/components/Navbar.tsx
"use client";

import React from "react";
import Link from "next/link";
import { ThemeToggleButton } from "./shared/theme-toggle-button";
import { useAuth } from "@/context/auth-context";

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <header className="flex items-center justify-between p-4 bg-gray-100 dark:bg-gray-900">
      {/* Logo / site name */}
      <Link href="/">
        <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
          EduFlex LMS
        </h1>
      </Link>

      {/* Right side */}
      <div className="flex items-center space-x-4">
        {/* Theme toggle */}
        <ThemeToggleButton />

        {/* User info + logout */}
        {user ? (
          <>
            <span className="text-gray-800 dark:text-gray-200">
              {user.name || user.name}
            </span>
            <button
              onClick={logout}
              className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Logout
            </button>
          </>
        ) : (
          <Link
            href="/login"
            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Login
          </Link>
        )}
      </div>
    </header>
  );
};
