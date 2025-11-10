"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, CheckCircle, Upload } from "lucide-react"
import { Input } from "@/components/ui/input"

interface SubmissionFormProps {
  assignmentTitle: string
  onSubmit: (data: SubmissionData) => Promise<void>
  onCancel: () => void
}

export interface SubmissionData {
  content: string
  files: File[]
}

export function SubmissionForm({ assignmentTitle, onSubmit, onCancel }: SubmissionFormProps) {
  const [content, setContent] = useState("")
  const [files, setFiles] = useState<File[]>([])
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [submitting, setSubmitting] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    if (!content.trim() && files.length === 0) {
      setError("Please provide content or upload files")
      return
    }

    setSubmitting(true)
    try {
      await onSubmit({ content, files })
      setSuccess("Assignment submitted successfully!")
      setContent("")
      setFiles([])
      setTimeout(() => {
        onCancel()
      }, 1500)
    } catch (err) {
      setError("Failed to submit assignment. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Submit Assignment</CardTitle>
        <CardDescription>{assignmentTitle}</CardDescription>
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
            <label className="text-sm font-medium">Your Answer</label>
            <Textarea
              placeholder="Write your answer here..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={6}
              className="resize-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Attachments (Optional)</label>
            <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition">
              <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
              <Input type="file" multiple onChange={handleFileChange} className="hidden" id="file-upload" />
              <label htmlFor="file-upload" className="cursor-pointer">
                <p className="text-sm font-medium text-foreground">Click to upload files</p>
                <p className="text-xs text-muted-foreground">or drag and drop</p>
              </label>
            </div>

            {files.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium">Selected files:</p>
                <ul className="space-y-1">
                  {files.map((file, idx) => (
                    <li key={idx} className="text-sm text-muted-foreground flex items-center gap-2">
                      <span className="text-primary">✓</span>
                      {file.name} ({(file.size / 1024).toFixed(2)} KB)
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="submit" className="flex-1" disabled={submitting}>
              {submitting ? "Submitting..." : "Submit Assignment"}
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
