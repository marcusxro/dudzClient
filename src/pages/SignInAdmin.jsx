import React, { useState, useEffect } from 'react'
import imageOne from '../images/mririwatir.jpg'
import { useNavigate } from 'react-router-dom'
import { AdminAuth } from '../Authentication'
import { signInWithEmailAndPassword } from 'firebase/auth'

const SignInAdmin = () => {
    const nav = useNavigate()
    const [user, setUser] = useState(null)
    const [password, setPassword] = useState('')
    const [email, setEmail] = useState('')




    const signIn = () => {
        if (password.length <= 5) {
            alert("Password should be at least 6 characters long");
            return;
        } else {
            signInWithEmailAndPassword(AdminAuth, email, password)
                .then((userCredential) => {
                    const user = userCredential.user;
                    setUser(user.uid);
                    console.log("WELCOME", user.email)
                    nav('/System/AdminSystem')

                }).catch((err) => {
                    if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/too-many-requests' || err.code === 'auth/invalid-credential') {
                        alert("user not found")

                    } else {
                        console.error('Authentication error:', err);
                    }
                });
        }

    }

    return (
        <div className='signUp'>
            <div className="absoBg">
                <img src={imageOne} alt="" />
            </div>

            <div className="signInContent">
                <div className="signInText">
                    Admin
                </div>
                <input
                    value={email} onChange={(e) => { setEmail(e.target.value) }}
                    required
                    type="email" placeholder='Enter your email' />
                <input
                    value={password} onChange={(e) => { setPassword(e.target.value) }}
                    required
                    type="password" placeholder='Enter your password' />
                <div className="forgot">
                    Don't remember your password? <span onClick={() => { nav('/ForgotPassword') }}>go here!</span>
                </div>
                <button onClick={() => { signIn() }}>Sign in</button>
                <div className="navis">
                   Navigate back to <span onClick={() => { nav('/') }}>Customer side</span>
                </div>
                <div className="adminNav">
                    Sign in as <span>admin</span>
                </div>
            </div>
        </div>
    )
}

export default SignInAdmin
