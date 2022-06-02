import React from "react";


export default function Chat(){


    let content = "hampir seminggu ga ngobrol, kamu apa kabarnya? kangen ga? 😊"


    return (
        <div className="chat">
                            
            <div>
                <img src="./other-profile.png" className="w-6 h-6" alt="" />
            </div>
            <div className="chat-content">
                {content}
            </div>
        </div>
    )
}