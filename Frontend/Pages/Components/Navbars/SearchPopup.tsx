import React   from "react";
import { Link } from "react-router-dom";
import { ADD_HISTORY } from "../../../postgre/Mutation";
import { useMutation } from "@apollo/client";

export default function SearchPopup({username, full_name}){

    const [addHistory, addRes] = useMutation(ADD_HISTORY)

    function addToHistory(){
        addHistory({
            variables:{
                uid : localStorage.getItem("uid"),
                history : username
            }
        })
    }

    return (
        <Link to={"/"+username} onClick={addToHistory} style={{textDecoration : 'none'}} className="searching-template">
            <div className="left">
                <img src="./profile.png"  className= "w-8 h-8" alt="" />
            </div>

            <div className="right">

                <div className="username">
                    {username}
                </div>

                <div className="full-name">
                    {full_name}
                </div>

                </div>
        </Link>
    )
}