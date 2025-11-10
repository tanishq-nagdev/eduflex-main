"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, FileText, Download } from "lucide-react"
import { BadgeStatus } from "@/components/shared/badge-status"

interface Attachment {
  id: string
  name: string
  size: number
  url: string
}

interface SubmissionViewProps {
  assignmentTitle: string
  content: string
  submittedDate: string
  status: "submitted" | "graded"
  grade?: number
  feedback?: string
  attachments?: Attachment[]
  onClose: () => void
}

export function SubmissionView({
  assignmentTitle,
  content,
  submittedDate,
  status,
  grade,
  feedback,
  attachments = [],
  onClose,
}: SubmissionViewProps) {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-2">
            <div>
              <CardTitle>{assignmentTitle}</CardTitle>
              <CardDescription>Your submission</CardDescription>
            </div>
            <BadgeStatus
              status={status === "graded" ? "Graded" : "Submitted"}
              variant={status === "graded" ? "success" : "info"}
            />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>Submitted: {new Date(submittedDate).toLocaleString()}</span>
          </div>

          <div className="space-y-2">
            <h4 className="font-medium">Your Answer</h4>
            <div className="p-4 bg-muted rounded-lg text-sm whitespace-pre-wrap">{content}</div>
          </div>

          {attachments.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-medium">Attachments</h4>
              <div className="space-y-2">
                {attachments.map((attachment) => (
                  <div
                    key={attachment.id}
                    className="flex items-center justify-between p-3 border border-border rounded-lg"
                  >
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">{attachment.name}</p>
                        <p className="text-xs text-muted-foreground">{(attachment.size / 1024).toFixed(2)} KB</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" asChild>
                      <a href={attachment.url} download>
                        <Download className="h-4 w-4" />
                      </a>
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {status === "graded" && (
            <div className="space-y-4 border-t border-border pt-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Grade</h4>
                <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 text-lg px-3 py-1">
                  {grade}%
                </Badge>
              </div>

              {feedback && (
                <div className="space-y-2">
                  <h4 className="font-medium">Feedback</h4>
                  <div className="p-4 bg-muted rounded-lg text-sm whitespace-pre-wrap">{feedback}</div>
                </div>
              )}
            </div>
          )}

          <Button onClick={onClose} variant="outline" className="w-full bg-transparent">
            Close
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
