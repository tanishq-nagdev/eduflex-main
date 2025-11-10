"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { PlusCircle } from "lucide-react"
import { Button, buttonVariants } from "@/components/ui/button"
import { UserManagementTable } from "@/components/admin/user-management-table"
import { PageHeader } from "@/components/shared/page-header"
import { LoadingSpinner } from "@/components/shared/loading-spinner"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { Terminal } from "lucide-react"
import { User } from "@/types"
import api from "@/lib/api"
import { cn } from "@/lib/utils"

export default function UserManagementPage() {
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // useCallback ensures this function isn't recreated on every render
  // We can pass this function down to child components (like the action buttons)
  // to trigger a data refresh after an update or delete.
  const fetchUsers = useCallback(async () => {
    setIsLoading(true)
    try {
      const response = await api.get("/admin/users")
      setUsers(response.data)
      setError(null)
    } catch (err: any) {
      console.error("Failed to fetch users:", err)
      setError(err.response?.data?.message || "Failed to fetch users.")
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Fetch users when the component mounts
  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  const renderContent = () => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner />
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <Terminal className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  return (
    <UserManagementTable
      users={users}
      isLoading={isLoading}
      onDelete={async (userId) => {
        try {
          await api.delete(`/admin/users/${userId}`)
          await fetchUsers()
        } catch (err) {
          console.error("Delete failed:", err)
        }
      }}
      onUpdate={async (userId, updatedData) => {
        try {
          await api.put(`/admin/users/${userId}`, updatedData)
          await fetchUsers()
        } catch (err) {
          console.error("Update failed:", err)
        }
      }}
    />
  )
}


  return (
    <div className="container mx-auto">
      <PageHeader
        title="User Management"
        description="Manage all users on the platform."
      >
        {/*
          FIXED: This is now a Link styled as a button.
          This fixes the "no border" issue and is the correct
          way to link to another page.
        */}
        <Link
          href="/admin/create-user"
          className={cn(buttonVariants({ variant: "default" }))}
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Create New User
        </Link>
      </PageHeader>

      {renderContent()}
    </div>
  )
}