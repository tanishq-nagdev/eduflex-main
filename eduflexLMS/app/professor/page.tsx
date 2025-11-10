"use client"

import { useAuth } from "@/context/auth-context"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Sidebar } from "@/components/layout/sidebar"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import  api  from "@/lib/api"

interface Stats {
  totalCourses: number
  totalAssignments: number
  pendingGrades: number
}

export default function ProfessorDashboard() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [stats, setStats] = useState<Stats>({ totalCourses: 0, totalAssignments: 0, pendingGrades: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isLoading && (!user || user.role !== "teacher")) router.push("/dashboard")
  }, [user, isLoading, router])

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await api.get("/professor/dashboard")
        setStats(data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    if (user?.role === "teacher") fetchStats()
  }, [user])

  if (isLoading || !user || user.role !== "teacher") {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 md:ml-64 p-6">
        <h1 className="text-3xl font-bold mb-4">Professor Dashboard</h1>
        {loading ? (
          <p>Loading stats...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader><CardTitle>Total Courses</CardTitle></CardHeader>
              <CardContent>{stats.totalCourses}</CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Total Assignments</CardTitle></CardHeader>
              <CardContent>{stats.totalAssignments}</CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Pending Grades</CardTitle></CardHeader>
              <CardContent>{stats.pendingGrades}</CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  )
}
