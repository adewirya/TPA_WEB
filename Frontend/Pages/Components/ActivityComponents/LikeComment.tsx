import React from "react";
import { Link } from "react-router-dom";

export default function LikeComment(){

    let senderPath = "./other-profile.png";
    let sender = "Pai"
    let postPath = "./tesss.png"

    return (
        <Link to="/postdetails/18" style={{textDecoration : 'none'}} className="template-notif">

            <div className="image-left">
                <img src={senderPath} className="w-8 h-8" alt="" />
            </div>
            
            <div className="mid-content">
                <b>{sender}</b> liked your comment: otw good boy
            </div>

            <div className="image-right ">
                <img src={postPath} className="w-8 h-8" alt="" />

            </div>

        </Link>
    )
}