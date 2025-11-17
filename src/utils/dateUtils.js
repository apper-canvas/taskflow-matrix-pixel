import { format, isToday, isTomorrow, isPast, isThisWeek, isThisYear } from "date-fns"

export const formatDueDate = (dateString) => {
  if (!dateString) return null
  
  const date = new Date(dateString)
  
  if (isToday(date)) {
    return "Today"
  }
  
  if (isTomorrow(date)) {
    return "Tomorrow"
  }
  
  if (isPast(date) && !isToday(date)) {
    return `Overdue • ${format(date, "MMM d")}`
  }
  
  if (isThisWeek(date)) {
    return format(date, "EEEE")
  }
  
  if (isThisYear(date)) {
    return format(date, "MMM d")
  }
  
  return format(date, "MMM d, yyyy")
}

export const isOverdue = (dateString) => {
  if (!dateString) return false
  const date = new Date(dateString)
  return isPast(date) && !isToday(date)
}

export const formatDateForInput = (dateString) => {
  if (!dateString) return ""
  return format(new Date(dateString), "yyyy-MM-dd")
}

export const createDateFromInput = (inputValue) => {
  if (!inputValue) return null
  return new Date(inputValue).toISOString()
}