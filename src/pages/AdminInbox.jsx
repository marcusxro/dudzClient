import React, { useEffect, useState } from 'react'
import Sidebar from '../comps/Sidebar'
import AdminSidear from './AdminSidebar'
import axios from 'axios'
import moment from 'moment'

const AdminInbox = () => {

    const [ratingData, setRatings] = useState([])
    const [starItem, setStar] = useState(0)
    const [visitOfUser, setVisit] = useState([])
    useEffect(() => {
        axios.get('http://localhost:8080/getRatings')
            .then((res) => {
                setRatings(res.data)
                if (ratingData.length === 0) return 0;
                const totalStars = ratingData.reduce((acc, rating) => {
                  // Parse star value and convert it into a number
                  const stars = parseInt(rating.Stars === NaN ? 0 : rating.Stars);
                  return acc + stars;
                }, 0);
            
                // Calculate average rating
                const averageRating = totalStars / ratingData.length;
                setStar(averageRating.toFixed(1)) 
            }).catch((err) => {
                console.log(err)
            })
    }, [ratingData])

    useEffect(() => {
        axios.get('http://localhost:8080/getPostAct')
        .then((res) => {
            setVisit(res.data)
        }).catch((err) => {
            console.log(err)
        })
    }, [visitOfUser])

    return (
        <div className='adminInbox'>
            <AdminSidear />
            <div className="adminInboxCon">
                <header>
                    Inbox Notification
                </header>
                <div className="inboxRating">

                    <div className="firstRatingCon">
                        <div className="ratingItems starRatingItem">
                           Ratings {starItem}% <span><ion-icon name="star-outline"></ion-icon></span>
                        </div>
                        <div className="ratingItems starRatingItem">
                            Monthly Visit: <span>{visitOfUser.length}</span>
                        </div>
                        <div className="ratingItems starRatingItem">
                        Yearly Visit: <span>{visitOfUser.length}</span>
                        </div>
                    </div>

                    <div className="secRatingCon">
                        <div className="secRatingConText">
                            Customer Message
                        </div>
                        {ratingData.slice().reverse().map((item) => (
                            <div className="ratingItemForMessage" key={item._id}>
                                <div className="ratingName">
                                    By {item.Username}:
                                </div>
                                <div className="ratingMessage">
                                    <span> </span> {item.Message}
                                </div>
                                <div className="ratingDate">
                                    on {moment(new Date(parseInt(item.Date, 10))).format('MMMM Do YYYY, h:mm')}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AdminInbox
