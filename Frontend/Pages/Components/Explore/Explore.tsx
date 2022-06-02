import React from "react";
import PostProfile from "../ProfileComponent/PostProfile";

export default function Explore(){


    return (
        <div className="content-explore">
            <div className="top">
                <div className="left">
                    <PostProfile></PostProfile>
                    <PostProfile></PostProfile>
                </div>
                <div className="right">
                    <img src="/profile.png" width="566px" height="566px" alt="" />
                </div>
            </div>
            <div className="bot">   
                <PostProfile></PostProfile>
                <PostProfile></PostProfile>
                <PostProfile></PostProfile>
                <PostProfile></PostProfile>
                <PostProfile></PostProfile>
                <PostProfile></PostProfile>
            </div>
        </div>
    )
}