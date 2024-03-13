import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Logout from './Logout'
const Header = () => {
    const nav = useNavigate()
    return (
        <header>
            <div className="logo">
                Logo
            </div>
            <div className="midCon">
                <div className='btns' onClick={() => {nav('/system')}}>
                    Inventory
                </div>
                <div className='btns' onClick={() => {nav('/filemaintenance')}}>
                    File Maintenance
                </div>
            </div>
            <div className="logOutCon">
                <Logout />
            </div>
        </header>
    )
}

export default Header