import { useEffect } from 'react'
import { useChore } from '../contexts/ChoreContext'
import { choreApi, userApi } from '../services/api'
import { CreateChoreData, UpdateChoreData } from '../types'

export const useChores = () => {
  const { state, dispatch } = useChore()

  useEffect(() => {
    loadChores()
    loadUsers()
  }, [])

  const loadChores = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      const chores = await choreApi.getAll()
      dispatch({ type: 'SET_CHORES', payload: chores })
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to load chores' })
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }

  const loadUsers = async () => {
    try {
      const users = await userApi.getAll()
      dispatch({ type: 'SET_USERS', payload: users })
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to load users' })
    }
  }

  const createChore = async (choreData: CreateChoreData) => {
    try {
      const newChore = await choreApi.create(choreData)
      dispatch({ type: 'ADD_CHORE', payload: newChore })
      return newChore
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to create chore' })
      throw error
    }
  }

  const updateChore = async (id: number, choreData: UpdateChoreData) => {
    try {
      const updatedChore = await choreApi.update(id, choreData)
      dispatch({ type: 'UPDATE_CHORE', payload: updatedChore })
      return updatedChore
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to update chore' })
      throw error
    }
  }

  const deleteChore = async (id: number) => {
    try {
      await choreApi.delete(id)
      dispatch({ type: 'DELETE_CHORE', payload: id })
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to delete chore' })
      throw error
    }
  }

  return {
    chores: state.chores,
    users: state.users,
    loading: state.loading,
    error: state.error,
    createChore,
    updateChore,
    deleteChore,
    loadChores,
  }
}