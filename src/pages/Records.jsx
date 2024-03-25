import React, { useState, useEffect } from 'react'
import Header from '../comp/Header'
import AddDataRec from '../comp/AddDataRec'
import axios from 'axios'
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';


const Records = () => {

    const [isShow, setShow] = useState(false)
    const [data, setData] = useState([])
    const [selectedIndex, setSelectedIndex] = useState(null);


    const unDo = () => {
        setShow(!isShow)
    }

    useEffect(() => {
        axios.get('http://localhost:8080/GetRecords')
            .then((res) => {
                setData(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    }, [data]);

    const handleEdit = (index) => {
        setSelectedIndex(index);
    };

    const handleSave = (itemId, index) => {
        setSelectedIndex(null);
    };

    const handleCancel = () => {
        setSelectedIndex(null);
    };

    const [editedData, setEditedData] = useState({ riceProd: '', Stocks: '', Price: '', StocksUsed: '', Supplier: '', ContactNum: '', DatePur: '', DateStock: '', });

    const handleInputChange = (e, fieldName) => {
        const value = e.target.value;
        setEditedData(prevState => ({
            ...prevState,
            [fieldName]: value
        }));
    };


    const handleSaveToDb = async (itemId, index) => {
        try {
            const { riceProd, Stocks, Price, StocksUsed, Supplier, ContactNum, DatePur, DateStock } = editedData;
            const response = await axios.put(`http://localhost:8080/updateRec/${itemId}/${index}`, {
                riceProd,
                Stocks,
                Price,
                StocksUsed,
                Supplier,
                ContactNum,
                DatePur,
                DateStock
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
                {data.slice().reverse().map((item) => (
                    <SwiperSlide key={item._id}>
                        <div className="recCon">
                            <div className="firstTables">
                                <div className="date">Date: <span>{item.date}</span></div>
                                <div className="pos">Position: <span>{item.Position}</span></div>
                                <div className="user">user: <span>{item.userName}</span> </div>
                            </div>
                            <table className='recTable'>
                                <thead>
                                    <tr>
                                        <th>Rice Products</th>
                                        <th>Stocks</th>
                                        <th>Price</th>
                                        <th>Stocks used</th>
                                        <th>Supplier</th>
                                        <th>Contact Number</th>
                                        <th>Date Purchased</th>
                                        <th>Date Stockout</th>
                                        <th>ACTIONS</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {item.data.map((dataItem, index) => (
                                        <tr key={index}>
                                            <td>{isEq === index ?
                                                <input type="text" value={editedData.riceProd}
                                                    onChange={(e) => handleInputChange(e, 'riceProd')} /> : dataItem && dataItem.riceProd}</td>
                                            <td>{isEq === index ?
                                                <input type="text" value={editedData.Stocks}
                                                    onChange={(e) => handleInputChange(e, 'Stocks')} /> : dataItem && dataItem.Stocks}</td>
                                            <td>{isEq === index ?
                                                <input type="number" value={editedData.Price}
                                                    onChange={(e) => handleInputChange(e, 'Price')} /> : dataItem && dataItem.Price}</td>
                                            <td>{isEq === index ?
                                                <input type="text" value={editedData.StocksUsed}
                                                    onChange={(e) => handleInputChange(e, 'StocksUsed')} /> : dataItem && dataItem.StocksUsed}</td>
                                            <td>{isEq === index ?
                                                <input type="text" value={editedData.Supplier}
                                                    onChange={(e) => handleInputChange(e, 'Supplier')} /> : dataItem && dataItem.Supplier}</td>
                                            <td>{isEq === index ?
                                                <input type="number" value={editedData.ContactNum}
                                                    onChange={(e) => handleInputChange(e, 'ContactNum')} /> : dataItem && dataItem.ContactNum}</td>
                                            <td>{isEq === index ?
                                                <input type="date" value={editedData.DatePur}
                                                    onChange={(e) => handleInputChange(e, 'DatePur')} /> : dataItem && dataItem.DatePur}</td>
                                            <td>{isEq === index ?
                                                <input type="date" value={editedData.DateStock}
                                                    onChange={(e) => handleInputChange(e, 'DateStock')} /> : dataItem && dataItem.DateStock}</td>
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
                {isShow === true ? "Close modal" : "Add record"}
            </button>
        </div>
    )
}

export default Records
