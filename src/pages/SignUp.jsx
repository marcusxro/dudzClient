import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import imageOne from '../images/mririwatir.jpg'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { Authentication } from '../Authentication'
import axios from 'axios'

const SignUp = () => {
    const nav = useNavigate()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [username, setUsername] = useState('')

    const createAcc = () => {
        if (password >= 5) {
            return alert("make your password longer!")
        } else if (!username) {
            return alert("please type something")
        } else {
            createUserWithEmailAndPassword(Authentication, email, password)
                .then(() => {
                    const user = Authentication.currentUser;
                    console.log("ACCOUNT CREATED!")
                    console.log(email, password, user.uid);                    
                    
                    axios.post('http://localhost:8080/SendAcc', {
                        Email: email,
                        Username: username,
                        Password: password,
                        Uid: user.uid,
                    })
                    .then(() => {
                        console.log("details sent")
                        setPassword('')
                        setEmail('')
                        setUsername('')
                    })
                    .catch((err) => {
                        console.log(err)
                    })
                    


                }).catch((err) => {
                    if (err.code === "auth/email-already-in-use") {
                        alert('email in use')
                    }
                    console.log(err)

                })
        }
    }
    return (
        <div className='signUpCon'>

            <div className="firstCol">

                <div className="signUpContent">
                    <div className="signUpText">
                        Sign up
                    </div>
                    <input
                        value={username} onChange={(e) => { setUsername(e.target.value) }}
                        required type="text" placeholder='Enter your username' />
                    <input
                        value={email} onChange={(e) => { setEmail(e.target.value) }}
                        required type="email" placeholder='Enter your email' />
                    <input
                        value={password} onChange={(e) => { setPassword(e.target.value) }}
                        required type="password" placeholder='Enter your password' />

                    <div className="goBack">
                        already have account? <span onClick={() => { nav('/') }}>Sign in</span>
                    </div>
                    <button onClick={() => { createAcc() }}>Create account</button>
                </div>

            </div>

            <div className="secondCol">
                <img src={imageOne} alt="" />
            </div>
        </div>
    )
}

export default SignUp
