import { getApperClient } from '@/services/apperClient';

class ProjectService {
  constructor() {
    this.tableName = 'projects_c';
    
    // Define field mappings based on projects_c table schema
    this.fields = [
      {"field": {"Name": "Id"}},
      {"field": {"Name": "Name"}},
      {"field": {"Name": "description_c"}},
      {"field": {"Name": "status_c"}},
      {"field": {"Name": "priority_c"}},
      {"field": {"Name": "startDate_c"}},
      {"field": {"Name": "endDate_c"}},
      {"field": {"Name": "budget_c"}},
      {"field": {"Name": "progress_c"}},
      {"field": {"Name": "CreatedBy"}},
      {"field": {"Name": "CreatedDate"}},
      {"field": {"Name": "LastModifiedBy"}},
      {"field": {"Name": "LastModifiedDate"}}
    ];
    
    // Fields that can be updated (excluding ReadOnly/System fields)
    this.updateableFields = [
      'Name',
      'description_c',
      'status_c', 
      'priority_c',
      'startDate_c',
      'endDate_c',
      'budget_c',
      'progress_c'
    ];
  }

  async getAll() {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.fetchRecords(this.tableName, {
        fields: this.fields,
        orderBy: [{"fieldName": "LastModifiedDate", "sorttype": "DESC"}],
        pagingInfo: {"limit": 100, "offset": 0}
      });

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching projects:", error?.response?.data?.message || error.message);
      return [];
    }
  }

  async getById(id) {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.getRecordById(this.tableName, parseInt(id), {
        fields: this.fields
      });

      if (!response.success) {
        console.error(response.message);
        return null;
      }

      return response.data || null;
    } catch (error) {
      console.error(`Error fetching project ${id}:`, error?.response?.data?.message || error.message);
      return null;
    }
  }

  async create(projectData) {
    try {
      const apperClient = getApperClient();
      
      // Filter to only updateable fields and format data
      const filteredData = {};
      this.updateableFields.forEach(field => {
        if (projectData[field] !== undefined && projectData[field] !== null && projectData[field] !== '') {
          filteredData[field] = projectData[field];
        }
      });

      const response = await apperClient.createRecord(this.tableName, {
        records: [filteredData]
      });

      if (!response.success) {
        console.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create project: ${JSON.stringify(failed)}`);
          failed.forEach(record => {
            if (record.errors) {
              record.errors.forEach(error => console.error(`Error: ${error}`));
            }
            if (record.message) console.error(record.message);
          });
          return null;
        }
        
        return successful.length > 0 ? successful[0].data : null;
      }

      return null;
    } catch (error) {
      console.error("Error creating project:", error?.response?.data?.message || error.message);
      return null;
    }
  }

  async update(id, projectData) {
    try {
      const apperClient = getApperClient();
      
      // Filter to only updateable fields and format data
      const filteredData = { Id: parseInt(id) };
      this.updateableFields.forEach(field => {
        if (projectData[field] !== undefined && projectData[field] !== null && projectData[field] !== '') {
          filteredData[field] = projectData[field];
        }
      });

      const response = await apperClient.updateRecord(this.tableName, {
        records: [filteredData]
      });

      if (!response.success) {
        console.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to update project ${id}: ${JSON.stringify(failed)}`);
          failed.forEach(record => {
            if (record.errors) {
              record.errors.forEach(error => console.error(`Error: ${error}`));
            }
            if (record.message) console.error(record.message);
          });
          return null;
        }
        
        return successful.length > 0 ? successful[0].data : null;
      }

      return null;
    } catch (error) {
      console.error(`Error updating project ${id}:`, error?.response?.data?.message || error.message);
      return null;
    }
  }

  async delete(id) {
    try {
      const apperClient = getApperClient();
      
      const response = await apperClient.deleteRecord(this.tableName, {
        RecordIds: [parseInt(id)]
      });

      if (!response.success) {
        console.error(response.message);
        return false;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to delete project ${id}: ${JSON.stringify(failed)}`);
          failed.forEach(record => {
            if (record.message) console.error(record.message);
          });
          return false;
        }
        
        return successful.length > 0;
      }

      return false;
    } catch (error) {
      console.error(`Error deleting project ${id}:`, error?.response?.data?.message || error.message);
      return false;
    }
  }
}

export const projectService = new ProjectService();