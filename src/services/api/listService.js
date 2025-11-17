import { getApperClient } from '@/services/apperClient'
import { toast } from 'react-toastify'

class ListService {
  constructor() {
    this.tableName = 'lists_c'
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
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "color_c"}},
          {"field": {"Name": "order_c"}},
          {"field": {"Name": "taskCount_c"}}
        ],
        orderBy: [{"fieldName": "order_c", "sorttype": "ASC"}]
      }

      const response = await apperClient.fetchRecords(this.tableName, params)

      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return []
      }

      return response.data || []
    } catch (error) {
      console.error("Error fetching lists:", error?.response?.data?.message || error)
      toast.error("Failed to load lists")
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
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "color_c"}},
          {"field": {"Name": "order_c"}},
          {"field": {"Name": "taskCount_c"}}
        ]
      }

      const response = await apperClient.getRecordById(this.tableName, parseInt(id), params)

      if (!response?.data) {
        throw new Error("List not found")
      }

      return response.data
    } catch (error) {
      console.error(`Error fetching list ${id}:`, error?.response?.data?.message || error)
      throw new Error("List not found")
    }
  }

  async create(listData) {
    try {
      const apperClient = getApperClient()
      if (!apperClient) {
        throw new Error('ApperClient not available')
      }

      const params = {
        records: [{
          name_c: listData.name_c,
          color_c: listData.color_c,
          order_c: listData.order_c || 0,
          taskCount_c: 0
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
          console.error(`Failed to create ${failed.length} lists:`, failed)
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`))
            if (record.message) toast.error(record.message)
          })
        }

        return successful.length > 0 ? successful[0].data : null
      }

      return null
    } catch (error) {
      console.error("Error creating list:", error?.response?.data?.message || error)
      toast.error("Failed to create list")
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
          ...(data.name_c !== undefined && { name_c: data.name_c }),
          ...(data.color_c !== undefined && { color_c: data.color_c }),
          ...(data.order_c !== undefined && { order_c: data.order_c }),
          ...(data.taskCount_c !== undefined && { taskCount_c: data.taskCount_c })
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
          console.error(`Failed to update ${failed.length} lists:`, failed)
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`))
            if (record.message) toast.error(record.message)
          })
        }

        return successful.length > 0 ? successful[0].data : null
      }

      return null
    } catch (error) {
      console.error("Error updating list:", error?.response?.data?.message || error)
      toast.error("Failed to update list")
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
          console.error(`Failed to delete ${failed.length} lists:`, failed)
          failed.forEach(record => {
            if (record.message) toast.error(record.message)
          })
        }

        return successful.length > 0
      }

      return true
    } catch (error) {
      console.error("Error deleting list:", error?.response?.data?.message || error)
      toast.error("Failed to delete list")
      return false
    }
  }
}

export const listService = new ListService()