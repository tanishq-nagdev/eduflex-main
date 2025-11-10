// eduflexlms/components/ui/dropdown-menu.tsx
"use client";

import * as React from "react";

interface DropdownMenuProps {
  children: React.ReactNode;
}
export const DropdownMenu: React.FC<DropdownMenuProps> = ({ children }) => {
  return <div className="relative inline-block">{children}</div>;
};

export const DropdownMenuTrigger: React.FC<{ asChild?: boolean; children: React.ReactNode }> = ({
  children,
  asChild,
}) => {
  return <>{children}</>;
};

export const DropdownMenuContent: React.FC<{ align?: "start" | "end"; children: React.ReactNode }> = ({
  children,
  align = "start",
}) => {
  return <div className={`absolute z-50 mt-2 ${align === "end" ? "right-0" : "left-0"} bg-white dark:bg-gray-800 border rounded shadow-lg`}>{children}</div>;
};

export const DropdownMenuItem: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({
  children,
  ...props
}) => {
  return (
    <button
      {...props}
      className="w-full text-left px-4 py-2 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
    >
      {children}
    </button>
  );
};

export const DropdownMenuLabel: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <div className="px-4 py-2 text-gray-500 text-sm">{children}</div>;
};
