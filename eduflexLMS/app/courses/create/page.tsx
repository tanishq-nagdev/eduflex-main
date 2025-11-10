"use client"

import { useAuth } from "@/context/auth-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Sidebar } from "@/components/layout/sidebar"
import { CourseForm, type CourseFormData } from "@/components/teacher/course-form"

export default function CreateCoursePage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && (!user || user.role !== "teacher")) {
      router.push("/dashboard")
    }
  }, [user, isLoading, router])

  const handleCreateCourse = async (data: CourseFormData) => {
    try {
      const response = await fetch("http://localhost:5000/api/courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error("Failed to create course")
      }

      setTimeout(() => {
        router.push("/courses")
      }, 1500)
    } catch (error) {
      console.error("Failed to create course:", error)
      throw error
    }
  }

  if (isLoading || !user || user.role !== "teacher") {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 md:ml-64">
        <div className="p-4 md:p-8">
          <div className="max-w-2xl">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-foreground">Create New Course</h1>
              <p className="text-muted-foreground mt-2">Set up a new course for your students</p>
            </div>

            <CourseForm onSubmit={handleCreateCourse} />
          </div>
        </div>
      </main>
    </div>
  )
}
