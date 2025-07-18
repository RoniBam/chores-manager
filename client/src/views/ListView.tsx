import { useState } from 'react'
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { useChores } from '../hooks/useChores'
import ChoreForm from '../components/ChoreForm'
import DraggableChoreItem from '../components/DraggableChoreItem'
import { CreateChoreData } from '../types'

const ListView = () => {
  const { chores, users, loading, error, createChore, updateChore, deleteChore } = useChores()
  const [showForm, setShowForm] = useState(false)
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all')
  const [choreOrder, setChoreOrder] = useState<number[]>([])

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleCreateChore = async (choreData: CreateChoreData) => {
    try {
      await createChore(choreData)
      setShowForm(false)
    } catch (error) {
      console.error('Failed to create chore:', error)
    }
  }

  const handleUpdateChore = async (id: number, updates: Partial<any>) => {
    try {
      const chore = chores.find(c => c.id === id)
      if (chore) {
        await updateChore(id, { ...chore, ...updates })
      }
    } catch (error) {
      console.error('Failed to update chore:', error)
    }
  }

  const handleDeleteChore = async (id: number) => {
    try {
      await deleteChore(id)
    } catch (error) {
      console.error('Failed to delete chore:', error)
    }
  }

  const handleDragEnd = (event: any) => {
    const { active, over } = event

    if (active.id !== over.id) {
      setChoreOrder((items) => {
        const oldIndex = items.indexOf(active.id)
        const newIndex = items.indexOf(over.id)
        return arrayMove(items, oldIndex, newIndex)
      })
    }
  }

  const filteredChores = chores.filter(chore => {
    if (filter === 'all') return true
    return chore.status === filter
  })

  const sortedChores = filteredChores.sort((a, b) => {
    if (a.status === 'completed' && b.status !== 'completed') return 1
    if (a.status !== 'completed' && b.status === 'completed') return -1
    
    const aIndex = choreOrder.indexOf(a.id)
    const bIndex = choreOrder.indexOf(b.id)
    
    if (aIndex !== -1 && bIndex !== -1) {
      return aIndex - bIndex
    }
    
    return new Date(a.due_date).getTime() - new Date(b.due_date).getTime()
  })

  if (choreOrder.length === 0 && filteredChores.length > 0) {
    setChoreOrder(filteredChores.map(c => c.id))
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-600">Loading chores...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        {error}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Chores</h2>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          Add New Chore
        </button>
      </div>

      <div className="flex space-x-2">
        <button
          onClick={() => setFilter('all')}
          className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
            filter === 'all' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          All ({chores.length})
        </button>
        <button
          onClick={() => setFilter('pending')}
          className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
            filter === 'pending' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Pending ({chores.filter(c => c.status === 'pending').length})
        </button>
        <button
          onClick={() => setFilter('completed')}
          className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
            filter === 'completed' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Completed ({chores.filter(c => c.status === 'completed').length})
        </button>
      </div>

      {showForm && (
        <div className="mb-6">
          <ChoreForm
            users={users}
            onSubmit={handleCreateChore}
            onCancel={() => setShowForm(false)}
          />
        </div>
      )}

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <div className="space-y-3">
          {sortedChores.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No chores found. Add your first chore to get started!
            </div>
          ) : (
            <SortableContext items={sortedChores.map(c => c.id)} strategy={verticalListSortingStrategy}>
              {sortedChores.map(chore => (
                <DraggableChoreItem
                  key={chore.id}
                  chore={chore}
                  onUpdate={handleUpdateChore}
                  onDelete={handleDeleteChore}
                />
              ))}
            </SortableContext>
          )}
        </div>
      </DndContext>
    </div>
  )
}

export default ListView