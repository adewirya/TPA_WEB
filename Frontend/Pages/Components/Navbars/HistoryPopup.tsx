import React from "react";

export default function HistoryPopup({history}){




    return (
        <div className="searching-template">

            <div className="right">

                <div className="username">
                    {history}
                </div>
            </div>
    </div>
    )
}