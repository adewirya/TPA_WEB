import React from "react";
import Popup from "react-animated-popup";


export const VerifEmailPopup = props =>{

    return (
        <div className="popup-box">
            <div className="box">
                {props.content}
            </div>
        </div>
    )
}