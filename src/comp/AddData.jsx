import React, { useEffect, useState } from 'react';
import axios from 'axios'
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../auth';

const AddData = ({showModal}) => {

    const [email, setEmail] = useState('')
    const [uid, setUid] = useState('')



    useEffect(() => {
        const Iden = onAuthStateChanged(auth, (acc) => {
            if(acc) {
                setEmail(acc.email)
                setUid(acc.uid)
            } 
        })
        return () => {Iden()}
    }, [email])

    const [accName, setAcc] = useState([])
    const [pos, setPos] = useState("")
    useEffect(() => {
        axios.get('http://localhost:8080/GetAcc')
            .then((res) => {
                setAcc(res.data)
                const filteredData = res.data.filter((item) => item.Uid === uid)
                setAcc(filteredData)
              setPos(filteredData[0].position)
            }).catch((err) => {
                console.log(err)
            })
    }, [accName])



    const [rowData, setRowData] = useState([{ riceName: '', pricePerKilo: '', productSold: '' }]);

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
    const [Expences, setExpences] = useState('')
    
    const sendData = () => {
        const rowDataToSend = rowData.map(row => ({
            riceName: row.riceName,
            pricePerKilo: row.pricePerKilo,
            productSold: row.productSold
        }));    
        axios.post('http://localhost:8080/SendData', {
            userName: email,
            Position: pos,
            Expences: Expences,
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
        <div className='addDataCon'>
            <div className="remove" onClick={showModal}>
                close
            </div>
            <div className="firstTable">
                <div className="tableName">DUDZCHAMCHOI INVENTORY</div>
                <div className="date">Date: <input required type="date" value={date} onChange={(e) => { setDate(e.target.value) }} /></div>
                <div className="user">users: {accName.Email} </div>
                <div className="pos">Position: {accName.Position}</div>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>RICE NAME</th>
                        <th>PRICE PER KILO</th>
                        <th>PRODUCT SOLD</th>
                    </tr>
                </thead>
                <tbody>
                    {rowData.map((data, index) => (
                        <tr key={index}>
                            <td><input type="text" name="riceName" value={data.riceName} onChange={(e) => handleChange(index, e)} /></td>
                            <td><input type="number" name="pricePerKilo" value={data.pricePerKilo} onChange={(e) => handleChange(index, e)} /></td>
                            <td><input type="number" name="productSold" value={data.productSold} onChange={(e) => handleChange(index, e)} /></td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className='btnActions'>
                <button onClick={handleAddRow}>Add data</button>
                <button onClick={handleDecreaseRow}>Decrease</button>
            </div>
            <div className="expences">
                <input type="number" required placeholder='Enter expences' value={Expences} onChange={(e) => {setExpences(e.target.value)}} />
            </div>
            <button className='saveBtn' onClick={() => {sendData()}}>save</button>
        </div>
    );
};

export default AddData;
