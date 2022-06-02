import React,{useState, useContext, useEffect} from "react";
import GuessNavbar from "../Components/Navbars/GuessNavbar";
import Footer from "../Components/Footer/Footer";
import { useMutation } from "@apollo/client";
import { NEW_USER } from "../../postgre/Mutation";
import { JWTContext } from "../../App";
import GoogleLoginButton from "../Components/GoogleLogin/GoogleButton";
import Popup from "react-animated-popup";
import {BrowserRouter, BrowserRouter as Router, Redirect, Route, Switch, Link} from 'react-router-dom'
import ReactLoading from "react-loading"
import Loading from "react-loading";

export default function Register(){

    const [email,setEmail] = useState("")
    const [fullname, setFullname] = useState("")
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")

    const [register,{data,loading,error}] = useMutation(NEW_USER)

    const [isVisible, setVisible] = useState(false)

    const setPopup= ()=>{
        setVisible(!isVisible)
    }

    function RegisterUser(){
        register({
            variables:{
                username : username,
                full_name : fullname,
                email : email,
                password : password,
                is_google : false,
                is_verified : false
            }
        })

    }  

    
    useEffect(() => {
        if (data != undefined){
            setVisible(!isVisible)
        }
    }, [data]);

    const RegisterBtn = () => <div className="loginBtn">
        <button  className="loginBtn" onClick={RegisterUser}>Sign Up</button> </div>

    const LoadingBtn = () => <div className="loginBtn"><button  className="loginBtn" ><ReactLoading type={"spokes"} color={'white'} height={'5%'} width={'5%'}/></button></div>


    return (
        <div className="register">
            <GuessNavbar></GuessNavbar>   
            <div className="form">
                <div className="top-form">
                    {/* <form action="/signup"> */}
                        <div className="title content">
                                <h2>
                                    InSOgram
                                </h2>
                                <h3>
                                    Sign up to see photos and videos from your friends.
                                </h3>
                        </div>
                        <div className="fb-btn">
                            <GoogleLoginButton></GoogleLoginButton>
                        </div>
                        <div className="or">
                            <hr />
                            OR
                            <hr />
                        </div>

                        <div className="input">
                            <input type="email" name="email" id="email" placeholder="Email" required onChange={(e) => setEmail(e.target.value)}/>
                        </div>

                        <div className="input">
                            <input type="text" name="fullname" id="fullname" placeholder="Full Name" required  onChange={(e)=> setFullname(e.target.value)}/>
                        </div>

                        <div className="input">
                            <input type="text" name="username" id="username" placeholder="Username" required  onChange = {(e)=> setUsername(e.target.value)}/>
                        </div>

                        <div className="input">
                            <input type="password" name="password" id="password" placeholder="Password" required  onChange= {(e)=> setPassword(e.target.value)}/>
                        </div>

                        {
                            (error) ? <div style={{color : 'red'}}>
                                {error.message}
                            </div> : <div></div>
                        }

                        <Popup visible={isVisible} onClose = {setPopup}>
                            <div className="popup">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="100px" height="100px" fill="none" viewBox="0 0 24 24" stroke="lightgreen">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>

                                    <h3>
                                        Verification Sent Succesfully
                                    </h3>

                                    <Link to ={"/verify/"+email} className="button"  style={{ textDecoration: 'none'}}>
                                        OK
                                    </Link>
                                </div>  
                        </Popup>

                        <div className="btn-container">
                            {
                                 (loading) ? <LoadingBtn/> : <RegisterBtn/>
                            }
                        </div>

                        <div className="agree">
                            <p>
                                By signing up, you agree to our Terms, Data 
                            </p>
                            <p>
                                Policy and Cookies Policy
                            </p>
                        </div>
                    {/* </form> */}
                </div>

                <div className="bot-form">
                    <div className="bot-form-content">
                        Have an Account? 
                    <Link to="/login"  style={{ textDecoration: 'none'}}>
                        Log in
                    </Link>
                    </div>
                </div>

            </div>

            <div className="get-the-app">
                    <div className="title">
                            Get the App
                    </div>
                    <div className="bot-pictures">
                        <img src="./apple.png" width="200px" height="100px" alt="" />
                        <img src="./google.png" width="175px" height="100px" alt="" />
                     </div>
            </div>

            <Footer></Footer>

            
        </div>
    )
}
