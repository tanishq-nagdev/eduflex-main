"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/context/auth-context"
import { useRouter } from "next/navigation"
import { Sidebar } from "@/components/layout/sidebar"
import api from "@/lib/api"
import { Table, TableBody, TableCell, TableHead, TableRow } from "@/components/ui/table"

interface Grade {
  assignmentId: string
  assignmentTitle: string
  course: string
  grade: number | null
  submitted: boolean
  files: string[]
}

export default function GradesPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [grades, setGrades] = useState<Grade[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isLoading && (!user || user.role !== "student")) {
      router.push("/dashboard")
    }
  }, [user, isLoading, router])

  useEffect(() => {
    if (user?.role !== "student") return
    const fetchGrades = async () => {
      try {
        const res = await api.get("/student/grades")
        setGrades(res.data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchGrades()
  }, [user])

  if (isLoading || !user || user.role !== "student") {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 md:ml-64 p-4 md:p-8">
        <h1 className="text-3xl font-bold mb-4">My Grades</h1>
        {loading ? (
          <p>Loading grades...</p>
        ) : grades.length === 0 ? (
          <p>No grades available yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <Table>
  <TableHead>
    <TableRow>
      <TableCell>Assignment</TableCell>
      <TableCell>Course</TableCell>
      <TableCell>Submitted</TableCell>
      <TableCell>Grade</TableCell>
      <TableCell>Files</TableCell>
    </TableRow>
  </TableHead>
  <TableBody>
    {grades.map(g => (
      <TableRow key={g.assignmentId}>
        <TableCell>{g.assignmentTitle}</TableCell>
        <TableCell>{g.course}</TableCell>
        <TableCell>{g.submitted ? "Yes" : "No"}</TableCell>
        <TableCell>{g.grade !== null ? g.grade : "N/A"}</TableCell>
        <TableCell>
          {g.files.map((f, i) => (
            <a key={i} href={f} target="_blank" className="text-blue-600 underline mr-2">{`File ${i + 1}`}</a>
          ))}
        </TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>

          </div>
        )}
      </main>
    </div>
  )
}
