import listsData from "@/services/mockData/lists.json"

class ListService {
  constructor() {
    this.storageKey = "taskflow_lists"
    this.loadLists()
  }

  loadLists() {
    const stored = localStorage.getItem(this.storageKey)
    if (stored) {
      this.lists = JSON.parse(stored)
    } else {
      this.lists = [...listsData]
      this.saveLists()
    }
  }

  saveLists() {
    localStorage.setItem(this.storageKey, JSON.stringify(this.lists))
  }

  async getAll() {
    await this.delay(150)
    return [...this.lists]
  }

  async getById(id) {
    await this.delay(100)
    const list = this.lists.find(list => list.Id === parseInt(id))
    if (!list) {
      throw new Error("List not found")
    }
    return { ...list }
  }

  async create(listData) {
    await this.delay(250)
    
    const newList = {
      Id: this.getNextId(),
      ...listData,
      taskCount: 0
    }

    this.lists.push(newList)
    this.saveLists()
    return { ...newList }
  }

  async update(id, data) {
    await this.delay(200)
    
    const index = this.lists.findIndex(list => list.Id === parseInt(id))
    if (index === -1) {
      throw new Error("List not found")
    }

    this.lists[index] = {
      ...this.lists[index],
      ...data,
      Id: this.lists[index].Id
    }

    this.saveLists()
    return { ...this.lists[index] }
  }

  async delete(id) {
    await this.delay(150)
    
    const index = this.lists.findIndex(list => list.Id === parseInt(id))
    if (index === -1) {
      throw new Error("List not found")
    }

    this.lists.splice(index, 1)
    this.saveLists()
    return true
  }

  getNextId() {
    if (this.lists.length === 0) return 1
    return Math.max(...this.lists.map(list => list.Id)) + 1
  }

  async delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}

export const listService = new ListService()