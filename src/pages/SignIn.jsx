import React, { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../auth'
import axios from 'axios'
import BgShop from '../imgs/Bg.jpg'

const SignIn = () => {
    const nav = useNavigate()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    document.title = "DUDZCHAMCHOI | Sign in"


    const signIn = (e) => {
        e.preventDefault()
        if (password.length === 0 && email.length === 0) {
            alert("Please type something");
            return;
        } else if (password.length <= 5) {
            alert("Password should be at least 6 characters long");
            return;
        }
        else {
            signInWithEmailAndPassword(auth, email, password)
                .then((user) => {
                    console.log("user logged in", user)
                    console.log(user.user.uid)
                    axios.put(`http://localhost:8080/LoginDate/${user.user.uid}`, {
                        LogIn: Date.now()
                    }).then(() => {
                        console.log('logged in!')
                        nav('/Home')
                    }).catch((err) => {
                        console.log(err)
                    })
                }).catch((err) => {
                    console.log(err)
                    setError("user not found")
                })
        }

    }

    const passEl = useRef()
    const [click, setClick] = useState(0)

    const seePass = () => {
        passEl.current.type = "text"
        setClick(click + 1)

        if (click === 1) {
            passEl.current.type = "password"
            setClick(0)
        }
    }

    return (
        <div className='signInCon'>
            <div className="sideImg">
                <img src={BgShop} alt="" />
            </div>
            <form action="submit" onSubmit={signIn}>
                <div className="signInText">
                    Sign in
                </div>
                {error}
                <input required type="text" placeholder='Enter your email' value={email} onChange={(e) => { setEmail(e.target.value) }} />
                <input ref={passEl} required type="password" placeholder='Enter your password' value={password} onChange={(e) => { setPassword(e.target.value) }} />
                <div className="bottom">

                    <div className="forgotCons">
                        forgot password? <span onClick={() => { nav('/Forgot') }}> click here!</span>
                    </div>
                </div>
                <button>Sign in</button>
                <div className="bottomNav">
                    Don't have account? <span onClick={() => { nav('/SignUp') }}>Sign up here!</span>
                </div>
            </form>
        </div>
    )
}

export default SignIn