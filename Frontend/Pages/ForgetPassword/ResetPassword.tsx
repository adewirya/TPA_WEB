import React, {useState} from "react";
import GuessNavbar from "../Components/Navbars/GuessNavbar";
import { Link, useParams } from "react-router-dom";
import Footer from "../Components/Footer/Footer";
import { RESET_PASSWORD } from "../../postgre/Mutation";
import { useMutation } from "@apollo/client";
import Popup from "react-animated-popup";
export default function ResetPassword(){

const get = useParams()
console.log(get)

const token = get.token

const [reset, {data, loading , error}] = useMutation(RESET_PASSWORD)
const [isVisible, setVisible] = useState(false)

const [password, setPassword] = useState("")
const [confirmPassword , setConfirmPassword] = useState("")



function resetPassword(){

    setVisible(!isVisible)

    if (password !== confirmPassword){
        return
    }

    reset({
        variables:{
            token: token,
            password : password
        }
    })
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
                            Reset Your Password 
                        </h2>
                        <p>
                            Enter the new password for your InSOgram account
                        </p>

                        <div className="input"> 
                            <input type="password" placeholder="Password" onChange={(e)=>{setPassword(e.target.value)}}/>
                        </div>

                        <div className="input"> 
                            <input type="password" placeholder="Confirm Your Password" onChange={(e)=>{setConfirmPassword(e.target.value)}}/>
                        </div>

                        <div className="btn-container">
                            <button onClick={resetPassword}>
                                Change Password
                            </button>
                        </div>
                        
                            <Popup visible={isVisible} onClose={() => setVisible(false)}>
                                <div className="popupreset">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="100px" height="100px" fill="none" viewBox="0 0 24 24" stroke="lightgreen">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <h3>
                                        Password Has Changed Succesfully
                                    </h3>
                                    <div className="btn-container">
                                        <Link to ="/login" style={{ textDecoration: 'none' }} onClick={()=>setVisible(false)} className="button">
                                            OK
                                        </Link>
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