"use client"

import { useEffect, useState } from "react"
import { Eye } from "lucide-react"

export function VisitorCounter() {
  const [visitors, setVisitors] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate visitor count - in real implementation this would come from analytics
    const simulatedCount = Math.floor(Math.random() * 50) + 15
    setTimeout(() => {
      setVisitors(simulatedCount)
      setIsLoading(false)
    }, 1000)
  }, [])

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 text-muted-foreground">
        <Eye size={16} />
        <span className="text-sm">Cargando visitantes...</span>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2 text-muted-foreground">
      <Eye size={16} />
      <span className="text-sm">
        {visitors} {visitors === 1 ? "persona" : "personas"} navegando ahora
      </span>
    </div>
  )
}
