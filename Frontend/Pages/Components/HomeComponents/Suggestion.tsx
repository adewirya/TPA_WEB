import React from "react";
import { Link } from "react-router-dom";
export default function Suggestion({username,path}){


    return (
        <Link to={'/'+username} style={{textDecoration : 'none'}} className="suggestion-template">
            <img src={path} width="40px" height="40px" alt="" />
                <div className="name-name">
                    <div className="username">
                        {username}
                    </div>

                </div>
                
                <a href="#">
                    Follow
                </a>
         </Link>
    )
}