import React, { useEffect, useState } from 'react'
import Header from '../comp/Header'
import FileMain from '../imgs/FileMan.png'
import InventoryImg from '../imgs/Inventory.png'
import RecordImg from '../imgs/Record.png'
import AccImg from '../imgs/Acc.png'
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../auth';
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const Static = () => {
    const [uid, setUid] = useState('');
    document.title = "DUDZCHAMCHOI | System"
    const nav = useNavigate()
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (acc) => {
            if (acc) {
                setUid(acc.uid);
            }
        });
        return () => unsubscribe();
    }, []);

    const [userName, setUserName] = useState([])
    const [accDetails, setAcc] = useState({});



    useEffect(() => {
        axios.get('http://localhost:8080/GetAcc')
            .then((res) => {
                setAcc(res.data[0])
                const filteredAcc = res.data.filter((item) => item.Uid === uid);
                setUserName(filteredAcc[0]);
            }).catch((err) => {
                console.log(err)
            })
    }, [accDetails])

    return (
        <div className='static'>
            <Header />
            <div className="staticCon">

               <div className="staticTextCon">
               <div className="staticText">
                    Welcome <span>{userName ? userName.Username : 'loading..'}</span> 👋
                </div>
                <div className="staticDesc">
                    Kinly read the text at the bottom and navigate in your choice!
                </div>
               </div>

                <div className="gridCon">

              
                    <div className="gridItem">
                        <div className="gridTitle">
                        Inventory
                        </div>
                        <div className="image">
                            <img src={InventoryImg} alt="" />
                        </div>
                        <div className="gridDesc">
                        Our inventory system tracks rice names, prices per kilo, product quantities, sales, and expenses for efficient management. It ensures accurate records and informed decision-making without the need for numerical specifics.
                        </div>
                        <div className="navTo" onClick={() => {nav('/System')}}>
                            Navigate
                        </div>
                    </div>



                    <div className="gridItem">
                        <div className="gridTitle">
                            Record of Transaction
                        </div>
                        <div className="image">
                            <img src={RecordImg} alt="" />
                        </div>
                        <div className="gridDesc">
                            Our transaction records capture essential details of each rice product sold, aiding in precise inventory management and informed decision-making. With this information, we navigate market fluctuations adeptly, ensuring seamless operations and customer satisfaction.
                        </div>
                        <div className="navTo" onClick={() => {nav('/Records')}}>
                            Navigate
                        </div>
                    </div>




                    <div className="gridItem">
                        <div className="gridTitle">
                            File Management
                        </div>
                        <div className="image">
                            <img src={FileMain} alt="" />
                        </div>
                        <div className="gridDesc">
                        Our file management system enables efficient organization, editing, and deletion of documents related to rice inventory, ensuring smooth operations and regulatory compliance.
                        </div>
                        <div className="navTo" onClick={() => {nav('/fileMaintenance')}}>
                            Navigate
                        </div>
                    </div>





                    <div className="gridItem">
                        <div className="gridItem">
                            <div className="gridTitle">
                                Manage Users
                            </div>
                            <div className="image">
                                <img src={AccImg} alt="" />
                            </div>
                            <div className="gridDesc">
                            In our account management system, administrators have the capability to delete user accounts as needed, ensuring security and streamlined access control.
                            </div>
                        </div>
                        <div className="navTo" onClick={() => {nav('/Manage')}}>
                            Navigate
                        </div>
                    </div>


                </div>
            </div>
        </div>
    )
}

export default Static
