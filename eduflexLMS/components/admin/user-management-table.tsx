"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, Trash2, Edit2 } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { EditUserDialog } from "./edit-user-dialog"

import { User as GlobalUser } from "@/types"

interface User extends GlobalUser {}


interface UserManagementTableProps {
  users: User[]
  onDelete: (userId: string) => Promise<void>
  onUpdate: (userId: string, data: Partial<User>) => Promise<void>
  isLoading: boolean
  // refreshData: () => Promise<void>
}

export function UserManagementTable({ users, onDelete, onUpdate, isLoading }: UserManagementTableProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState<string>("ALL")
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [deleting, setDeleting] = useState<string | null>(null)

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = roleFilter === "ALL" || u.role === roleFilter
    return matchesSearch && matchesRole
  })

  const handleDelete = async (userId: string) => {
    if (confirm("Are you sure you want to delete this user?")) {
      setDeleting(userId)
      try {
        await onDelete(userId)
      } finally {
        setDeleting(null)
      }
    }
  }

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-red-100 text-red-800"
      case "teacher":
        return "bg-blue-100 text-blue-800"
      case "student":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="w-full md:w-40">
            <SelectValue placeholder="Filter by role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Roles</SelectItem>
            <SelectItem value="student">Students</SelectItem>
            <SelectItem value="teacher">Teachers</SelectItem>
            <SelectItem value="admin">Admins</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">Loading users...</p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>All Users</CardTitle>
            <CardDescription>{filteredUsers.length} users found</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 font-medium">Name</th>
                    <th className="text-left py-3 px-4 font-medium">Email</th>
                    <th className="text-left py-3 px-4 font-medium">Role</th>
                    <th className="text-left py-3 px-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-8 text-center text-muted-foreground">
                        No users found
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((u) => (
                      <tr key={u._id} className="border-b border-border hover:bg-muted/50">
                        <td className="py-3 px-4 font-medium">{u.name}</td>
                        <td className="py-3 px-4 text-muted-foreground">{u.email}</td>
                        <td className="py-3 px-4">
                          <Badge className={getRoleBadgeColor(u.role)}>{u.role}</Badge>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setEditingUser(u)}
                              className="text-blue-600 hover:text-blue-700"
                            >
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(u._id)}
                              disabled={deleting === u._id}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {editingUser && (
       <EditUserDialog
  isOpen={!!editingUser}      // <-- add this
  user={editingUser!}         // non-null assertion since editingUser is not null here
  onClose={() => setEditingUser(null)}
  onSave={async (updatedData) => {
    await onUpdate(editingUser!._id, updatedData)
    setEditingUser(null)
    return true               // <-- return boolean to satisfy onSave type
  }}
/>
      )}
    </div>
  )
}
