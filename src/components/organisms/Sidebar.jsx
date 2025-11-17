import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { listService } from "@/services/api/listService";
import { taskService } from "@/services/api/taskService";
import ApperIcon from "@/components/ApperIcon";
import Projects from "@/components/pages/Projects";
import Button from "@/components/atoms/Button";

const Sidebar = ({ selectedListId, onSelectList, isMobileOpen, onMobileClose }) => {
  const navigate = useNavigate()
  const location = useLocation()
  const [lists, setLists] = useState([])
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(false)
  const [newListName, setNewListName] = useState("")
  const [isAddingList, setIsAddingList] = useState(false)
  const loadData = async () => {
    setLoading(true)
    try {
      const [listsData, tasksData] = await Promise.all([
        listService.getAll(),
        taskService.getAll()
      ])
      setLists(listsData)
      setTasks(tasksData)
    } catch (error) {
      console.error("Error loading data:", error)
      toast.error("Failed to load lists")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const getTaskCount = (listId) => {
    if (listId === "all") {
      return tasks.length
    }
    return tasks.filter(task => task.listId === listId).length
  }

  const handleAddList = async () => {
    if (!newListName.trim()) return

    try {
      await listService.create({
        name: newListName.trim(),
        color: getRandomColor(),
        taskCount: 0,
        order: lists.length
      })
      
      setNewListName("")
      setIsAddingList(false)
      loadData()
      toast.success("List created successfully!")
    } catch (error) {
      console.error("Error creating list:", error)
      toast.error("Failed to create list")
    }
  }

  const handleDeleteList = async (listId) => {
    if (!window.confirm("Are you sure you want to delete this list? All tasks in this list will also be deleted.")) {
      return
    }

    try {
      await listService.delete(listId)
      // Delete all tasks in this list
      const tasksToDelete = tasks.filter(task => task.listId === listId)
      await Promise.all(tasksToDelete.map(task => taskService.delete(task.id)))
      
      loadData()
      if (selectedListId === listId) {
        onSelectList("all")
      }
      toast.success("List deleted successfully!")
    } catch (error) {
      console.error("Error deleting list:", error)
      toast.error("Failed to delete list")
    }
  }

  const getRandomColor = () => {
    const colors = ["#6366f1", "#8b5cf6", "#ec4899", "#10b981", "#f59e0b", "#ef4444", "#3b82f6", "#84cc16"]
    return colors[Math.floor(Math.random() * colors.length)]
  }

  const sidebarContent = (
    <div className="h-full flex flex-col bg-white border-r border-gray-200">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            TaskFlow
          </h1>
          <div className="lg:hidden">
            <button
              onClick={onMobileClose}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <ApperIcon name="X" size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Lists */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-2">
{/* All Tasks */}
          <button
            onClick={() => {
              onSelectList("all")
              onMobileClose?.()
            }}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-left ${
              selectedListId === "all"
                ? "bg-gradient-to-r from-primary/10 to-secondary/10 text-primary border-l-4 border-primary"
                : "text-gray-700 hover:bg-gray-50"
            }`}
          >
            <ApperIcon name="Inbox" size={18} />
            <span className="flex-1 font-medium">All Tasks</span>
            <span className="text-sm text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
              {getTaskCount("all")}
            </span>
          </button>

          {/* Projects */}
          <button
            onClick={() => {
              navigate("/projects")
              onMobileClose?.()
            }}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-left ${
              location.pathname === "/projects"
                ? "bg-gradient-to-r from-primary/10 to-secondary/10 text-primary border-l-4 border-primary"
                : "text-gray-700 hover:bg-gray-50"
            }`}
          >
            <ApperIcon name="Folder" size={18} />
            <span className="flex-1 font-medium">Projects</span>
          </button>

          {/* Custom Lists */}
{lists.map((list) => (
            <div key={list.Id} className="group relative mb-1">
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onSelectList(list.Id)
                  onMobileClose?.()
                }}
className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 text-left relative ${
                  selectedListId === list.Id
                    ? "bg-gradient-to-r from-primary/10 to-secondary/10 text-primary border-l-4 border-primary shadow-sm"
                    : "text-gray-800 hover:bg-gray-50 hover:shadow-sm hover:text-gray-900"
                }`}
              >
                <div
                  className="w-4 h-4 rounded-full flex-shrink-0 ring-1 ring-white shadow-sm"
                  style={{ backgroundColor: list.color || '#6366f1' }}
                />
                <span className={`flex-1 font-medium text-sm leading-5 truncate pr-8 ${
                  selectedListId === list.Id ? 'text-primary' : 'text-gray-900'
                }`}>
                  {list.name}
                </span>
                <span className="text-xs text-gray-600 bg-gray-100 px-2 py-0.5 rounded-full font-medium flex-shrink-0">
                  {getTaskCount(list.Id)}
                </span>
              </button>
              
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  handleDeleteList(list.Id)
                }}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-all duration-200 rounded z-10"
              >
                <ApperIcon name="Trash2" size={14} />
              </button>
            </div>
          ))}
        </div>

        {/* Add List */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          {isAddingList ? (
            <div className="space-y-2">
              <input
                type="text"
                placeholder="List name..."
                value={newListName}
                onChange={(e) => setNewListName(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleAddList()}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none text-sm"
                autoFocus
              />
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={handleAddList}
                  disabled={!newListName.trim()}
                  className="flex-1"
                >
                  Add
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => {
                    setIsAddingList(false)
                    setNewListName("")
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsAddingList(true)}
              className="w-full justify-start"
            >
              <ApperIcon name="Plus" size={16} className="mr-2" />
              Add New List
            </Button>
          )}
        </div>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:block w-80 h-full">
        {sidebarContent}
      </div>

      {/* Mobile Sidebar */}
      {isMobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black bg-opacity-50"
            onClick={onMobileClose}
          />
          <div className="relative w-80 max-w-sm">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  )
}

export default Sidebar