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
const updatedTask = await taskService.update(task.Id, {
        completed_c: !task.completed_c,
        completedAt_c: !task.completed_c ? new Date().toISOString() : null
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
await taskService.delete(task.Id)
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

const config = priorityConfig[task.priority_c] || priorityConfig.medium
  const dueDateText = formatDueDate(task.dueDate)
const taskIsOverdue = isOverdue(task.dueDate_c)
  return (
    <div className={`card p-4 transition-all duration-200 hover:-translate-y-0.5 ${task.completed ? "opacity-60" : ""}`}>
      <div className="flex items-start gap-3">
        <div className="checkbox-wrapper">
          <input
            type="checkbox"
checked={task.completed_c}
            onChange={handleToggleComplete}
            disabled={loading}
            className="mt-0.5"
          />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
<h3 className={`font-semibold text-gray-900 ${task.completed_c ? "line-through" : ""}`}>
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

{task.description_c && (
            <div>
              <p className={`text-gray-600 text-sm mt-1 ${!isExpanded ? "line-clamp-2" : ""}`}>
                {task.description_c}
              </p>
              {task.description_c && task.description_c.length > 100 && (
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="text-primary text-sm hover:text-secondary transition-colors mt-1"
                >
                  {isExpanded ? "Show less" : "Show more"}
                </button>
              )}
            </div>
          )}

{task.attachments_c && task.attachments_c.length > 0 && (
            <div className="mt-3 pt-3 border-t border-gray-100">
              <div className="flex items-center gap-2 mb-2">
                <ApperIcon name="Paperclip" size={14} className="text-gray-500" />
                <span className="text-xs font-medium text-gray-700">
{task.attachments_c?.length || 0} Attachment{(task.attachments_c?.length || 0) > 1 ? 's' : ''}
                </span>
              </div>
              <div className="grid grid-cols-1 gap-1">
{task.attachments_c.slice(0, isExpanded ? task.attachments_c.length : 2).map((file) => (
                  <div key={file.id} className="flex items-center gap-2 p-2 bg-gray-50 rounded text-xs">
                    <ApperIcon 
                      name={
                        file.type.startsWith('image/') ? 'Image' : 
                        file.type === 'application/pdf' ? 'FileText' : 
                        'File'
                      } 
                      size={14} 
                      className="text-gray-500 flex-shrink-0" 
                    />
                    <span className="truncate flex-1 text-gray-700">{file.name}</span>
                    <a
                      href={file.data}
                      download={file.name}
                      className="text-primary hover:text-secondary transition-colors"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <ApperIcon name="Download" size={14} />
                    </a>
                  </div>
                ))}
{!isExpanded && (task.attachments_c?.length || 0) > 2 && (
                  <button
                    onClick={() => setIsExpanded(true)}
                    className="text-xs text-primary hover:text-secondary transition-colors text-left p-1"
                  >
                    +{(task.attachments_c?.length || 0) - 2} more files
                  </button>
                )}
              </div>
            </div>
          )}

          <div className="flex items-center gap-3 mt-3">
            <Badge variant={config.variant} size="sm">
<ApperIcon name={config.icon} size={12} className="mr-1" />
              {task.priority_c.charAt(0).toUpperCase() + task.priority_c.slice(1)}
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

{task.completed_c && task.completedAt_c && (
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