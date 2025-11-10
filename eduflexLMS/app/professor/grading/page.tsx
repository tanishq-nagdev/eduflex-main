"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Sidebar } from "@/components/layout/sidebar"
import api  from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface Submission {
  _id: string
  studentName: string
  files: string[]
  grade?: number
}

export default function GradingPage() {
  const params = useParams()
  const assignmentId = params.assignmentId
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const { data } = await api.get(`/professor/assignments/${assignmentId}/submissions`)
        setSubmissions(data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchSubmissions()
  }, [assignmentId])

  const handleGradeChange = (studentId: string, grade: number) => {
    setSubmissions(prev => prev.map(s => s._id === studentId ? { ...s, grade } : s))
  }

  const submitGrades = async () => {
    try {
      await api.post(`/professor/assignments/${assignmentId}/grade`, { submissions })
      alert("Grades submitted!")
    } catch (err) {
      console.error(err)
      alert("Failed to submit grades")
    }
  }

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 md:ml-64 p-6">
        <h1 className="text-3xl font-bold mb-4">Grade Submissions</h1>
        {loading ? <p>Loading...</p> : (
          <div className="space-y-4">
            {submissions.map(s => (
              <div key={s._id} className="border p-3 rounded-md flex items-center justify-between">
                <div>
                  <p className="font-medium">{s.studentName}</p>
                  <a href={s.files[0]} target="_blank" className="text-blue-500 underline">View File</a>
                </div>
                <Input
                  type="number"
                  placeholder="Grade"
                  value={s.grade ?? ""}
                  onChange={e => handleGradeChange(s._id, Number(e.target.value))}
                  className="w-20"
                />
              </div>
            ))}
            <Button onClick={submitGrades}>Submit Grades</Button>
          </div>
        )}
      </main>
    </div>
  )
}
