import { useState } from "react"
import { toast } from "react-toastify"
import ApperIcon from "@/components/ApperIcon"
import Badge from "@/components/atoms/Badge"
import Button from "@/components/atoms/Button"
import { formatDueDate, isOverdue } from "@/utils/dateUtils"
import { createConfetti } from "@/utils/confetti"
import { taskService } from "@/services/api/taskService"

const TaskCard = ({ task, onEdit, onUpdate }) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleToggleComplete = async () => {
    setLoading(true)
    try {
      const updatedTask = await taskService.update(task.id, {
        completed: !task.completed,
        completedAt: !task.completed ? new Date().toISOString() : null
      })
      
      if (!task.completed) {
        createConfetti()
        toast.success("🎉 Task completed! Great work!")
      } else {
        toast.info("Task marked as incomplete")
      }
      
      onUpdate?.(updatedTask)
    } catch (error) {
      console.error("Error updating task:", error)
      toast.error("Failed to update task")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this task?")) {
      return
    }

    setLoading(true)
    try {
      await taskService.delete(task.id)
      toast.success("Task deleted successfully")
      onUpdate?.()
    } catch (error) {
      console.error("Error deleting task:", error)
      toast.error("Failed to delete task")
    } finally {
      setLoading(false)
    }
  }

  const priorityConfig = {
    high: { variant: "high", icon: "AlertTriangle" },
    medium: { variant: "medium", icon: "Circle" },
    low: { variant: "low", icon: "Minus" }
  }

  const config = priorityConfig[task.priority] || priorityConfig.medium
  const dueDateText = formatDueDate(task.dueDate)
  const taskIsOverdue = isOverdue(task.dueDate)

  return (
    <div className={`card p-4 transition-all duration-200 hover:-translate-y-0.5 ${task.completed ? "opacity-60" : ""}`}>
      <div className="flex items-start gap-3">
        <div className="checkbox-wrapper">
          <input
            type="checkbox"
            checked={task.completed}
            onChange={handleToggleComplete}
            disabled={loading}
            className="mt-0.5"
          />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3 className={`font-semibold text-gray-900 ${task.completed ? "line-through" : ""}`}>
              {task.title}
            </h3>
            
            <div className="flex items-center gap-1">
              <button
                onClick={() => onEdit?.(task)}
                className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors"
                disabled={loading}
              >
                <ApperIcon name="Edit2" size={16} />
              </button>
              <button
                onClick={handleDelete}
                className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                disabled={loading}
              >
                <ApperIcon name="Trash2" size={16} />
              </button>
            </div>
          </div>

          {task.description && (
            <div>
              <p className={`text-gray-600 text-sm mt-1 ${!isExpanded ? "line-clamp-2" : ""}`}>
                {task.description}
              </p>
              {task.description.length > 100 && (
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="text-primary text-sm hover:text-secondary transition-colors mt-1"
                >
                  {isExpanded ? "Show less" : "Show more"}
                </button>
              )}
            </div>
          )}

          <div className="flex items-center gap-3 mt-3">
            <Badge variant={config.variant} size="sm">
              <ApperIcon name={config.icon} size={12} className="mr-1" />
              {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
            </Badge>

            {dueDateText && (
              <div className={`flex items-center gap-1 text-sm ${taskIsOverdue ? "text-red-600" : "text-gray-500"}`}>
                <ApperIcon 
                  name={taskIsOverdue ? "AlertTriangle" : "Calendar"} 
                  size={14} 
                />
                {dueDateText}
              </div>
            )}

            {task.completed && task.completedAt && (
              <div className="flex items-center gap-1 text-sm text-green-600">
                <ApperIcon name="CheckCircle" size={14} />
                Completed
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default TaskCard