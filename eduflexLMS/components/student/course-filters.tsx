"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, X } from "lucide-react"

interface CourseFiltersProps {
  searchTerm: string
  onSearchChange: (term: string) => void
  levelFilter: string
  onLevelChange: (level: string) => void
  statusFilter: string
  onStatusChange: (status: string) => void
  onReset: () => void
}

export function CourseFilters({
  searchTerm,
  onSearchChange,
  levelFilter,
  onLevelChange,
  statusFilter,
  onStatusChange,
  onReset,
}: CourseFiltersProps) {
  const hasActiveFilters = searchTerm || levelFilter !== "ALL" || statusFilter !== "ALL"

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search courses by name or description..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="flex flex-col md:flex-row gap-3">
        <Select value={levelFilter} onValueChange={onLevelChange}>
          <SelectTrigger className="w-full md:w-40">
            <SelectValue placeholder="Filter by level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Levels</SelectItem>
            <SelectItem value="Beginner">Beginner</SelectItem>
            <SelectItem value="Intermediate">Intermediate</SelectItem>
            <SelectItem value="Advanced">Advanced</SelectItem>
          </SelectContent>
        </Select>

        <Select value={statusFilter} onValueChange={onStatusChange}>
          <SelectTrigger className="w-full md:w-40">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Courses</SelectItem>
            <SelectItem value="enrolled">Enrolled</SelectItem>
            <SelectItem value="available">Available</SelectItem>
          </SelectContent>
        </Select>

        {hasActiveFilters && (
          <Button variant="outline" onClick={onReset} className="gap-2 bg-transparent">
            <X className="h-4 w-4" />
            Reset
          </Button>
        )}
      </div>
    </div>
  )
}
