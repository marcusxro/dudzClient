import { onAuthStateChanged } from 'firebase/auth'
import React, { useEffect, useState } from 'react'
import { auth } from '../auth'
import { useNavigate } from 'react-router-dom'
import Header from '../comp/Header'
import Table from '../comp/Table'
const System = () => {
    const nav = useNavigate()
    const [email, setEmail] = useState()
    document.title = "DUDZCHAMCHOI | System"
    useEffect(() => {
        const Iden = onAuthStateChanged(auth, (acc) => {
            if(acc) {
                setEmail(acc.email)
            } else {
                nav('/')
            }
        })
        return () => {Iden()}
    }, [email])


  return (
    <div className='systemCon'>
        <Header />
        <Table />
    </div>
  )
}

export default System