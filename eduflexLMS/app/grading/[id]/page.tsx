"use client"

import { useAuth } from "@/context/auth-context"
import { useRouter, useParams } from "next/navigation"
import { useEffect, useState } from "react"
import { Sidebar } from "@/components/layout/sidebar"
import { LoadingSpinner } from "@/components/shared"
import { GradeForm, type GradeData } from "@/components/grading/grade-form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Calendar, User } from "lucide-react"
import api from "@/lib/api"

interface Submission {
  id: string
  studentId: string
  studentName: string
  content: string
  submittedDate: string
  grade?: number
  feedback?: string
  status: "submitted" | "graded"
}

export default function GradeSubmissionPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const params = useParams()
  const submissionId = params.id as string

  const [submission, setSubmission] = useState<Submission | null>(null)
  const [loadingSubmission, setLoadingSubmission] = useState(true)
  const [showGradeDialog, setShowGradeDialog] = useState(false)

  useEffect(() => {
    if (!isLoading && (!user || user.role !== "teacher")) {
      router.push("/dashboard")
    }
  }, [user, isLoading, router])

  useEffect(() => {
    const fetchSubmission = async () => {
      try {
        const { data } = await api.get(`/teacher/submissions/${submissionId}`)
        setSubmission(data)
      } catch (error) {
        console.log("[v0] Submission fetch failed", error)
      } finally {
        setLoadingSubmission(false)
      }
    }

    if (user?.role === "teacher" && submissionId) {
      fetchSubmission()
    }
  }, [user, submissionId])

  if (isLoading || !user || user.role !== "teacher") {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  const handleGradeSubmit = async (data: GradeData) => {
    if (!submission) return
    try {
      const { data: updatedSubmission } = await api.post(
        `/teacher/submissions/${submission.id}/grade`,
        data
      )
      setSubmission(updatedSubmission)
      setShowGradeDialog(false)
    } catch (error) {
      console.log("[v0] Mock grading submission", error)
      setSubmission({ ...submission, grade: data.grade, feedback: data.feedback, status: "graded" })
      setShowGradeDialog(false)
    }
  }

  if (loadingSubmission) {
    return (
      <div className="flex">
        <Sidebar />
        <main className="flex-1 md:ml-64 flex justify-center p-8">
          <LoadingSpinner text="Loading submission..." />
        </main>
      </div>
    )
  }

  if (!submission) {
    return (
      <div className="flex">
        <Sidebar />
        <main className="flex-1 md:ml-64 p-8">
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">Submission not found</p>
              <Button onClick={() => router.push("/grading")} className="mt-4">
                Back to Grading
              </Button>
            </CardContent>
          </Card>
        </main>
      </div>
    )
  }

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 md:ml-64 p-8">
        <div className="space-y-6">
          <Button variant="outline" onClick={() => router.push("/grading")}>
            ← Back to Grading
          </Button>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <User className="h-4 w-4" /> Student
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-medium">{submission.studentName}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Calendar className="h-4 w-4" /> Submitted
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-medium">{new Date(submission.submittedDate).toLocaleDateString()}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Status</CardTitle>
              </CardHeader>
              <CardContent>
                <Badge
                  className={
                    submission.status === "graded"
                      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                      : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                  }
                >
                  {submission.status === "graded" ? "Graded" : "Pending"}
                </Badge>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Student Submission</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-4 bg-muted rounded-lg whitespace-pre-wrap text-sm">{submission.content}</div>
            </CardContent>
          </Card>

          {submission.status === "graded" && submission.feedback && (
            <Card>
              <CardHeader>
                <CardTitle>Grade & Feedback</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Grade</span>
                  <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 text-lg px-3 py-1">
                    {submission.grade}%
                  </Badge>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium">Feedback</p>
                  <div className="p-4 bg-muted rounded-lg text-sm whitespace-pre-wrap">{submission.feedback}</div>
                </div>
              </CardContent>
            </Card>
          )}

          <Button
            onClick={() => setShowGradeDialog(true)}
            className="w-full"
            disabled={submission.status === "graded"}
          >
            {submission.status === "graded" ? "Already Graded" : "Grade Submission"}
          </Button>
        </div>
      </main>

      <Dialog open={showGradeDialog} onOpenChange={setShowGradeDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Grade Submission</DialogTitle>
          </DialogHeader>
          <GradeForm
            studentName={submission.studentName}
            assignmentTitle="Assignment"
            initialGrade={submission.grade}
            initialFeedback={submission.feedback}
            onSubmit={handleGradeSubmit}
            onCancel={() => setShowGradeDialog(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}
