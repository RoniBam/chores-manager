import { createContext, useContext, useReducer, ReactNode } from 'react'
import { Chore, User } from '../types'

interface ChoreState {
  chores: Chore[]
  users: User[]
  loading: boolean
  error: string | null
}

type ChoreAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_CHORES'; payload: Chore[] }
  | { type: 'SET_USERS'; payload: User[] }
  | { type: 'ADD_CHORE'; payload: Chore }
  | { type: 'UPDATE_CHORE'; payload: Chore }
  | { type: 'DELETE_CHORE'; payload: number }

const initialState: ChoreState = {
  chores: [],
  users: [],
  loading: false,
  error: null,
}

const choreReducer = (state: ChoreState, action: ChoreAction): ChoreState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload }
    case 'SET_ERROR':
      return { ...state, error: action.payload }
    case 'SET_CHORES':
      return { ...state, chores: action.payload }
    case 'SET_USERS':
      return { ...state, users: action.payload }
    case 'ADD_CHORE':
      return { ...state, chores: [...state.chores, action.payload] }
    case 'UPDATE_CHORE':
      return {
        ...state,
        chores: state.chores.map(chore =>
          chore.id === action.payload.id ? action.payload : chore
        )
      }
    case 'DELETE_CHORE':
      return {
        ...state,
        chores: state.chores.filter(chore => chore.id !== action.payload)
      }
    default:
      return state
  }
}

const ChoreContext = createContext<{
  state: ChoreState
  dispatch: React.Dispatch<ChoreAction>
} | null>(null)

export const ChoreProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(choreReducer, initialState)

  return (
    <ChoreContext.Provider value={{ state, dispatch }}>
      {children}
    </ChoreContext.Provider>
  )
}

export const useChore = () => {
  const context = useContext(ChoreContext)
  if (!context) {
    throw new Error('useChore must be used within a ChoreProvider')
  }
  return context
}