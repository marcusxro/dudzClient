import React, { useEffect, useState } from 'react'
import logo from '../images/logo.jpg'
import axios from 'axios'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { Authentication } from '../Authentication'
import { useNavigate } from 'react-router-dom'
import { AdminAuth } from '../Authentication'

const AdminSidear = () => {
    const nav = useNavigate('')

    const [data, setData] = useState([])
    const [uid, setUid] = useState('')

    useEffect(() => {
        axios.get('http://localhost:8080/GetAcc')
            .then((res) => {
                const filteredData = res.data.filter((item) => item.Uid === uid)
                setData(filteredData)
            }).catch((err) => {
                console.log(err)
            })

    }, [data])

    useEffect(() => {
        const unsub = onAuthStateChanged(AdminAuth, (acc) => {
            if (acc) {
                setUid(acc.uid)
                console.log(uid)

            }
        })
        return () => { unsub() }
    }, [uid])


    const signOutAcc = () => {
        signOut(AdminAuth)
            .then(() => {
                console.log("completed")
                nav('/')
            }).catch((err) => {
                console.log(err)
            })
    }


    return (
        <div className='SidebarCon'>
            <div className="upperLogo">
                <img src={logo} alt="" />
            </div>
            <div className="accName">
                ADMIN
            </div>

            <header>
                <div className="itemHeader" onClick={() => { nav('/admin/adminsystem') }}>
                    <span><ion-icon name="bag-handle-outline"></ion-icon></span>   Dashboard
                </div>
                <div className="itemHeader" onClick={() => { nav('/admin/AdminTask') }}>
                    <span><ion-icon name="person-outline"></ion-icon></span>  Task
                </div>
                <div className="itemHeader" onClick={() => { nav('/admin/AdminInbox') }}>
                    <span><ion-icon name="chatbubble-ellipses-outline"></ion-icon></span>   Inbox
                </div>
            </header>

            <div className="logout" onClick={signOutAcc}>
                <span><ion-icon name="log-out-outline"></ion-icon></span>  Log out
            </div>
        </div>
    )
}

export default AdminSidear
