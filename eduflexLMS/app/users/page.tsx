"use client"

import { useAuth } from "@/context/auth-context"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Sidebar } from "@/components/layout/sidebar"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"
import { UserManagementTable } from "@/components/admin/user-management-table"

interface User {
  id: string
  name: string
  email: string
  role: "STUDENT" | "TEACHER" | "ADMIN"
}

export default function UsersPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [users, setUsers] = useState<User[]>([])
  const [loadingUsers, setLoadingUsers] = useState(true)

  useEffect(() => {
    if (!loading && (!user || user.role !== "ADMIN")) {
      router.push("/dashboard")
    }
  }, [user, loading, router])

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/admin/users")
        if (response.ok) {
          const data = await response.json()
          setUsers(data)
        }
      } catch (error) {
        console.error("Failed to fetch users:", error)
      } finally {
        setLoadingUsers(false)
      }
    }

    if (user?.role === "ADMIN") {
      fetchUsers()
    }
  }, [user])

  const handleDelete = async (userId: string) => {
    try {
      const response = await fetch(`http://localhost:5000/api/admin/users/${userId}`, {
        method: "DELETE",
      })
      if (response.ok) {
        setUsers(users.filter((u) => u.id !== userId))
      }
    } catch (error) {
      console.error("Failed to delete user:", error)
      throw error
    }
  }

  const handleUpdate = async (userId: string, data: Partial<User>) => {
    try {
      const response = await fetch(`http://localhost:5000/api/admin/users/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      if (response.ok) {
        const updatedUser = await response.json()
        setUsers(users.map((u) => (u.id === userId ? updatedUser : u)))
      }
    } catch (error) {
      console.error("Failed to update user:", error)
      throw error
    }
  }

  if (loading || !user || user.role !== "ADMIN") {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 md:ml-64">
        <div className="p-4 md:p-8">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground">User Management</h1>
                <p className="text-muted-foreground mt-2">Manage all system users and their roles</p>
              </div>
              <Link href="/create-user">
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  Create User
                </Button>
              </Link>
            </div>

            <UserManagementTable
              users={users}
              onDelete={handleDelete}
              onUpdate={handleUpdate}
              isLoading={loadingUsers}
            />
          </div>
        </div>
      </main>
    </div>
  )
}
