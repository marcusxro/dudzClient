import React, { useEffect, useState } from 'react'
import Sidebar from '../comps/Sidebar'
import waterCon from '../images/waterCon.jpg'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { onAuthStateChanged } from 'firebase/auth'
import { Authentication } from '../Authentication'
import moment from 'moment'
const History = () => {
    const [checkedOutItem, setCheckedOut] = useState([])

    const [uid, setUid] = useState('');
    const nav = useNavigate()

    useEffect(() => {
        const unsub = onAuthStateChanged(Authentication, (acc) => {
            if (acc) {
                setUid(acc.uid);
            } else {
                nav('/');
            }
        });
        return () => { unsub(); };
    }, []);

    const [totalPriceEl, setTotal] = useState('')
    useEffect(() => {
        axios.get('http://localhost:8080/getProduct')
            .then((res) => {
                const filteredData = res.data.filter((itm) => itm.Uid === uid)
                setCheckedOut(filteredData)
                const totalPriceCal = filteredData.reduce((accumulate, item) => accumulate + parseFloat(item.totalPrice), 0)
                setTotal(totalPriceCal)
            }).catch((err) => {
                console.log(err)
            })
    }, [checkedOutItem])



    const getClassname = (dataName) => {
        
            switch (dataName) {
                case 'Received':
                    return 'itemRecievedSuccess'
                case 'To Receive':
                    return 'itemToRecieved'
                case 'To Ship':
                    return 'itemToShip'
                case 'To Prepare':
                    return 'itemToPrepare'
            }
        
    }


    return (
        <div className='history'>
            <Sidebar />

            <div className="historyCon">
                <div className="firstHistoryText">
                    My Purchases
                </div>
                <div className="firstHistory">
                    <div className="lowerFirst">
                        <div className="icon">
                            <ion-icon name="person-outline"></ion-icon>
                        </div>
                        <div className="container">
                            {checkedOutItem.length === 0 && <div className='white'>No purchases at the moment</div>}
                            {checkedOutItem.slice().reverse().map((item) => (
                                <div className={`containerItem ${getClassname(item.Destination)}`}>
                                    <div className="firstDetails">
                                        <div className="firstItem">
                                            <img src={waterCon} alt="" />
                                        </div>
                                        <div className="itemNameCon">
                                            {item.Data.map((itm) => (
                                                <div className="productName">
                                                    {itm.itemName}
                                                </div>
                                            ))}
                                            <div className="length">
                                                {item.Data.length} <span>
                                                    {item.Data.length > 1 ?
                                                        "Items" : "item"}
                                                </span>
                                            </div>
                                            <div className="status">
                                                COD: {item.Destination}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="secDetails">
                                        ₱{item.totalPrice}
                                    </div>
                                </div>
                            ))}

                        </div>
                    </div>
                </div>

                <div className="secHistory">
                    <div className="historyItem">
                        <div className="historyItemText">
                            Transaction History
                        </div>
                        <div className="transactCon">
                            {checkedOutItem.length === 0 && "No transaction at the moment"}
                            {checkedOutItem.slice().reverse().map((item) => (
                                <div className="transactItem" key={item.id}>
                                    <div className="transactContents">
                                        Your Receipt
                                    </div>
                                    <div className="transactContent">
                                        Date: <span>{moment(new Date(parseInt(item.Date, 10))).format('MMMM Do YYYY, h:mm')}</span>
                                    </div>
                                    <div className="transactContentz">
                                        Amount: <span>₱{item.totalPrice}</span>
                                    </div>
                                    <div className="transactContentz">
                                        Reference: <span>₱{item._id}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="historyItem">
                        <div className="historyItemText">
                            Cost of all your purchase
                        </div>
                        <div className="total">
                            in total of ₱{totalPriceEl}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default History
