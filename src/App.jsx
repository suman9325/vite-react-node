import './App.css'
import { BrowserRouter } from 'react-router-dom'
import AppSidebar from './AppSidebar'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

function App() {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <AppSidebar />
        </BrowserRouter>
      </QueryClientProvider>
    </>
  )
}

export default App
