"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Users, Clock, BookOpen } from "lucide-react"

interface CourseCardProps {
  id: string
  name: string
  description: string
  instructor: string
  studentCount: number
  duration: string
  level: "Beginner" | "Intermediate" | "Advanced"
  isEnrolled?: boolean
  onEnroll?: () => void
  onView?: () => void
}

export function CourseCard({
  id,
  name,
  description,
  instructor,
  studentCount,
  duration,
  level,
  isEnrolled = false,
  onEnroll,
  onView,
}: CourseCardProps) {
  const getLevelColor = (level: string) => {
    switch (level) {
      case "Beginner":
        return "bg-green-100 text-green-800"
      case "Intermediate":
        return "bg-blue-100 text-blue-800"
      case "Advanced":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <Card className="hover:shadow-lg transition-shadow h-full flex flex-col">
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <CardTitle className="line-clamp-2">{name}</CardTitle>
            <CardDescription className="line-clamp-2 mt-1">{description}</CardDescription>
          </div>
          <Badge className={getLevelColor(level)}>{level}</Badge>
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Instructor</span>
            <span className="font-medium">{instructor}</span>
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span>{studentCount} students</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{duration}</span>
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          {isEnrolled ? (
            <Button className="w-full" onClick={onView}>
              <BookOpen className="h-4 w-4 mr-2" />
              View Course
            </Button>
          ) : (
            <Button className="w-full" onClick={onEnroll}>
              Enroll Now
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
