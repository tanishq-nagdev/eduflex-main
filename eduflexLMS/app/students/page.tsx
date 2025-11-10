"use client"

import { useAuth } from "@/context/auth-context"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Sidebar } from "@/components/layout/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search } from "lucide-react"

interface Student {
  id: string
  name: string
  email: string
  enrolledCourses: number
  averageGrade: number
  status: "active" | "inactive"
}

export default function StudentsPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [students, setStudents] = useState<Student[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loadingStudents, setLoadingStudents] = useState(true)

  useEffect(() => {
    if (!isLoading && (!user || user.role !== "teacher")) {
      router.push("/dashboard")
    }
  }, [user, isLoading, router])

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/teacher/students")
        if (response.ok) {
          const data = await response.json()
          setStudents(data)
        }
      } catch (error) {
        console.error("Failed to fetch students:", error)
      } finally {
        setLoadingStudents(false)
      }
    }

    if (user?.role === "teacher") {
      fetchStudents()
    }
  }, [user])

  if (isLoading || !user || user.role !== "teacher") {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  const filteredStudents = students.filter(
    (s) =>
      s.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.email?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 md:ml-64">
        <div className="p-4 md:p-8">
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground">My Students</h1>
              <p className="text-muted-foreground mt-2">View and manage your students</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{students.length}</div>
                  <p className="text-xs text-muted-foreground">Across all courses</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">Active</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{students.filter((s) => s.status === "active").length}</div>
                  <p className="text-xs text-muted-foreground">Currently enrolled</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">Average Grade</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {students.length > 0
                      ? (students.reduce((sum, s) => sum + s.averageGrade, 0) / students.length).toFixed(1)
                      : "N/A"}
                    %
                  </div>
                  <p className="text-xs text-muted-foreground">Class average</p>
                </CardContent>
              </Card>
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search students by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {loadingStudents ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Loading students...</p>
              </div>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Students</CardTitle>
                  <CardDescription>{filteredStudents.length} students found</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="text-left py-3 px-4 font-medium">Name</th>
                          <th className="text-left py-3 px-4 font-medium">Email</th>
                          <th className="text-left py-3 px-4 font-medium">Enrolled Courses</th>
                          <th className="text-left py-3 px-4 font-medium">Average Grade</th>
                          <th className="text-left py-3 px-4 font-medium">Status</th>
                          <th className="text-left py-3 px-4 font-medium">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredStudents.length === 0 ? (
                          <tr>
                            <td colSpan={6} className="py-8 text-center text-muted-foreground">
                              No students found
                            </td>
                          </tr>
                        ) : (
                          filteredStudents.map((student) => (
                            <tr key={student.id} className="border-b border-border hover:bg-muted/50">
                              <td className="py-3 px-4 font-medium">{student.name}</td>
                              <td className="py-3 px-4 text-muted-foreground">{student.email}</td>
                              <td className="py-3 px-4">{student.enrolledCourses}</td>
                              <td className="py-3 px-4 font-medium">{student.averageGrade}%</td>
                              <td className="py-3 px-4">
                                <Badge
                                  className={
                                    student.status === "active"
                                      ? "bg-green-100 text-green-800"
                                      : "bg-gray-100 text-gray-800"
                                  }
                                >
                                  {student.status === "active" ? "Active" : "Inactive"}
                                </Badge>
                              </td>
                              <td className="py-3 px-4">
                                <Button variant="outline" size="sm">
                                  View Details
                                </Button>
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
          </div>
        </div>
      </main>
    </div>
  )
}
