"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Sidebar } from "@/components/layout/sidebar"
import api from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Course {
  _id: string
  title: string
  description: string
  teacher: string
}

export default function AdminCoursesPage() {
  const router = useRouter()
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [teacherId, setTeacherId] = useState("")

  const fetchCourses = async () => {
    try {
      const res = await api.get("/admin/courses")
      setCourses(res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCourses()
  }, [])

  const createCourse = async () => {
    if (!title || !teacherId) return alert("Title and Teacher are required")
    try {
      const res = await api.post("/admin/courses", { title, description, teacher: teacherId })
      setCourses(prev => [...prev, res.data])
      setTitle("")
      setDescription("")
      setTeacherId("")
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 md:ml-64 p-4 md:p-8">
        <h1 className="text-3xl font-bold mb-4">Manage Courses</h1>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Create New Course</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Input placeholder="Course Title" value={title} onChange={e => setTitle(e.target.value)} />
            <Input placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} />
            <Input placeholder="Teacher ID" value={teacherId} onChange={e => setTeacherId(e.target.value)} />
            <Button onClick={createCourse}>Create New Course</Button>
          </CardContent>
        </Card>

        {loading ? (
          <p>Loading courses...</p>
        ) : (
          <div className="space-y-2">
            {courses.map(c => (
              <Card key={c._id}>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <div>
                      <h2 className="font-bold">{c.title}</h2>
                      <p>{c.description}</p>
                      <p className="text-sm text-muted-foreground">Teacher: {c.teacher}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
