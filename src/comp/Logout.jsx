import React, { useState, useEffect } from 'react'
import { signOut } from 'firebase/auth'
import { auth } from '../auth'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { onAuthStateChanged } from 'firebase/auth';

const Logout = () => {
  const navigate = useNavigate()
  const [uid, setUid] = useState('')


  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (acc) => {
      if (acc) {
        setUid(acc.uid);
      } else {
        navigate('/')
      }
    });
    return () => unsubscribe();
  }, []);


  const Logout = (e) => {
    e.preventDefault()
    signOut(auth)
      .then((user) => {
        // Navigate to the home page after successful sign out
        navigate('/');
        console.log(user)
        axios.put(`http://localhost:8080/LogOutDate/${uid}`, {
          LoggedOut: Date.now()
        }).then(() => {
          console.log('logged out!')
          navigate('/Home')
        }).catch((err) => {
          console.log(err)
        })
      }).catch((err) => {
        console.log(err)
      })
  }
  return (
    <div className='logOut' onClick={Logout}>Logout <ion-icon name="log-out-outline"></ion-icon></div>
  )
}

export default Logout