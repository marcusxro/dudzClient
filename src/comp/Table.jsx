import React, { useEffect, useState } from 'react'
import AddData from './AddData'
import axios from 'axios'
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';

const Table = () => {
    const [show, setShow] = useState(false)
    const [data, setData] = useState([])

    useEffect(() => {
        axios.get('http://localhost:8080/GetData')
            .then((res) => {
                setData(res.data)
            }).catch((err) => {
                console.log(err)
            })
    }, [data])
    const [accDetails, setAcc] = useState([])


    useEffect(() => {
        axios.get('http://localhost:8080/GetAcc')
            .then((res) => {
                setAcc(res.data[0])

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
                            <div className="date">Date: {item.date}</div>
                            <div className="user">user: {item.userName} </div>

                            <div className="pos">Position: {item.Position}</div>
                        </div>
                        <table className='dataTable'>
                            <thead>
                                <tr>
                                    <th>RICE NAME</th>
                                    <th>PRICE PER KILO</th>
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
                                        <td>
                                            {rowData.productSold}
                                        </td>

                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <table className='secTable'>
                            <tbody>
                                <tr>
                                    <th>Expenses</th>
                                    <th>Total sold today</th>
                                </tr>
                                <tr>
                                    <td>
                                    {item.Expences}
                                    </td>
                                    <td>
                                        {/* Calculate the total products sold by summing up all products sold */}
                                        {item.data ? item.data.reduce((total, dataItem) => {
                                            if (dataItem) {
                                                return total + parseInt(dataItem.productSold);
                                            } else {
                                                return total;
                                            }
                                        }, 0) : 0}
                                    </td>
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