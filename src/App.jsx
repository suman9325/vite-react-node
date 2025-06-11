import './App.css'
import { BrowserRouter } from 'react-router-dom'
import AppSidebar from './AppSidebar'

function App() {
  return (
    <>
      <BrowserRouter>
          <AppSidebar />
      </BrowserRouter>
    </>
  )
}

export default App
