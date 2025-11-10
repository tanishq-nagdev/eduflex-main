// eduflexlms/components/ui/alert-dialog.tsx
"use client";

import * as React from "react";

// Root AlertDialog
interface AlertDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}
export const AlertDialog: React.FC<AlertDialogProps> = ({ open, onOpenChange, children }) => {
  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/50 ${
        open ? "block" : "hidden"
      }`}
      onClick={() => onOpenChange(false)}
    >
      <div onClick={(e) => e.stopPropagation()}>{children}</div>
    </div>
  );
};

// Content
export const AlertDialogContent: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md shadow-lg">
      {children}
    </div>
  );
};

// Header
export const AlertDialogHeader: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="mb-4">{children}</div>
);

export const AlertDialogTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{children}</h2>
);

export const AlertDialogDescription: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{children}</p>
);

// Footer
export const AlertDialogFooter: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="mt-6 flex justify-end gap-2">{children}</div>
);

// Cancel button
export const AlertDialogCancel: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({
  children,
  ...props
}) => (
  <button
    {...props}
    className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition"
  >
    {children}
  </button>
);

// Action button
export const AlertDialogAction: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({
  children,
  ...props
}) => (
  <button
    {...props}
    className="px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded hover:bg-blue-700 dark:hover:bg-blue-600 transition"
  >
    {children}
  </button>
);
