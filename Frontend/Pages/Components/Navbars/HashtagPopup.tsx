import React from "react";
import { Link } from "react-router-dom";

export default function HashtagPopup({hashtag}){




    return (
        <Link to={"/"} style={{textDecoration : 'none'}} className="searching-template">
            <div className="left">
                #
            </div>

            <div className="right">

                <div className="username">
                    {hashtag}
                </div>
            </div>
    </Link>
    )
}