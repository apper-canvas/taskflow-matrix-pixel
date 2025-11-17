import { useState, useEffect } from "react"
import TaskCard from "@/components/organisms/TaskCard"
import TaskFilters from "@/components/organisms/TaskFilters"
import Loading from "@/components/ui/Loading"
import ErrorView from "@/components/ui/ErrorView"
import Empty from "@/components/ui/Empty"
import { taskService } from "@/services/api/taskService"

const TaskList = ({ selectedListId, onEditTask, onAddTask }) => {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  
  const [filters, setFilters] = useState({
    status: "all",
    priority: "all",
    search: "",
    sort: "created"
  })

  const loadTasks = async () => {
    setLoading(true)
    setError("")
    
    try {
      const allTasks = await taskService.getAll()
      setTasks(allTasks)
    } catch (err) {
      console.error("Error loading tasks:", err)
      setError("Failed to load tasks. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadTasks()
  }, [])

  const filterTasks = () => {
    let filtered = tasks

    // Filter by selected list
if (selectedListId && selectedListId !== "all") {
      filtered = filtered.filter(task => (task.listId_c?.Id || task.listId_c) === selectedListId)
    }

    // Filter by status
if (filters.status === "active") {
      filtered = filtered.filter(task => !task.completed_c)
    } else if (filters.status === "completed") {
filtered = filtered.filter(task => task.completed_c)
    }

    // Filter by priority
    if (filters.priority !== "all") {
filtered = filtered.filter(task => task.priority_c === filters.priority)
    }

    // Filter by search
    if (filters.search) {
      const search = filters.search.toLowerCase()
      filtered = filtered.filter(task =>
task.title_c.toLowerCase().includes(search) ||
        task.description_c.toLowerCase().includes(search)
      )
    }

    // Sort tasks
    filtered.sort((a, b) => {
      switch (filters.sort) {
case "dueDate":
          if (!a.dueDate_c && !b.dueDate_c) return 0
          if (!a.dueDate_c) return 1
          if (!b.dueDate_c) return -1
          return new Date(a.dueDate_c) - new Date(b.dueDate_c)
        case "priority":
          const priorityOrder = { high: 3, medium: 2, low: 1 }
          return priorityOrder[b.priority_c] - priorityOrder[a.priority_c]
        case "title":
          return a.title_c.localeCompare(b.title_c)
        default: // created
          return new Date(b.CreatedOn) - new Date(a.CreatedOn)
      }
    })

    return filtered
  }

  const filteredTasks = filterTasks()

  // Calculate task counts
  const listTasks = selectedListId && selectedListId !== "all" 
? tasks.filter(task => (task.listId_c?.Id || task.listId_c) === selectedListId)
    : tasks

  const taskCounts = {
    all: listTasks.length,
active: listTasks.filter(task => !task.completed_c).length,
    completed: listTasks.filter(task => task.completed_c).length
  }

  const handleTaskUpdate = () => {
    loadTasks()
  }

  if (loading) return <Loading />
  
  if (error) {
    return (
      <ErrorView 
        message={error}
        onRetry={loadTasks}
      />
    )
  }

  return (
    <div className="flex flex-col h-full">
      <TaskFilters
        filters={filters}
        onFiltersChange={setFilters}
        taskCounts={taskCounts}
      />

      <div className="flex-1 overflow-y-auto p-6">
        {filteredTasks.length === 0 ? (
          <Empty
            title={filters.search || filters.status !== "all" || filters.priority !== "all" 
              ? "No matching tasks" 
              : "No tasks yet"
            }
            description={filters.search || filters.status !== "all" || filters.priority !== "all"
              ? "Try adjusting your filters to see more tasks."
              : "Ready to tackle your day? Add your first task!"
            }
            actionText="Add Task"
            onAction={onAddTask}
          />
        ) : (
          <div className="space-y-3">
            {filteredTasks.map((task) => (
              <TaskCard
key={task.Id}
                task={task}
                onEdit={onEditTask}
                onUpdate={handleTaskUpdate}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default TaskList