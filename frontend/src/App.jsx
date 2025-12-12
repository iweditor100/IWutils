import { useEffect } from 'react'
import { Route, Routes } from 'react-router-dom'

import ImageUploader from './components/ImageUploader'
import { useAuth } from './hooks/authHook'
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import { restoreSession } from './utils/restoreSession';

function App() {
  const {isAuthenticated, loadingAuth } = useAuth();
  console.log(isAuthenticated, loadingAuth);


  // We just fire the restoration. "loadingAuth" in Redux handles the initial state (false by default due to hydration)
  // or true if you want to block interactions. But for "Instant App", we rely on the Hydrated User.
  useEffect(() => {
    restoreSession();
  }, []);


  // if(loadingAuth) {
  //   return <div className='flex flex-col items-center justify-center'>
  //     Restoring session
  //   </div>
  // }
  return (
    <>  
      <div>
        {isAuthenticated ? <Dashboard/> : <Login/>}
      </div>
    </>
  )
}

export default App
