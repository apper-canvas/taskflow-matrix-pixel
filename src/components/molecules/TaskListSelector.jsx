import { useState } from "react"
import ApperIcon from "@/components/ApperIcon"

const TaskListSelector = ({ value, onChange, lists = [] }) => {
  const [isOpen, setIsOpen] = useState(false)

  const selectedList = lists.find(list => list.id === value) || lists[0]

  const handleSelect = (list) => {
    onChange(list.id)
    setIsOpen(false)
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:border-gray-400 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50 w-full text-left"
      >
        <div
          className="w-3 h-3 rounded-full"
          style={{ backgroundColor: selectedList?.color || "#6366f1" }}
        />
        <span className="flex-1">{selectedList?.name || "Select List"}</span>
        <ApperIcon name="ChevronDown" size={16} className="text-gray-400" />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto">
          {lists.map((list) => (
            <button
              key={list.id}
              type="button"
              onClick={() => handleSelect(list)}
              className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg transition-colors text-left"
            >
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: list.color }}
              />
              <span className="flex-1">{list.name}</span>
              <span className="text-sm text-gray-500">
                {list.taskCount || 0}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default TaskListSelector