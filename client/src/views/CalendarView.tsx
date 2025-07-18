import { useState, useMemo } from 'react'
import { Calendar, momentLocalizer, View } from 'react-big-calendar'
import moment from 'moment'
import { useChores } from '../hooks/useChores'
import ChoreForm from '../components/ChoreForm'
import { CreateChoreData, Chore } from '../types'
import 'react-big-calendar/lib/css/react-big-calendar.css'

const localizer = momentLocalizer(moment)

const CalendarView = () => {
  const { chores, users, loading, error, createChore, updateChore, deleteChore } = useChores()
  const [showForm, setShowForm] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedChore, setSelectedChore] = useState<Chore | null>(null)

  const events = useMemo(() => {
    return chores.map(chore => ({
      id: chore.id,
      title: chore.title,
      start: new Date(chore.due_date),
      end: new Date(chore.due_date),
      resource: chore,
      className: `priority-${chore.priority} ${chore.status === 'completed' ? 'completed' : ''}`,
    }))
  }, [chores])

  const handleSelectSlot = ({ start }: { start: Date }) => {
    setSelectedDate(start)
    setShowForm(true)
  }

  const handleSelectEvent = (event: any) => {
    setSelectedChore(event.resource)
  }

  const handleCreateChore = async (choreData: CreateChoreData) => {
    try {
      const newChoreData = {
        ...choreData,
        due_date: selectedDate ? selectedDate.toISOString().split('T')[0] : choreData.due_date,
      }
      await createChore(newChoreData)
      setShowForm(false)
      setSelectedDate(null)
    } catch (error) {
      console.error('Failed to create chore:', error)
    }
  }

  const handleUpdateChore = async (updates: Partial<Chore>) => {
    if (!selectedChore) return
    
    try {
      await updateChore(selectedChore.id, { ...selectedChore, ...updates })
      setSelectedChore(null)
    } catch (error) {
      console.error('Failed to update chore:', error)
    }
  }

  const handleDeleteChore = async () => {
    if (!selectedChore) return
    
    try {
      await deleteChore(selectedChore.id)
      setSelectedChore(null)
    } catch (error) {
      console.error('Failed to delete chore:', error)
    }
  }

  const handleMoveEvent = async ({ event, start, end }: { event: any; start: Date; end: Date }) => {
    try {
      const chore = event.resource
      const newDueDate = start.toISOString().split('T')[0]
      await updateChore(chore.id, { ...chore, due_date: newDueDate })
    } catch (error) {
      console.error('Failed to move chore:', error)
    }
  }

  const eventStyleGetter = (event: any) => {
    const chore = event.resource
    let backgroundColor = '#3174ad'
    
    switch (chore.priority) {
      case 'high':
        backgroundColor = '#ef4444'
        break
      case 'medium':
        backgroundColor = '#f59e0b'
        break
      case 'low':
        backgroundColor = '#10b981'
        break
    }

    if (chore.status === 'completed') {
      backgroundColor = '#6b7280'
    }

    return {
      style: {
        backgroundColor,
        borderRadius: '4px',
        opacity: chore.status === 'completed' ? 0.7 : 1,
        color: 'white',
        border: 'none',
        display: 'block',
      },
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-600">Loading calendar...</div>
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
        <h2 className="text-2xl font-bold text-gray-900">Calendar</h2>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          Add New Chore
        </button>
      </div>

      {showForm && (
        <div className="mb-6">
          <ChoreForm
            users={users}
            onSubmit={handleCreateChore}
            onCancel={() => {
              setShowForm(false)
              setSelectedDate(null)
            }}
          />
        </div>
      )}

      {selectedChore && (
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{selectedChore.title}</h3>
              {selectedChore.description && (
                <p className="text-gray-600 mt-1">{selectedChore.description}</p>
              )}
              <div className="flex items-center space-x-2 mt-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  selectedChore.priority === 'high' ? 'bg-red-100 text-red-800' :
                  selectedChore.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {selectedChore.priority}
                </span>
                <span className="text-sm text-gray-500">
                  Due: {new Date(selectedChore.due_date).toLocaleDateString()}
                </span>
                {selectedChore.assigned_to_name && (
                  <span className="text-sm text-blue-600 bg-blue-100 px-2 py-1 rounded">
                    {selectedChore.assigned_to_name}
                  </span>
                )}
              </div>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => handleUpdateChore({ 
                  status: selectedChore.status === 'completed' ? 'pending' : 'completed' 
                })}
                className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                  selectedChore.status === 'completed' 
                    ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    : 'bg-green-600 text-white hover:bg-green-700'
                }`}
              >
                {selectedChore.status === 'completed' ? 'Mark Pending' : 'Mark Complete'}
              </button>
              <button
                onClick={handleDeleteChore}
                className="px-3 py-1 bg-red-600 text-white rounded text-sm font-medium hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
              <button
                onClick={() => setSelectedChore(null)}
                className="px-3 py-1 bg-gray-200 text-gray-700 rounded text-sm font-medium hover:bg-gray-300 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white p-4 rounded-lg shadow-md">
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 600 }}
          selectable
          onSelectSlot={handleSelectSlot}
          onSelectEvent={handleSelectEvent}
          onEventDrop={handleMoveEvent}
          eventPropGetter={eventStyleGetter}
          views={['month', 'week', 'day']}
          defaultView="month"
          popup
          dayLayoutAlgorithm="no-overlap"
        />
      </div>

      <div className="flex items-center space-x-6 text-sm">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-red-500 rounded"></div>
          <span>High Priority</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-yellow-500 rounded"></div>
          <span>Medium Priority</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-green-500 rounded"></div>
          <span>Low Priority</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-gray-500 rounded"></div>
          <span>Completed</span>
        </div>
      </div>
    </div>
  )
}

export default CalendarView