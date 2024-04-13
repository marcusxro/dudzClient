import React, { useState, useEffect } from 'react'
import AdminSidear from '../comps/AdminSidebar'
import axios from 'axios'
import moment from 'moment'

const AdminTask = () => {
    const [infoDetails, setInfo] = useState([])
    const [toProcessData, setToProcess] = useState([])
    const [toShipData, setToShip] = useState([])
    const [toRecieveData, setToRecieved] = useState([])
    const [RecievedData, setRecieved] = useState([])

    useEffect(() => {
        axios.get('http://localhost:8080/getProduct')
            .then((res) => {
                setInfo(res.data)
                const toProcess = res.data.filter((item) => item.Destination === "To Prepare")
                const toShip = res.data.filter((item) => item.Destination === "To Ship")
                const toReceieved = res.data.filter((item) => item.Destination === "To Receive")
                const Receieved = res.data.filter((item) => item.Destination === "Received")

                setToProcess(toProcess)
                setToShip(toShip)
                setToRecieved(toReceieved)
                setRecieved(Receieved)



            }).catch((err) => {
                console.log(err)
            })

    }, [infoDetails])

    const [driverName, setDriverName] = useState('')
    const [itemIdEq, setItemEq] = useState('')
    const setTask = (itemId, Destination) => {

        axios.put(`http://localhost:8080/editProduct/${itemId}`, {
            Destination: Destination
        }).then((res) => {
            console.log(res.data.message)
        }).catch((err) => {
            console.log(err)
        })
    }

    const addDriver = (itemId, Destination) => {

        if (!driverName) {
            return alert('Please add driver')
        }

        axios.put(`http://localhost:8080/addDriver/${itemId}`, {
            Destination: Destination,
            DeliverGuy: driverName
        }).then((res) => {
            console.log(res.data.message)
            setDriverName('')
        }).catch((err) => {
            console.log(err)
        })
    }
    return (
        <div className='adminTask'>
            <AdminSidear />

            <div className="adminTaskCon">
                <header>
                    Task Management
                </header>
                <div className="taskConGrid">
                    <div className="taskCon">
                        <div className="taskConText">
                            To Process
                        </div>
                        <table>
                            <thead>
                                <tr>
                                    <th>Username</th>
                                    <th>Purchase</th>
                                    <th>Date</th>
                                    <th>Reference</th>
                                    <th>Address</th>
                                    <th>Message</th>
                                    <th>Contact</th>
                                    <th>Payment</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {toProcessData.slice().reverse().map((itm) => (
                                    <tr key={itm._id}>
                                        <td>{itm.Username}</td>
                                        <td className='itemData'>
                                            {itm.Data.map((item) => (
                                                <td>{item.itemName}</td>
                                            ))}
                                        </td>
                                        <td>{moment(new Date(parseInt(itm.Date, 10))).format('MMMM Do YYYY, h:mm')}</td>
                                        <td>{itm._id}</td>
                                        <td>{itm.Address}</td>
                                        <td>{itm.message === "" ? 'None' : itm.message}</td>
                                        <td>{itm.ContactNum}</td>
                                        <td>COD</td>
                                        <td>
                                            <button onClick={() => { setTask(itm._id, 'To Ship') }}>Approve</button>
                                        </td>
                                    </tr>
                                ))}

                            </tbody>
                        </table>
                    </div>
                    <div className="taskCon">
                        <div className="taskConText">
                            To Ship
                        </div>
                        <table>
                            <thead>
                                <tr>
                                    <th>Username</th>
                                    <th>Purchase</th>
                                    <th>Date</th>
                                    <th>Reference</th>
                                    <th>Address</th>
                                    <th>Message</th>
                                    <th>Driver</th>
                                    <th>Contact</th>
                                    <th>Payment</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {toShipData.slice().reverse().map((itm) => (
                                    <tr key={itm._id}>
                                        <td>{itm.Username}</td>
                                        <td className='itemData'>
                                            {itm.Data.map((item) => (
                                                <td>{item.itemName}</td>
                                            ))}
                                        </td>
                                        <td>{moment(new Date(parseInt(itm.Date, 10))).format('MMMM Do YYYY, h:mm')}</td>
                                        <td>{itm._id}</td>
                                        <td>{itm.Address}</td>
                                        <td>{itm.message === "" ? 'None' : itm.message}</td>
                                        <td>

                                            {itemIdEq === itm._id ?
                                                <select value={driverName} onChange={(e) => { setDriverName(e.target.value); setItemEq(itm._id) }}>
                                                    <option value="">Select Driver</option>
                                                    <option value="Driver One">Driver One</option>
                                                    <option value="Driver Two">Driver Two</option>
                                                    <option value="Driver Three">Driver Three</option>
                                                </select>
                                                :
                                                <button onClick={() => { setItemEq(itm._id) }} >Add Driver</button>
                                            }
                                       
                                        </td>
                                        <td>{itm.ContactNum}</td>
                                        <td>COD</td>
                                        <td>
                                            <button onClick={() => { addDriver(itm._id, 'To Receive'); }} >proceed</button>
                                        </td>
                                    </tr>
                                ))}

                            </tbody>
                        </table>
                    </div>
                    <div className="taskCon">
                        <div className="taskConText">
                            To Receive
                        </div>
                        <table>
                            <thead>
                                <tr>
                                    <th>Username</th>
                                    <th>Purchase</th>
                                    <th>Date</th>
                                    <th>Reference</th>
                                    <th>Address</th>
                                    <th>Message</th>
                                    <th>Driver</th>
                                    <th>Contact</th>
                                    <th>Payment</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {toRecieveData.slice().reverse().map((itm) => (
                                    <tr key={itm._id}>
                                        <td>{itm.Username}</td>
                                        <td className='itemData'>
                                            {itm.Data.map((item) => (
                                                <td>{item.itemName}</td>
                                            ))}
                                        </td>
                                        <td>{moment(new Date(parseInt(itm.Date, 10))).format('MMMM Do YYYY, h:mm')}</td>
                                        <td>{itm._id}</td>
                                        <td>{itm.Address}</td>
                                        <td>{itm.message === "" ? 'None' : itm.message}</td>
                                        <td>{itm.DeliverGuy}</td>
                                        <td>{itm.ContactNum}</td>
                                        <td>COD</td>
                                        <td>
                                            <button onClick={() => { setTask(itm._id, 'Received') }}>proceed</button>
                                        </td>
                                    </tr>
                                ))}

                            </tbody>
                        </table>
                    </div>
                    <div className="taskCon">
                        <div className="taskConText">
                            Received
                        </div>
                        <table>
                            <thead>
                                <tr>
                                    <th>Username</th>
                                    <th>Purchase</th>
                                    <th>Date</th>
                                    <th>Reference</th>
                                    <th>Address</th>
                                    <th>Message</th>
                                    <th>Contact</th>
                                    <th>Driver</th>
                                    <th>Payment</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {RecievedData.slice().reverse().map((itm) => (
                                    <tr key={itm._id}>
                                        <td>{itm.Username}</td>
                                        <td className='itemData'>
                                            {itm.Data.map((item) => (
                                                <td>{item.itemName}</td>
                                            ))}
                                        </td>
                                        <td>{moment(new Date(parseInt(itm.Date, 10))).format('MMMM Do YYYY, h:mm')}</td>
                                        <td>{itm._id}</td>
                                        <td>{itm.Address}</td>
                                        <td>{itm.message === "" ? 'None' : itm.message}</td>
                                        <td>{itm.DeliverGuy}</td>
                                        <td>{itm.ContactNum}</td>
                                        <td>COD</td>
                                        <td>
                                            <button>proceed</button>
                                        </td>
                                    </tr>
                                ))}

                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AdminTask
