"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Users, Clock, Edit2, Trash2 } from "lucide-react"

interface TeacherCourseCardProps {
  id: string
  name: string
  description: string
  studentCount: number
  duration: string
  level: "Beginner" | "Intermediate" | "Advanced"
  onEdit?: () => void
  onDelete?: () => void
  onManageStudents?: () => void
}

export function TeacherCourseCard({
  id,
  name,
  description,
  studentCount,
  duration,
  level,
  onEdit,
  onDelete,
  onManageStudents,
}: TeacherCourseCardProps) {
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
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <CardTitle className="line-clamp-2">{name}</CardTitle>
            <CardDescription className="line-clamp-2 mt-1">{description}</CardDescription>
          </div>
          <Badge className={getLevelColor(level)}>{level}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
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

        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={onManageStudents} className="flex-1 bg-transparent">
            Manage Students
          </Button>
          <Button variant="ghost" size="sm" onClick={onEdit} className="text-blue-600 hover:text-blue-700">
            <Edit2 className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={onDelete} className="text-destructive hover:text-destructive">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
