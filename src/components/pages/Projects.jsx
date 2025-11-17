import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import Loading from '@/components/ui/Loading'
import Empty from '@/components/ui/Empty'
import ErrorView from '@/components/ui/ErrorView'
import { getApperClient } from '@/services/apperClient'

const Projects = () => {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [editingProject, setEditingProject] = useState(null)
  const [formData, setFormData] = useState({
    name_c: '',
    description_c: '',
    status_c: 'Active',
    priority_c: 'Medium',
    startDate_c: '',
    endDate_c: ''
  })

  useEffect(() => {
    loadProjects()
  }, [])

  const loadProjects = async () => {
    setLoading(true)
    setError(null)
    try {
      const apperClient = getApperClient()
      if (!apperClient) {
        throw new Error('ApperClient not initialized')
      }

      const response = await apperClient.fetchRecords('projects_c', {
        fields: [
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "priority_c"}},
          {"field": {"Name": "startDate_c"}},
          {"field": {"Name": "endDate_c"}}
        ],
        orderBy: [{"fieldName": "Id", "sorttype": "DESC"}],
        pagingInfo: {"limit": 50, "offset": 0}
      })

      if (!response?.success) {
        throw new Error(response?.message || 'Failed to fetch projects')
      }

      setProjects(response.data || [])
    } catch (err) {
      console.error('Error loading projects:', err?.response?.data?.message || err)
      setError(err.message || 'Failed to load projects')
      setProjects([])
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.name_c.trim()) {
      toast.error('Project name is required')
      return
    }

    try {
      const apperClient = getApperClient()
      if (!apperClient) {
        throw new Error('ApperClient not initialized')
      }

      const projectData = {
        name_c: formData.name_c.trim(),
        description_c: formData.description_c.trim(),
        status_c: formData.status_c,
        priority_c: formData.priority_c,
        startDate_c: formData.startDate_c || null,
        endDate_c: formData.endDate_c || null
      }

      let response
      if (editingProject) {
        response = await apperClient.updateRecord('projects_c', {
          records: [{ Id: editingProject.Id, ...projectData }]
        })
      } else {
        response = await apperClient.createRecord('projects_c', {
          records: [projectData]
        })
      }

      if (!response?.success) {
        throw new Error(response?.message || 'Failed to save project')
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success)
        const failed = response.results.filter(r => !r.success)
        
        if (failed.length > 0) {
          console.error(`Failed to save ${failed.length} projects:`, failed)
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`))
            if (record.message) toast.error(record.message)
          })
        }
        
        if (successful.length > 0) {
          toast.success(editingProject ? 'Project updated successfully' : 'Project created successfully')
          handleCloseForm()
          loadProjects()
        }
      }
    } catch (err) {
      console.error('Error saving project:', err?.response?.data?.message || err)
      toast.error(err.message || 'Failed to save project')
    }
  }

  const handleEdit = (project) => {
    setEditingProject(project)
    setFormData({
      name_c: project.name_c || '',
      description_c: project.description_c || '',
      status_c: project.status_c || 'Active',
      priority_c: project.priority_c || 'Medium',
      startDate_c: project.startDate_c ? project.startDate_c.split('T')[0] : '',
      endDate_c: project.endDate_c ? project.endDate_c.split('T')[0] : ''
    })
    setShowForm(true)
  }

  const handleDelete = async (project) => {
    if (!confirm(`Are you sure you want to delete "${project.name_c}"?`)) {
      return
    }

    try {
      const apperClient = getApperClient()
      if (!apperClient) {
        throw new Error('ApperClient not initialized')
      }

      const response = await apperClient.deleteRecord('projects_c', {
        RecordIds: [project.Id]
      })

      if (!response?.success) {
        throw new Error(response?.message || 'Failed to delete project')
      }

      if (response.results) {
        const failed = response.results.filter(r => !r.success)
        
        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} projects:`, failed)
          failed.forEach(record => {
            if (record.message) toast.error(record.message)
          })
        } else {
          toast.success('Project deleted successfully')
          loadProjects()
        }
      }
    } catch (err) {
      console.error('Error deleting project:', err?.response?.data?.message || err)
      toast.error(err.message || 'Failed to delete project')
    }
  }

  const handleAddNew = () => {
    setEditingProject(null)
    setFormData({
      name_c: '',
      description_c: '',
      status_c: 'Active',
      priority_c: 'Medium',
      startDate_c: '',
      endDate_c: ''
    })
    setShowForm(true)
  }

  const handleCloseForm = () => {
    setShowForm(false)
    setEditingProject(null)
    setFormData({
      name_c: '',
      description_c: '',
      status_c: 'Active',
      priority_c: 'Medium',
      startDate_c: '',
      endDate_c: ''
    })
  }

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'medium':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'low':
        return 'bg-gray-100 text-gray-800 border-gray-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'completed':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'on hold':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  if (loading) return <Loading />
  if (error) return <ErrorView message={error} onRetry={loadProjects} />

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
          <p className="text-gray-600 mt-1">Manage your projects and track progress</p>
        </div>
        <Button onClick={handleAddNew} className="btn-primary">
          <ApperIcon name="Plus" size={16} className="mr-2" />
          Add Project
        </Button>
      </div>

      {projects.length === 0 ? (
        <Empty 
          icon="FolderPlus" 
          title="No projects yet" 
          description="Get started by creating your first project"
          action={
            <Button onClick={handleAddNew} className="btn-primary mt-4">
              <ApperIcon name="Plus" size={16} className="mr-2" />
              Create Project
            </Button>
          }
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <div key={project.Id} className="card p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold text-gray-900 truncate">
                  {project.name_c || 'Untitled Project'}
                </h3>
                <div className="flex gap-2 ml-2">
                  <Button 
                    onClick={() => handleEdit(project)}
                    className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <ApperIcon name="Edit" size={16} />
                  </Button>
                  <Button 
                    onClick={() => handleDelete(project)}
                    className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <ApperIcon name="Trash2" size={16} />
                  </Button>
                </div>
              </div>

              {project.description_c && (
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {project.description_c}
                </p>
              )}

              <div className="flex flex-wrap gap-2 mb-4">
                <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(project.status_c)}`}>
                  {project.status_c || 'Active'}
                </span>
                <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(project.priority_c)}`}>
                  {project.priority_c || 'Medium'} Priority
                </span>
              </div>

              {(project.startDate_c || project.endDate_c) && (
                <div className="text-xs text-gray-500 space-y-1">
                  {project.startDate_c && (
                    <div className="flex items-center gap-1">
                      <ApperIcon name="Calendar" size={12} />
                      <span>Start: {new Date(project.startDate_c).toLocaleDateString()}</span>
                    </div>
                  )}
                  {project.endDate_c && (
                    <div className="flex items-center gap-1">
                      <ApperIcon name="Calendar" size={12} />
                      <span>End: {new Date(project.endDate_c).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Project Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                {editingProject ? 'Edit Project' : 'Create New Project'}
              </h2>
              <Button 
                onClick={handleCloseForm}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg"
              >
                <ApperIcon name="X" size={20} />
              </Button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Project Name *
                </label>
                <input
                  type="text"
                  value={formData.name_c}
                  onChange={(e) => setFormData(prev => ({...prev, name_c: e.target.value}))}
                  className="input-field"
                  placeholder="Enter project name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description_c}
                  onChange={(e) => setFormData(prev => ({...prev, description_c: e.target.value}))}
                  className="input-field resize-none"
                  rows="3"
                  placeholder="Enter project description"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    value={formData.status_c}
                    onChange={(e) => setFormData(prev => ({...prev, status_c: e.target.value}))}
                    className="input-field"
                  >
                    <option value="Active">Active</option>
                    <option value="Completed">Completed</option>
                    <option value="On Hold">On Hold</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Priority
                  </label>
                  <select
                    value={formData.priority_c}
                    onChange={(e) => setFormData(prev => ({...prev, priority_c: e.target.value}))}
                    className="input-field"
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={formData.startDate_c}
                    onChange={(e) => setFormData(prev => ({...prev, startDate_c: e.target.value}))}
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={formData.endDate_c}
                    onChange={(e) => setFormData(prev => ({...prev, endDate_c: e.target.value}))}
                    className="input-field"
                    min={formData.startDate_c}
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button type="submit" className="btn-primary flex-1">
                  {editingProject ? 'Update Project' : 'Create Project'}
                </Button>
                <Button 
                  type="button" 
                  onClick={handleCloseForm}
                  className="btn-secondary"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Projects