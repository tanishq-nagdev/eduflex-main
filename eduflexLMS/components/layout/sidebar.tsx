"use client";

import { useAuth } from "@/context/auth-context";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Home, LogOut } from "lucide-react";

export function Sidebar() {
  const { user, logout } = useAuth();
  const router = useRouter();

  if (!user) return null;

  const handleLogout = () => {
    if (confirm("Are you sure you want to logout?")) {
      logout();
      router.push("/login");
    }
  };

  const linkClass = (path: string) =>
    `flex items-center gap-2 p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700`;

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-200 shadow-md p-4 flex flex-col justify-between">
      <div className="space-y-2">
        <Link href="/admin/dashboard" className={linkClass("/admin/dashboard")}>
          <Home className="w-5 h-5" /> Dashboard
        </Link>

        {user.role === "admin" && (
          <>
            <Link href="/admin/users" className={linkClass("/admin/users")}>
              Users List
            </Link>
            <Link href="/admin/courses" className={linkClass("/admin/courses")}>
              Courses List
            </Link>
          </>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
        >
          <LogOut className="w-4 h-4" /> Logout
        </button>
      </div>
    </aside>
  );
}
