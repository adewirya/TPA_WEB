import React from "react";


export default function MentionStory(){

    let senderPath = "./other-profile.png";
    let sender = "Pai"
    let postPath = "./tesss.png"

    return (
        <div className="template-notif">

            <div className="image-left">
                <img src={senderPath} className="w-8 h-8" alt="" />
            </div>
            
            <div className="mid-content">
                <b>{sender}</b> Mentioned you in their story.
            </div>

            <div className="image-right ">
                <img src={postPath} className="w-8 h-8" alt="" />

            </div>

        </div>
    )
}