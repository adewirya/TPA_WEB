import React, {useState, useContext, useEffect} from "react";
import GuessNavbar from "../Components/Navbars/GuessNavbar";
import Footer from "../Components/Footer/Footer";
import { Link } from "react-router-dom";
import { useMutation } from "@apollo/client";
import { LOGIN_USER } from "../../postgre/Mutation";
import { JWTContext } from "../../App";
import GoogleLoginButton from "../Components/GoogleLogin/GoogleButton";
import ReactLoading from "react-loading"


export default function Login(){

    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")

    const [login, {data,loading,error}] = useMutation(LOGIN_USER)


    const [_, setJwt] = useContext(JWTContext)

    useEffect(() => {
        if (data !== undefined && data !== null){
            setJwt(data.login)
        }
    }, [data]);

    function LoginUser(){
        login({
            variables:{
                username : username,
                password : password
            }
        })

    }


    const LoginBtn = ()=> <button  className="loginBtn" onClick={LoginUser}>Log In</button>
    const LoadingBtn = ()=> <button  className="loginBtn"> <ReactLoading type={"spokes"} color={'white'} height={'10%'} width={'5%'}/></button>

    return (    
        <div className="login">
            <GuessNavbar></GuessNavbar>
            <div className="body">
                {/* <div className="login-container"> */}
                    <div className="phone">
                        <img src="./example_phone.png" alt="Phone Assets" />
                    </div>

                    <div className="form">
                        <div className="top-form">
                            {/* <form action=""> */}
                                <div className="title">
                                    <h2>
                                        InSOgram
                                    </h2>
                                </div>
                                <div className="input">
                                    <input type="text" name="text" id="text" placeholder="Username" onChange={(e)=> setUsername(e.target.value)}/>
                                </div>

                                <div className="input">
                                    <input type="password" name="password" id="password" placeholder="Password" onChange={(e)=> setPassword(e.target.value)} />
                                </div>

                                <div className="btn-container">
                                    {
                                        (loading) ? <LoadingBtn/> : <LoginBtn/>
                                    }
                                </div>

                                {
                                    (error) ? <div className="error">{error.message}</div> : <div></div>
                                }

                            <div className="or">
                                <hr />
                                OR
                                <hr />
                            </div>

                            <a href="" className="fb-login">
                                <GoogleLoginButton></GoogleLoginButton>
                            </a>

                            <Link to= "/forgetpass" style={{ textDecoration: 'none'}} >
                                <a href="" className="forgot">
                                    Forgot password?
                                </a>
                            </Link>

                        </div>

                        <div className="bot-form">
                            <div className="bot-form-content">
                                Don't have an account?   
                                <Link to ="/signup" style={{ textDecoration: 'none'}}>
                                    Sign Up
                                </Link>
                            </div>
                        </div>

                        <div className="get-the-app">
                            <div className="title">
                                Get the App
                            </div>
                            <div className="bot-pictures">
                                <img src="./apple.png" width="200px" height="100px" alt="" />
                                <img src="./google.png" width="180px" height="100px" alt="" />
                            </div>
                        </div>


                    </div>
                {/* </div> */}
            
            </div>


            <Footer></Footer>

            
        </div>
    )
}