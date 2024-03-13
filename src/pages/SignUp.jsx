import React, { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../auth'
import axios from 'axios'

const SignUp = () => {
    const nav = useNavigate()
    const [email, setEmail] = useState('')
    const [password, setPass] = useState('')
    const [position, setPos] = useState('')
    const [error, setError] = useState('')  
    const [uid, setUid] = useState('')
    document.title = "DUDZCHAMCHOI | Sign Up"
    const RegisterAccount = (e) => {
        e.preventDefault()
          if(password.length === 0 && email.length === 0) {
            alert("please type something")
            return
        }else if (password.length < 5) {
            alert("make it 6 or more longer!")
            return
        }
         else {
            createUserWithEmailAndPassword(auth, email, password)
                .then((acc) => {
                    console.log(acc)
                    setUid(acc.user.uid)
                    axios.post('http://localhost:8080/SendAcc', {
                        Email: email,
                        Password: password,
                        position: position,
                        Uid: acc.user.uid
                    }).then(() => {
                        console.log("acc details sent")
                        setEmail('')
                        setPass('')
                        setPos('')
                    }).catch((err) => {
                        console.log(err)
                    })
                }).catch((err) => {
                    if (err.code === 'auth/email-already-in-use') {
                        setError(err.errFour);
                    } else {
                        console.error('Error:', err.message);
                    }
                })
        }
    }

    const passEl = useRef()
    const [click,  setClick] = useState(0)

    const seePass = () => {
        passEl.current.type = "text"
        setClick(click + 1)

        if(click === 1) {
            passEl.current.type = "password"
            setClick(0)
        }
    }

    return (
        <div className='signUpCon'>
            {error}
            <form action="submit" onSubmit={RegisterAccount}>
                <div className="signUpText">
                    Sign up
                </div>
                <input type="email" required placeholder='Enter your email' value={email} onChange={(e) => { setEmail(e.target.value) }} />
                <input type="password" ref={passEl} required placeholder='Enter your password' value={password} onChange={(e) => { setPass(e.target.value) }} />
                <div className="forgotCon">
                    <input onClick={() => {seePass()}} type="checkbox" name="check" id="" />
                    <label htmlFor="check">Show password</label>
                </div>
                <select required name="" id="" value={position} onChange={(e) => { setPos(e.target.value) }}>
                    <option value="">Choose your position</option>
                    <option value="Owner">Owner</option>
                    <option value="Employee">Employee</option>
                </select>
                <button>Create account</button>
            </form>
            <div className="already">
                Already have account? <span onClick={() => { nav('/') }}>Sign in here</span>
            </div>
        </div>
    )
}

export default SignUp