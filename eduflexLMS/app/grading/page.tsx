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
import api from "@/lib/api"

interface Submission {
  id: string
  studentName: string
  assignmentTitle: string
  courseName: string
  submittedDate: string
  status: "pending" | "graded"
  grade?: number
}

export default function GradingPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loadingSubmissions, setLoadingSubmissions] = useState(true)

  useEffect(() => {
    if (!isLoading && (!user || user.role !== "teacher")) {
      router.push("/dashboard")
    }
  }, [user, isLoading, router])

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const { data } = await api.get("/teacher/submissions")
        setSubmissions(data)
      } catch (error) {
        console.error("Failed to fetch submissions:", error)
      } finally {
        setLoadingSubmissions(false)
      }
    }

    if (user?.role === "teacher") fetchSubmissions()
  }, [user])

  if (isLoading || !user || user.role !== "teacher") {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  const filteredSubmissions = submissions.filter(
    (s) =>
      s.studentName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.assignmentTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.courseName?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const pendingCount = submissions.filter((s) => s.status === "pending").length

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 md:ml-64">
        <div className="p-4 md:p-8 space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Grading</h1>
            <p className="text-muted-foreground mt-2">Review and grade student submissions</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Pending Submissions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{pendingCount}</div>
                <p className="text-xs text-muted-foreground">Awaiting review</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Total Submissions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{submissions.length}</div>
                <p className="text-xs text-muted-foreground">All time</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Graded</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{submissions.filter((s) => s.status === "graded").length}</div>
                <p className="text-xs text-muted-foreground">Completed</p>
              </CardContent>
            </Card>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by student, assignment, or course..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {loadingSubmissions ? (
            <div className="text-center py-12 text-muted-foreground">Loading submissions...</div>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Submissions</CardTitle>
                <CardDescription>{filteredSubmissions.length} submissions found</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-3 px-4 font-medium">Student</th>
                        <th className="text-left py-3 px-4 font-medium">Assignment</th>
                        <th className="text-left py-3 px-4 font-medium">Course</th>
                        <th className="text-left py-3 px-4 font-medium">Submitted</th>
                        <th className="text-left py-3 px-4 font-medium">Status</th>
                        <th className="text-left py-3 px-4 font-medium">Grade</th>
                        <th className="text-left py-3 px-4 font-medium">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredSubmissions.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="py-8 text-center text-muted-foreground">
                            No submissions found
                          </td>
                        </tr>
                      ) : (
                        filteredSubmissions.map((submission) => (
                          <tr key={submission.id} className="border-b border-border hover:bg-muted/50">
                            <td className="py-3 px-4 font-medium">{submission.studentName}</td>
                            <td className="py-3 px-4">{submission.assignmentTitle}</td>
                            <td className="py-3 px-4">{submission.courseName}</td>
                            <td className="py-3 px-4 text-muted-foreground">
                              {new Date(submission.submittedDate).toLocaleDateString()}
                            </td>
                            <td className="py-3 px-4">
                              <Badge
                                className={
                                  submission.status === "graded"
                                    ? "bg-green-100 text-green-800"
                                    : "bg-yellow-100 text-yellow-800"
                                }
                              >
                                {submission.status === "graded" ? "Graded" : "Pending"}
                              </Badge>
                            </td>
                            <td className="py-3 px-4">{submission.grade ?? "-"}</td>
                            <td className="py-3 px-4">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => router.push(`/grading/${submission.id}`)}
                              >
                                {submission.status === "graded" ? "View" : "Grade"}
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
      </main>
    </div>
  )
}
