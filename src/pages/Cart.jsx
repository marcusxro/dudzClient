import React, { useEffect, useRef, useState } from 'react';
import Sidebar from '../comps/Sidebar';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { onAuthStateChanged } from 'firebase/auth';
import { Authentication } from '../Authentication';
import WaterCon from '../images/waterCon.jpg';
import waterJag from '../images/waterJag.jpg';
import miniGallons from '../images/miniGallon.png'
import markOne from '../images/markOne.png'
import markTwo from '../images/markTwo.png'

const Cart = () => {
    const nav = useNavigate();
    const [data, setData] = useState([]);
    const [uid, setUid] = useState('');
    const [products, setProducts] = useState([])


    useEffect(() => {
        const unsub = onAuthStateChanged(Authentication, (acc) => {
            if (!acc) { nav('/'); }
            else { setUid(acc.uid); }
        }); return () => { unsub(); };
    }, []);
    useEffect(() => {
        axios.get('http://localhost:8080/GetCart')
            .then((res) => {
                const filteredData = res.data.filter((item) => item.Uid === uid);
                setData(filteredData);
            }).catch((err) => {
                console.log(err);
            });
    }, [uid, data]);

    const [isCheckedd, setCheckedd] = useState()
    useEffect(() => {
        console.log(isCheckedd)
    }, [isCheckedd])
    
    const deleteItem = async (itemId, itemPrice, itemName) => {
        try {
            await axios.post('http://localhost:8080/DeleteCartItem', { itemId });
            await axios.get('http://localhost:8080/GetCart');

            if (isCheckedd) {
                setSelectedItemPrice(prevPrice => prevPrice - parseFloat(itemPrice));
                setProducts(prevProducts => prevProducts.map(item => {
                    if (item.itemName === itemName) {
                        return {
                            ...item,
                            totalPrice: item.totalPrice - itemPrice
                        };
                    }
                    return item;
                }).filter(item => item.totalPrice !== 0));

            }


        } catch (error) {
            console.error('Error deleting item:', error);
        }
    };
    const aggregateQuantitiesAndPrices = () => {
        const aggregatedItems = {};
        data.forEach((item) => {
            const itemId = item._id;
            if (aggregatedItems[item.Item]) {
                aggregatedItems[item.Item].quantity++;
                aggregatedItems[item.Item].totalPrice += parseFloat(item.Price);
            } else {
                aggregatedItems[item.Item] = {
                    itemName: item.Item,
                    quantity: 1,
                    ItemId: itemId,
                    totalPrice: parseFloat(item.Price),
                };
            }
        });
        return aggregatedItems;
    };
    const [subTotal, setSubTotal] = useState(null);
    const firstCheck = useRef(null);
    const SecCheck = useRef(null);

    const [waterJagvPrice, setWaterJagPrice] = useState('');
    const [waterConPrice, setWaterConPrice] = useState('');

    useEffect(() => {
        let waterConTotalPrice = 0;
        let waterJagTotalPrice = 0;
        const aggregatedItems = aggregateQuantitiesAndPrices();
        Object.values(aggregatedItems).forEach((item) => {
            if (item.itemName === 'Water Container') {
                waterConTotalPrice += item.totalPrice;
            } else {
                waterJagTotalPrice += item.totalPrice;
            }
        });
        setWaterJagPrice(waterJagTotalPrice);
        setWaterConPrice(waterConTotalPrice);
    }, [aggregateQuantitiesAndPrices()]);
    const [selectedItemPrice, setSelectedItemPrice] = useState(0);
    const AddCartItem = (itemName, itemPrice) => {
        axios.post('http://localhost:8080/SendCart', {
            Item: itemName,
            Price: itemPrice,
            Date: Date.now(),
            Uid: uid,
        }).then(() => {
            console.log('cart item sent');
            if (isCheckedd) {
                setSelectedItemPrice(prevPrice => prevPrice + parseFloat(itemPrice))
                setProducts(prevProducts => prevProducts.map(item => {
                    if (item.itemName === itemName) {
                        return {
                            ...item,
                            totalPrice: item.totalPrice + parseFloat(itemPrice)
                        };
                    }
                    return item;
                }));
            }
        }).catch((err) => {
            console.log(err);
        });
    };
    useEffect(() => {
        console.log(products)
    }, [products])
    const inputEL = useRef(null)
    const [waterConChecked, setWaterConChecked] = useState(false);
    const [waterJagChecked, setWaterJagChecked] = useState(false);

    const [waterGallonThree, setwaterGallonThree] = useState(false);
    const [waterGallonFour, setwaterGallonFour] = useState(false);

    const [miniGallon, setminiGallon] = useState(false);
    const [waterGallEmpty, setwaterGallEmpty] = useState(false);



    const [checkboxState, setCheckboxState] = useState({
        'Water Container': false,
        'Water Jag': false,
        'Water Gallon (empty)': false,
        'Mini Gallon': false,
        'Water Gallon #3': false,
        'Water Gallon #4': false
    });

    const handleCheckboxChange = (itemName, isChecked, itemPrice, itemInfo) => {
        setCheckboxState(prevState => ({
            ...prevState,
            [itemName]: isChecked
        }));

        // Update products state and total price
        if (isChecked) {
            setProducts(prevProducts => [...prevProducts, itemInfo]);
            setSelectedItemPrice(prevPrice => prevPrice + parseInt(itemPrice)); // Accumulate item price
        } else {
            setProducts(prevProducts => prevProducts.filter(product => product.ItemId !== itemInfo.ItemId));
            setSelectedItemPrice(prevPrice => Math.max(0, prevPrice - parseInt(itemPrice))); // Deduct item price, but ensure it's not negative
        }

        // Update specific states based on the item name
        switch (itemName) {
            case 'Water Container':
                setWaterConPrice(isChecked ? parseInt(itemPrice) : 0);
                setWaterConChecked(isChecked);
                break;
            case 'Water Jag':
                setWaterJagPrice(isChecked ? itemPrice : 0);
                setWaterJagChecked(isChecked);
                break;
            case 'Water Gallon (empty)':
                setwaterGallEmpty(isChecked);
                break;
            case 'Mini Gallon':
                setminiGallon(isChecked);
                break;
            case 'Water Gallon #3':
                setwaterGallonThree(isChecked);
                break;
            case 'Water Gallon #4':
                setwaterGallonFour(isChecked);
                break;
            default:
                break;
        }
    };


    const seePic = (pic) => {
        switch (pic) {
            case 'Water Container':
                return WaterCon
            case 'Water Jag':
                return waterJag
            case 'Water Gallon (empty)':
                return waterJag
            case 'Mini Gallon':
                return miniGallons
            case 'Water Gallon #3':
                return markOne
            case 'Water Gallon #4':
                return markTwo;

            case 'Water Container (Refill)':
                return WaterCon
            case 'Water Container (Gallon)':
                return WaterCon

            case 'Water Jag (Refill)':
                return waterJag
            case 'Water Jag (Gallon)':
                return waterJag

            case 'Mini Gallon (Refill)':
                return miniGallons
            case 'Mini Gallon (Gallon)':
                return miniGallons
            case 'Water Gallon #3 (Refill)':
                return markOne
            case 'Water Gallon #4 (Refill)':
                return markTwo;
            case 'Water Gallon #3 (Gallon)':
                return markOne
            case 'Water Gallon #4 (Gallon)':
                return markTwo;
            default:
                break;
        }
    }

    return (
        <div className="cartCon">
            <Sidebar />
            <div className="cartContainer">
                <header className="cartHeader">
                    <div className="logo">Water Gallon</div>
                    <div className="buttonCon">
                        <button onClick={() => nav('/System')}>Purchase</button>
                    </div>
                </header>
                <div className="cartContent">
                    {data.length === 0 && "You have no items here"}
                    {Object.entries(aggregateQuantitiesAndPrices()).map(([itemName, itemInfo]) => (
                        <div className="cartItem" key={itemName}>
                            <div className="image">
                                <img src={seePic(itemName)} alt="" />
                            </div>
                            <div className="actions">
                                <div className="cartName">{itemName}</div>
                                <div className="btn">
                                    <div className="btnItem ac" onClick={(e) => { deleteItem(itemInfo.ItemId, 30, itemName); }}>
                                        <ion-icon name="remove-circle-outline" />
                                    </div>
                                    <div className="btnItem">({itemInfo.quantity})</div>
                                    <div className="btnItem ac" onClick={(e) => { AddCartItem(itemName, '30'); }}>
                                        <ion-icon name="add-circle-outline" />
                                    </div>
                                </div>
                            </div>
                            <div className="last">
                                <div className="add">
                                    <label htmlFor="input">Add item</label>
                                    <input
                                        checked={checkboxState[itemName]}
                                        type="checkbox"
                                        onChange={(e) => { setCheckedd(e.target.checked); handleCheckboxChange(itemName, e.target.checked, itemInfo.totalPrice, itemInfo); }} />
                                </div>
                                <div className="Price">Total Price: ₱{itemInfo.totalPrice.toFixed(2)}</div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="checkOut">
                    <div className="first">
                        {Object.values(checkboxState).some(checked => checked) ? (
                            <div className="subtotal">
                                subTotal: ₱<span>{selectedItemPrice}</span>
                            </div>
                        ) : (
                            <div className="subtotal">
                                subTotal: ₱0
                            </div>
                        )}

                    {products.length === 0 ? 
                    <button>Check Out(0)</button> :  <button onClick={() => { nav('/system/CheckOut', { state: { product: products } }) }}>Check Out(<span>{products.length}</span>)</button>}
                    </div>
                </div>
            </div>
        </div >
    );
};

export default Cart;
