import React, {useState, useEffect} from "react";
import GuessNavbar from "../Components/Navbars/GuessNavbar";
import Footer from "../Components/Footer/Footer";
import { Link } from "react-router-dom";
import { useMutation } from "@apollo/client";
import { SEND_GMAIL_RESET } from "../../postgre/Mutation";
import Popup from "react-animated-popup";
import Countdown from "react-countdown";

export default function ForgetPassword(){

    const [email, setEmail] = useState("")
    const [isVisible, setVisible] = useState(false)

    const [date, setDate] = useState(Date.now())
    const [timeIndex, setTimeIndex] = useState(0)


    const [send, {data, loading ,error}] = useMutation(SEND_GMAIL_RESET)


    const Complete = ()=> <button onClick={sendResetLink}>Send Reset Password Link</button>

    const renderer = ({hours,minutes,seconds,completed}) => {
        if (completed){
            return <Complete/>;
        }else{
            return  <button >{seconds}</button>
        }
    }

    function sendResetLink(){
        // send reset link in here

        setVisible(!isVisible)
        send({
            variables:{
                email : email
            }
        })

        setDate(Date.now() + 10000)
        setTimeIndex(timeIndex + 1)
    }

    return (
        <div className="forgot-password">
            <GuessNavbar/>

                <div className="forgot-password-container">
                    <div className="form">
                        <svg xmlns="http://www.w3.org/2000/svg" width="100px" height="100px" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                        <h2>
                            Trouble Logging In?
                        </h2>
                        <p>
                            Enter your email and we'll send you a link to get back into your account
                        </p>

                        <div className="input"> 
                            <input type="email" placeholder="Email" onChange={(e)=>{setEmail(e.target.value)}}/>
                        </div>

                        {
                            (error) ? <div style={{color : 'red'}}>
                                {error.message}
                            </div> : <div></div>
                        }

                        <div className="btn-container">
                            <Countdown
                            date = {date}
                            key = {timeIndex}
                            renderer = {renderer}
                            />
                        </div>

                        <div className="or">
                            <hr />
                            OR
                            <hr />
                        </div>

                        
                        <Link to="/signup" className="create-new" style={{ textDecoration: 'none' }}>
                            Create New Account
                        </Link>


                                                    
                        <Popup visible={isVisible} onClose={() => setVisible(false)}>
                                <div className="popupreset">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="100px" height="100px" fill="none" viewBox="0 0 24 24" stroke="lightgreen">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <h3>
                                        We have sent a link to your email
                                    </h3>
                                    <div className="btn-container">
                                        <button onClick={()=>setVisible(false)} className="button">
                                            OK
                                        </button>
                                    </div>
                                </div>
                        </Popup>



                    </div>

                    <div className="back">

                        <Link to="/login" style={{ textDecoration: 'none' }} className="back-login">
                            Back To Login
                        </Link>

                    </div>
                    

                </div>


            <Footer/>
        </div>
    )
}