import { getApperClient } from '@/services/apperClient'
import { toast } from 'react-toastify'

class TaskService {
  constructor() {
    this.tableName = 'tasks_c'
  }

  async getAll() {
    try {
      const apperClient = getApperClient()
      if (!apperClient) {
        throw new Error('ApperClient not available')
      }

      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "priority_c"}},
          {"field": {"Name": "dueDate_c"}},
          {"field": {"Name": "completed_c"}},
          {"field": {"Name": "completedAt_c"}},
          {"field": {"Name": "archived_c"}},
          {"field": {"Name": "listId_c"}},
          {"field": {"Name": "attachments_c"}},
          {"field": {"Name": "CreatedOn"}}
        ],
        orderBy: [{"fieldName": "CreatedOn", "sorttype": "DESC"}]
      }

      const response = await apperClient.fetchRecords(this.tableName, params)

      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return []
      }

      return response.data || []
    } catch (error) {
      console.error("Error fetching tasks:", error?.response?.data?.message || error)
      toast.error("Failed to load tasks")
      return []
    }
  }

  async getById(id) {
    try {
      const apperClient = getApperClient()
      if (!apperClient) {
        throw new Error('ApperClient not available')
      }

      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "priority_c"}},
          {"field": {"Name": "dueDate_c"}},
          {"field": {"Name": "completed_c"}},
          {"field": {"Name": "completedAt_c"}},
          {"field": {"Name": "archived_c"}},
          {"field": {"Name": "listId_c"}},
          {"field": {"Name": "attachments_c"}},
          {"field": {"Name": "CreatedOn"}}
        ]
      }

      const response = await apperClient.getRecordById(this.tableName, parseInt(id), params)

      if (!response?.data) {
        throw new Error("Task not found")
      }

      return response.data
    } catch (error) {
      console.error(`Error fetching task ${id}:`, error?.response?.data?.message || error)
      throw new Error("Task not found")
    }
  }

  async create(taskData) {
    try {
      const apperClient = getApperClient()
      if (!apperClient) {
        throw new Error('ApperClient not available')
      }

      const params = {
        records: [{
          title_c: taskData.title_c,
          description_c: taskData.description_c,
          priority_c: taskData.priority_c || "medium",
          dueDate_c: taskData.dueDate_c,
          completed_c: false,
          archived_c: false,
          listId_c: taskData.listId_c ? parseInt(taskData.listId_c) : null,
          attachments_c: taskData.attachments_c || []
        }]
      }

      const response = await apperClient.createRecord(this.tableName, params)

      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return null
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success)
        const failed = response.results.filter(r => !r.success)

        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} tasks:`, failed)
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`))
            if (record.message) toast.error(record.message)
          })
        }

        return successful.length > 0 ? successful[0].data : null
      }

      return null
    } catch (error) {
      console.error("Error creating task:", error?.response?.data?.message || error)
      toast.error("Failed to create task")
      return null
    }
  }

  async update(id, data) {
    try {
      const apperClient = getApperClient()
      if (!apperClient) {
        throw new Error('ApperClient not available')
      }

      const params = {
        records: [{
          Id: parseInt(id),
          ...(data.title_c !== undefined && { title_c: data.title_c }),
          ...(data.description_c !== undefined && { description_c: data.description_c }),
          ...(data.priority_c !== undefined && { priority_c: data.priority_c }),
          ...(data.dueDate_c !== undefined && { dueDate_c: data.dueDate_c }),
          ...(data.completed_c !== undefined && { completed_c: data.completed_c }),
          ...(data.completedAt_c !== undefined && { completedAt_c: data.completedAt_c }),
          ...(data.archived_c !== undefined && { archived_c: data.archived_c }),
          ...(data.listId_c !== undefined && { listId_c: data.listId_c ? parseInt(data.listId_c) : null }),
          ...(data.attachments_c !== undefined && { attachments_c: data.attachments_c })
        }]
      }

      const response = await apperClient.updateRecord(this.tableName, params)

      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return null
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success)
        const failed = response.results.filter(r => !r.success)

        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} tasks:`, failed)
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`))
            if (record.message) toast.error(record.message)
          })
        }

        return successful.length > 0 ? successful[0].data : null
      }

      return null
    } catch (error) {
      console.error("Error updating task:", error?.response?.data?.message || error)
      toast.error("Failed to update task")
      return null
    }
  }

  async delete(id) {
    try {
      const apperClient = getApperClient()
      if (!apperClient) {
        throw new Error('ApperClient not available')
      }

      const params = {
        RecordIds: [parseInt(id)]
      }

      const response = await apperClient.deleteRecord(this.tableName, params)

      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return false
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success)
        const failed = response.results.filter(r => !r.success)

        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} tasks:`, failed)
          failed.forEach(record => {
            if (record.message) toast.error(record.message)
          })
        }

        return successful.length > 0
      }

      return true
    } catch (error) {
      console.error("Error deleting task:", error?.response?.data?.message || error)
      toast.error("Failed to delete task")
      return false
    }
  }
}

export const taskService = new TaskService()