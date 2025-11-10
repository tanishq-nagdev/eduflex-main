"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { ReactNode } from "react"

interface StatCardProps {
  title: string
  value: string | number
  description?: string
  icon?: ReactNode
  variant?: "default" | "success" | "warning" | "danger"
}

export function StatCard({ title, value, description, icon, variant = "default" }: StatCardProps) {
  const variantClasses = {
    default: "bg-primary/10 text-primary",
    success: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200",
    warning: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-200",
    danger: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200",
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          {icon && <div className={`p-2 rounded-lg ${variantClasses[variant]}`}>{icon}</div>}
          <span>{title}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
      </CardContent>
    </Card>
  )
}
