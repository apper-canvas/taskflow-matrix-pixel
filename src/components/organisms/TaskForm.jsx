import React, { useState } from "react";
import { toast } from "react-toastify";
import { taskService } from "@/services/api/taskService";
import { listService } from "@/services/api/listService";
import { createDateFromInput, formatDateForInput } from "@/utils/dateUtils";
import ApperIcon from "@/components/ApperIcon";
import TaskPrioritySelector from "@/components/molecules/TaskPrioritySelector";
import FormField from "@/components/molecules/FormField";
import TaskListSelector from "@/components/molecules/TaskListSelector";
import Button from "@/components/atoms/Button";

const FileUpload = ({ files, onFilesChange, className = "" }) => {
  const [isDragging, setIsDragging] = useState(false)

  const validateFile = (file) => {
    const maxSize = 5 * 1024 * 1024 // 5MB
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain',
      'image/jpeg',
      'image/jpg', 
      'image/png',
      'image/gif'
    ]

    if (file.size > maxSize) {
      toast.error(`File "${file.name}" is too large. Maximum size is 5MB.`)
      return false
    }

    if (!allowedTypes.includes(file.type)) {
      toast.error(`File type "${file.type}" is not supported.`)
      return false
    }

    return true
  }

  const processFiles = async (fileList) => {
    const validFiles = Array.from(fileList).filter(validateFile)
    
    const processedFiles = await Promise.all(
      validFiles.map(async (file) => {
        return new Promise((resolve) => {
          const reader = new FileReader()
          reader.onload = (e) => {
            resolve({
              id: Date.now() + Math.random(),
              name: file.name,
              size: file.size,
              type: file.type,
              data: e.target.result
            })
          }
          reader.readAsDataURL(file)
        })
      })
    )

    onFilesChange([...files, ...processedFiles])
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    processFiles(e.dataTransfer.files)
  }

  const handleFileSelect = (e) => {
    processFiles(e.target.files)
    e.target.value = ''
  }

  const removeFile = (fileId) => {
    onFilesChange(files.filter(f => f.id !== fileId))
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
  }

  const getFileIcon = (type) => {
    if (type.startsWith('image/')) return 'Image'
    if (type === 'application/pdf') return 'FileText'
    if (type.includes('word') || type === 'text/plain') return 'FileText'
    return 'File'
  }

  return (
    <div className={className}>
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-all duration-200 ${
          isDragging 
            ? 'border-primary bg-primary/5' 
            : 'border-gray-300 hover:border-primary/50 hover:bg-gray-50'
        }`}
        onDrop={handleDrop}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
        onDragLeave={(e) => { e.preventDefault(); setIsDragging(false) }}
      >
        <ApperIcon name="Upload" size={32} className="mx-auto text-gray-400 mb-3" />
        <p className="text-gray-600 mb-2">
          Drag and drop files here, or{' '}
          <label className="text-primary hover:text-secondary cursor-pointer font-medium">
            browse
            <input
              type="file"
              multiple
              className="hidden"
              accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.gif"
              onChange={handleFileSelect}
            />
          </label>
        </p>
        <p className="text-sm text-gray-500">
          Supports PDF, DOC, DOCX, TXT, JPG, PNG, GIF (max 5MB each)
        </p>
      </div>

      {files.length > 0 && (
        <div className="mt-4 space-y-2">
          <h4 className="text-sm font-medium text-gray-700">Uploaded Files ({files.length})</h4>
          {files.map((file) => (
            <div key={file.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <ApperIcon name={getFileIcon(file.type)} size={20} className="text-gray-500" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
                <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
              </div>
              <button
                onClick={() => removeFile(file.id)}
                className="p-1 hover:bg-gray-200 rounded transition-colors"
                type="button"
              >
                <ApperIcon name="X" size={16} className="text-gray-500" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
const TaskForm = ({ task, lists, onSave, onCancel }) => {
const [formData, setFormData] = useState({
    title: task?.title_c || "",
    description: task?.description_c || "",
    priority: task?.priority_c || "medium",
    dueDate: task?.dueDate_c ? formatDateForInput(task.dueDate_c) : "",
    listId: task?.listId_c?.Id || task?.listId_c || lists[0]?.Id || "",
    projectId: task?.projectId_c?.Id || task?.projectId_c || "",
    attachments: task?.attachments_c || []
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
        title_c: formData.title.trim(),
        description_c: formData.description.trim(),
        priority_c: formData.priority,
        dueDate_c: formData.dueDate ? createDateFromInput(formData.dueDate).toISOString().split('T')[0] : null,
        listId_c: parseInt(formData.listId),
        projectId_c: formData.projectId ? parseInt(formData.projectId) : null,
        attachments_c: formData.attachments
      }
      if (task) {
await taskService.update(task.Id, taskData)
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

  const handleFilesChange = (files) => {
    setFormData(prev => ({ ...prev, attachments: files }))
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

{/* Project selector temporarily disabled - ProjectSelector component not available */}
            {/* <FormField label="Project" error={errors.projectId}>
              <ProjectSelector
                value={formData.projectId}
                onChange={(value) => handleInputChange("projectId", value)}
                projects={projects}
              />
            </FormField> */}
            <FormField label="Attachments">
              <FileUpload
                files={formData.attachments}
                onFilesChange={handleFilesChange}
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