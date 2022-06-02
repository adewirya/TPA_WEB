import React,{useState} from "react";
import millify from "millify";
import { useMutation } from "@apollo/client";
import { DELETE_REPLY} from "../../../postgre/Mutation";


export default function Reply({caption , name, replyId}){

    let hour = "16h"
    let likes = 211;


    const [liked, setLiked] = useState(false)
    const [deleteReply, delRepRes] = useMutation(DELETE_REPLY)

    function trashReply(){

        deleteReply({
            variables:{
                replyId : replyId
            }
        })

        // console.log('masuk delete')
    }


    function toggleLike(){
        setLiked(!liked)
    }

    const Liked = () =>             <svg xmlns="http://www.w3.org/2000/svg" onClick={toggleLike} className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="gray">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
    </svg>

    const Unlike = () =><svg xmlns="http://www.w3.org/2000/svg" onClick={toggleLike} className="h-4 w-4" fill="red" viewBox="0 0 24 24" stroke="red">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
    </svg>


    return (

        <div className="reply-details" id="reply">
                                <div className="caption-reply">
                                        <div>
                                            <img src=".././profile.png" className="w-8 h-8" alt="" />
                                        </div>

                                        <div className="name">
                                            {name}
                                        </div>

                                        <div className='content-caption'>
                                            {caption}
                                        </div>
                                        
                                </div>
                                <div className="bottom-reply">
                                    <div className="hour">
                                            {hour}
                                    </div>

                                    <div className="like">
                                            {millify(likes)} likes
                                    </div>

                                    <div>
                                        {
                                            (liked) ? <Unlike/> : <Liked/>
                                        }

                                        {/* garbage */}
                                        <svg className="w-4 h-4" fill="none" stroke="gray" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" onClick={trashReply} /></svg>
                                    </div>
                                </div>
                            </div>
    )
}