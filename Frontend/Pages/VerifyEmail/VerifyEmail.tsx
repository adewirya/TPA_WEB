import React, {useState, useEffect, useContext} from "react";
import { Link, useParams } from "react-router-dom";
import Footer from "../Components/Footer/Footer";
import GuessNavbar from "../Components/Navbars/GuessNavbar";
import { VERIFY_USER, RESEND_VERIFY} from "../../postgre/Mutation";
import { useMutation } from "@apollo/client";
import { JWTContext } from "../../App";
import Popup from "react-animated-popup";
import Countdown from "react-countdown";

export default function VerifyEmail (){

    const get = useParams()
    const email = get.email
    console.log(email)

    const [_, setJwt] = useContext(JWTContext)

    const [confirmationCode, setConfirmationCode] = useState("")

    const [timeIndex, setTimeIndex] = useState(0)
    const [currTime, setCurrTime] = useState(Date.now() + 10000)

    const [isPopup, setPopup] = useState(false)


    const [verification, {data,loading , error }] = useMutation(VERIFY_USER)

    const [resent] = useMutation(RESEND_VERIFY)
    
    useEffect(() => {
        if (data !== undefined && data !== null){
            setJwt(data.verifyUser)
            console.log('hahah')
        }

    }, [data]);

    useEffect (()=>{
        var btn = document.getElementById("btn-code");
        if (confirmationCode == ""){    
            btn.classList.remove("btn-after")
        }
        else{
            btn.classList.add("btn-after")
        }

    }, [confirmationCode])

    const togglePopup = ()=>{
        setPopup(!isPopup)
    }

    
    const Complete = ()=> <a href="#" onClick={resendVerification}>Resend Verification</a>;

    const renderer = ({hours,minutes,seconds,completed}) => {
        if (completed){

            return <Complete/>;
        }else{
            return <div className="countdown">
                {seconds}
            </div>
        }
    }

    function resendVerification(){
        togglePopup()
        resent({
            variables:{
                email : email
            }
        })
        setCurrTime(Date.now() + 10000)
        setTimeIndex(timeIndex + 1)        
    }

    function verify(){
        // verify with confirmation code here
        verification({
            variables:{
                token : confirmationCode,
                email : email
            }
        })

        if (error){
            console.log(error)
        }
    }   

    return (
        <div className="verif-email">
            <GuessNavbar></GuessNavbar>
            <div className="container">
                <div className="verif-email-container">
                    <div className="top-form">
                        <svg xmlns="http://www.w3.org/2000/svg" width="100px" height="100px" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 19v-8.93a2 2 0 01.89-1.664l7-4.666a2 2 0 012.22 0l7 4.666A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19l6.75-4.5M21 19l-6.75-4.5M3 10l6.75 4.5M21 10l-6.75 4.5m0 0l-1.14.76a2 2 0 01-2.22 0l-1.14-.76" />
                        </svg>
                        <h2>
                            Enter The Confirmation Code
                        </h2>
                        <p>
                            Enter the confirmation code we sent to {email + " "}
                            not receiving your code? 
                            {/* <a href="#" onClick={resendVerification}>
                                Resend Verification
                            </a> */}
                            <Countdown
                                date={currTime}
                                renderer={renderer}
                                key = {timeIndex}
                            />

                            
                        </p>
                        <div className="input">
                            <input type="text" name="code" placeholder="Enter your confirmation code" onChange={(e)=>setConfirmationCode(e.target.value)}/>
                        </div>

                        <div className="btn-container">
                            <div className="btn" id="btn-code">
                                <button onClick={verify}>
                                        Next
                                </button>
                            </div>
                            {/* <Link to ="/" className="btn"  style={{ textDecoration: 'none' }} onClick={verify}> */}
                            {/* </Link> */}
                        </div>

                        <div >
                            <Link to="/signup"  className="go-back"  style={{ textDecoration: 'none' }}>
                                Go Back
                            </Link>
                        </div>
                    </div>  


                    <div className="bot-form-verif">
                            <div>
                                Have an Account? 
                                <Link to="/login"  style={{ textDecoration: 'none'}}>
                                    Log in
                                </Link>
                            </div>
                    </div>


                    <div className="get-the-app">
                            <div className="title">
                                Get the App
                            </div>
                            <div className="bot-pictures">
                                <img src="/apple.png" width="200px" height="100px" alt="wat" />
                                <img src="/google.png" width="175px" height="100px" alt="wat" />
                            </div>
                    </div>

                </div>

                <Popup visible={isPopup} onClose = {togglePopup}>
                    <div className="popup">
                            <svg xmlns="http://www.w3.org/2000/svg" width="100px" height="100px" fill="none" viewBox="0 0 24 24" stroke="lightgreen">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>

                            <h3>
                                Verification Sent Succesfully
                            </h3>

                            <button onClick={togglePopup}>
                                OK
                            </button>
                        </div>  
                </Popup>

            </div>
            
            <Footer></Footer>
           
        </div>
    )
}