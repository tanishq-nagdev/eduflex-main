"use client"

import { useEffect, useState } from "react"
import { Sidebar } from "@/components/layout/sidebar"
import api  from "@/lib/api"
import { CourseCard } from "@/components/teacher/course-card"
import { CourseFilters } from "@/components/teacher/course-filters"

interface Course {
  _id: string
  title: string
  description: string
  studentsCount: number
  level: "Beginner" | "Intermediate" | "Advanced"
}

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [levelFilter, setLevelFilter] = useState("ALL")

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const { data } = await api.get("/professor/courses")
        setCourses(data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchCourses()
  }, [])

  const filteredCourses = courses.filter(c =>
    c.title.toLowerCase().includes(search.toLowerCase()) &&
    (levelFilter === "ALL" || c.level === levelFilter)
  )

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 md:ml-64 p-6">
        <h1 className="text-3xl font-bold mb-4">My Courses</h1>
        <CourseFilters
          searchTerm={search}
          onSearchChange={setSearch}
          levelFilter={levelFilter}
          onLevelChange={setLevelFilter}
          statusFilter="ALL"
          onStatusChange={() => {}}
          onReset={() => { setSearch(""); setLevelFilter("ALL") }}
        />
        {loading ? <p>Loading courses...</p> : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            {filteredCourses.map(c => (
              <CourseCard
                key={c._id}
                id={c._id}
                name={c.title}
                description={c.description}
                instructor="You"
                studentCount={c.studentsCount}
                duration="N/A"
                level={c.level}
                isEnrolled
                onView={() => {}}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
