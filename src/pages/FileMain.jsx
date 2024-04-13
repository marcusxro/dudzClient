import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import Header from '../comp/Header';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../auth';
import { useNavigate } from 'react-router-dom';
import moment from 'moment'

const FileMain = () => {
    const [data, setData] = useState([]);
    const [accDetails, setAcc] = useState([]);
    const [email, setEmail] = useState('');
    const [uid, setUid] = useState('');
    const [filtered, setFil] = useState([]);
    const [selectedIndex, setSelectedIndex] = useState(null);
    const [editedData, setEditedData] = useState({ expence: '' });



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
                        console.log(filteredData)
                        if (filtered.isDeleted === true) {
                            alert("Your account has been deleted by owner")
                            nav('/')
                        }
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
    }, [uid, filtered]);


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
            const { riceName, pricePerKilo, productQuantity } = editedData;

            const response = await axios.put(`http://localhost:8080/update/${itemId}/${index}`, {
                riceName,
                pricePerKilo,
                productQuantity
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


    const [isEditExp, setEditEx] = useState('')

    const [editedEx, setEditedEx] = useState('')
    const [editedVal, setEditedVal] = useState('')

    const getVal = (expencesName, expencesValue) => {
        setEditedEx(expencesName)
        setEditedVal(expencesValue)
    }
    const handleEditExpense = async (itemId, index) => {
        try {
            if (!itemId) {
                console.error("Item ID is undefined");
                return;
            }

            if (!editedVal || !editedEx) {
                return alert("add value")
            }

            const response = await axios.put(`http://localhost:8080/updateEx/${itemId}/${index}`, {
                expence: editedEx,
                expenceVal: editedVal,
            });
            console.log(response.data.message);
            setSelectedIndex(null);
        } catch (error) {
            console.error(error);
        }
    };


    const handleDeleteExpense = async (itemId, index) => {
        try {
            // Send a request to delete the expense with the specified index
            await axios.delete(`http://localhost:8080/updateEx/${itemId}/${index}`);

            // Update the local state to remove the deleted expense
            const updatedData = [...data];
            updatedData.forEach(item => {
                item.Expences.splice(index, 1); // Remove the expense at the specified index
            });
            setData(updatedData);
        } catch (error) {
            console.error(error);
        }
    };

    const [isEq, setIsEq] = useState('')

    return (
        <div className='TableCon'>
            <Header />
            {filtered.Position !== "Owner" ? (
                <div className='notAllowed'>You are not allowed here!</div>
            ) : (
                <Swiper>
                    {data && data.slice().reverse().map((item) => (
                        <SwiperSlide key={item._id}>
                            <div className="firstTable">
                                <div className="tableName">DUDZCHAMCHOI INVENTORY</div>
                                <div className="date">Date: {moment(new Date(parseInt(item.date, 10))).format('MMMM Do YYYY, h:mm a')}</div>
                                <div className="user">user: {item.userName} </div>
                                <div className="pos">Position: {item.Position}</div>
                            </div>
                            <table className='firstTableCon'>
                                <thead>
                                    <tr>
                                        <th>RICE NAME</th>
                                        <th>PRICE PER KILO</th>
                                        <th>PRODUCT QUANTITY</th>
                                        <th>PRODUCT SOLD</th>
                                        <th>ACTIONS</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {item.data.map((rowData, index) => (
                                        <tr key={index}>
                                            <td>
                                                {rowData && rowData ? (
                                                    index === selectedIndex ? (
                                                        <input
                                                            required
                                                            value={editedData.riceName}
                                                            onChange={(e) => handleInputChange(e, 'riceName')}
                                                        />
                                                    ) : (
                                                        rowData.riceName || ''
                                                    )
                                                ) : null}
                                            </td>

                                            <td>
                                                {rowData && rowData ? (
                                                    index === selectedIndex ? (
                                                        <input
                                                            value={editedData.pricePerKilo}
                                                            onChange={(e) => handleInputChange(e, 'pricePerKilo')}
                                                        />
                                                    ) : (
                                                        rowData.pricePerKilo || ''
                                                    )
                                                ) : null}
                                            </td>

                                            <td>
                                                {rowData ? (
                                                    index === selectedIndex ? (
                                                        <input
                                                            value={editedData.productQuantity}
                                                            onChange={(e) => handleInputChange(e, 'productQuantity')}
                                                        />
                                                    ) : (
                                                        rowData.productQuantity || ''
                                                    )
                                                ) : null}
                                            </td>
                                            <td>

                                                {rowData && (parseFloat(rowData.pricePerKilo) * parseFloat(rowData.productQuantity)).toLocaleString('en-PH', { style: 'currency', currency: 'PHP' })}
                                            </td>
                                            <td className='firstEditBtn'>
                                                {rowData && rowData ? (
                                                    index === selectedIndex ? (
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
                                                            <button onClick={() => { handleEdit(index); }}>EDIT</button>
                                                            <button onClick={() => handleDelete(item._id, index)}>DELETE</button>
                                                        </>
                                                    )
                                                ) : null}
                                            </td>

                                        </tr>
                                    ))}
                                </tbody>
                                <tbody>
                                    <tr>
                                        <td>Total sales</td>
                                        <td>
                                            {item.data ?
                                                item.data &&
                                                item.data.reduce((total, dataItem) => total + parseFloat(dataItem && dataItem.pricePerKilo || 0), 0)
                                                : 0
                                            }
                                        </td>
                                        <td>
                                            {
                                                item.data &&
                                                item.data.reduce((total, data) =>
                                                    total + parseFloat(data && data.productQuantity || 0), 0)
                                                    .toLocaleString('en-PH', { style: 'currency', currency: 'PHP' })
                                            }
                                        </td>
                                        <td>
                                            {
                                                item.data &&
                                                item.data.reduce((total, data) =>
                                                    total + (parseFloat(data && data.pricePerKilo) * parseFloat(data && data.productQuantity) || 0), 0)
                                                    .toLocaleString('en-PH', { style: 'currency', currency: 'PHP' })
                                            }
                                        </td>
                                        <td></td>
                                    </tr>
                                </tbody>
                            </table>
                            <table className='secTable'>
                                <tbody>
                                    <tr>
                                        <th>Expenses</th>
                                        <th className='salesData'>Total sales today</th>
                                        <th>actions</th>
                                    </tr>
                                    {item.Expences.filter((expenceItem) => expenceItem !== null).map((items, index) => (
                                        <tr key={index}>

                                            {isEq === index ? (
                                                <td>
                                                    <input required type="text" value={editedEx} placeholder='Enter Expence name' onChange={(e) => { setEditedEx(e.target.value) }} /> {/* This is where the error likely occurs */}
                                                    <input required type='number' value={editedVal} placeholder='Enter Expence value' onChange={(e) => { setEditedVal(e.target.value) }} /> {/* This is where the error likely occurs */}
                                                </td>
                                            ) : (
                                                <td>
                                                    <div className="itemExpence">
                                                        <div className="firstEx">
                                                            {items.expence ? items.expence : 'No expence recorded'} {/* Add a null check for items.expence */}
                                                        </div>
                                                        <div className="expenceVal">
                                                            {items.expenceVal ? items.expenceVal : 'No expence value'} {/* Add a null check for items.expenceVal */}
                                                        </div>
                                                    </div>
                                                </td>
                                            )}
                                            <td className='salesData'>
                                                <div>
                                                    {
                                                        item &&
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
                                            </td>
                                            <td className='editBtnCon'>
                                                {isEq === index ? (
                                                    <>
                                                        <button onClick={() => { setIsEq(null); handleEditExpense(item._id, index) }}>Save</button>
                                                        <button onClick={() => setIsEq(null)}>Cancel</button>
                                                    </>
                                                ) : (
                                                    <>
                                                        <button onClick={() => { setIsEq(index); getVal(items.expence, items.expenceVal) }}>Edit</button>
                                                        <button onClick={() => handleDeleteExpense(item._id, index)}>Delete</button>
                                                    </>
                                                )}
                                            </td>
                                        </tr>
                                    ))}

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
