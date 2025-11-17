import { forwardRef } from "react"
import { cn } from "@/utils/cn"

const Input = forwardRef(({ 
  className, 
  type = "text", 
  error,
  ...props 
}, ref) => {
  const baseClasses = "w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all duration-200 bg-white"
  
  const stateClasses = error 
    ? "border-red-300 focus:border-red-500 focus:ring-red-500/50" 
    : "border-gray-300"

  return (
    <input
      type={type}
      className={cn(baseClasses, stateClasses, className)}
      ref={ref}
      {...props}
    />
  )
})

Input.displayName = "Input"

export default Input