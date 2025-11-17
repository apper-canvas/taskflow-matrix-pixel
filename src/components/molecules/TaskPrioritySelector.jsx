import { useState } from "react"
import ApperIcon from "@/components/ApperIcon"
import Badge from "@/components/atoms/Badge"

const TaskPrioritySelector = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false)

  const priorities = [
    { value: "high", label: "High Priority", variant: "high", icon: "AlertTriangle" },
    { value: "medium", label: "Medium Priority", variant: "medium", icon: "Circle" },
    { value: "low", label: "Low Priority", variant: "low", icon: "Minus" }
  ]

  const selectedPriority = priorities.find(p => p.value === value) || priorities[1]

  const handleSelect = (priority) => {
    onChange(priority.value)
    setIsOpen(false)
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:border-gray-400 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50"
      >
        <ApperIcon name={selectedPriority.icon} size={16} />
        <Badge variant={selectedPriority.variant} size="sm">
          {selectedPriority.label}
        </Badge>
        <ApperIcon name="ChevronDown" size={16} className="text-gray-400" />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-10">
          {priorities.map((priority) => (
            <button
              key={priority.value}
              type="button"
              onClick={() => handleSelect(priority)}
              className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg transition-colors"
            >
              <ApperIcon name={priority.icon} size={16} />
              <Badge variant={priority.variant} size="sm">
                {priority.label}
              </Badge>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default TaskPrioritySelector