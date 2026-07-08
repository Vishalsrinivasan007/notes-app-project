import {BrowserRouter,Routes,Route,replace,Navigate} from 'react-router-dom'
import Login from './Pages/Login'
import Register from './Pages/Register'
import Notes from './Pages/Notes'
import ProtectedRoutes from './components/ProtectedRoute'
function App(){
  return(
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace/>} />
      <Route path="/login" element={<Login/>}/>
      <Route path="/register" element={<Register/>}/>
      <Route path="/notes" element={
        <ProtectedRoutes>
          <Notes/>
        </ProtectedRoutes>
      }/>
    </Routes>
    </BrowserRouter>
  )
}
export default App