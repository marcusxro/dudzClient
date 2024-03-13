import React from 'react'
import { signOut } from 'firebase/auth'
import { auth } from '../auth'
import { useNavigate } from 'react-router-dom'

const Logout = () => {
  const navigate = useNavigate()
  const Logout = (e) => {
    e.preventDefault()
    signOut(auth)
      .then(() => {
            // Navigate to the home page after successful sign out
            navigate('/');
            console.log('sdsd')
      }).catch((err) => {
        console.log(err)
      })
  }
  return (
    <div className='logOut' onClick={Logout}>Logout <ion-icon name="log-out-outline"></ion-icon></div>
  )
}

export default Logout