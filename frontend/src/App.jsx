import { useState } from 'react'
import { Route, Routes } from 'react-router-dom'

import ImageUploader from './components/ImageUploader'
import { useAuth } from './hooks/authHook'
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';

function App() {
  const {isAuthenticated} = useAuth();
  const [count, setCount] = useState(0)

  return (
    <>  
      <div>
        {isAuthenticated ? <Dashboard/> : <Login/>}
      </div>
    </>
  )
}

export default App
