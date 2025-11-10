"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, FileText, Clock } from "lucide-react"
import { BadgeStatus } from "@/components/shared/badge-status"

interface AssignmentCardProps {
  id: string
  title: string
  course: string
  description: string
  dueDate: string
  status: "pending" | "submitted" | "graded"
  grade?: number
  submittedDate?: string
  onSubmit?: () => void
  onView?: () => void
}

export function AssignmentCard({
  id,
  title,
  course,
  description,
  dueDate,
  status,
  grade,
  submittedDate,
  onSubmit,
  onView,
}: AssignmentCardProps) {
  const isOverdue = new Date(dueDate) < new Date() && status === "pending"

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "graded":
        return "success"
      case "submitted":
        return "info"
      case "pending":
        return isOverdue ? "danger" : "warning"
      default:
        return "default"
    }
  }

  const getStatusLabel = (status: string) => {
    if (status === "pending" && isOverdue) return "Overdue"
    return status.charAt(0).toUpperCase() + status.slice(1)
  }

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <CardTitle className="line-clamp-2">{title}</CardTitle>
            <CardDescription className="line-clamp-1 mt-1">{course}</CardDescription>
          </div>
          <BadgeStatus status={getStatusLabel(status)} variant={getStatusVariant(status)} />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground line-clamp-2">{description}</p>

        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>Due: {new Date(dueDate).toLocaleDateString()}</span>
          </div>

          {submittedDate && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>Submitted: {new Date(submittedDate).toLocaleDateString()}</span>
            </div>
          )}

          {grade !== undefined && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <FileText className="h-4 w-4" />
              <span>Grade: {grade}%</span>
            </div>
          )}
        </div>

        <div className="flex gap-2 pt-2">
          {status === "pending" && (
            <Button className="flex-1" onClick={onSubmit}>
              Submit Assignment
            </Button>
          )}
          {status !== "pending" && (
            <Button variant="outline" className="flex-1 bg-transparent" onClick={onView}>
              View Submission
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
