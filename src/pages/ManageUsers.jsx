import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Header from '../comp/Header'
import moment from 'moment'
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../auth';
import { useNavigate } from 'react-router-dom';


const ManageUsers = () => {
    const [accDetails, setAcc] = useState([]);
    const nav = useNavigate()
    const [uid, setUid] = useState('');


    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (acc) => {
            if (acc) {
                setUid(acc.uid);
            }
        });
        return () => unsubscribe();
    }, []);

    const [isAllowed, setAllowed] = useState()
    const [filteredAcc, setFil] = useState([])

    useEffect(() => {
        axios.get('http://localhost:8080/GetAcc')
            .then((res) => {
                const data = res.data; // Store the received data
                
                if (data.length > 0) {
                    setAcc(data);
                    const filteredData = data.filter((item) => item.Uid === uid);
                    if (filteredData.length > 0) {
                        setFil(filteredData[0]);
                        if(filteredAcc.isDeleted === true) {
                            alert("Your account has been deleted by owner")
                            nav('/')
                        }
                    } else {
                        console.log("No matching elements found for the given UID.");
                    }
                } else {
         
                    console.log("No data received from the server.");
                }
            }).catch((err) => {
                console.log(err);
            });
    }, [uid, accDetails ]); 
    

    useEffect(() => {
        console.log(filteredAcc.Position)
    }, [filteredAcc])


    const BanOrRec = (value, UidOfUser) => {
        axios.put(`http://localhost:8080/DelOrRec/${UidOfUser}`, {
            isDeleted: value
        }).then(() => {
            console.log('Account Status Changed!')
        }).catch((err) => {
            console.log(err)
        })
    }



    return (
        <div className='manageUsers'>
            <Header />
            <div className="manageUserCon">
                {filteredAcc && filteredAcc.Position === 'Owner' ? (
                    <React.Fragment>
                        <div className="manageUserText">
                            Monitor the details and <span>Manage</span> the users here!
                        </div>
                        <table>
                            <thead>
                                <tr>
                                    <td>Account Email</td>
                                    <td>Username</td>
                                    <td>Password</td>
                                    <td>Sex</td>
                                    <td>Position</td>
                                    <td>Log In</td>
                                    <td>Log Out</td>
                                    <td>Unique ID</td>
                                    <td>Delete Account</td>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredAcc && accDetails && accDetails.map((itm) => (
                                    <tr key={itm._id} className={`${itm.Uid === uid ? 'you' : ''}`}>
                                        <td>{accDetails &&itm.Email} </td>
                                        <td>{accDetails &&itm.Username}</td>
                                        <td>{accDetails &&itm.Password}</td>
                                        <td>{accDetails &&itm.Sex}</td>
                                        <td>{accDetails &&itm.Position}</td>
                                        <td>{moment(new Date(parseInt(accDetails &&itm.LogIn, 10))).format('MMMM Do YYYY, h:mm a')}</td>
                                        <td>{moment(new Date(parseInt(accDetails &&itm.LoggedOut, 10))).format('MMMM Do YYYY, h:mm a')}</td>
                                        <td>{accDetails &&itm.Uid}</td>
                                        <td>
                                            {accDetails &&itm.isDeleted === true ?
                                                <div className="manageConBtn">
                                                    <button onClick={() => { BanOrRec(itm.isDeleted === true ? false : true, itm.Uid) }} className='recover'>Recover</button>
                                                </div> :
                                                <div className="manageConBtn">
                                                    <button className='del' onClick={() => { BanOrRec(itm.isDeleted === true ? false : true, itm.Uid) }}>Yes</button>
                                                    <button>No</button>
                                                </div>
                                            }
                                        </td>
                                    </tr>
                                ))}

                            </tbody>
                        </table>
                    </React.Fragment>
                ) : (
                    <>
                        YOU ARE NOT ALLOWED HERE
                    </>
                )}
            </div>
        </div>
    )
}

export default ManageUsers
