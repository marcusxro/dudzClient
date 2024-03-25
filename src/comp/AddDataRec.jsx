import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../auth';

const AddDataRec = ({ unDo }) => {

    const [accName, setAcc] = useState([])
    const [pos, setPos] = useState("")

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



    const [rowData, setRowData] = useState([{ riceProd: '', Stocks: '', Price: '', StocksUsed: '', Supplier: '', ContactNum: '', DatePur: '', DateStock: '', }]);

    const handleAddRow = () => {
        setRowData([...rowData, { riceProd: '', Stocks: '', Price: '', StocksUsed: '', Supplier: '', ContactNum: '', DatePur: '', DateStock: '', }]);
    };


    const handleDecreaseRow = () => {
        if (rowData.length > 1) {
            const updatedRows = [...rowData];
            updatedRows.pop(); // Remove the last row
            setRowData(updatedRows);
        }
    };

    const handleChange = (index, e) => {
        console.log(index, e)
        const { name, value } = e.target;
        const updatedRows = [...rowData];
        updatedRows[index][name] = value;
        setRowData(updatedRows);
    };
    const [date, setDate] = useState('')
    const sendData = () => {
        const rowDataToSend = rowData.map(row => ({
            riceProd: row.riceProd,
            Stocks: row.Stocks,
            Price: row.Price,
            StocksUsed: row.StocksUsed,
            Supplier: row.Supplier,
            ContactNum: row.ContactNum,
            DatePur: row.DatePur,
            DateStock: row.DateStock,
        }));

        axios.post('http://localhost:8080/SendRecord', {
            userName: email,
            Position: pos,
            data: rowDataToSend,
            date: date,
            Uid: uid
        }).then(() => {
            console.log("data sent");
        }).catch((err) => {
            console.log(err);
        });
    };
    return (
        <div className='AddRec'>
            <div className="close" onClick={unDo}>
                close
            </div>
            <div className="addRecText">
                Add record
            </div>
            <div className="firstContent">
                <label htmlFor="Date">Date: <span><input type="Date" value={date} onChange={(e) => {setDate(e.target.value)}} /></span></label>
            </div>
            <div className="addRecordCon">
                <table>
                    <tbody>
                        <tr>
                            <th>Rice Products</th>
                            <th>Stocks</th>
                            <th>Price</th>
                            <th>Stocks used</th>
                            <th>Supplier</th>
                            <th>Contact Number</th>
                            <th>Date Purchased</th>
                            <th>Date Stockout</th>
                        </tr>
                        {rowData.map((data, index) => (
                            <tr key={index}>
                                <td><input name='riceProd' type="text" value={data.riceProd} onChange={(e) => { handleChange(index, e) }} /></td>
                                <td><input name='Stocks' type="text" value={data.Stocks} onChange={(e) => { handleChange(index, e) }} /></td>
                                <td><input name='Price' type="number" value={data.Price} onChange={(e) => { handleChange(index, e) }} /></td>
                                <td><input name='StocksUsed' type="text" value={data.StocksUsed} onChange={(e) => { handleChange(index, e) }} /></td>
                                <td><input name='Supplier' type="text" value={data.Supplier} onChange={(e) => { handleChange(index, e) }} /></td>
                                <td><input name='ContactNum' type="number" value={data.ContactNum} onChange={(e) => { handleChange(index, e) }} /></td>
                                <td><input name='DatePur' type="date" value={data.DatePur} onChange={(e) => { handleChange(index, e) }} /></td>
                                <td><input name='DateStock' type="date" value={data.DateStock} onChange={(e) => { handleChange(index, e) }} /></td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div className="AddAndDec">
                    <button onClick={() => { handleAddRow() }}>Add data</button>
                    <button onClick={() => { handleDecreaseRow() }}>Decrease</button>
                </div>
                <div className="submitBtn">
                    <button onClick={() => {sendData()}}> Add Data</button>
                </div>
            </div>
        </div>
    )
}

export default AddDataRec
