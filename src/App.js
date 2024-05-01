import logo from './logo.svg';
import './App.css';
import SignUp from './pages/SignUp';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import SignIn from './pages/SignIn';
import ForgotPw from './pages/ForgotPw';
import System from './pages/System';
import Profile from './pages/Profile';
import Inbox from './pages/Inbox';
import Cart from './pages/Cart';
import CheckOut from './pages/CheckOut';
import PlacedOrder from './pages/PlacedOrder';
import History from './pages/History';
import SignInAdmin from './pages/SignInAdmin'
import AdminSystem from './pages/AdminSystem'
import AdminInbox from './pages/AdminInbox';
import AdminTask from './pages/AdminTask'

function App() {
  return (
    <Router>
    <div className="App">
      <Routes>
        <Route path='/' element={<SignIn />} />
        <Route path='/Register' element={<SignUp />} />
        <Route path='/ForgotPassword' element={<ForgotPw />} />
        <Route path='/System' element={<System />} />
        <Route path='/System/Inbox' element={<Inbox />} />
        <Route path='/System/Profile' element={<Profile />} />
        <Route path='/System/Cart' element={<Cart />} />
        <Route path='/System/CheckOut' element={<CheckOut />} />
        <Route path='/System/placedOrder' element={<PlacedOrder />} />
        <Route path='/System/History' element={<History />} />
        


        {/* admin side routess */}
        <Route path='/admin' element={<SignInAdmin />} />
        <Route path='/admin/AdminSystem' element={<AdminSystem />} />
        <Route path='/admin/AdminInbox' element={<AdminInbox />} />
        <Route path='/admin/AdminTask' element={<AdminTask />} />
{/* 
        <Route path='*'
          element={<NotFound />} /> */}
      </Routes>
    </div>
  </Router>
  );
}

export default App;
