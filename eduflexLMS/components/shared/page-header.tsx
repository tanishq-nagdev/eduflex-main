import React from "react"

interface PageHeaderProps {
  title: string
  description: string
  children?: React.ReactNode // 'children' allows us to add buttons
}

/**
 * A reusable page header component.
 * I've updated this from your file to include the `children` prop,
 * which lets us add buttons (like "Create User") to the right side.
 */
export function PageHeader({ title, description, children }: PageHeaderProps) {
  return (
    <div className="mb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        <p className="text-lg text-muted-foreground">{description}</p>
      </div>
      {/* This will render any buttons we pass in */}
      <div className="flex-shrink-0">{children}</div>
    </div>
  )
}