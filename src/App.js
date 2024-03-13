import './App.css';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import ForgotPw from './pages/ForgotPw';
import System from './pages/System';
import FileMain from './pages/FileMain';



function App() {
  return (
    <Router>
    <div className="App">
      <Routes>
        <Route path='/' element={<SignIn />} />
        <Route path='/SignUp' element={<SignUp />} />
        <Route path='/Forgot' element={<ForgotPw />} />
        <Route path='/System' element={<System />} />
        <Route path='/fileMaintenance' element={<FileMain />} />
        {/* <Route path='/system' 
        element={loading ? (authenticated ? <System /> : <Navigate to='/login' />) : <Loading />} /> */}
      </Routes>
    </div>
  </Router>
  );
}

export default App;
