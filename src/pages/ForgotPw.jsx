import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../auth';


const ForgotPw = () => {
    const [email, setEmail] = useState('')
    document.title = "DUDZCHAMCHOI | Forgot Password"
    const resetPassword = (e) => {
        e.preventDefault()
        sendPasswordResetEmail(auth, email)
            .then(() => {
                console.log("sent")
                setEmail('')
                alert('Verification sent! check your email')
            })
            .catch((error) => {
                console.log(error)
            });
    };

    const nav = useNavigate()
    return (
        <div className='forgotPwCon'>
            <form action="submit" onSubmit={resetPassword}>
                <div className="forgotText">
                    Forgot password
                </div>
                <input type="email" required placeholder='Enter your email' value={email} onChange={(e) => {setEmail(e.target.value)}} />
                <button>Send verification</button>
            </form>
            <div className="forgotBot">
                Go back to <span onClick={() => {nav('/')}}>Sign in</span>
            </div>
        </div>
    )
}

export default ForgotPw