import { useState } from 'react'
import { Route, Routes } from 'react-router-dom'

import ImageUploader from './components/ImageUploader'
import { useAuth } from './hooks/authHook'
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import { useEffect } from 'react';
import { restoreSession } from './utils/restoreSession';

function App() {
  const {isAuthenticated} = useAuth();
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const init = async() => {
      try {
        await restoreSession();
      } catch(err) {
        console.error("Restoring session failed", err);
      } finally {
        setLoading(false);
      }
    }
    init();
  }, []);


  if(loading) {
    return <div className='flex flex-col items-center justify-center'>
      Restoring session
    </div>
  }
  return (
    <>  
      <div>
        {isAuthenticated ? <Dashboard/> : <Login/>}
      </div>
    </>
  )
}

export default App
