import { useMutation } from "@apollo/client";
import React,{useState} from "react";
import { FOLLOW, UNFOLLOW } from "../../../postgre/Mutation";
import { Link } from "react-router-dom";

export default function StartFollowing(){

    let name = "nikosidharta"
    let path = "./profile.png"

    const [followPerson, followResult] = useMutation(FOLLOW)
    const [unfollowPerson, unfollowResult] = useMutation(UNFOLLOW)
    

    const [follow, setFollow]= useState(false)

    function toggleFollow(){
        setFollow(!follow)
    }


    const Following = () =>  <button className="following" onClick={toggleFollow}>
                Following
            </button>

    const Follow = () =>                 <button className="follow" onClick={toggleFollow}>
    Follow
</button>

    return (
        
        <Link to="/niko" style={{textDecoration : 'none'}} className="start-following">

            <div className="image">
                <img src={path} className="w-8 h-8" alt="" />
            </div>

            <div className="cont">
                <b>{name}</b> started following you
            </div>

            <div className="button">
                {
                    (follow) ? <Following/> : <Follow/> 
                }
            </div>

        </Link>
    )
}