import ApperIcon from "@/components/ApperIcon"

const Empty = ({ 
  title = "No tasks yet", 
  description = "Ready to tackle your day? Add your first task!",
  actionText = "Add Task",
  onAction 
}) => {
  return (
    <div className="min-h-[400px] flex flex-col items-center justify-center text-center p-8">
      <div className="w-20 h-20 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-full flex items-center justify-center mb-6">
        <ApperIcon name="CheckSquare" className="w-10 h-10 text-primary" />
      </div>
      
      <h3 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-3">
        {title}
      </h3>
      
      <p className="text-gray-600 mb-8 max-w-md text-lg">
        {description}
      </p>
      
      {onAction && (
        <button
          onClick={onAction}
          className="btn-primary flex items-center gap-2 text-lg px-8 py-4"
        >
          <ApperIcon name="Plus" size={20} />
          {actionText}
        </button>
      )}
    </div>
  )
}

export default Empty