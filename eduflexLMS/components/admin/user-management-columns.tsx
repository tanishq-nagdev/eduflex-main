"use client"

import { useState } from "react"
import { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal, ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { User } from "@/types"
import { EditUserDialog } from "./edit-user-dialog"
import { DeleteUserAlert } from "./delete-user-alert"
import api from "@/lib/api"
import { toast } from "sonner"

// --- Helper for API errors ---
const handleApiError = (error: any, action: string) => {
  console.error(`Failed to ${action} user:`, error)
  const message =
    error.response?.data?.message ||
    `An error occurred while ${action}ing the user.`
  toast.error(message)
}

// --- Actions dropdown for each row ---
const RowActions = ({
  user,
  refreshData,
}: {
  user: User
  refreshData: () => void
}) => {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  const handleDelete = async () => {
    try {
      await api.delete(`/admin/users/${user._id}`)
      toast.success(`User "${user.name}" deleted successfully.`)
      refreshData()
    } catch (error) {
      handleApiError(error, "delete")
    }
  }

  const handleUpdate = async (updatedData: Partial<User>) => {
    try {
      await api.put(`/admin/users/${user._id}`, updatedData)
      toast.success(`User "${user.name}" updated successfully.`)
      refreshData()
      return true
    } catch (error) {
      handleApiError(error, "update")
      return false
    }
  }

  return (
    <>
      <EditUserDialog
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        user={user}
        onSave={handleUpdate} // matches EditUserDialog prop
      />

      <DeleteUserAlert
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onDelete={handleDelete}
        userName={user.name}
      />

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => setIsEditDialogOpen(true)}>
            Edit User
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setIsDeleteDialogOpen(true)}
            className="text-red-600 focus:text-red-600"
          >
            Delete User
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}

// --- Column definitions ---
export const getColumns = (refreshData: () => void): ColumnDef<User>[] => [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Name
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }: { row: any }) => <div className="font-medium">{row.getValue("name")}</div>,
  },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Email
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }: { row: any }) => {
      const role = row.getValue("role") as string
      let variant: "default" | "secondary" | "outline" = "default"
      if (role === "admin") variant = "default"
      if (role === "teacher") variant = "secondary"
      if (role === "student") variant = "outline"

      return (
        <Badge variant={variant} className="capitalize">
          {role}
        </Badge>
      )
    },
  },
  {
    accessorKey: "createdAt",
    header: "Joined",
    cell: ({ row }: { row: any }) => {
      const date = new Date(row.getValue("createdAt"))
      return <div>{date.toLocaleDateString()}</div>
    },
  },
  {
    id: "actions",
    cell: ({ row }: { row: any }) => {
      const user: User = row.original
      return <RowActions user={user} refreshData={refreshData} />
    },
  },
]
