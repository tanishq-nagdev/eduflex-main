"use client"

interface SectionDividerProps {
  title?: string
  className?: string
}

export function SectionDivider({ title, className = "" }: SectionDividerProps) {
  if (title) {
    return (
      <div className={`flex items-center gap-4 my-6 ${className}`}>
        <div className="flex-1 h-px bg-border" />
        <h3 className="text-sm font-semibold text-muted-foreground">{title}</h3>
        <div className="flex-1 h-px bg-border" />
      </div>
    )
  }

  return <div className={`h-px bg-border my-6 ${className}`} />
}
