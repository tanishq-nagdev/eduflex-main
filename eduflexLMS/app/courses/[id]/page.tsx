"use client"

import { useAuth } from "@/context/auth-context"
import { useRouter, useParams } from "next/navigation"
import { useEffect, useState } from "react"
import { Sidebar } from "@/components/layout/sidebar"
import { LoadingSpinner } from "@/components/shared"
import { CourseDetailCard } from "@/components/courses/course-detail-card"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BookOpen, FileText } from "lucide-react"

interface Course {
  id: string
  name: string
  description: string
  instructor: string
  studentCount: number
  duration: string
  level: "Beginner" | "Intermediate" | "Advanced"
  startDate: string
  capacity: number
  isEnrolled: boolean
  syllabus?: string
  materials?: any[]
  assignments?: any[]
}

const MOCK_COURSES: Record<string, Course> = {
  "68fdeb3b522d9e16710e07c8": {
    id: "68fdeb3b522d9e16710e07c8",
    name: "Introduction to Web Development",
    description: "Learn the fundamentals of web development including HTML, CSS, and JavaScript.",
    instructor: "Jane Teacher",
    studentCount: 24,
    duration: "8 weeks",
    level: "Beginner",
    startDate: "2024-01-15",
    capacity: 30,
    isEnrolled: false,
    syllabus: "Week 1: HTML Basics\nWeek 2: CSS Styling\nWeek 3: JavaScript Fundamentals\nWeek 4-8: Projects",
    materials: [
      { id: "1", name: "HTML Cheat Sheet" },
      { id: "2", name: "CSS Guide" },
      { id: "3", name: "JavaScript Basics" },
    ],
    assignments: [
      { id: "1", title: "Build a Personal Website", dueDate: "2024-02-01" },
      { id: "2", title: "Create a Todo App", dueDate: "2024-02-15" },
    ],
  },
}

export default function CourseDetailPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const params = useParams()
  const courseId = params.id as string

  const [course, setCourse] = useState<Course | null>(null)
  const [loadingCourse, setLoadingCourse] = useState(true)
  const [enrolling, setEnrolling] = useState(false)

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
    }
  }, [user, isLoading, router])

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/courses/${courseId}`, {
          signal: AbortSignal.timeout(5000),
        })
        if (response.ok) {
          const data = await response.json()
          setCourse(data)
        } else {
          throw new Error("Failed to fetch")
        }
      } catch (error) {
        console.log("[v0] Using mock course data")
        const mockCourse = MOCK_COURSES[courseId]
        if (mockCourse) {
          setCourse(mockCourse)
        }
      } finally {
        setLoadingCourse(false)
      }
    }

    if (user && courseId) {
      fetchCourse()
    }
  }, [user, courseId])

  if (isLoading || !user) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  const handleEnroll = async () => {
    if (!course) return
    setEnrolling(true)
    try {
      const response = await fetch(`http://localhost:5000/api/courses/${course.id}/enroll`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: AbortSignal.timeout(5000),
      })

      if (response.ok) {
        setCourse({ ...course, isEnrolled: true })
      } else {
        throw new Error("Failed to enroll")
      }
    } catch (error) {
      console.log("[v0] Mock enrollment")
      setCourse({ ...course, isEnrolled: true })
    } finally {
      setEnrolling(false)
    }
  }

  const handleUnenroll = async () => {
    if (!course) return
    setEnrolling(true)
    try {
      const response = await fetch(`http://localhost:5000/api/courses/${course.id}/unenroll`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: AbortSignal.timeout(5000),
      })

      if (response.ok) {
        setCourse({ ...course, isEnrolled: false })
      } else {
        throw new Error("Failed to unenroll")
      }
    } catch (error) {
      console.log("[v0] Mock unenrollment")
      setCourse({ ...course, isEnrolled: false })
    } finally {
      setEnrolling(false)
    }
  }

  if (loadingCourse) {
    return (
      <div className="flex">
        <Sidebar />
        <main className="flex-1 md:ml-64">
          <div className="p-4 md:p-8 flex justify-center">
            <LoadingSpinner text="Loading course..." />
          </div>
        </main>
      </div>
    )
  }

  if (!course) {
    return (
      <div className="flex">
        <Sidebar />
        <main className="flex-1 md:ml-64">
          <div className="p-4 md:p-8">
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">Course not found</p>
                <Button onClick={() => router.push("/courses")} className="mt-4">
                  Back to Courses
                </Button>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 md:ml-64">
        <div className="p-4 md:p-8">
          <div className="space-y-6">
            <Button variant="outline" onClick={() => router.push("/courses")} className="bg-transparent">
              ← Back to Courses
            </Button>

            <CourseDetailCard {...course} onEnroll={handleEnroll} onUnenroll={handleUnenroll} />

            {course.isEnrolled && (
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="materials">Materials</TabsTrigger>
                  <TabsTrigger value="assignments">Assignments</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Course Syllabus</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground whitespace-pre-wrap">
                        {course.syllabus || "No syllabus available yet"}
                      </p>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="materials" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Course Materials</CardTitle>
                      <CardDescription>Download course resources</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {course.materials && course.materials.length > 0 ? (
                        <div className="space-y-2">
                          {course.materials.map((material: any) => (
                            <div
                              key={material.id}
                              className="flex items-center justify-between p-3 border border-border rounded-lg"
                            >
                              <div className="flex items-center gap-2">
                                <BookOpen className="h-4 w-4 text-muted-foreground" />
                                <span className="font-medium">{material.name}</span>
                              </div>
                              <Button variant="outline" size="sm">
                                Download
                              </Button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-muted-foreground">No materials available yet</p>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="assignments" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Assignments</CardTitle>
                      <CardDescription>View and submit assignments</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {course.assignments && course.assignments.length > 0 ? (
                        <div className="space-y-2">
                          {course.assignments.map((assignment: any) => (
                            <div
                              key={assignment.id}
                              className="flex items-center justify-between p-3 border border-border rounded-lg"
                            >
                              <div className="flex items-center gap-2">
                                <FileText className="h-4 w-4 text-muted-foreground" />
                                <div>
                                  <p className="font-medium">{assignment.title}</p>
                                  <p className="text-xs text-muted-foreground">
                                    Due: {new Date(assignment.dueDate).toLocaleDateString()}
                                  </p>
                                </div>
                              </div>
                              <Button variant="outline" size="sm">
                                View
                              </Button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-muted-foreground">No assignments yet</p>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
