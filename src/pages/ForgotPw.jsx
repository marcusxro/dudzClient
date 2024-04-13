import React, {useState} from 'react'
import imageOne from '../images/mririwatir.jpg'
import { useNavigate } from 'react-router-dom'
import { sendPasswordResetEmail } from 'firebase/auth';
import { Authentication } from '../Authentication';


const ForgotPw = () => {


    const nav = useNavigate()
    const [email, setEmail] = useState('');

    const resetPassword = () => {

        sendPasswordResetEmail(Authentication, email)
            .then(() => {
                setEmail('')
                alert("Verification sent!")
                console.log("DONE!")
            })
            .catch((error) => {
                if (error.code === 'auth/user-not-found') {
                    alert('User does not exist');
                    setEmail('')
                } else {
                    alert('There is some error');
                }
            });
    };

    return (
        <div className='forgotCon'>
            <div className="absoBg">
                <img src={imageOne} alt="" />
            </div>
            <div className="forgotContent">
                <div className="forgotText">
                    Forgot Password
                </div>
                <div className="forgotForm">
                    <input
                    value={email} onChange={(e) => {setEmail(e.target.value)}}
                    type="email" placeholder='Enter your email' />
                    <button onClick={() => {resetPassword()}}>Send verification</button>
                </div>
                <div className="goTo">
                    Go back to <span onClick={() => {nav('/')}}>Sign in</span>
                </div>

            </div>
        </div>
    )
}

export default ForgotPw
