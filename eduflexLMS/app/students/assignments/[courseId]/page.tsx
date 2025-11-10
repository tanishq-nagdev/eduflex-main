"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import { Sidebar } from "@/components/layout/sidebar"
import api from "@/lib/api"
import { Button } from "@/components/ui/button"

interface Assignment {
  _id: string
  title: string
  description: string
  dueDate: string
  submissions?: { submission: string[]; grade?: number }[]
}

export default function AssignmentsPage() {
  const { user, isLoading } = useAuth()
  const params = useParams()
  const courseId = params.courseId
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [loading, setLoading] = useState(true)
  const [filesMap, setFilesMap] = useState<Record<string, File[]>>({})

  useEffect(() => {
    if (user?.role !== "student") return

    const fetchAssignments = async () => {
      try {
        const res = await api.get(`/student/assignments/${courseId}`)
        setAssignments(res.data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchAssignments()
  }, [user, courseId])

  const handleFileChange = (assignmentId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFilesMap({ ...filesMap, [assignmentId]: Array.from(e.target.files) })
    }
  }

  const handleSubmit = async (assignmentId: string) => {
    const files = filesMap[assignmentId]
    if (!files || files.length === 0) return alert("Select files to submit")

    const formData = new FormData()
    files.forEach(f => formData.append("files", f))

    try {
      await api.post(`/student/assignments/${assignmentId}/submit`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      alert("Assignment submitted successfully")
    } catch (err) {
      console.error(err)
      alert("Submission failed")
    }
  }

  if (isLoading || !user || user.role !== "student") {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 md:ml-64 p-4 md:p-8">
        <h1 className="text-3xl font-bold mb-4">Assignments</h1>
        {loading ? (
          <p>Loading assignments...</p>
        ) : assignments.length === 0 ? (
          <p>No assignments yet.</p>
        ) : (
          <div className="space-y-4">
            {assignments.map(a => (
              <div key={a._id} className="border p-4 rounded-md">
                <h2 className="font-semibold text-lg">{a.title}</h2>
                <p>{a.description}</p>
                <p className="text-sm text-muted-foreground">Due: {a.dueDate?.slice(0, 10)}</p>
                <input type="file" multiple onChange={(e) => handleFileChange(a._id, e)} className="mt-2 mb-2" />
                <Button onClick={() => handleSubmit(a._id)}>Submit Assignment</Button>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
