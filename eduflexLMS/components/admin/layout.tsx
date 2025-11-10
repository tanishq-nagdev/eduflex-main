"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import { Button } from "@/components/ui/button"
import { Home, Users, BookOpen, LogOut, School } from "lucide-react"

// This "interface" defines a type for our navigation links,
// which makes our code cleaner and safer (this is a good part of TypeScript).
interface NavItem {
  name: string
  href: string
  icon: React.ComponentType<{ className?: string }>
}

export default function AdminSidebar() {
  const { logout, user } = useAuth()
  const pathname = usePathname() // This hook gets the current URL path

  // We define our navigation links as an array of objects.
  // This makes it easy to add or remove links later.
  const navItems: NavItem[] = [
    { name: "Dashboard", href: "/admin/dashboard", icon: Home },
    { name: "Manage Users", href: "/admin/users", icon: Users },
    { name: "Manage Courses", href: "/admin/courses", icon: BookOpen },
  ]

  return (
    <aside className="w-64 flex-col border-r bg-white dark:bg-gray-950 dark:border-gray-800 hidden md:flex">
      {/* Sidebar Header */}
      <div className="flex h-16 items-center border-b px-6">
        <Link
          href="/admin/dashboard"
          className="flex items-center gap-2 font-semibold"
        >
          <School className="h-6 w-6" />
          <span className="text-lg">EduFlex Admin</span>
        </Link>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="grid items-start px-4 text-sm font-medium">
          {/* We loop (map) over the navItems array to create each link */}
          {navItems.map((item) => {
            // Check if the current page's URL matches the link's URL
            const isActive = pathname === item.href
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  // This is a dynamic className. We use ` (backticks) to build a string.
                  // If 'isActive' is true, it adds the background/bold styles.
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 text-gray-700 transition-all hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 ${
                    isActive
                      ? "bg-gray-100 dark:bg-gray-800 font-bold dark:text-gray-50"
                      : ""
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  {item.name}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Sidebar Footer (User Profile & Logout) */}
      <div className="mt-auto border-t p-4 dark:border-gray-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-gray-300 dark:bg-gray-700 flex items-center justify-center font-semibold text-gray-600 dark:text-gray-300">
              {/* user? means "only do this if user is not null" */}
              {user?.name.charAt(0).toUpperCase()}
            </div>
            <span className="text-sm font-medium dark:text-gray-300">
              {user?.name}
            </span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="text-gray-600 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-500"
            onClick={logout} // This button calls the logout function
            title="Logout"
          >
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </aside>
  )
}