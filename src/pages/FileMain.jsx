import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import Header from '../comp/Header';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../auth';
import { useNavigate } from 'react-router-dom';

const FileMain = () => {
    const [data, setData] = useState([]);
    const [accDetails, setAcc] = useState([]);
    const [email, setEmail] = useState('');
    const [uid, setUid] = useState('');
    const [filtered, setFil] = useState([]);
    const [selectedIndex, setSelectedIndex] = useState(null);
    const [editedData, setEditedData] = useState({});
    const nav = useNavigate()
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (acc) => {
            if (acc) {
                setEmail(acc.email);
                setUid(acc.uid);
            } else {
                nav('/')
            }
        });
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        axios.get('http://localhost:8080/GetAcc')
            .then((res) => {
                // Ensure that res.data is defined and contains elements
                if (res.data && res.data.length > 0) {
                    setAcc(res.data[0]);
                    const filteredData = res.data.filter((item) => item.Uid === uid);
                    if (filteredData.length > 0) {
                        setFil(filteredData[0]);
                    } else {
                        console.log("No matching elements found for the given UID.");
                    }
                } else {
                    // Handle the case where res.data is empty
                    console.log("No data received from the server.");
                }
            })
            .catch((err) => {
                console.log(err);
            });
    }, [uid]);
    

    useEffect(() => {
        axios.get('http://localhost:8080/GetData')
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

    const handleInputChange = (e, fieldName) => {
        const value = e.target.value;
        setEditedData(prevState => ({
            ...prevState,
            [fieldName]: value
        }));
    };

    const handleSaveToDb = async (itemId, index) => {
        try {
            const { riceName, pricePerKilo, productSold } = editedData;
            const response = await axios.put(`http://localhost:8080/update/${itemId}/${index}`, {
                riceName,
                pricePerKilo,
                productSold
            });
            console.log(response.data.message);
            setSelectedIndex(null);
        } catch (error) {
            console.error(error);
        }
    };

    const handleDelete = async (itemId, index) => {
        try {
            const response = await axios.delete(`http://localhost:8080/delete/${itemId}/${index}`);
            const updatedData = [...data];
            updatedData.splice(index, 1);
            setData(updatedData);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className='TableCon'>
            <Header />
            {filtered.position !== "Owner" ? (
                <div className='notAllowed'>You are not allowed here!</div>
            ) : (
                <Swiper>
                    {data.slice().reverse().map((item) => (
                        <SwiperSlide key={item._id}>
                            <div className="firstTable">
                                <div className="tableName">DUDZCHAMCHOI INVENTORY</div>
                                <div className="date">Date: {item.date}</div>
                                <div className="user">user: {item.userName} </div>
                                <div className="pos">Position: {item.Position}</div>
                            </div>
                            <table className='firstTableCon'>
                                <thead>
                                    <tr>
                                        <th>RICE NAME</th>
                                        <th>PRICE PER KILO</th>
                                        <th>PRODUCT SOLD</th>
                                        <th>ACTIONS</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {item.data.map((rowData, index) => (
                                        <tr key={index}>
                                            <td>
                                                {rowData && index === selectedIndex ? (
                                                    <input
                                                        value={editedData.riceName || rowData.riceName}
                                                        onChange={(e) => handleInputChange(e, 'riceName')}
                                                    />
                                                ) : (
                                                    rowData && rowData.riceName
                                                )}
                                            </td>

                                            <td>
                                                {rowData && index === selectedIndex ? (
                                                    <input
                                                        value={editedData.pricePerKilo || rowData.pricePerKilo}
                                                        onChange={(e) => handleInputChange(e, 'pricePerKilo')}
                                                    />
                                                ) : (
                                                    rowData && rowData.pricePerKilo
                                                )}
                                            </td>

                                            <td>
                                                {rowData && index === selectedIndex ? (
                                                    <input
                                                        value={editedData.productSold || rowData.productSold}
                                                        onChange={(e) => handleInputChange(e, 'productSold')}
                                                    />
                                                ) : (
                                                    rowData && rowData.productSold
                                                )}
                                            </td>
                                            <td>
                                                {rowData && index === selectedIndex ? (
                                                    <>
                                                        <button
                                                            onClick={() => {
                                                                handleSave(item._id, index);
                                                                handleSaveToDb(item._id, index);
                                                            }}
                                                        >
                                                            SAVE
                                                        </button>
                                                        <button onClick={() => handleCancel()}>CANCEL</button>
                                                    </>
                                                ) : (
                                                    <>
                                                        <button onClick={() => handleEdit(index)}>EDIT</button>
                                                        <button onClick={() => handleDelete(item._id, index)}>DELETE</button>
                                                    </>
                                                )}
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
            )}
        </div>
    );
};

export default FileMain;
