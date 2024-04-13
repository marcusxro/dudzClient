import './App.css';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import ForgotPw from './pages/ForgotPw';
import System from './pages/System';
import FileMain from './pages/FileMain';
import Records from './pages/Records';
import Static from './pages/Static';
import ManageUsers from './pages/ManageUsers';



function App() {
  return (
    <Router>
    <div className="App">
      <Routes>
        <Route path='/' element={<SignIn />} />
        <Route path='/SignUp' element={<SignUp />} />
        <Route path='/Forgot' element={<ForgotPw />} />
        <Route path='/System' element={<Records />} />
        <Route path='/fileMaintenance' element={<FileMain />} />
        <Route path='/Records' element={<System />} />
        <Route path='/Home' element={<Static />} />
        <Route path='/Manage' element={<ManageUsers />} />
        {/* <Route path='/system' 
        element={loading ? (authenticated ? <System /> : <Navigate to='/login' />) : <Loading />} /> */}
      </Routes>
    </div>
  </Router>
  );
}

export default App;
