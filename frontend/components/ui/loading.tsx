'use client'

import { RefreshCw } from 'lucide-react'

interface LoadingProps {
  text?: string
  size?: 'sm' | 'md' | 'lg'
}

export function Loading({ text = 'Loading...', size = 'md' }: LoadingProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8'
  }

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <RefreshCw className={`${sizeClasses[size]} animate-spin mb-2`} />
      <p className="text-sm text-muted-foreground">{text}</p>
    </div>
  )
}
