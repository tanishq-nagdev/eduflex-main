"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, CheckCircle } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface CourseFormProps {
  onSubmit: (data: CourseFormData) => Promise<void>
  isLoading?: boolean
}

export interface CourseFormData {
  name: string
  description: string
  level: "Beginner" | "Intermediate" | "Advanced"
  duration: string
  capacity: number
}

export function CourseForm({ onSubmit, isLoading = false }: CourseFormProps) {
  const [formData, setFormData] = useState<CourseFormData>({
    name: "",
    description: "",
    level: "Beginner",
    duration: "8 weeks",
    capacity: 30,
  })
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    setSubmitting(true)

    try {
      await onSubmit(formData)
      setSuccess("Course created successfully!")
      setFormData({
        name: "",
        description: "",
        level: "Beginner",
        duration: "8 weeks",
        capacity: 30,
      })
      setTimeout(() => setSuccess(""), 3000)
    } catch (err) {
      setError("Failed to create course. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create New Course</CardTitle>
        <CardDescription>Set up a new course for your students</CardDescription>
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
            <label className="text-sm font-medium">Course Name</label>
            <Input
              placeholder="e.g., Advanced Python Programming"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Description</label>
            <Textarea
              placeholder="Describe what students will learn in this course..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
              rows={4}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Level</label>
              <Select value={formData.level} onValueChange={(value: any) => setFormData({ ...formData, level: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Beginner">Beginner</SelectItem>
                  <SelectItem value="Intermediate">Intermediate</SelectItem>
                  <SelectItem value="Advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Duration</label>
              <Input
                placeholder="e.g., 8 weeks"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Student Capacity</label>
            <Input
              type="number"
              placeholder="30"
              value={formData.capacity}
              onChange={(e) => setFormData({ ...formData, capacity: Number.parseInt(e.target.value) })}
              required
              min="1"
            />
          </div>

          <Button type="submit" className="w-full" disabled={submitting || isLoading}>
            {submitting || isLoading ? "Creating..." : "Create Course"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
