import axios from 'axios'
import { Chore, User, CreateChoreData, UpdateChoreData } from '../types'

const API_BASE_URL = '/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

export const choreApi = {
  async getAll(): Promise<Chore[]> {
    const response = await api.get('/chores')
    return response.data
  },

  async getById(id: number): Promise<Chore> {
    const response = await api.get(`/chores/${id}`)
    return response.data
  },

  async create(choreData: CreateChoreData): Promise<Chore> {
    const response = await api.post('/chores', choreData)
    return response.data
  },

  async update(id: number, choreData: UpdateChoreData): Promise<Chore> {
    const response = await api.put(`/chores/${id}`, choreData)
    return response.data
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/chores/${id}`)
  },
}

export const userApi = {
  async getAll(): Promise<User[]> {
    const response = await api.get('/users')
    return response.data
  },

  async getById(id: number): Promise<User> {
    const response = await api.get(`/users/${id}`)
    return response.data
  },

  async create(userData: { name: string; email?: string }): Promise<User> {
    const response = await api.post('/users', userData)
    return response.data
  },
}

export default api