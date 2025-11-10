"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, CheckCircle } from "lucide-react"

interface GradeFormProps {
  studentName: string
  assignmentTitle: string
  onSubmit: (data: GradeData) => Promise<void>
  onCancel: () => void
  initialGrade?: number
  initialFeedback?: string
}

export interface GradeData {
  grade: number
  feedback: string
}

export function GradeForm({
  studentName,
  assignmentTitle,
  onSubmit,
  onCancel,
  initialGrade = 0,
  initialFeedback = "",
}: GradeFormProps) {
  const [grade, setGrade] = useState(initialGrade.toString())
  const [feedback, setFeedback] = useState(initialFeedback)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    const gradeNum = Number.parseInt(grade)
    if (isNaN(gradeNum) || gradeNum < 0 || gradeNum > 100) {
      setError("Grade must be between 0 and 100")
      return
    }

    setSubmitting(true)
    try {
      await onSubmit({ grade: gradeNum, feedback })
      setSuccess("Grade submitted successfully!")
      setTimeout(() => {
        onCancel()
      }, 1500)
    } catch (err) {
      setError("Failed to submit grade. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Grade Assignment</CardTitle>
        <CardDescription>
          {studentName} - {assignmentTitle}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {success && (
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">{success}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium">Grade (0-100)</label>
            <div className="flex gap-2">
              <Input
                type="number"
                min="0"
                max="100"
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                placeholder="85"
                required
              />
              <span className="flex items-center text-muted-foreground">%</span>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Feedback (Optional)</label>
            <Textarea
              placeholder="Provide constructive feedback for the student..."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              rows={4}
              className="resize-none"
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="submit" className="flex-1" disabled={submitting}>
              {submitting ? "Submitting..." : "Submit Grade"}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel} className="flex-1 bg-transparent">
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
