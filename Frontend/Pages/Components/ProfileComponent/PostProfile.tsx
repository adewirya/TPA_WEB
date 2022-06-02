import React, {useEffect, useState} from "react";
import { Link } from "react-router-dom";
import { useMutation } from "@apollo/client";
import { SELECT_POST_BASED_ID } from "../../../postgre/Mutation";


export default function PostProfile({id}){

    const [getPost, postResult] = useMutation(SELECT_POST_BASED_ID)
    // const [postData, setPostData] = useState({datas : []})
    const [source, setSource] = useState("")
    const [type, setType ] = useState("")
    
    useEffect(() => {
        
        getPost({
            variables :{
                postId : id
            }
        })


    }, []);

    useEffect(() => {
        
        if (postResult.data != undefined && postResult.data != null){
            
            if (postResult.data.selectPostBasedID != null){
                setSource(postResult.data.selectPostBasedID.post_contents[0].path)
                setType(postResult.data.selectPostBasedID.post_contents[0].type)
            }
        }


    }, [postResult.data]);

    
    return (
        <Link to ={"/postdetails/"+id} className="profile-post" style = {{textDecoration : 'none'}}>

            {
                (type == "image") ? <img src={source} width="267px" height="270px" alt="" /> : 
                <video src={source} width="267px" height="270px" controls preload="auto" />
            }
        </Link>
    )
}