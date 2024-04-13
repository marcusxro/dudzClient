import React, { useEffect, useState } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { Authentication } from '../Authentication'
import { useNavigate } from 'react-router-dom'
import Sidebar from '../comps/Sidebar'
import waterCon from '../images/waterCon.jpg'
import waterJag from '../images/waterJag.jpg'
import miniGallon from '../images/miniGallon.png'
import markOne from '../images/markOne.png'
import markTwo from '../images/markTwo.png'

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import axios from 'axios'

const System = () => {
  const nav = useNavigate('')
  const [uid, setUid] = useState('')
  const [username, setUserName] = useState('')

  useEffect(() => {
    axios.get('http://localhost:8080/getacc')
      .then((res) => {
        const filteredData = res.data.filter((itm) => itm.Uid === uid)
        if (filteredData.length > 0) {
          setUserName(filteredData[0].Username)
          console.log(username)
        } else {
          console.log('User not found or data empty');
        }
      })
  }, [username, uid])

  useEffect(() => {
    const unsub = onAuthStateChanged(Authentication, (acc) => {
      if (!acc) {
        nav("/")
      } else {
        setUid(acc.uid)
        if(username) {
          axios.post('http://localhost:8080/postAct', {
            Username: username && username,
            Uid: uid
          }).then(() => {
            console.log("acc sent")
          }).catch((err) => {
            console.log(err)
          })
        }
      }
    })
    return () => { unsub() }
  }, [username, uid])

  const notify = (text) => {
    toast.success(text, {
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

  const sendCartItem = (itemName, itemPrice) => {
    axios.post("http://localhost:8080/SendCart", {
      Item: itemName,
      Price: itemPrice,
      Date: Date.now(),
      Uid: uid,
    }).then(() => {
      console.log("cart item sent")
      notify(`${itemName} has been successfully added to cart!`)
    }).catch((err) => {
      console.log(err)
    })
  }



  return (
    <div className='SystemCon'>
      <ToastContainer />
      <Sidebar />
      <div className="systemCon">
        <header>
          <div className="itemOne">
            Water Gallon
          </div>
          <div className="cart" onClick={() => { nav('/System/Cart') }}>
            <ion-icon name="cart-outline"></ion-icon>
          </div>
        </header>



        <div className="gallonCon">
          <div className="gallon">
            <div className="absoBtn">
              <div className="btn" onClick={() => { sendCartItem("Water Container", "30") }}>
                <ion-icon name="cart-outline"></ion-icon>
              </div>
            </div>
            <div className="gallonImg">
              <img src={waterCon} alt="" />
            </div>

            <div className="gallonLower">
              <div className="gallonInfo">
                <div className="name">
                  Water Container
                </div>
                <div className="price">
                  ₱30
                </div>
              </div>

              <div className="gallonBtn">
                <div className="btn" onClick={() => { sendCartItem("Water Jag (Refill)", "20") }}>
                  Refill
                </div>
                <div className="btn" onClick={() => { sendCartItem("Water Jag (Gallon)", "20") }}>
                  Buy Gallon
                </div>
              </div>
            </div>

          </div>

          <div className="gallon">
            <div className="absoBtn">
              <div className="btn">
                <ion-icon name="cart-outline" onClick={() => { sendCartItem("Water Jag", "30") }}></ion-icon>
              </div>
            </div>
            <div className="gallonImg">
              <img src={waterJag} alt="" />
            </div>
            <div className="gallonLower">
              <div className="gallonInfo">
                <div className="name">
                  Water Jag
                </div>
                <div className="price">
                  ₱30
                </div>
              </div>
              <div className="gallonBtn">
                <div className="btn" onClick={() => { sendCartItem("Water Jag (Refill)", "20") }}>
                  Refill
                </div>
                <div className="btn" onClick={() => { sendCartItem("Water Jag (Gallon)", "20") }}>
                  Buy Gallon
                </div>
              </div>
            </div>
          </div>

          <div className="gallon">
            <div className="absoBtn">
              <div className="btn">
                <ion-icon name="cart-outline" onClick={() => { sendCartItem("Water Gallon (empty)", "30") }}></ion-icon>
              </div>
            </div>
            <div className="gallonImg">
              <img src={waterJag} alt="" />
            </div>
            <div className="gallonLower">
              <div className="gallonInfo">
                <div className="name">
                  Water Gallon (empty)
                </div>
                <div className="price">
                  ₱30
                </div>
              </div>
              <div className="gallonBtn">
                <div className="btn">
                  (not available)
                </div>
                <div className="btn">
                  (not available)
                </div>
              </div>
            </div>
          </div>

          <div className="gallon">
            <div className="absoBtn">
              <div className="btn">
                <ion-icon name="cart-outline" onClick={() => { sendCartItem("Mini Gallon", "30") }}></ion-icon>
              </div>
            </div>
            <div className="gallonImg">
              <img src={miniGallon} alt="" />
            </div>
            <div className="gallonLower">
              <div className="gallonInfo">
                <div className="name">
                  Mini Gallon
                </div>
                <div className="price">
                  ₱30
                </div>
              </div>
              <div className="gallonBtn" onClick={() => { sendCartItem("Mini Gallon (Refill)", "20") }}>
                <div className="btn">
                  Refill
                </div>
                <div className="btn" onClick={() => { sendCartItem("Mini Gallon (Gallon)", "20") }}>
                  Buy Gallon
                </div>
              </div>
            </div>

          </div>


          <div className="gallon">
            <div className="absoBtn">
              <div className="btn">
                <ion-icon name="cart-outline" onClick={() => { sendCartItem("Water Gallon #3", "30") }}></ion-icon>
              </div>
            </div>
            <div className="gallonImg glln">
              <img src={markOne} alt="" />
            </div>
            <div className="gallonLower">
              <div className="gallonInfo">
                <div className="name">
                  Water Gallon #3
                </div>
                <div className="price">
                  ₱30
                </div>
              </div>
              <div className="gallonBtn">
                <div className="btn" onClick={() => { sendCartItem("Water Gallon #3 (Refill)", "30") }}>
                  Refill
                </div>
                <div className="btn" onClick={() => { sendCartItem("Water Gallon #3 (Gallon)", "30") }}>
                  Buy Gallon
                </div>
              </div>
            </div>
          </div>



          <div className="gallon">
            <div className="absoBtn">
              <div className="btn">
                <ion-icon name="cart-outline" onClick={() => { sendCartItem("Water Gallon #4", "30") }}></ion-icon>
              </div>
            </div>
            <div className="gallonImg glln">
              <img src={markTwo} alt="" />
            </div>
            <div className="gallonLower">
              <div className="gallonInfo">
                <div className="name">
                  Water Gallon #4
                </div>
                <div className="price">
                  ₱30
                </div>
              </div>
              <div className="gallonBtn">
                <div className="btn" onClick={() => { sendCartItem("Water Gallon #4 (Refill)", "20") }}>
                  Refill
                </div>
                <div className="btn" onClick={() => { sendCartItem("Water Gallon #4 (Gallon)", "20") }}>
                  Buy Gallon
                </div>
              </div>
            </div>

          </div>


        </div>
      </div>
    </div>
  )
}

export default System
