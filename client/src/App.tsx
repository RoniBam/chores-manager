import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ChoreProvider } from './contexts/ChoreContext'
import Layout from './components/Layout'
import ListView from './views/ListView'
import CalendarView from './views/CalendarView'

function App() {
  return (
    <ChoreProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<ListView />} />
            <Route path="/calendar" element={<CalendarView />} />
          </Routes>
        </Layout>
      </Router>
    </ChoreProvider>
  )
}

export default App