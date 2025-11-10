"use client"

import { useEffect, useState } from "react"
import { Sidebar } from "@/components/layout/sidebar"
import api  from "@/lib/api"
import { Button } from "@/components/ui/button"

interface Assignment {
  _id: string
  title: string
  course: string
  dueDate: string
}

export default function AssignmentsPage() {
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const { data } = await api.get("/professor/assignments")
        setAssignments(data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchAssignments()
  }, [])

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 md:ml-64 p-6">
        <h1 className="text-3xl font-bold mb-4">Assignments</h1>
        {loading ? <p>Loading...</p> : (
          <table className="table-auto w-full text-left">
            <thead>
              <tr>
                <th>Title</th>
                <th>Course</th>
                <th>Due Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {assignments.map(a => (
                <tr key={a._id}>
                  <td>{a.title}</td>
                  <td>{a.course}</td>
                  <td>{new Date(a.dueDate).toLocaleDateString()}</td>
                  <td>
                    <Button onClick={() => window.location.href=`/professor/grading/${a._id}`}>Grade</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </main>
    </div>
  )
}
