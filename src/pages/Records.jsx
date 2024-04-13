import React, { useState, useEffect, useCallback } from 'react'
import Header from '../comp/Header'
import AddDataRec from '../comp/AddDataRec'
import axios from 'axios'
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';

import { useNavigate } from 'react-router-dom'
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../auth'


import moment from 'moment';

const Records = () => {

    const [isShow, setShow] = useState(false)
    const [data, setData] = useState([])
    const [selectedIndex, setSelectedIndex] = useState(null);
    const [uid, setUid] = useState('');
    
    const unDo = useCallback(() => {
        setShow(prevState => !prevState);
    }, []); // 




    const nav = useNavigate()
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (acc) => {
            if (acc) {
                setUid(acc.uid);
            } else {
                nav('/')
            }
        });
        return () => unsubscribe();
    }, []);
    const [filteredAcc, setFil] = useState([])

    useEffect(() => {
        axios.get('http://localhost:8080/GetAcc')
            .then((res) => {
                const data = res.data; // Store the received data

                if (data.length > 0) {
                    const filteredData = data.filter((item) => item.Uid === uid);
                    if (filteredData.length > 0) {
                        setFil(filteredData[0]);
                        if (filteredAcc.isDeleted === true) {
                            alert("Your account has been deleted by owner")
                            nav('/')
                        }
                    } else {
                        console.log("No matching elements found for the given UID.");
                    }
                } else {

                    console.log("No data received from the server.");
                }
            }).catch((err) => {
                console.log(err);
            });
    }, [uid, filteredAcc]);

    useEffect(() => {
        axios.get('http://localhost:8080/GetRecords')
            .then((res) => {
                setData(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    }, [data]);




    const [imgData, setImg] = useState([])
    const [imgId, setId] = useState('')

    const getUnique = (unique) => {
        // Check if the 'unique' value is truthy (i.e., not null or undefined)
        return unique

    }

    useEffect(() => {
        axios.get('http://localhost:8080/getImg')
            .then((res) => {
                setImg(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    }, [imgData]);

    const handleEdit = (index) => {
        setSelectedIndex(index);
    };

    const handleSave = (itemId, index) => {
        setSelectedIndex(null);
    };

    const handleCancel = () => {
        setSelectedIndex(null);
    };

    const [editedData, setEditedData] = useState({ riceProd: '', Stocks: '', Price: '', StocksUsed: '', PerKilo: '', ContactNum: '', DatePur: '', DateStock: '', });

    const handleInputChange = (e, fieldName) => {
        const value = e.target.value;
        setEditedData(prevState => ({
            ...prevState,
            [fieldName]: value
        }));
    };


    const handleSaveToDb = async (itemId, index) => {
        try {
            const { riceProd, Stocks, Price, StocksUsed, PerKilo, ContactNum, DatePur, DateStock } = editedData;

            // Conditionally set DateStock based on the comparison between Stocks and StocksUsed
            const currentDate = Price >= StocksUsed ? Date.now() : '';

            console.log(Price+ " " +StocksUsed)
            const response = await axios.put(`http://localhost:8080/updateRec/${itemId}/${index}`, {
                riceProd,
                Stocks,
                Price,
                StocksUsed,
                PerKilo,
                ContactNum,
                DatePur,
                currentDate
            });

            console.log(response.data.message);
            setSelectedIndex(null);
        } catch (error) {
            console.error(error);
        }
    };


    const [isEq, setEq] = useState('')


    const handleDelete = async (itemId, index) => {
        try {
            const response = await axios.delete(`http://localhost:8080/updateRec/${itemId}/${index}`);
            const updatedData = [...data];
            updatedData.splice(index, 1);
            setData(updatedData);
        } catch (error) {
            console.error(error);
        }

    };

    return (
        <div className='RecordsCon'>
            <Header />
            <Swiper className="recCon">
                {data && data.slice().reverse().map((item) => (
                    <SwiperSlide key={item._id}>
                        <div className={`recCon  ${getUnique(item.uniqueId)} `}>
                            <div className="firstTables">
                                <div className="date">Date: <span>{moment(new Date(parseInt(item.date, 10))).format('MMMM Do YYYY, h:mm a')}</span></div>
                                <div className="pos">Position: <span>{item.Position}</span></div>
                                <div className="user">User: <span>{item.userName}</span> </div>
                                <div className="pos">Data Reference: {item._id}</div>
                            </div>
                            <table className='recTable'>
                                <thead>
                                    <tr>
                                        <th>Rice Products</th>
                                        <th>Cost per sack</th>
                                        <th>Cost per Kilo</th>
                                        <th>Stocks Quantity</th>
                                        <th>Stocks Used</th>
                                        <th>Image</th>
                                        <th>Contact Number</th>
                                        <th>Date Purchased</th>
                                        <th>Out of Stock</th>
                                        <th>Date Stock Outage</th>
                                        <th>ACTIONS</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {item.data && item.data.map((dataItem, index) => (
                                        <tr key={index}>
                                            <td>{isEq === index ?
                                                <input type="text" value={dataItem && editedData.riceProd}
                                                    onChange={(e) => handleInputChange(e, 'riceProd')} /> : dataItem && dataItem.riceProd}</td>
                                            <td>{isEq === index ?
                                                <input type="text" value={dataItem && editedData.Stocks}
                                                    onChange={(e) => handleInputChange(e, 'Stocks')} /> : dataItem && dataItem.Stocks}</td>
                                            <td>{isEq === index ?
                                                <input type="number" value={dataItem && editedData.PerKilo}
                                                    onChange={(e) => handleInputChange(e, 'PerKilo')} /> : dataItem && dataItem.PerKilo}</td>
                                            <td>{isEq === index ?
                                                <input type="text" value={dataItem && editedData.Price}
                                                    onChange={(e) => handleInputChange(e, 'Price')} /> : dataItem && dataItem.Price}</td>



                                            <td>{isEq === index ?
                                                <input type="text" value={dataItem && editedData.StocksUsed}
                                                    onChange={(e) => handleInputChange(e, 'StocksUsed')} /> : dataItem && dataItem.StocksUsed}</td>
                                            <td>
                                                {dataItem && dataItem.photoURL !== null && <div className="imageCon">
                                                    <img src={`http://localhost:8080/images/${dataItem.photoURL}`} alt="" />
                                                </div>}
                                            </td>
                                            <td>{isEq === index ?
                                                <input type="number" value={dataItem && editedData.ContactNum}
                                                    onChange={(e) => handleInputChange(e, 'ContactNum')} /> : dataItem && dataItem.ContactNum}</td>
                                            <td>{isEq === index ?
                                                <input type="date" value={dataItem && editedData.DatePur}
                                                    onChange={(e) => handleInputChange(e, 'DatePur')} /> : dataItem && dataItem.DatePur}</td>
                                            <td>
                                                {dataItem && dataItem?.Price && dataItem?.StocksUsed && parseFloat(dataItem.Price) >= parseFloat(dataItem.StocksUsed) ? "Yes" : "No"}
                                            </td>

                                            <td>{isEq === index ?
                                                <input type="date" value={dataItem && editedData.DateStock}
                                                    onChange={(e) => handleInputChange(e, 'DateStock')} /> : dataItem && dataItem.DateStock === '' ? '' : dataItem && dataItem.DateStock !== null ? moment(new Date(parseInt(dataItem.DateStock, 10))).format('MMMM Do YYYY, h:mm a') : ''}
                                            </td>
                                            <td>
                                                {isEq === index ? (
                                                    <>
                                                        <button onClick={() => { handleSaveToDb(item._id, index); setEq(null) }}>Save</button>
                                                        <button onClick={() => { setEq(null) }}> Cancel</button>
                                                    </>
                                                ) : (
                                                    <>
                                                        <button onClick={() => { setEq(index) }}>Edit</button>
                                                        <button onClick={() => { handleDelete(item._id, index) }}>Delete</button>
                                                    </>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>

            {isShow === true ? <AddDataRec unDo={unDo} /> : <></>}
            <button className='addRecord' onClick={() => { setShow(!isShow) }}>
                {isShow === true ? "x" : "+"}
            </button>
        </div>
    )
}

export default Records
