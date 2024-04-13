import React, { useEffect, useState, useRef } from 'react';
import Sidebar from '../comps/Sidebar';
import { useLocation, useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { Authentication } from '../Authentication';
import axios from 'axios';
import emailjs from '@emailjs/browser';


const CheckOut = () => {
    const nav = useNavigate();

    const [infoDetails, setInfo] = useState([]);
    const [data, setData] = useState([]);
    const [uid, setUid] = useState('');

    const location = useLocation();
    const [products, setProducts] = useState([]);
    const [email, setEmail] = useState('')

    useEffect(() => {
        if (location.state) {
            setProducts(prevProducts => {
                console.log(prevProducts); // Log the previous state
                return location.state.product; // Update the state
            });
        } else {
            nav('/System/Cart')
        }
    }, [location.state]);


    useEffect(() => {
        const unsub = onAuthStateChanged(Authentication, (acc) => {
            if (acc) {
                setUid(acc.uid);
            } else {
                nav('/');
            }
        });
        return () => { unsub(); };
    }, []);


    const [userName, setUserName] = useState('')

    useEffect(() => {
        axios.get('http://localhost:8080/GetAcc')
            .then((res) => {
                const filteredData = res.data.filter((item) => item.Uid === uid);
                setData(filteredData[0]);
                setUserName(data.Username)
                setEmail(data.Email)
            }).catch((err) => {
            });
    }, [data]);

    useEffect(() => {
        axios.get('http://localhost:8080/GetInfo')
            .then((res) => {
                const filteredData = res.data.filter((item) => item.Uid === uid);
                setInfo(filteredData.length === 0 ? null : filteredData);
            }).catch((err) => {
                console.log(err);
            });
    }, [infoDetails, data]);

    const[infData, setInf] = useState([])

  useEffect(() => {
        axios.get('http://localhost:8080/GetInfo')
            .then((res) => {
                const filteredData = res.data.filter((item) => item.Uid === uid);
                setInf(filteredData.length === 0 ? null : filteredData);
            }).catch((err) => {
                console.log(err);
            });
    }, [infData]);


    const decreaseItem = (itemName, itemPrice, itmQuan) => {
        let updatedPrice = itemPrice;

        switch (itemName) {
            case 'Water Container':
            case 'Water Jag':
                updatedPrice = 30;
                break;
            case 'Water Gallon (empty)':
            case 'Water Container (Refill)':
            case 'Water Container (Gallon)':
            case 'Water Jag (Refill)':
            case 'Water Jag (Gallon)':
            case 'Mini Gallon (Refill)':
            case 'Mini Gallon (Gallon)':
            case 'Water Gallon #3 (Refill)':
            case 'Water Gallon #4 (Refill)':
            case 'Water Gallon #3 (Gallon)':
            case 'Water Gallon #4 (Gallon)':
                updatedPrice = 20;
                break;
            default:
                break;
        }


        setProducts(prevProducts => prevProducts.map(item => {
            if (item.itemName === itemName) {
                return {
                    ...item,
                    totalPrice: item.totalPrice - (updatedPrice * itmQuan),
                    quantity: itmQuan > 0 ? item.quantity - itmQuan : item.quantity
                };
            }
            return item;
        }).filter(item => item.totalPrice !== 0));
    };


    const incrementItm = (itemName, itemPrice, itmQuan) => {
        setProducts(prevProducts => prevProducts.map(item => {
            if (item.itemName === itemName) {
                return {
                    ...item,
                    totalPrice: item.totalPrice + parseFloat(itemPrice),
                    quantity: itmQuan > 0 ? item.quantity + itmQuan : item.quantity
                };
            }
            return item;
        }));
    }
    const [finalPrice, setFinal] = useState()
    useEffect(() => {
        console.log(products)

        const totalPrice = products.reduce((accumulator, itm) => accumulator + itm.totalPrice, 0)
        setFinal(totalPrice)
    }, [products])


    const [message, setMess] = useState('')

 

    const sendProductData = () => {
        if (!infoDetails) {
            return alert("Please check your info first (Address, Contact)");
        }

        axios.post('http://localhost:8080/SendProduct', {
            Email: data && data.Email, // Accessing email from data state
            Username: data && data.Username, // Accessing username from data state
            Data: products,
            message: message,
            ContactNum: infoDetails[0]?.Contact, // Using optional chaining
            Address: infoDetails[0]?.Address, // Using optional chaining
            totalPrice: finalPrice,
            Date: Date.now(),
            Destination: "To Prepare",
            Uid: uid,
        })
            .then(() => {
                console.log("order has been placed");
            })
            .catch((err) => {
                console.log(err);
            });
    };


    return (
        <div className='checkOutPage'>
            <Sidebar />
            <div className="checkOutCon">
                <header className="cartHeader">
                    <div className="logo">Water Gallon</div>
                    <div className="buttonCon">
                        <button onClick={() => nav('/System/Cart')}>Back to cart</button>
                    </div>
                </header>
                <div className="checkOutContent">
                    {infoDetails ? infoDetails.map((itm, index) => (
                        <div className="details" key={index}>
                            <div className="firstDetails">
                                {itm.Username}
                            </div>
                            <div className="secDetails">
                                <div className="address">
                                    Address:  <span>{itm.Address ? itm.Address : "You dont have any address!"}</span>
                                </div>
                                <div className="contactNum">
                                    Contact Number: <span>{itm.Contact}</span>
                                </div>
                            </div>
                        </div>
                    )) :
                        <div className="navBac">
                            <div className="navBackText">
                                You dont have any address and contact set please click <span onClick={() => { nav('/System/Profile') }}>here</span> to continue your check out
                            </div>
                        </div>
                    }
                    <div className="productCon">
                        {products.map((itm) => (
                            <div className="itemCheckOut" key={itm.itemName}>
                                <div className="productName">
                                    {itm.itemName}  ₱<span>{itm.totalPrice}</span>
                                </div>
                                <div className="productDet">
                                    <div className="btns" onClick={() => { decreaseItem(itm.itemName, 30, 1) }}>
                                        <ion-icon name="remove-circle-outline" />
                                    </div>
                                    <div className="prodQuan">
                                        ({itm.quantity})
                                    </div>
                                    <div className="btns" onClick={() => { incrementItm(itm.itemName, 30, 1) }}>
                                        <ion-icon name="add-circle-outline" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="addMessage">
                        <div className="addMesText">
                            Add message (optional)
                        </div>
                        <textarea name="" id="" cols="30" rows="10" value={message} onChange={(e) => { setMess(e.target.value) }}></textarea>
                    </div>
                    <div className="placeOrderCon">
                        <div className="totalItms">
                            Total ({products.length})
                        </div>
                        <div className="totalPrice">
                            <div className="price">
                                ₱<span>{finalPrice}</span>
                            </div>
                            {infoDetails === null ?
                                <button >You dont have any info!</button> :
                                <button onClick={() => { sendProductData();  nav('/System/placedOrder', { state: { products } }) }}>Place order</button>
                            }
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default CheckOut;
