import { useState } from "react"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"
import SearchBar from "@/components/molecules/SearchBar"

const TaskFilters = ({ 
  filters, 
  onFiltersChange, 
  taskCounts = { all: 0, active: 0, completed: 0 }
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false)

  const statusOptions = [
    { value: "all", label: "All Tasks", count: taskCounts.all },
    { value: "active", label: "Active", count: taskCounts.active },
    { value: "completed", label: "Completed", count: taskCounts.completed }
  ]

  const priorityOptions = [
    { value: "all", label: "All Priorities" },
    { value: "high", label: "High Priority" },
    { value: "medium", label: "Medium Priority" },
    { value: "low", label: "Low Priority" }
  ]

  const sortOptions = [
    { value: "created", label: "Date Created" },
    { value: "dueDate", label: "Due Date" },
    { value: "priority", label: "Priority" },
    { value: "title", label: "Title" }
  ]

  const handleFilterChange = (key, value) => {
    onFiltersChange({ ...filters, [key]: value })
  }

  return (
    <div className="bg-white border-b border-gray-200 p-4 space-y-4">
      {/* Status Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {statusOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => handleFilterChange("status", option.value)}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 ${
              filters.status === option.value
                ? "bg-gradient-to-r from-primary to-secondary text-white shadow-sm"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {option.label}
            <span className={`text-xs px-1.5 py-0.5 rounded-full ${
              filters.status === option.value
                ? "bg-white/20 text-white"
                : "bg-white text-gray-600"
            }`}>
              {option.count}
            </span>
          </button>
        ))}
      </div>

      {/* Search Bar */}
      <SearchBar
        placeholder="Search tasks..."
        onSearch={(value) => handleFilterChange("search", value)}
        className="max-w-md"
      />

      {/* Advanced Filters Toggle */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center gap-2"
        >
          <ApperIcon 
            name={showAdvanced ? "ChevronUp" : "ChevronDown"} 
            size={16} 
          />
          Advanced Filters
        </Button>

        {(filters.priority !== "all" || filters.sort !== "created") && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onFiltersChange({ 
              ...filters, 
              priority: "all", 
              sort: "created",
              search: "" 
            })}
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <ApperIcon name="X" size={16} className="mr-1" />
            Clear Filters
          </Button>
        )}
      </div>

      {/* Advanced Filters */}
      {showAdvanced && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Priority
            </label>
            <select
              value={filters.priority}
              onChange={(e) => handleFilterChange("priority", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none"
            >
              {priorityOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sort By
            </label>
            <select
              value={filters.sort}
              onChange={(e) => handleFilterChange("sort", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}
    </div>
  )
}

export default TaskFilters