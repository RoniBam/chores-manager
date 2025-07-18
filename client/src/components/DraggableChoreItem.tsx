import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Chore } from '../types'
import ChoreItem from './ChoreItem'

interface DraggableChoreItemProps {
  chore: Chore
  onUpdate: (id: number, updates: Partial<Chore>) => void
  onDelete: (id: number) => void
}

const DraggableChoreItem = ({ chore, onUpdate, onDelete }: DraggableChoreItemProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: chore.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <div className="relative group">
        <div
          {...listeners}
          className="absolute left-2 top-1/2 transform -translate-y-1/2 cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <div className="w-4 h-4 text-gray-400">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 6h2V4H8v2zm0 4h2V8H8v2zm0 4h2v-2H8v2zm0 4h2v-2H8v2zm6-12h2V4h-2v2zm0 4h2V8h-2v2zm0 4h2v-2h-2v2zm0 4h2v-2h-2v2z"/>
            </svg>
          </div>
        </div>
        <ChoreItem chore={chore} onUpdate={onUpdate} onDelete={onDelete} />
      </div>
    </div>
  )
}

export default DraggableChoreItem