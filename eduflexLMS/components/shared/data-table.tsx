"use client"

import type { ReactNode } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface Column {
  key: string
  label: string
  render?: (value: any, row: any) => ReactNode
}

interface DataTableProps {
  title?: string
  description?: string
  columns: Column[]
  data: any[]
  isLoading?: boolean
  emptyMessage?: string
}

export function DataTable({
  title,
  description,
  columns,
  data,
  isLoading = false,
  emptyMessage = "No data found",
}: DataTableProps) {
  return (
    <Card>
      {(title || description) && (
        <CardHeader>
          {title && <CardTitle>{title}</CardTitle>}
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
      )}
      <CardContent>
        {isLoading ? (
          <div className="py-8 text-center text-muted-foreground">Loading...</div>
        ) : data.length === 0 ? (
          <div className="py-8 text-center text-muted-foreground">{emptyMessage}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  {columns.map((column) => (
                    <th key={column.key} className="text-left py-3 px-4 font-medium">
                      {column.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.map((row, idx) => (
                  <tr key={idx} className="border-b border-border hover:bg-muted/50 transition">
                    {columns.map((column) => (
                      <td key={column.key} className="py-3 px-4">
                        {column.render ? column.render(row[column.key], row) : row[column.key]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
