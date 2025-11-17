import { forwardRef } from "react"
import { cn } from "@/utils/cn"

const Badge = forwardRef(({ 
  className, 
  variant = "default", 
  size = "md",
  children, 
  ...props 
}, ref) => {
  const baseClasses = "inline-flex items-center justify-center font-medium rounded-full transition-all duration-200"
  
  const variants = {
    default: "bg-gray-100 text-gray-700",
    primary: "bg-gradient-to-r from-primary to-secondary text-white shadow-sm",
    secondary: "bg-gradient-to-r from-secondary to-purple-600 text-white shadow-sm",
    success: "bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-sm",
    warning: "bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-sm",
    danger: "bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-sm",
    high: "bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-sm",
    medium: "bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-sm",
    low: "bg-gradient-to-r from-gray-400 to-slate-500 text-white shadow-sm"
  }
  
  const sizes = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-2.5 py-1 text-xs",
    lg: "px-3 py-1.5 text-sm"
  }

  return (
    <span
      className={cn(baseClasses, variants[variant], sizes[size], className)}
      ref={ref}
      {...props}
    >
      {children}
    </span>
  )
})

Badge.displayName = "Badge"

export default Badge