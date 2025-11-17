import tasksData from "@/services/mockData/tasks.json"

class TaskService {
  constructor() {
    this.storageKey = "taskflow_tasks"
    this.loadTasks()
  }

  loadTasks() {
    const stored = localStorage.getItem(this.storageKey)
    if (stored) {
      this.tasks = JSON.parse(stored)
    } else {
      this.tasks = [...tasksData]
      this.saveTasks()
    }
  }

  saveTasks() {
    localStorage.setItem(this.storageKey, JSON.stringify(this.tasks))
  }

  async getAll() {
    // Simulate API delay
    await this.delay(200)
    return [...this.tasks]
  }

  async getById(id) {
    await this.delay(150)
    const task = this.tasks.find(task => task.Id === parseInt(id))
    if (!task) {
      throw new Error("Task not found")
    }
    return { ...task }
  }

  async create(taskData) {
    await this.delay(300)
    
    const newTask = {
      Id: this.getNextId(),
      ...taskData,
      completed: false,
      archived: false,
      createdAt: new Date().toISOString(),
      completedAt: null
    }

    this.tasks.push(newTask)
    this.saveTasks()
    return { ...newTask }
  }

  async update(id, data) {
    await this.delay(250)
    
    const index = this.tasks.findIndex(task => task.Id === parseInt(id))
    if (index === -1) {
      throw new Error("Task not found")
    }

    this.tasks[index] = {
      ...this.tasks[index],
      ...data,
      Id: this.tasks[index].Id // Ensure Id doesn't change
    }

    this.saveTasks()
    return { ...this.tasks[index] }
  }

  async delete(id) {
    await this.delay(200)
    
    const index = this.tasks.findIndex(task => task.Id === parseInt(id))
    if (index === -1) {
      throw new Error("Task not found")
    }

    this.tasks.splice(index, 1)
    this.saveTasks()
    return true
  }

  getNextId() {
    if (this.tasks.length === 0) return 1
    return Math.max(...this.tasks.map(task => task.Id)) + 1
  }

  async delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}

export const taskService = new TaskService()