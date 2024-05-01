import React, { useEffect, useState } from 'react'
import Sidebar from '../comps/Sidebar'
import { onAuthStateChanged } from 'firebase/auth'
import { Authentication } from '../Authentication'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import moment from 'moment'

const Profile = () => {
    const nav = useNavigate('')
    const [data, setData] = useState([])
    const [uid, setUid] = useState('')

    useEffect(() => {
        const unsub = onAuthStateChanged(Authentication, (acc) => {
            if (acc) {
                setUid(acc.uid)
                console.log(uid)
            } else {
                nav('/')
            }
        })
        return () => { unsub() }
    }, [uid])



    useEffect(() => {
        axios.get('http://localhost:8080/GetAcc')
            .then((res) => {
                const filteredData = res.data.filter((item) => item.Uid === uid)
                setData(filteredData[0])
            }).catch((err) => {
                console.log(err)
            })

    }, [data, uid])

    const [isEdit, setEdit] = useState(false)
    const [userName, setUsername] = useState('')
    const [Address, setAddress] = useState('')
    const [ContactNo, setContactNo] = useState('')



    const getVal = (user, addrss, cntc) => {
        setUsername(user);
        setAddress(addrss ? addrss : "");
        setContactNo(cntc ? cntc : "");
    }

    const [infoDetails, setInfo] = useState([])

    useEffect(() => {
        axios.get('http://localhost:8080/GetInfo')
            .then((res) => {
                const filteredData = res.data.filter((item) => item.Uid === uid)
                setInfo(filteredData[0])
            }).catch((err) => {
                console.log(err)
            })

    }, [infoDetails, data])

    const sendInfo = () => {
        axios.put(` http://localhost:8080/ChangeName/${uid}`, {
            Username: userName,
            Address: Address,
            Contact: ContactNo,
        }).then(() => {
            console.log("details senst")
        }).catch((err) => {
            console.log(err)
        })
    }
    const [checkedOutItem, setCheckedOut] = useState([])
    const [toPrep, setToPrep] = useState([])
    const [toShip, setToShip] = useState([])
    const [toRec, setToRec] = useState([])
    const [Recieved, setRecieved] = useState([])
    
    useEffect(() => {
        axios.get('http://localhost:8080/getProduct')
            .then((res) => {
                const filteredData = res.data.filter((itm) => itm.Uid === uid)
                setCheckedOut(filteredData)
                const filteredToPrep = filteredData.filter((itm) => itm.Destination === "To Prepare")
                const filteredToShip = filteredData.filter((itm) => itm.Destination === "To Ship")
                const filteredToRec = filteredData.filter((itm) => itm.Destination === "To Receive")
                const filteredRecieved = filteredData.filter((itm) => itm.Destination === "Received")
                setToPrep(filteredToPrep)
                setToShip(filteredToShip)
                setToRec(filteredToRec)
                setRecieved(filteredRecieved)
            }).catch((err) => {
                console.log(err)
            })
    }, [checkedOutItem])

    const cancelItem = (itemId) => {
        axios.put(`http://localhost:8080/editProduct/${itemId}`, {
            Destination: "cancelled"
        }).then(() => {
            console.log("cancelled")
        }).catch((err) => {
            console.log(err)
        })
    }
    return (
        <div className='profileCon'>
            <Sidebar />

            <div className="profileContent">
                <div className="upperProfile">

                    <div className="firstCon">
                        <div className="contactImg">
                            <ion-icon name="person-outline"></ion-icon>
                        </div>

                        {isEdit === true ? (
                            <div className="userName">
                                <input type="text" placeholder='Edit your Username' value={userName} onChange={(e) => { setUsername(e.target.value) }} />
                            </div>
                        ) : (
                            <div className="userName">
                                {data ? data.Username : "loading"}
                            </div>
                        )
                        }
                    </div>


                    {isEdit === true ? (

                        <div className="secondCon">
                            <input type="text" placeholder='Add Address' value={Address} onChange={(e) => { setAddress(e.target.value) }} />
                            <input type="number" placeholder='Add Contact number' value={ContactNo} onChange={(e) => { setContactNo(e.target.value) }} />
                        </div>
                    ) : (

                        <div className="secondCon">
                            <div className="Address">
                                Address: <span>{data ? data.Address : "No Address"}</span>
                            </div>
                            <div className="Address">
                                Contact No: <span>{data ? data.Contact : "No Contact Number"}</span>
                            </div>
                        </div>
                    )}


                    {isEdit === true ? (
                        <div className="absoCon">
                            <div className="absoBtns green" onClick={() => { setEdit(!isEdit); sendInfo() }}>
                                <ion-icon name="create-outline"></ion-icon>
                            </div>
                            <div className="absoBtns red" onClick={() => { setEdit(!isEdit) }}>
                                <ion-icon name="close-circle-outline"></ion-icon>
                            </div>
                        </div>

                    ) : (

                        (data &&
                            <div className="absoBtn" onClick={() => {
                                setEdit(!isEdit);
                                getVal(data.Username,
                                    data ? data.Address : "",
                                    data ? data.Contact : "")
                            }}>
                                <ion-icon name="create-outline"></ion-icon>
                            </div>
                        )

                    )}
                </div>


                <div className="lowerContent">

                    <div className="lowerItem">
                        <div className="method">
                            <span><ion-icon name="wallet-outline"></ion-icon></span>
                            <span>To pay</span>
                        </div>
                        <div className="itemBody">
                            {toPrep.length === 0 && "you have no items"}
                            {toPrep.slice().reverse().map((item) => (
                                <div className="itemBodyItem" key={item._id}>
                                    <div className="itemFirsts">
                                        <div className="toPrepItem">
                                            Items Ordered:
                                            {item.Data.map((itm) => (
                                                <div className="gallons">
                                                    {itm.itemName}
                                                </div>
                                            ))}
                                        </div>
                                        <div className="toPrepItem">
                                            Quantity: {item.Data.length}
                                        </div>
                                        <div className="toPrepItem">
                                        Status: {item.Destination}
                                        </div>
                                        Date Ordered: <span>{moment(new Date(parseInt(item.Date, 10))).format('MMMM Do YYYY, h:mm')}</span>
                                        <div className="toPrepItem">
                                            Total prize: ₱{item.totalPrice}
                                        </div>
                                        <button onClick={() => { cancelItem(item._id) }}>Cancel</button>
                                    </div>
                                </div>
                            ))}
                        </div>

                    </div>

                    <div className="lowerItem">
                        <div className="method">
                            <span><ion-icon name="water-outline"></ion-icon></span>
                            <span>To ship</span>
                        </div>
                        <div className="itemBody">
                            {toShip.length === 0 && "No items to be ship yet"}
                            {toShip.slice().reverse().map((item) => (
                                <div className="itemBodyItem" key={item._id}>
                                    <div className="itemFirsts">
                                        <div className="toPrepItem">
                                            Items Ordered:
                                            {item.Data.map((itm) => (
                                                <div className="gallons">
                                                    {itm.itemName}
                                                </div>
                                            ))}
                                        </div>
                                        <div className="toPrepItem">
                                            Quantity: {item.Data.length}
                                        </div>
                                        <div className="toPrepItem">
                                        Status: {item.Destination}
                                        </div>
                                        Date: Ordered <span>{moment(new Date(parseInt(item.Date, 10))).format('MMMM Do YYYY, h:mm')}</span>
                                        <div className="toPrepItem">
                                            Total prize: ₱{item.totalPrice}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                    </div>


                    <div className="lowerItem">
                        <div className="method">
                            <span><ion-icon name="car-outline"></ion-icon></span>
                            <span>To receive</span>
                        </div>
                        <div className="itemBody">
                            {toRec.length === 0 && "No items to be recieve yet"}
                            {toRec.slice().reverse().map((item) => (
                                <div className="itemBodyItem" key={item._id}>
                                    <div className="itemFirsts">
                                        <div className="toPrepItem">
                                            Items Ordered:
                                            {item.Data.map((itm) => (
                                                <div className="gallons">
                                                    {itm.itemName}
                                                </div>
                                            ))}
                                        </div>
                                        <div className="toPrepItem">
                                            Quantity: {item.Data.length}
                                        </div>
                                        <div className="toPrepItem">
                                        Status: {item.Destination}
                                        </div>
                                        <div className="toPrepItem">
                                        Driver: {item.DeliverGuy}
                                        </div>
                                        Date Ordered: <span>{moment(new Date(parseInt(item.Date, 10))).format('MMMM Do YYYY, h:mm')}</span>
                                        <div className="toPrepItem">
                                            Total prize: ₱{item.totalPrice}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="lowerItem">
                        <div className="method">
                            <ion-icon name="checkmark-done-circle-outline"></ion-icon>
                            <span>Recieved</span>
                        </div>
                        <div className="itemBody">
                            {Recieved.length === 0 && "No recieved items yet"}
                            {Recieved.slice().reverse().map((item) => (
                                <div className="itemBodyItem" key={item._id}>
                                    <div className="itemFirsts">
                                        <div className="toPrepItem">
                                            Items Ordered:
                                            {item.Data.map((itm) => (
                                                <div className="gallons">
                                                    {itm.itemName}
                                                </div>
                                            ))}
                                        </div>
                                        <div className="toPrepItem">
                                            Quantity: {item.Data.length}
                                        </div>
                                        <div className="toPrepItem">
                                        Driver: {item.DeliverGuy}
                                        </div>
                                        <div className="toPrepItem">
                                        Status: {item.Destination}
                                        </div>
                                        Date: Ordered <span>{moment(new Date(parseInt(item.Date, 10))).format('MMMM Do YYYY, h:mm')}</span>
                                        <div className="toPrepItem">
                                            Total prize: ₱{item.totalPrice}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                    </div>


                </div>
            </div>

        </div>
    )
}

export default Profile
