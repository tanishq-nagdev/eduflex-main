"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface CourseDetailCardProps {
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
  onEnroll?: () => void
  onUnenroll?: () => void
}

export function CourseDetailCard({
  id,
  name,
  description,
  instructor,
  studentCount,
  duration,
  level,
  startDate,
  capacity,
  isEnrolled,
  onEnroll,
  onUnenroll,
}: CourseDetailCardProps) {
  const getLevelColor = (level: string) => {
    switch (level) {
      case "Beginner":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "Intermediate":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      case "Advanced":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const capacityPercentage = (studentCount / capacity) * 100

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <CardTitle className="text-2xl">{name}</CardTitle>
            <CardDescription className="mt-2">{description}</CardDescription>
          </div>
          <Badge className={getLevelColor(level)}>{level}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Instructor</p>
            <p className="font-medium">{instructor}</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Duration</p>
            <p className="font-medium">{duration}</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Start Date</p>
            <p className="font-medium">{new Date(startDate).toLocaleDateString()}</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Capacity</p>
            <p className="font-medium">
              {studentCount} / {capacity} students
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Enrollment</span>
            <span className="font-medium">{capacityPercentage.toFixed(0)}%</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all"
              style={{ width: `${Math.min(capacityPercentage, 100)}%` }}
            />
          </div>
        </div>

        <div className="flex gap-2 pt-4">
          {isEnrolled ? (
            <Button variant="outline" onClick={onUnenroll} className="flex-1 bg-transparent">
              Unenroll
            </Button>
          ) : (
            <Button onClick={onEnroll} className="flex-1" disabled={studentCount >= capacity}>
              {studentCount >= capacity ? "Course Full" : "Enroll Now"}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
