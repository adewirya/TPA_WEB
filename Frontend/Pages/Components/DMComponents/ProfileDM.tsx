import React from "react";
import { useMutation } from "@apollo/client";
import { GET_USER_BASED_ID } from "../../../postgre/Mutation";
import { useEffect, useState } from "react";

export default function ProfileDM({id}){


    // let otherName = "paai";
    const [name ,setName] = useState("")
    const [selectUser, selectRes] = useMutation(GET_USER_BASED_ID)
    const [path, setPath] = useState("")

    useEffect(() => {
        
        selectUser({
            variables:{
                uid : id
            }
        })

    }, []);

    useEffect(() => {
        
        if (selectRes.data != null && selectRes.data != undefined){
            setName(selectRes.data.getUserBasedID.username)
            setPath(selectRes.data.getUserBasedID.profile_picture)
        }

    }, [selectRes.data]);


    return (

        <div className="cont">                  
            <img src={path} className="w-8 h-8" alt="" />
            {name}
    </div>
    )
}