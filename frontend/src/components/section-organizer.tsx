"use client"

import type React from "react"

export interface DashboardSection {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  component: React.ComponentType<any>
  role: string
}

interface SectionOrganizerProps {
  sections: DashboardSection[]
  activeSection: string
  role: string
}

export function SectionOrganizer({ sections, activeSection, role }: SectionOrganizerProps) {
  const roleSections = sections.filter((s) => s.role === role)
  const activeItem = roleSections.find((s) => s.id === activeSection)
  const Component = activeItem?.component

  if (!Component) {
    return (
      <div className="flex items-center justify-center h-96 text-muted-foreground">
        <p>Section not found</p>
      </div>
    )
  }

  return <Component />
}
