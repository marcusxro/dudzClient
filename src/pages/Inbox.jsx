import React, { useEffect, useRef, useState } from 'react'
import Sidebar from '../comps/Sidebar'
import { onAuthStateChanged } from 'firebase/auth'
import { Authentication } from '../Authentication'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import moment from 'moment'
import gsap from 'gsap'

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const Inbox = () => {
    const [uid, setUid] = useState('')
    const nav = useNavigate('')

    useEffect(() => {
        const unsub = onAuthStateChanged(Authentication, (acc) => {
            if (acc) {
                setUid(acc.uid)
                console.log(uid)
            } else {
                nav('/')
            }
        })
        return () => { unsub() }
    }, [uid])
    const [checkedOutItem, setCheckedOut] = useState([])
    const [Username, setUser] = useState('')

    useEffect(() => {
        axios.get('http://localhost:8080/GetAcc')
            .then((res) => {
                const filteredData = res.data.filter((item) => item.Uid === uid)
                setUser(filteredData[0].Username)
            }).catch((err) => {
                console.log(err)
            })

    }, [Username, uid])

    useEffect(() => {
        axios.get('http://localhost:8080/getProduct')
            .then((res) => {
                const filteredData = res.data.filter((itm) => itm.Uid === uid);
                const sortedData = filteredData.sort((a, b) => {
                    // Custom sorting function to prioritize items based on destination
                    if (a.Destination !== b.Destination) {
                        // If the destination has changed, prioritize the one that has changed recently
                        return a.Destination === 'Recieved' ? -1 : 1;
                    } else {
                        // If destinations are the same, sort based on the date
                        return parseInt(b.Date) - parseInt(a.Date);
                    }
                });
                setCheckedOut(sortedData);
            }).catch((err) => {
                console.log(err);
            });
    }, [checkedOutItem]);
    


    const caculateDestinationAndStatus = (stats) => {
        switch (stats) {
            case "To Prepare":
                return "preparing for shipped out"
            case "To Ship":
                return "Shipped"
            case "To Receive":
                return "To Receive"
            case "Received":
                return "Received"
            case "cancelled":
                return "cancelled"
        }
    }

    const [star, setStar] = useState('')

    const starOne = useRef()
    const starTwo = useRef()
    const starThree = useRef()
    const starFour = useRef()
    const starFive = useRef()

    const [click, setClick] = useState(0)

    const setToZero = () => {
        gsap.to([starOne.current,
        starTwo.current, starThree.current,
        starFour.current, starFive.current], {
            color: "white"
        });
    }
    const returnRatings = (star, clk) => {
        switch (star) {
            case "1":
                setStar("1")
                setClick(click + 1)
                console.log(clk)
                gsap.to([starOne.current], {
                    color: "blue",
                });
                if (clk === 1) {
                    setStar("")
                    setClick(0)
                    setToZero()

                }
                return
            case "2":
                setStar("2")
                setClick(click + 1)
                console.log(clk)
                gsap.to([starOne.current,
                starTwo.current], {
                    color: "blue"
                });
                if (clk === 1) {
                    setStar("")
                    setClick(0)
                    setToZero()
                }
                return
            case "3":
                setStar("3")
                setClick(click + 1)
                console.log(clk)
                gsap.to([starOne.current,
                starTwo.current, starThree.current], {
                    color: "blue"
                });
                if (clk === 1) {
                    setStar("")
                    setClick(0)
                    setToZero()
                }
                return
            case "4":
                setStar("3")
                setClick(click + 1)
                console.log(clk)
                gsap.to([starOne.current,
                starTwo.current, starThree.current,
                starFour.current], {
                    color: "blue"
                });
                if (clk === 1) {
                    setStar("")
                    setClick(0)
                    setToZero()
                }
                return
            case "5":
                setStar("5")
                setClick(click + 1)
                console.log(clk)
                gsap.to([starOne.current,
                starTwo.current, starThree.current,
                starFour.current, starFive.current], {
                    color: "blue"
                });
                if (clk === 1) {
                    setStar("")
                    setClick(0)
                    setToZero()
                }
                return
        }
        console.log(star)
    }

    const notify = () => {
        toast.success('Thank you for your rating!', {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
        });
    };


    const [msg, setMsg] = useState('')
    const sendRating = () => {
        if (!msg && star === '') {
            alert("please send something")
        }
        axios.post('http://localhost:8080/SendRating', {
            Message: msg,
            Username: Username,
            Stars: star === '' ? 0 : star,
            Uid: uid,
        }).then(() => {
            setStar('')
            setMsg('')
            setToZero()
            notify()
        }).catch((err) => {
            console.log(err)
        })
    }
    return (
        <div className='inboxCon'>
            <Sidebar />
            <div className="inboxContainer">
                <ToastContainer />

                <div className="inboxNotif">
                    <div className="notifText">
                        Notification
                    </div>

                    <div className="notifCon">
                        {checkedOutItem.length === 0 && "No notification at the moment"}
                        {checkedOutItem.slice().reverse().map((item) => (
                            <div className={`notifItem ${item.Destination}`} key={item._id}>
                                <div className="notifImg">
                                    <ion-icon name="notifications-outline"></ion-icon>
                                </div>
                                <div className="notifs">
                                    Your item has been  {caculateDestinationAndStatus(item.Destination)}
                                </div>
                                <div className="notifs">
                                Date Ordered: <span>{moment(new Date(parseInt(item.Date, 10))).format('MMMM Do YYYY, h:mm')}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                </div>

                <div className="contact">
                    <div className="contactText">
                        Contact
                    </div>
                    <div className="contactContent">

                        <div className="contactCons">

                            <div className="firstContact">
                                <div className="firstText">
                                    Feel free to contact us at anytime!
                                </div>
                                <div className="msgBox">
                                    <textarea
                                        value={msg}
                                        onChange={(e) => { setMsg(e.target.value) }}
                                        placeholder='Enter your message'>
                                    </textarea>
                                    <div className="ratings">
                                        <div className="ratingsText">
                                            Add Ratings
                                        </div>
                                        <div className="ratingsCon">
                                            <div onClick={() => { returnRatings('1', click) }}
                                                ref={starOne} className="ratingItem"><ion-icon name="star-outline"></ion-icon></div>
                                            <div onClick={() => { returnRatings('2', click) }}
                                                ref={starTwo} className="ratingItem"><ion-icon name="star-outline"></ion-icon></div>
                                            <div onClick={() => { returnRatings('3', click) }}
                                                ref={starThree} className="ratingItem"><ion-icon name="star-outline"></ion-icon></div>
                                            <div onClick={() => { returnRatings('4', click) }}
                                                ref={starFour} className="ratingItem"><ion-icon name="star-outline"></ion-icon></div>
                                            <div onClick={() => { returnRatings('5', click) }}
                                                ref={starFive} className="ratingItem"><ion-icon name="star-outline"></ion-icon></div>
                                        </div>
                                    </div>
                                    <button onClick={() => { sendRating() }}>Send</button>
                                </div>
                            </div>

                            <div className="secondContact">
                                <div className="items">
                                    <span><ion-icon name="call-outline"></ion-icon></span>
                                    <span>Number of Riri's</span>
                                </div>
                                <div className="items">
                                    <span><ion-icon name="mail-outline"></ion-icon></span>
                                    <span>Email of Riri's</span>
                                </div>
                                <div className="items">
                                    <span><ion-icon name="logo-facebook"></ion-icon></span>
                                    <span>Facebook of Riri's</span>
                                </div>
                                <div className="items">
                                    <span><ion-icon name="location-outline"></ion-icon></span>
                                    <span>Address of Riri's</span>
                                </div>
                            </div>
                        </div>


                    </div>
                </div>

            </div>
        </div>
    )
}

export default Inbox
