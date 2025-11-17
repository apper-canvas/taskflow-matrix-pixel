import { useState } from "react"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"
import Sidebar from "@/components/organisms/Sidebar"
import TaskList from "@/components/organisms/TaskList"
import TaskForm from "@/components/organisms/TaskForm"
import { listService } from "@/services/api/listService"
import { projectService } from "@/services/api/projectService"
const TaskManager = () => {
const [selectedListId, setSelectedListId] = useState("all")
  const [showTaskForm, setShowTaskForm] = useState(false)
  const [editingTask, setEditingTask] = useState(null)
  const [lists, setLists] = useState([])
  const [projects, setProjects] = useState([])
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)

// Load lists and projects for the task form
  const loadLists = async () => {
    try {
      const listsData = await listService.getAll()
      setLists(listsData)
    } catch (error) {
      console.error("Error loading lists:", error)
    }
  }

  const loadProjects = async () => {
    try {
      const projectsData = await projectService.getAll()
      setProjects(projectsData)
    } catch (error) {
      console.error("Error loading projects:", error)
    }
  }

const handleAddTask = () => {
    loadLists()
    loadProjects()
    setEditingTask(null)
    setShowTaskForm(true)
  }

const handleEditTask = (task) => {
    loadLists()
    loadProjects()
    setEditingTask(task)
    setShowTaskForm(true)
  }

  const handleTaskFormClose = () => {
    setShowTaskForm(false)
    setEditingTask(null)
  }

  const handleTaskFormSave = () => {
    setShowTaskForm(false)
    setEditingTask(null)
    // TaskList will reload tasks automatically
  }

  return (
    <div className="h-screen flex bg-background">
      {/* Sidebar */}
      <Sidebar
        selectedListId={selectedListId}
        onSelectList={setSelectedListId}
        isMobileOpen={isMobileSidebarOpen}
        onMobileClose={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsMobileSidebarOpen(true)}
                className="lg:hidden p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <ApperIcon name="Menu" size={20} />
              </button>
<div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {selectedListId === "all" ? "All Tasks" : 
                   lists.find(list => list.Id === selectedListId)?.name_c || "Tasks"}
                </h2>
                <p className="text-gray-600">
                  {selectedListId === "all" 
                    ? "Manage all your tasks in one place"
                    : "Organize and track your progress"
                  }
                </p>
              </div>
            </div>

            <Button
              onClick={handleAddTask}
              className="flex items-center gap-2"
            >
              <ApperIcon name="Plus" size={18} />
              Add Task
            </Button>
          </div>
        </header>

        {/* Task List */}
        <div className="flex-1 overflow-hidden">
          <TaskList
            selectedListId={selectedListId}
            onEditTask={handleEditTask}
            onAddTask={handleAddTask}
          />
        </div>
      </div>

      {/* Task Form Modal */}
      {showTaskForm && (
<TaskForm
          task={editingTask}
          lists={lists}
          projects={projects}
          onSave={handleTaskFormSave}
          onCancel={handleTaskFormClose}
        />
      )}

      {/* Floating Add Button (Mobile) */}
      <button
        onClick={handleAddTask}
        className="lg:hidden fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-primary to-secondary text-white rounded-full shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-200 flex items-center justify-center z-40"
      >
        <ApperIcon name="Plus" size={24} />
      </button>
    </div>
  )
}

export default TaskManager