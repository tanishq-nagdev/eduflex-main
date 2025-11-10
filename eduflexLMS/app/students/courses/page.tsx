"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/context/auth-context"
import { useRouter } from "next/navigation"
import { Sidebar } from "@/components/layout/sidebar"
import { CourseCard } from "@/components/student/course-card"
import api from "@/lib/api"

export default function StudentCoursesPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [courses, setCourses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isLoading && (!user || user.role !== "student")) {
      router.push("/dashboard")
    }
  }, [user, isLoading, router])

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await api.get("/student/courses")
        setCourses(res.data)
      } catch (error) {
        console.error("Failed to fetch courses:", error)
      } finally {
        setLoading(false)
      }
    }
    if (user?.role === "student") fetchCourses()
  }, [user])

  if (isLoading || !user || user.role !== "student") {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 md:ml-64 p-4 md:p-8">
        <h1 className="text-3xl font-bold mb-4">My Courses</h1>
        {loading ? (
          <p>Loading courses...</p>
        ) : courses.length === 0 ? (
          <p>No enrolled courses yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {courses.map((c) => (
              <CourseCard
                key={c._id}
                id={c._id}
                name={c.title}
                description={c.description}
                instructor={c.teacher?.name || "N/A"}
                studentCount={c.students.length}
                duration="N/A"
                level="Beginner"
                isEnrolled
                onView={() => router.push(`/student/assignments/${c._id}`)}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
