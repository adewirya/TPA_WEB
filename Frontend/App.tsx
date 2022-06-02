import React, { createContext, useState, useEffect } from "react"
import GuessNavbar from "./Pages/Components/Navbars/GuessNavbar"
import Login from "./Pages/Login/Login"
import { useMutation } from "@apollo/client"
import Register from "./Pages/Register/Register"
import UserNavbar from "./Pages/Components/Navbars/UserNavbar"
import {BrowserRouter, BrowserRouter as Router, Redirect, Route, Switch} from 'react-router-dom'
import Home from "./Pages/Home/Home"
import VerifyEmail from "./Pages/VerifyEmail/VerifyEmail"
import ForgetPassword from "./Pages/ForgetPassword/ForgetPassword"
import ResetPassword from "./Pages/ForgetPassword/ResetPassword"
import Profile from "./Pages/Profile/Profile"
import OtherProfile from "./Pages/Profile/OtherProfile"
import { ThemeProvider } from 'styled-components';
import { lightTheme, darkTheme } from './theme';
import { GlobalStyles } from './global';
import Story from "./Pages/Components/Stories/Story"
import ExplorePage from "./Pages/ExplorePage/ExplorePage"
import EditAccount from "./Pages/EditAccount/EditAccount"
import { GET_USER } from "./postgre/Mutation"
import AddPost from "./Pages/AddPost/AddPost"
import Activity from "./Pages/Activity/Activity"
import DirectMessage from "./Pages/DirectMessage/DirectMessage"
import PostDetails from "./Pages/Components/HomeComponents/PostDetails"
import firebase from "firebase/app";
import "firebase/storage";


export const JWTContext = createContext<[string, React.Dispatch<React.SetStateAction<string>>]>(["", ()=>{}])
const firebaseConfig = firebase.initializeApp({
    apiKey: "AIzaSyD1co7uuc2TDRma6oDzGjcERfHN-vVagJs",
    authDomain: "inkagram-7681a.firebaseapp.com",
    projectId: "inkagram-7681a",
    storageBucket: "inkagram-7681a.appspot.com",
    messagingSenderId: "877073023201",
    appId: "1:877073023201:web:b2e0f8a15eae800638f7a0",
    measurementId: "G-4Y37CH5BTD"
  });

export const FirebaseAppContext = createContext(firebaseConfig);

export default function App(){

    const [jwt, setJwt] = useState("");

    useEffect(() => {
        const _jwt = localStorage.getItem("jwt");
        if (_jwt != null && _jwt !== "") {
            setJwt(_jwt);
        }
    }, []);
        
    useEffect(() => {
        localStorage.setItem("jwt", jwt);

    }, [jwt]);
  

    // console.log(jwt)
    
    return (
        <FirebaseAppContext.Provider value={firebaseConfig}>    
            <JWTContext.Provider value = {[jwt,setJwt]}>
                <BrowserRouter>
                    <Router>
                        <ThemeProvider theme = {lightTheme}>
                            <Switch>

                                <Route exact path="/profile">
                                    
                                    {
                                        (jwt !== "" && jwt !== undefined) ? <Profile/> : <Redirect to="/"/>
                                    }

                                    {/* <Profile></Profile> */}
                                
                                </Route>

                                <Route exact path="/login">
                                    {
                                        (jwt !== "" && jwt !== undefined) ? <Redirect to="/home"/> : <Login/>
                                    }
                                </Route>

                                <Route exact path="/signup">
                                    {
                                        (jwt !== "" && jwt !== undefined) ? <Redirect to="/home"/> : <Register/>
                                    }
                                </Route>

                                <Route path = "/stories">
                                    {
                                        (jwt !== "" && jwt !== undefined) ?  <Story/> : <Redirect to="/home"/> 
                                    }
                                    {/* <Story></Story> */}
                                </Route>

                                <Route path = "/postdetails/:id">
                                    {
                                        (jwt !== "" && jwt !== undefined) ?     <PostDetails/> : <Redirect to="/"/>
                                    }
                                    {/* <PostDetails/>  */}
                                </Route>

                                <Route path= "/settings">
                                    {
                                        (jwt !== "" && jwt !== undefined) ? <EditAccount/> : <Redirect to="/"/>
                                    }
                                </Route>

                                <Route path="/explore">
                                    {/* <ExplorePage></ExplorePage>  */}
                                    {
                                        (jwt !== "" && jwt !== undefined) ? <ExplorePage></ExplorePage> : <Redirect to="/"/>
                                    }
                                </Route>

                                <Route exact path="/home">
                                    {
                                        (jwt !== "" && jwt !== undefined) ? <Home/> : <Redirect to="/"/>
                                    }

                                    {/* <Home/> */}
                                </Route>

                                <Route path ="/activity">
                                    {
                                        (jwt !== "" && jwt !== undefined) ? <Activity/> : <Redirect to="/"/>
                                    }
                                    {/* <Activity></Activity> */}
                                </Route>

                                <Route path ="/direct"> 
                                    {
                                        (jwt !== "" && jwt !== undefined) ? <DirectMessage></DirectMessage> : <Redirect to="/"/>
                                    } 
                                    {/* <DirectMessage></DirectMessage> */}
                                </Route>

                                <Route path="/newpost">
                                    {
                                        (jwt !== "" && jwt !== undefined) ?  <AddPost/> : <Redirect to="/"/>
                                    }
                                    {/* <AddPost></AddPost> */}
                                </Route>

                                <Route path = "/verify/:email">
                                    {
                                        (jwt !== "" && jwt !== undefined) ? <Redirect to="/home"/> : <VerifyEmail></VerifyEmail>
                                    }
                                </Route>

                                <Route exact path ="/forgetpass"> 
                                    {
                                        (jwt !== "" && jwt !== undefined) ? <Redirect to="/home"/> : <ForgetPassword/>
                                    }
                                </Route>

                                <Route path ="/resetpassword/:token">
                                    <ResetPassword/>
                                </Route>

                                <Route path="/:username">
                                    <OtherProfile></OtherProfile>
                                </Route>

                                <Route exact path="/">
                                    {
                                        (jwt !== "" && jwt !== undefined) ? <Redirect to="/home"/> : <Redirect to="/login"/>
                                    }
                                </Route>
                            </Switch>
                        </ThemeProvider>
                    
                    </Router>
                    
                </BrowserRouter>
                
            </JWTContext.Provider>
        </FirebaseAppContext.Provider>    
            
        
    )
}