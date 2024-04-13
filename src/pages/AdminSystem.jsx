import React from 'react'
import Sidebar from '../comps/Sidebar'
import AdminSidear from '../comps/AdminSidebar'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { onAuthStateChanged, } from 'firebase/auth'
import { useNavigate } from 'react-router-dom'
import { AdminAuth } from '../Authentication'
import WaterCon from '../images/waterCon.jpg';
import waterJag from '../images/waterJag.jpg';
import miniGallons from '../images/miniGallon.png'
import markOne from '../images/markOne.png'
import markTwo from '../images/markTwo.png'

import barChartImg from '../images/bar-chart-clip-art-bar-graph-icon-removebg-preview.png'

const AdminSystem = () => {
    const [checkedOutItem, setCheckedOut] = useState([])
    const [uid, setUid] = useState('')
    useEffect(() => {
        const unsub = onAuthStateChanged(AdminAuth, (acc) => {
            if (acc) {
                setUid(acc.uid)
            }
        })
        return () => { unsub() }
    }, [uid])

    const [cancelledItems, setCancelled] = useState([])
    const [salesPerWeek, setPerWeek] = useState('');
    const [totalSales, setTotalSales] = useState('')
    const [topItems, setTop] = useState([])
    useEffect(() => {
        axios.get('http://localhost:8080/getProduct')
            .then((res) => {
                setCheckedOut(res.data)
                const filteredCancelled = res.data.filter((item) => item.Destination === "cancelled")
                const perc = filteredCancelled.length / checkedOutItem.length * 100
                const limitedDec = perc.toFixed(2)

                const itemCountMap = {};
                const totalPriceMap = {};
                const itemNormalPrice = {}

                const setPriceUseOfName = (itm) => {
                    switch (itm) {
                        case 'Water Container':
                            return parseInt(30)
                        case 'Water Jag':
                            return parseInt(30)
                        case 'Water Gallon (empty)':
                            return parseInt(30)
                        case 'Mini Gallon':
                            return parseInt(30)
                        case 'Water Gallon #3':
                            return parseInt(30)
                        case 'Water Gallon #4':
                            return parseInt(30);

                        case 'Water Container (Refill)':
                            return parseInt(20)
                        case 'Water Container (Gallon)':
                            return parseInt(20)

                        case 'Water Jag (Refill)':
                            return parseInt(20)
                        case 'Water Jag (Gallon)':
                            return parseInt(20)

                        case 'Mini Gallon (Refill)':
                            return parseInt(20)
                        case 'Mini Gallon (Gallon)':
                            return parseInt(20)
                        case 'Water Gallon #3 (Refill)':
                            return parseInt(20)
                        case 'Water Gallon #4 (Refill)':
                            return parseInt(20);
                        case 'Water Gallon #3 (Gallon)':
                            return parseInt(20)
                        case 'Water Gallon #4 (Gallon)':
                            return parseInt(20);
                        default:
                            break;
                    }
                }

                res.data.forEach(order => {
                    order.Data.forEach(item => {
                        const itemName = item.itemName;
                        const quantity = item.quantity || 1; // Assume quantity of 1 if not provided
                        const priceOfItem = parseInt(item.totalPrice); // Parse totalPrice to ensure it's a number
                        itemCountMap[itemName] = (itemCountMap[itemName] || 0) + quantity;
                        totalPriceMap[itemName] = (totalPriceMap[itemName] || 0) + (quantity * setPriceUseOfName(itemName));
                        itemNormalPrice[itemName] = setPriceUseOfName(itemName)
                    });
                });
                const formattedItems = Object.keys(itemCountMap).map(itemName => ({
                    itemName: itemName,
                    quantity: itemCountMap[itemName],
                    totalPrice: totalPriceMap[itemName],
                    itemNormalPrice: itemNormalPrice[itemName]
                }));
                // Sort formatted items by quantity in descending order
                formattedItems.sort((a, b) => b.quantity - a.quantity);
                // Get the top 3 most ordered items
                const top3Items = formattedItems.slice(0, 3);
                setTop(top3Items)
                setCancelled(limitedDec)
                const totalIncome = checkedOutItem.reduce((itm, price) => itm + parseInt(price.totalPrice), 0)
                const formatCurrency = totalIncome.toLocaleString('en-US', {
                    style: 'currency',
                    currency: 'PHP'
                })
                setTotalSales(formatCurrency)
                const calculateTotalSalesForWeek = () => {
                    // object to store total sales for each day of the week
                    const totalSalesByDay = {
                        Sunday: 0,
                        Monday: 0,
                        Tuesday: 0,
                        Wednesday: 0,
                        Thursday: 0,
                        Friday: 0,
                        Saturday: 0
                    };
                    // Iterate over each checkout item
                    checkedOutItem.forEach(item => {
                        const itemDate = new Date(parseInt(item.Date));
                        const dayOfWeek = itemDate.toLocaleString('en-us', { weekday: 'long' });

                        // Update total sales for the corresponding day of the week
                        totalSalesByDay[dayOfWeek] += parseInt(item.totalPrice); // Convert totalSales to number
                    });
                    // Log or use the total sales for each day
                    const totalSalesForWeek = Object.values(totalSalesByDay).reduce((acc, val) => acc + val, 0);
                    const formattedTotalSalesForWeek = totalSalesForWeek.toLocaleString('en-US', {
                        style: 'currency',
                        currency: 'PHP'
                    });

                    setPerWeek(formattedTotalSalesForWeek)
                };

                // Call the function initially
                calculateTotalSalesForWeek();

            }).catch((err) => {
                console.log(err)
            })
    }, [checkedOutItem])


    const getImg = itemName => {
        switch (itemName) {
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
        <div className='adminSystem'>
            <AdminSidear />

            <div className="adminCon">
                <header>
                    <div className="headerText">
                        Dashboard
                    </div>
                </header>

                <div className="statCon">
                    <div className="statItem">
                        <div className="bar">
                            <img src={barChartImg} alt="" />
                        </div>
                        <div className="length">
                            {checkedOutItem.length}
                        </div>
                        <div className="statText">
                            Total Order
                        </div>
                    </div>
                    <div className="statItem">
                    <div className="bar">
                            <img src={barChartImg} alt="" />
                        </div>
                        <div className="statText">
                            Product
                        </div>
                    </div>
                    <div className="statItem">
                    <div className="bar">
                            <img src={barChartImg} alt="" />
                        </div>
                        <div className="length">
                            {salesPerWeek}
                        </div>
                        <div className="statText">
                            Weely Sales
                        </div>
                    </div>
                    <div className="statItem">
                    <div className="bar">
                            <img src={barChartImg} alt="" />
                        </div>
                        <div className="length">
                            {cancelledItems}%
                        </div>
                        <div className="statText">
                            Cancelled Orders
                        </div>
                    </div>
                </div>

                <div className="adminBot">
                    <div className="botItems">
                        <div className="infoBot">
                            Payment Method: COD
                        </div>
                        <div className="infoBot">
                            Total Income: <span>{totalSales}</span>
                        </div>
                    </div>
                    <div className="botItems">
                        <div className="txt">
                            Popular products
                        </div>
                        <table>
                            <thead>
                                <tr>
                                    <th>Product Name</th>
                                    <th>Price</th>
                                    <th>Sales</th>
                                    <th>Quantity sold</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {topItems.map((item) => (
                                    <tr key={item.itemName}>
                                        <td className='firstCon'>
                                            <div className="img">
                                                <img src={getImg(item.itemName)} alt="" />
                                            </div>
                                            <div className="txtName">
                                                {item.itemName}
                                            </div>
                                        </td>
                                        <td>{item.itemNormalPrice.toLocaleString('en-US', {
                                            style: 'currency',
                                            currency: 'PHP'
                                        })}</td>
                                        <td>{item.totalPrice.toLocaleString('en-US', {
                                            style: 'currency',
                                            currency: 'PHP'
                                        })}</td>
                                        <td>{item.quantity}</td>
                                        <td>In Stock</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                    </div>
                </div>
            </div>
        </div>
    )
}

export default AdminSystem
