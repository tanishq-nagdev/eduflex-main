"use client"

import { useAuth } from "@/context/auth-context"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Sidebar } from "@/components/layout/sidebar"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, CheckCircle } from "lucide-react"
import api from "@/lib/api"

export default function CreateUserPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "student", // match backend lowercase roles
  })
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!isLoading && (!user || user.role !== "admin")) {
      router.push("/dashboard")
    }
  }, [user, isLoading, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    setSubmitting(true)

    try {
      const { data } = await api.post("/admin/create-user", formData)

      setSuccess(`User "${data.name}" created successfully!`)
      setFormData({ name: "", email: "", password: "", role: "student" })
      setTimeout(() => setSuccess(""), 3000)
    } catch (err: any) {
  console.error("❌ Create user error:", err);

  let message = "Something went wrong. Please try again.";

  if (err.response) {
    switch (err.response.status) {
      case 400:
        message = "Please fill in all required fields.";
        break;
      case 401:
        message = "You are not authorized. Please log in again.";
        break;
      case 403:
        message = "Access denied. Only admins can perform this action.";
        break;
      case 409:
        message = "A user with this email already exists.";
        break;
      case 500:
        message = "Server error. Please try again later.";
        break;
      default:
        message = err.response.data?.message || message;
    }
  }

  setError(message);
}
finally {
      setSubmitting(false)
    }
  }

  if (isLoading || !user || user.role !== "admin") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    )
  }

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 md:ml-64">
        <div className="p-4 md:p-8">
          <div className="max-w-2xl">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-foreground">
                Create New User
              </h1>
              <p className="text-muted-foreground mt-2">
                Add a new user to the system
              </p>
            </div>

            <Card>
              <CardContent className="pt-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                  {error && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}
                  {success && (
                    <Alert className="border-green-200 bg-green-50">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <AlertDescription className="text-green-800">
                        {success}
                      </AlertDescription>
                    </Alert>
                  )}

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Full Name</label>
                    <Input
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Email</label>
                    <Input
                      type="email"
                      placeholder="john@example.com"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Password</label>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Role</label>
                    <select
                      value={formData.role}
                      onChange={(e) =>
                        setFormData({ ...formData, role: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground"
                    >
                      <option value="student">Student</option>
                      <option value="teacher">Teacher</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>

                  <Button type="submit" className="w-full" disabled={submitting}>
                    {submitting ? "Creating..." : "Create User"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
