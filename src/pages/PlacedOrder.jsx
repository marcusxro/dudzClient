import React, { useEffect, useState } from 'react'
import Sidebar from '../comps/Sidebar'
import { onAuthStateChanged } from 'firebase/auth';
import { Authentication } from '../Authentication';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import moment from 'moment'
import emailjs from '@emailjs/browser';



const PlacedOrder = () => {
    const [seeModal, setModal] = useState(false)
    const [uid, setUid] = useState('');
    const nav = useNavigate()
    const [placedItem, setItem] = useState([])
    const [refNum, setRefNum] = useState('')

    useEffect(() => {
        axios.get('http://localhost:8080/getProduct')
            .then((res) => {
                const filteredData = res.data.filter((itm) => itm.Uid === uid);
                const lastIndex = filteredData.length - 1;
                const lastItem = filteredData[lastIndex];
                setRefNum(lastItem._id)
                setItem([lastItem]);
            })
            .catch(error => {
                console.error("Error fetching data:", error);
            });
    }, [uid, placedItem]);
    

    function generateReceipt() {
        const objectMess = {
            Username: placedItem && placedItem[0].Username,
            Email: placedItem && placedItem[0].Email,
            Data: placedItem && placedItem[0].Data,
            message: placedItem && placedItem[0].message,
            ContactNum: placedItem && placedItem[0].ContactNum,
            Address: placedItem && placedItem[0].Address,
            totalPrice: placedItem[0].totalPrice,
            Date: Date.now(),
            Destination: placedItem && placedItem[0].Destination,
        }
        let receipt = '';
        // Add header
        receipt += 'Receipt\n\n';
        // Add items
        receipt += 'Items:\n';
        objectMess.Data.forEach(item => {
            receipt += `${item.itemName} x${item.quantity}: ₱${item.totalPrice}\n`;
        });
        // Add total price
        receipt += `\nTotal Price: ₱${objectMess.totalPrice}\n`;
        // Add customer details
        receipt += `\nCustomer Details:\n`;
        receipt += `Email: ${objectMess.Email}\n`;
        receipt += `Username: ${objectMess.Username}\n`;
        receipt += `Contact Number: ${objectMess.ContactNum}\n`;
        receipt += `Address: ${objectMess.Address}\n`;
        // Add date
        receipt += `\nDate: ${new Date(objectMess.Date).toLocaleString()}\n`;

        return receipt;
    }

    const sendEmail = () => {
        if (placedItem.length > 0 && placedItem[0].Username) {
            const receipt = generateReceipt();
            const params = {
                message: receipt,
                to_email: placedItem[0].Email,
                to_name: placedItem[0].Username
            };
    
            emailjs
                .send('service_7kgjf7m', 'template_64m6znr', params, 'SKz5MiymZ5vQ3ay44',)
                .then(
                    () => {
                        console.log('SUCCESS!');
                    },
                    (error) => {
                        console.log('FAILED...', error);
                    },
                );
        } else {
            console.log('Error: Cannot send email. Placed item data is incomplete.');
        }
    };


    useEffect(() => {
        const unsub = onAuthStateChanged(Authentication, (acc) => {
            if (acc) {
                setUid(acc.uid);

            } else {
                nav('/');
            }
        });
        return () => { unsub(); };
    }, [uid]);


        useEffect(() => {
            sendEmail();
        }, [refNum])

// console.log(
//   {
//     Username: placedItem[0].Username,
//     Data: placedItem[0].Data,
//     message: placedItem[0].message,
//     ContactNum: placedItem[0].ContactNum,
//     Address: placedItem[0].Address,
//     totalPrice: placedItem[0].finalPrice,
//     Date: Date.now(),
//     Destination: placedItem[0].Destination,
//   }
// )
   
    







    return (
        <div className='placedOrder'>
            <Sidebar />
            <div className="placedOrderCon">
                {seeModal && placedItem.length > 0 && (
                    <div className="reciept">
                        <div className="close" onClick={() => { setModal(!seeModal) }}>
                            close
                        </div>
                        <div className="recieptText">
                            Order Receipt
                        </div>
                        {placedItem.map((item) => (
                            <div className="recieptCon" key={item._id}>
                                <div className="cusName">
                                    Name: <span>{item.Username}</span>
                                </div>
                                <div className="cusDate">
                                    You ordered on: <span>{moment(new Date(parseInt(item.Date, 10))).format('MMMM Do YYYY, h:mm')}</span>
                                </div>
                                <div className="id">
                                    Reference: <span>{item._id}</span>
                                </div>
                                <div className="cusAdd">
                                    Address: <span>{item.Address}</span>
                                </div>
                                <div className="cusAdd">
                                    Contact Number: <span>{item.ContactNum}</span>
                                </div>
                                <div className="itmCon">
                                    {item.Data.map((itm) => (
                                        <div className="recievedItm">
                                            <div className="itmName">
                                                {itm.itemName} ₱{itm.totalPrice}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="totalPrice">
                                    Total Price ₱{item.totalPrice}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                <div className="placedText">
                    Order Placed! <span><ion-icon name="checkmark-circle-outline"></ion-icon></span>
                </div>
                <div className="placedPar">
                    Your order ({refNum && refNum}) has been placed <br />
                     successfully. For order details,
                    please click on "Order Receipt"
                </div>
                <button onClick={() => { setModal(!seeModal) }}>Order Reciept</button>
            </div>
        </div>
    )
}

export default PlacedOrder
