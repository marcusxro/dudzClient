import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../auth';
import { parse, v4 as uuidv4 } from 'uuid';

// Generate a unique ID


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

    const [uniqueId, setUnique] = useState('')
    useEffect(() => {
        const uniqueID = uuidv4();
        setUnique(uniqueID); // Log the unique ID once
    }, []);


    useEffect(() => {
        console.log(uniqueId)
    }, [uniqueId])



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



    const [rowData, setRowData] = useState([{ riceProd: '', photoURL: '', Stocks: '', Price: '', StocksUsed: '', PerKilo: '', ContactNum: '', DatePur: '', DateStock: '', }]);

    const handleAddRow = () => {
        setRowData([...rowData, { riceProd: '', photoURL: '', Stocks: '', Price: '', StocksUsed: '', PerKilo: '', ContactNum: '', DatePur: '', DateStock: '', }]);
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

    const [selectedImages, setSelectedImages] = useState([{
        photoURL: '',
        index: ''
    }]);

    const handleFileChange = (index, e) => {
        const files = Array.from(e.target.files);
        const updatedRowData = [...rowData]; // Copy the current state

        // Assuming each file corresponds to an item in the rowData array
        files.forEach((file, i) => {
            const dataIndex = index + i;
            updatedRowData[dataIndex] = {
                ...updatedRowData[dataIndex], // Preserve other properties
                photoURL: file, // Update photoURL with the new file object
            };
        });

        // Update the state with the updated rowData array
        setRowData(updatedRowData);
    };

    const sendData = () => {
        const formDataOne = new FormData();
    
        // Assuming rowData contains the data to be sent

       
        const rowDataToSend = rowData.map(row => ({
            riceProd: row.riceProd,
            Stocks: row.Stocks,
            Price: row.Price,
            StocksUsed: row.StocksUsed,
            PerKilo: row.PerKilo,
            ContactNum: row.ContactNum,
            DatePur: row.DatePur,
            DateStock: parseInt(row.Price )>= parseInt(row.StocksUsed) ? Date.now() : '',
            photoURL: row.photoURL ? row.photoURL : '', // Assuming row.photoURL contains the file object
        }));
    
        // Append rowDataToSend to formDataOne as a JSON string
        formDataOne.append('data', JSON.stringify(rowDataToSend));
    
        formDataOne.append('info', JSON.stringify({
            userName: email,
            Position: pos,
            date: Date.now(),
            Uid: uid,
            uniqueId:  uniqueId
        }))
        // Append images from rowData if they are not undefined
        rowDataToSend.forEach((row, index) => {
            if (row.photoURL) {
                formDataOne.append(`images`, row.photoURL);
            }
        });
    
        // Log formDataOne to check if files are appended correctly
        console.log(formDataOne);
    
        axios.post('http://localhost:8080/SendRecord', formDataOne, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
        .then(() => {
            console.log("data sent");
        })
        .catch((err) => {
            console.log(err);
        });
    }
    
    return (
        <div className='AddRec'>
            <div className="close" onClick={unDo}>
                close
            </div>
            <div className="addRecText">
                Add record
            </div>
            <div className="addRecordCon">
                <table>
                    <tbody>
                        <tr>
                            <th>Rice Products</th>
                            <th>Cost per Sack</th>
                            <th>Cost per Kilo</th>
                            <th>Stocks Quantity</th>
                            <th>Stocks used</th>
                            <th>img</th>
                            <th>Contact Number</th>
                            <th>Date Purchased</th>
                        </tr>
                        {rowData.map((data, index) => (
                            <tr key={index}>
                                <td><input name='riceProd' type="text" value={data.riceProd} onChange={(e) => { handleChange(index, e) }} /></td>
                                <td><input name='Stocks' type="number" value={data.Stocks} onChange={(e) => { handleChange(index, e) }} /></td>
                                <td><input name='PerKilo' type="number" value={data.Supplier} onChange={(e) => { handleChange(index, e) }} /></td>
                                <td><input name='Price' type="number" value={data.Price} onChange={(e) => { handleChange(index, e) }} /></td>
                                <td><input name='StocksUsed' type="number" value={data.StocksUsed} onChange={(e) => { handleChange(index, e) }} /></td>
                                <input type="file" name="images"
                                 onChange={(e) => { handleFileChange(index, e) }} multiple />
                                <td><input name='ContactNum' type="number" value={data.ContactNum} onChange={(e) => { handleChange(index, e) }} /></td>
                                <td><input name='DatePur' type="date" value={data.DatePur} onChange={(e) => { handleChange(index, e) }} /></td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div className="AddAndDec">
                    <button onClick={() => { handleAddRow() }}>Add data</button>
                    <button onClick={() => { handleDecreaseRow() }}>Decrease</button>
                </div>
                <div className="submitBtn">
                    <button onClick={() => { sendData() }}> Add Data</button>
                </div>
            </div>
        </div>
    )
}

export default AddDataRec