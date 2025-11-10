"use client"

import { useAuth } from "@/context/auth-context"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Sidebar } from "@/components/layout/sidebar"
import { PageHeader, LoadingSpinner, EmptyState } from "@/components/shared"
import { AssignmentCard } from "@/components/assignments/assignment-card"
import { SubmissionForm, type SubmissionData } from "@/components/assignments/submission-form"
import { SubmissionView } from "@/components/assignments/submission-view"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { FileQuestion } from "lucide-react"

interface Assignment {
  id: string
  title: string
  course: string
  description: string
  dueDate: string
  status: "pending" | "submitted" | "graded"
  grade?: number
  submittedDate?: string
  content?: string
  feedback?: string
  attachments?: any[]
}

export default function AssignmentsPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [loadingAssignments, setLoadingAssignments] = useState(true)
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null)
  const [showSubmitDialog, setShowSubmitDialog] = useState(false)
  const [showViewDialog, setShowViewDialog] = useState(false)

  useEffect(() => {
    if (!isLoading && (!user || user.role !== "student")) {
      router.push("/dashboard")
    }
  }, [user, isLoading, router])

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/assignments")
        if (response.ok) {
          const data = await response.json()
          setAssignments(data)
        }
      } catch (error) {
        console.error("Failed to fetch assignments:", error)
      } finally {
        setLoadingAssignments(false)
      }
    }

    if (user?.role === "student") {
      fetchAssignments()
    }
  }, [user])

  if (isLoading || !user || user.role !== "student") {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  const handleSubmit = async (data: SubmissionData) => {
    if (!selectedAssignment) return

    try {
      const formData = new FormData()
      formData.append("content", data.content)
      data.files.forEach((file) => {
        formData.append("files", file)
      })

      const response = await fetch(`http://localhost:5000/api/assignments/${selectedAssignment.id}/submit`, {
        method: "POST",
        body: formData,
      })

      if (response.ok) {
        const updatedAssignment = await response.json()
        setAssignments(assignments.map((a) => (a.id === selectedAssignment.id ? updatedAssignment : a)))
        setShowSubmitDialog(false)
        setSelectedAssignment(null)
      }
    } catch (error) {
      console.error("Failed to submit assignment:", error)
      throw error
    }
  }

  const pendingCount = assignments.filter((a) => a.status === "pending").length
  const submittedCount = assignments.filter((a) => a.status === "submitted").length
  const gradedCount = assignments.filter((a) => a.status === "graded").length

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 md:ml-64">
        <div className="p-4 md:p-8">
          <div className="space-y-6">
            <PageHeader title="My Assignments" description="Submit and track your assignments" />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-card border border-border rounded-lg p-4">
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold text-foreground">{pendingCount}</p>
              </div>
              <div className="bg-card border border-border rounded-lg p-4">
                <p className="text-sm text-muted-foreground">Submitted</p>
                <p className="text-2xl font-bold text-foreground">{submittedCount}</p>
              </div>
              <div className="bg-card border border-border rounded-lg p-4">
                <p className="text-sm text-muted-foreground">Graded</p>
                <p className="text-2xl font-bold text-foreground">{gradedCount}</p>
              </div>
            </div>

            {loadingAssignments ? (
              <div className="flex justify-center py-12">
                <LoadingSpinner text="Loading assignments..." />
              </div>
            ) : assignments.length === 0 ? (
              <EmptyState
                icon={<FileQuestion className="h-12 w-12" />}
                title="No assignments yet"
                description="You don't have any assignments assigned to you"
              />
            ) : (
              <div className="grid gap-4">
                {assignments.map((assignment) => (
                  <AssignmentCard
                    key={assignment.id}
                    {...assignment}
                    onSubmit={() => {
                      setSelectedAssignment(assignment)
                      setShowSubmitDialog(true)
                    }}
                    onView={() => {
                      setSelectedAssignment(assignment)
                      setShowViewDialog(true)
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Submit Dialog */}
      <Dialog open={showSubmitDialog} onOpenChange={setShowSubmitDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Submit Assignment</DialogTitle>
          </DialogHeader>
          {selectedAssignment && (
            <SubmissionForm
              assignmentTitle={selectedAssignment.title}
              onSubmit={handleSubmit}
              onCancel={() => {
                setShowSubmitDialog(false)
                setSelectedAssignment(null)
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>View Submission</DialogTitle>
          </DialogHeader>
          {selectedAssignment && (
            <SubmissionView
              assignmentTitle={selectedAssignment.title}
              content={selectedAssignment.content || ""}
              submittedDate={selectedAssignment.submittedDate || ""}
              status={selectedAssignment.status as "submitted" | "graded"}
              grade={selectedAssignment.grade}
              feedback={selectedAssignment.feedback}
              attachments={selectedAssignment.attachments}
              onClose={() => {
                setShowViewDialog(false)
                setSelectedAssignment(null)
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
