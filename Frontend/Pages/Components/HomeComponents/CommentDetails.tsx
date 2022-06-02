import React, {useState, useEffect} from "react";
import millify from "millify";
import { useMutation } from "@apollo/client";
import { LIKE_COMMENT, UNLIKE_COMMENT , DELETE_COMMENT, ADD_REPLY, DELETE_REPLY, GET_ALL_REPLY} from "../../../postgre/Mutation";
import Reply from "./Reply";

export default function CommentDetails({caption, name, likes, commentId}){

    let hour = "16h"
    let comment_id = commentId

    const [liked, setLiked] = useState(false)
    const [reply, setReply] = useState("")
    const [clicked, setClicked] = useState(false)

    const [likeComment , likeRes] = useMutation(LIKE_COMMENT)
    const [unlikeComment, unlikeRes] = useMutation(UNLIKE_COMMENT)
    const [deleteComment , deleteRes] = useMutation(DELETE_COMMENT)

    const [addReply, addRepRes] = useMutation(ADD_REPLY)
    const [delReply , delRepRes] = useMutation(DELETE_REPLY)
    const [getAllReply, allReply] = useMutation(GET_ALL_REPLY)

    const [replies, setReplies] = useState({datas : []})

    const[replyExists , setExists] = useState(false)

    const[showReply, setShow ]= useState(false)
    const [view, setView] = useState("Show")

    const [replyMultiple, setReplyMultiple] = useState(0)

    // let [currIdx, setCurrIdx] = useState(0)


    function toggleShow(){
        // setShow(true)

        if (replyMultiple > replies.datas.length){
            setView("Hide")

        }
        else
            setView("Show")

        if (view == "Hide"){
            setShow(false)
            setView("Show")
        }

        else if (view == "Show"){
            setShow(true)
        }

            setReplyMultiple(replyMultiple+3)
    }

    useEffect(() => {

        getAllReply({
            variables : {
                commentId : commentId
            }
        })

    }, []);

    useEffect(() => {
        
        if (allReply.data != undefined && allReply.data != null){

            if (allReply.data.getAllReply != null){
                setReplies({
                    datas : allReply.data.getAllReply.map((data,idx) =>{
                        return {
                            reply_id : data.id,
                            comment_id : data.comment_id,
                            msg : data.reply,
                            sender : data.sender
                        }
                    })
                })
                setExists(true)
            }


        }


    }, [allReply.data]);

    function addComment(){
        addReply({
            variables :{
                commentId : commentId,
                msg : reply,
                sender : localStorage.getItem("username")
            }
        })
        window.location.reload()

    }


    function toggleLike(){
        setLiked(!liked)

        if (liked == false){
            // console.log('mau di like')
            likeComment({
                variables:{
                    commentId : commentId
                }
            })
        }

        else if (liked == true){
            // di unlike
            unlikeComment({
                variables:{
                    commentId : commentId
                }
            })
        }
    }

    function deleteC(){
        deleteComment({
            variables:{
                commentId : commentId
            }
        })
        // history.push("/profile")
    }

    const Liked = () =>             <svg xmlns="http://www.w3.org/2000/svg" onClick={toggleLike} className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="gray">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
    </svg>

    const Unlike = () =><svg xmlns="http://www.w3.org/2000/svg" onClick={toggleLike} className="h-4 w-4" fill="red" viewBox="0 0 24 24" stroke="red">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
    </svg>

    return (
        <div className="comment-container">
            <div className="comment">
                                <div className="caption-comment">
                                        <div>
                                            <img src=".././profile.png" className="w-8 h-8" alt="" />
                                        </div>

                                        <div className="name">
                                            {name}
                                        </div>

                                        <div>
                                            {caption}
                                        </div>
                                        
                                </div>

                                <div className="bottom">
                                    <div className="hour">
                                        {hour}
                                    </div>

                                    <div className="like">
                                        {millify(likes)} likes
                                    </div>

                                    <div className="reply" onClick={()=>setClicked(!clicked)}>
                                            Reply
                                    </div>

                                    <div>
                                        {
                                            (liked) ? <Unlike/> : <Liked/>
                                        }

                                        {/* garbage */}
                                        <svg className="w-4 h-4" fill="none" stroke="gray" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" onClick={deleteC}/></svg>
                                    </div>
                                </div>


                                {
                                    (clicked) ? 
                                    <div className="reply-div">
                                        <input type="text" name="" id="" onChange={(e)=> setReply(e.target.value)}/>
                                        <button onClick={addComment}>Post</button>
                                    </div>
                                    
                                    : 
                                    null
                                }
                            </div>

                                {
                                    (replies.datas.length < 3) ? 
                                    replies.datas.map((replydata,idx)=>{

                                        // if (idx < replyMultiple)
                                        return (
                                            <Reply caption={replydata.msg} name={replydata.sender} replyId={replydata.reply_id}/>
                                        )
                                    }) : 
                                    

                                    (replyExists) ? 
                                        <div className='reply-click' onClick ={toggleShow}>
                                            <hr /> {view} Replies {millify(3)}
                                        </div>
                                    : null        
                                    
                                }

                                {
                                    (showReply ) ? 
                                    replies.datas.map((replydata,idx)=>{

                                        if (idx < replyMultiple)
                                        return (
                                            <Reply caption={replydata.msg} name={replydata.sender} replyId={replydata.reply_id}/>
                                        )
                                    }) : 
                                    null
                                    
                                }
        </div>
    )
}