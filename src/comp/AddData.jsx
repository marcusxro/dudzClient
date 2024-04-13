import React, { useEffect, useState } from 'react';
import axios from 'axios'
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../auth';

const AddData = ({ showModal }) => {

    const [email, setEmail] = useState('')
    const [uid, setUid] = useState('')



    useEffect(() => {
        const Iden = onAuthStateChanged(auth, (acc) => {
            if (acc) {
                setUid(acc.uid)
            }
        })
        return () => { Iden() }
    }, [email])

    const [accName, setAcc] = useState([])
    const [pos, setPos] = useState("")

    useEffect(() => {
        axios.get('http://localhost:8080/GetAcc')
            .then((res) => {
                setAcc(res.data)
                const filteredData = res.data.filter((item) => item.Uid === uid)
                setAcc(filteredData[0])
                setPos(filteredData[0].Position)
                setEmail(filteredData[0].Username)
            }).catch((err) => {
                console.log(err)
            })
    }, [accName])



    const [rowData, setRowData] = useState([
        { riceName: 'Malagkit', pricePerKilo: '60', productQuantity: '', productSold: '' },
        { riceName: 'Maalsa', pricePerKilo: '65', productQuantity: '', productSold: '' },
        { riceName: 'Coco Pandan', pricePerKilo: '50', productQuantity: '', productSold: '' },
        { riceName: 'Jasmine Mindoro', pricePerKilo: '60', productQuantity: '', productSold: '' },
        { riceName: 'Island', pricePerKilo: '50', productQuantity: '', productSold: '' },
        { riceName: 'Coco Pandan', pricePerKilo: '50', productQuantity: '', productSold: '' },
        { riceName: 'Queen Jasmine', pricePerKilo: '50', productQuantity: '', productSold: '' },
        { riceName: 'Dinorado', pricePerKilo: '65', productQuantity: '', productSold: '' },

    ]);
    const [expenceRow, setExpenceRow] = useState([{ expence: '', expenceVal: '' }]);


    const handleAddRow = () => {
        setRowData([...rowData, { riceName: '', pricePerKilo: '', productSold: '' }]);
    };

    const handleDecreaseRow = () => {
        if (rowData.length > 1) {
            const updatedRows = [...rowData];
            updatedRows.pop(); // Remove the last row
            setRowData(updatedRows);
        }
    };

    const [date, setDate] = useState('')

    const handleChange = (index, e) => {
        const { name, value } = e.target;
        const updatedRows = [...rowData];
        updatedRows[index][name] = value;
        setRowData(updatedRows);



    };


    ////////////////////

    const handleAddExpenseRow = () => {
        setExpenceRow([...expenceRow, { expence: '', expenceVal: '' }]);
        console.log(expenceRow)
    };

    const handleDecreaseExpenseRow = () => {
        if (expenceRow.length > 1) {
            setExpenceRow(expenceRow.slice(0, -1));
        }
    };

    const handleExpenseChange = (index, e) => {
        const { name, value } = e.target; // Destructured to get name and value
        const updatedExpenses = [...expenceRow];
        if (name === "expenceName") {
            updatedExpenses[index].expence = value; // Update only the name
        } else if (name === "expenceVal") {
            updatedExpenses[index].expenceVal = value; // Update only the value
        }
        setExpenceRow(updatedExpenses);
    };

    const sendData = () => {
        const rowDataToSend = rowData.map(row => ({
            riceName: row.riceName,
            pricePerKilo: row.pricePerKilo,
            productSold: row.productSold,
            productQuantity: row.productQuantity
        }));

        const expencesToSend = expenceRow.map(item => ({
            expence: item.expence,
            expenceVal: item.expenceVal
        })).filter(item => item.expence.trim() !== "" && item.expenceVal.trim() !== "");

        axios.post('http://localhost:8080/SendData', {
            userName: email,
            Position: pos,
            Expences: expencesToSend.length > 0 ? expencesToSend : [], // Set to empty array if expencesToSend is empty
            data: rowDataToSend,
            date: Date.now(),
            Uid: uid
        }).then(() => {
            console.log("data sent");
        }).catch((err) => {
            console.log(err);
        });
    };



    return (
        <div className='addDataCon'>
            <div className="remove" onClick={showModal}>
                close
            </div>
            <div className="firstTable">
                <div className="tableName">DUDZCHAMCHOI INVENTORY</div>
                <div className="user">user: {accName ? accName.Email : "Loading.."} </div>
                <div className="pos">Position: {accName ? pos : "Loading.."}</div>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>RICE NAME</th>
                        <th>PRICE PER KILO</th>
                        <th>PRODUCT QUANTITY</th>
                        <th>PRODUCT SOLD</th>
                    </tr>
                </thead>
                <tbody>
                    {rowData.map((data, index) => (
                        <tr key={index}>
                            <td><input type="text" name="riceName" value={data.riceName} onChange={(e) => handleChange(index, e)} /></td>
                            <td><input type="number" name="pricePerKilo" value={data.pricePerKilo} onChange={(e) => handleChange(index, e)} /></td>
                            <td><input type="number" name="productQuantity" value={data.productQuantity} onChange={(e) => handleChange(index, e)} /></td>
                            <td><input type="number" name="productSold" value={data.pricePerKilo * data.productQuantity} onChange={(e) => handleChange(index, e)} /></td>
                        </tr>
                    ))}
                    <tr className='totalTr'>
                        <td>Total Sales</td>
                        <td></td>
                        <td>
                            {rowData.reduce((total, data) => total +
                                (parseFloat(data.productQuantity) || 0), 0)
                                .toLocaleString('en-PH', { style: "currency", currency: 'PHP' })}
                        </td>
                        <td>
                            {rowData.reduce((total, data) => total +
                                (parseFloat(data.pricePerKilo) * parseFloat(data.productQuantity) || 0), 0)
                                .toLocaleString('en-PH', { style: 'currency', currency: 'PHP' })}
                        </td>
                    </tr>
                </tbody>
            </table>
            <div className='btnActions'>
                <button onClick={handleAddRow}>Insert new Rice</button>
                <button onClick={handleDecreaseRow}>Decrease</button>
            </div>

            <div className="expences">
                <table>
                    <thead>
                        <th>Expencess</th>
                    </thead>
                    <tbody>
                        {expenceRow.map((data, index) => (
                            <tr key={index}>
                                <td>
                                    <input
                                        type="text"
                                        placeholder='Enter expences name'
                                        name="expenceName"
                                        value={data.expence}
                                        onChange={(e) => handleExpenseChange(index, e)}
                                    />
                                </td>
                                <td>
                                    <input
                                        type="number"
                                        placeholder='Enter expences value'
                                        name="expenceVal"
                                        value={data.expenceVal}
                                        onChange={(e) => handleExpenseChange(index, e)}
                                    />
                                </td>
                            </tr>
                        ))}
                        <tr className='expencesTr'>
                            <td>Total Expences</td>
                            <td>{expenceRow.reduce((total, data) => (parseFloat(total) + parseFloat(data.expenceVal) || 0), 0)
                                .toLocaleString('en-PH', { style: 'currency', currency: 'PHP' })}</td>
                        </tr>
                    </tbody>

                </table>
                <div className='btnActions'>
                    <button onClick={handleAddExpenseRow}>Insert Expences</button>
                    <button onClick={handleDecreaseExpenseRow}>Decrease Expences</button>
                </div>
            </div>

            <div className="totalSalesTr">
                <div className="cal">Total Sales</div>
                <div className="cal">
                    {(
                        expenceRow.reduce((totalExpences, data) => totalExpences + parseInt(data.expenceVal || 0), 0) -
                        rowData.reduce((totalProductsSold, dta) => totalProductsSold + parseInt(dta.pricePerKilo * dta.productQuantity|| 0), 0)
                    ).toLocaleString('en-PH', { style: 'currency', currency: 'PHP' })}
                </div>
            </div>
            <button className='saveBtn' onClick={() => { sendData() }}>save</button>
        </div>


    );
};

export default AddData;
