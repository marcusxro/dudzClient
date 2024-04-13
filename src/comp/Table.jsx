import React, { useEffect, useState } from 'react'
import AddData from './AddData'
import axios from 'axios'
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../auth';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';

const Table = () => {
    const [show, setShow] = useState(false)
    const [data, setData] = useState([])
    const [uid, setUid] = useState('');
    const nav = useNavigate()
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (acc) => {
            if (acc) {
                setUid(acc.uid);
            }
        });
        return () => unsubscribe();
    }, [data]);

    const [userName, setUserName] = useState([])

    useEffect(() => {
        axios.get('http://localhost:8080/GetData')
            .then((res) => {
                setData(res.data);
            }).catch((err) => {
                console.log(err);
            });
    }, [data]); // Depend on uid instead of data

    const [accDetails, setAcc] = useState({});



    useEffect(() => {
        axios.get('http://localhost:8080/GetAcc')
            .then((res) => {
                setAcc(res.data[0])
                const filteredAcc = res.data.filter((item) => item.Uid === uid);
                setUserName(filteredAcc[0]);
                if(userName.isDeleted) {
                    alert("Your account has been deleted by owner")
                    nav('/')
                }
            }).catch((err) => {
                console.log(err)
            })
    }, [accDetails])


    const showModal = () => {
        setShow(!show)
    }
    return (
        <div className='TableCon'>
            <Swiper>
                {data.slice().reverse().map((item) => (
                    <SwiperSlide key={item._id}>
                        <div className="firstTable">
                            <div className="tableName">DUDZCHAMCHOI INVENTORY</div>
                            <div className="date">Date: {moment(new Date(parseInt(item.date, 10))).format('MMMM Do YYYY, h:mm a')}</div>
                            <div className="user">User: {item.userName} </div>
                            <div className="pos">Position: {item.Position}</div>
                            <div className="pos">Data Reference: {item._id}</div>
                        </div>
                        <table className='dataTable'>
                            <thead>
                                <tr>
                                    <th>RICE NAME</th>
                                    <th>PRICE PER KILO</th>
                                    <th>PRODUCT QUANTITY</th>
                                    <th>PRODUCT SOLD</th>

                                </tr>
                            </thead>
                            <tbody>
                                {item.data.map((rowData, index) => (
                                    <tr key={index}>
                                        <td>
                                            {rowData.riceName}
                                        </td>
                                        <td>
                                            {rowData.pricePerKilo}
                                        </td>
                                        <td> {rowData.productQuantity}</td>
                                        <td>
                                            {(parseFloat(rowData.pricePerKilo) * parseFloat(rowData.productQuantity)).toLocaleString('en-PH', { style: 'currency', currency: 'PHP' })}

                                        </td>
                                    </tr>
                                ))}

                            </tbody>
                            <tbody>
                                <tr>
                                    <td>Total sales</td>
                                    <td>
                                        {item.data &&
                                            item.data.reduce((total, dataItem) => total + parseFloat(dataItem.pricePerKilo || 0), 0)
                                                .toLocaleString('en-PH', { style: 'currency', currency: 'PHP' })
                                        }
                                    </td>
                                    <td>
                                        {
                                            item.data &&
                                            item.data.reduce((total, data) =>
                                                total + parseFloat(data.productQuantity || 0), 0)
                                                .toLocaleString('en-PH', { style: 'currency', currency: 'PHP' })
                                        }
                                    </td>
                                    <td>
                                        {
                                            item.data &&
                                            item.data.reduce((total, data) =>
                                                total + (parseFloat(data.pricePerKilo) * parseFloat(data.productQuantity) || 0), 0)
                                                .toLocaleString('en-PH', { style: 'currency', currency: 'PHP' })
                                        }
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <table className='secTable'>
                            <tbody>
                                <tr className='shorts'>
                                    <th>Expenses</th>
                                    <th>Total sales today</th>
                                </tr>

                                <tr>
                                    <td>
                                        {item.Expences.filter((itm) => itm !== null).map((items, index) => (
                                            <tr key={index}>
                                                <td>
                                                    <div className="itemExpence">
                                                        <div className="firstEx">
                                                            {items.expence ? items.expence : 'No expense recorded'} {/* Check if items.expence exists */}
                                                        </div>
                                                        <div className="expenceVal">
                                                            {items.expenceVal ? items.expenceVal : 'No expense value'}
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}

                                    </td>
                                    <tr>
                                        <div>
                                            {
                                                (!item.Expences || item.Expences.length === 0) ? (
                                                    (item.data ? item.data.reduce((total, dataItem) => {
                                                        if (dataItem) {
                                                            return total + parseFloat(dataItem.pricePerKilo);
                                                        } else {
                                                            return total;
                                                        }
                                                    }, 0) : 0).toLocaleString('en-PH', { style: 'currency', currency: 'PHP' })
                                                ) : (
                                                    (item.Expences && item.Expences.length > 0) ? (
                                                        item.Expences.reduce((total, expenseItem) => {
                                                            if (expenseItem && expenseItem.expenceVal !== null && expenseItem.expenceVal !== undefined) {
                                                                return total + parseFloat(expenseItem.expenceVal);
                                                            }
                                                            return total;
                                                        }, 0) - (item.data ? item.data.reduce((total, dataItem) => {
                                                            if (dataItem) {
                                                                return total + parseFloat(dataItem.pricePerKilo * dataItem.productQuantity || 0);
                                                            } else {
                                                                return total;
                                                            }
                                                        }, 0) : 0)
                                                    ).toLocaleString('en-PH', { style: 'currency', currency: 'PHP' })
                                                        : (
                                                            item.data ? (
                                                                item.data.reduce((total, dataItem) => {
                                                                    return total + parseFloat(dataItem.pricePerKilo || 0);
                                                                }, 0)
                                                            ) : 0
                                                        )
                                                )
                                            }
                                        </div>


                                    </tr>
                                </tr>



                            </tbody>

                        </table>
                    </SwiperSlide>
                ))}
            </Swiper>
            {show ? <AddData showModal={showModal} /> : <></>}
            <div className="addDataButton" onClick={() => { setShow(!show) }}>
                <button>Add Data</button>
            </div>
        </div>
    )
}

export default Table