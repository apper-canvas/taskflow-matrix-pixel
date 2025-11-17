import { useState } from "react"
import { toast } from "react-toastify"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"
import FormField from "@/components/molecules/FormField"
import TaskPrioritySelector from "@/components/molecules/TaskPrioritySelector"
import TaskListSelector from "@/components/molecules/TaskListSelector"
import { formatDateForInput, createDateFromInput } from "@/utils/dateUtils"
import { taskService } from "@/services/api/taskService"
import { listService } from "@/services/api/listService"

const TaskForm = ({ task, lists, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    title: task?.title || "",
    description: task?.description || "",
    priority: task?.priority || "medium",
    dueDate: task?.dueDate ? formatDateForInput(task.dueDate) : "",
    listId: task?.listId || lists[0]?.id || ""
  })

  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.title.trim()) {
      newErrors.title = "Task title is required"
    }
    
    if (!formData.listId) {
      newErrors.listId = "Please select a list"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setLoading(true)

    try {
      const taskData = {
        ...formData,
        title: formData.title.trim(),
        description: formData.description.trim(),
        dueDate: formData.dueDate ? createDateFromInput(formData.dueDate) : null
      }

      if (task) {
        await taskService.update(task.id, taskData)
        toast.success("Task updated successfully!")
      } else {
        await taskService.create(taskData)
        toast.success("Task created successfully!")
      }

      onSave?.()
    } catch (error) {
      console.error("Error saving task:", error)
      toast.error("Failed to save task. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }))
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">
              {task ? "Edit Task" : "Create New Task"}
            </h2>
            <button
              onClick={onCancel}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <ApperIcon name="X" size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <FormField
              label="Task Title"
              required
              placeholder="Enter task title..."
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              error={errors.title}
            />

            <FormField label="Description">
              <textarea
                placeholder="Add a description (optional)..."
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all duration-200 resize-none h-20"
              />
            </FormField>

            <FormField label="Priority" required>
              <TaskPrioritySelector
                value={formData.priority}
                onChange={(value) => handleInputChange("priority", value)}
              />
            </FormField>

            <FormField label="Due Date">
              <input
                type="date"
                value={formData.dueDate}
                onChange={(e) => handleInputChange("dueDate", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all duration-200"
              />
            </FormField>

            <FormField label="List" required error={errors.listId}>
              <TaskListSelector
                value={formData.listId}
                onChange={(value) => handleInputChange("listId", value)}
                lists={lists}
              />
            </FormField>

            <div className="flex gap-3 pt-4">
              <Button
                type="submit"
                variant="primary"
                className="flex-1"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <ApperIcon name="Loader2" size={18} className="animate-spin mr-2" />
                    Saving...
                  </>
                ) : (
                  <>
                    <ApperIcon name="Check" size={18} className="mr-2" />
                    {task ? "Update Task" : "Create Task"}
                  </>
                )}
              </Button>
              
              <Button
                type="button"
                variant="secondary"
                onClick={onCancel}
                disabled={loading}
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default TaskForm