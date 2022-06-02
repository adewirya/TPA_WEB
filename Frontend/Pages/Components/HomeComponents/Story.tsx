import React, {useState} from "react";
import { Link } from "react-router-dom";

export default function Story(){

    return (
    <li className="story-template">
        <Link to = "/stories" style={{ textDecoration: 'none'}}>
            <div>
                <button className="story">
                    <div className="pp">
                        <img src="./profile.png" alt="" />
                    </div>
                    <div className="username-stories">
                        Mep Cebong
                    </div>
                </button>

            </div>
        </Link>
    </li>
    )
}