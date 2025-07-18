import { useState } from 'react'
import { Chore } from '../types'

interface ChoreItemProps {
  chore: Chore
  onUpdate: (id: number, updates: Partial<Chore>) => void
  onDelete: (id: number) => void
}

const ChoreItem = ({ chore, onUpdate, onDelete }: ChoreItemProps) => {
  const [isEditing, setIsEditing] = useState(false)
  const [editTitle, setEditTitle] = useState(chore.title)

  const handleStatusChange = () => {
    const newStatus = chore.status === 'completed' ? 'pending' : 'completed'
    onUpdate(chore.id, { status: newStatus })
  }

  const handleTitleUpdate = () => {
    if (editTitle.trim()) {
      onUpdate(chore.id, { title: editTitle.trim() })
      setIsEditing(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleTitleUpdate()
    } else if (e.key === 'Escape') {
      setEditTitle(chore.title)
      setIsEditing(false)
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'low': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  return (
    <div className={`p-4 border rounded-lg shadow-sm ${
      chore.status === 'completed' ? 'bg-gray-50 opacity-75' : 'bg-white'
    }`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3 flex-1">
          <input
            type="checkbox"
            checked={chore.status === 'completed'}
            onChange={handleStatusChange}
            className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          
          <div className="flex-1">
            {isEditing ? (
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                onBlur={handleTitleUpdate}
                onKeyDown={handleKeyPress}
                className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                autoFocus
              />
            ) : (
              <h3
                className={`font-medium cursor-pointer ${
                  chore.status === 'completed' ? 'line-through text-gray-500' : 'text-gray-900'
                }`}
                onClick={() => setIsEditing(true)}
              >
                {chore.title}
              </h3>
            )}
            
            {chore.description && (
              <p className="text-sm text-gray-600 mt-1">{chore.description}</p>
            )}
            
            <div className="flex items-center space-x-2 mt-2">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(chore.priority)}`}>
                {chore.priority}
              </span>
              
              <span className="text-xs text-gray-500">
                Due: {formatDate(chore.due_date)}
              </span>
              
              {chore.assigned_to_name && (
                <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded">
                  {chore.assigned_to_name}
                </span>
              )}
            </div>
          </div>
        </div>
        
        <button
          onClick={() => onDelete(chore.id)}
          className="text-red-600 hover:text-red-800 p-1"
          title="Delete chore"
        >
          ×
        </button>
      </div>
    </div>
  )
}

export default ChoreItem