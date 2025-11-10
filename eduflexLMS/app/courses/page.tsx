"use client"

import { useAuth } from "@/context/auth-context"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Sidebar } from "@/components/layout/sidebar"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, AlertCircle } from "lucide-react"
import { CourseCard } from "@/components/student/course-card"
import { CourseFilters } from "@/components/student/course-filters"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Link from "next/link"

interface Course {
  id: string
  name: string
  description: string
  instructor: string
  studentCount: number
  duration: string
  level: "Beginner" | "Intermediate" | "Advanced"
  isEnrolled?: boolean
}

export default function CoursesPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [courses, setCourses] = useState<Course[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [levelFilter, setLevelFilter] = useState("ALL")
  const [statusFilter, setStatusFilter] = useState("ALL")
  const [loadingCourses, setLoadingCourses] = useState(true)
  const [enrolling, setEnrolling] = useState<string | null>(null)
  const [error, setError] = useState("")

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
    }
  }, [user, isLoading, router])

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/courses")
        if (response.ok) {
          const data = await response.json()
          setCourses(data)
        }
      } catch (error) {
        console.error("Failed to fetch courses:", error)
        setError("Failed to load courses. Please try again.")
      } finally {
        setLoadingCourses(false)
      }
    }

    if (user) {
      fetchCourses()
    }
  }, [user])

  if (isLoading || !user) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      course.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesLevel = levelFilter === "ALL" || course.level === levelFilter

    let matchesStatus = true
    if (statusFilter === "enrolled") {
      matchesStatus = course.isEnrolled === true
    } else if (statusFilter === "available") {
      matchesStatus = course.isEnrolled !== true
    }

    return matchesSearch && matchesLevel && matchesStatus
  })

  const handleEnroll = async (courseId: string) => {
    setEnrolling(courseId)
    try {
      const response = await fetch(`http://localhost:5000/api/courses/${courseId}/enroll`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      })

      if (response.ok) {
        setCourses(courses.map((c) => (c.id === courseId ? { ...c, isEnrolled: true } : c)))
      } else {
        setError("Failed to enroll in course. Please try again.")
      }
    } catch (error) {
      console.error("Failed to enroll:", error)
      setError("Failed to enroll in course. Please try again.")
    } finally {
      setEnrolling(null)
    }
  }

  const handleReset = () => {
    setSearchTerm("")
    setLevelFilter("ALL")
    setStatusFilter("ALL")
  }

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 md:ml-64">
        <div className="p-4 md:p-8">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground">Courses</h1>
                <p className="text-muted-foreground mt-2">
                  {user.role === "student"
                    ? "Browse and enroll in courses to expand your knowledge"
                    : "Manage your courses"}
                </p>
              </div>
              {user.role === "teacher" && (
                <Link href="/courses/create">
                  <Button className="gap-2">
                    <Plus className="h-4 w-4" />
                    Create Course
                  </Button>
                </Link>
              )}
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {user.role === "student" && (
              <CourseFilters
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                levelFilter={levelFilter}
                onLevelChange={setLevelFilter}
                statusFilter={statusFilter}
                onStatusChange={setStatusFilter}
                onReset={handleReset}
              />
            )}

            {loadingCourses ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Loading courses...</p>
              </div>
            ) : filteredCourses.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground">
                    {courses.length === 0 ? "No courses available yet" : "No courses match your filters"}
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCourses.map((course) => (
                  <CourseCard
                    key={course.id}
                    {...course}
                    onEnroll={() => handleEnroll(course.id)}
                    onView={() => router.push(`/courses/${course.id}`)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
