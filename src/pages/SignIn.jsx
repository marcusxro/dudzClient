import React, { useState, useEffect } from 'react'
import imageOne from '../images/mririwatir.jpg'
import { useNavigate } from 'react-router-dom'
import { signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth'
import { Authentication } from '../Authentication'
import { AdminAuth } from '../Authentication'
const SignIn = () => {
    const nav = useNavigate()
    const [user, setUser] = useState(null)
    const [password, setPassword] = useState('')
    const [email, setEmail] = useState('')
    const [isAdmin, setAdmin] = useState(false)
    useEffect(() => {
        const unsub = onAuthStateChanged(Authentication, (acc) => {
            if (!acc) {
                nav("/")
            } else {
                nav('/System')
            }
        })
        return () => { unsub() }
    }, [])

    useEffect(() => {
        const unsub = onAuthStateChanged(AdminAuth, (acc) => {
            if (!acc) {
                nav("/")
                setAdmin(false)
            } else {
                setAdmin(true)
            }
        })
        return () => { unsub() }
    }, [])



    const signIn = () => {
        if (password.length <= 5) {
            alert("Password should be at least 6 characters long");
            return;
        } else {
            signInWithEmailAndPassword(Authentication, email, password)
                .then((userCredential) => {
                    const user = userCredential.user;
                    setUser(user.uid);
                    console.log("WELCOME", user.email)
                    nav('/System')

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
                    Sign in
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
                    Don't have account? <span onClick={() => { nav('/Register') }}>Sign up</span>
                </div>
            </div>
        </div>
    )
}

export default SignIn
