import React,{useEffect, useState , useRef} from "react";
import Comment from "./Comment";
import Modal from "react-modal"
import Popup from "react-animated-popup";
import millify from "millify";
import {CopyToClipboard} from 'react-copy-to-clipboard';
import {Link} from "react-router-dom"
import { useMutation } from "@apollo/client";
import {GET_USER_BASED_ID , DELETE_POST, CHANGE_CAPTION ,GET_POST_BASED_ID,SELECT_POST_BASED_ID , LIKE_POST, UNLIKE_POST, SAVE_POST, UNSAVE_POST,ADD_COMMENT, LIKE_COMMENT, UNLIKE_COMMENT} from "../../../postgre/Mutation";

export default function Post({post_id}){

    const [deleteP, DelRes] = useMutation(DELETE_POST)
    const [changeC, res] = useMutation(CHANGE_CAPTION)

    const [comment, setComment] = useState("")
    const [saved, setSave] = useState(false)
    const [isVisible, setVisible] = useState(false)
    const [liked, setLiked] = useState(false)

    const [deleteVisible, setDeleteVisible] = useState(false)

    const [show, setShow] = useState(false)

    const [caption, setCaption] = useState("")
    const [poster, setPoster] = useState("")
    const [likes , setLikes] = useState(0)
    const [sender, setSender] = useState("")

    const [editVisible, setEditVisible] = useState(false)

    const [postData, setPostDatas] = useState({datas : []})

    const [ownerId, setOwnerId] = useState(0)


    const [select, selectResult] = useMutation(GET_POST_BASED_ID)
    const [getUser, getUserRes] = useMutation(GET_USER_BASED_ID)

    const [isVideoPaused, setVideoPaused] = useState(false)


    const bimbing = useRef<HTMLVideoElement>(null)

    let [imageIdx, setImageIdx] = useState(0)

    const [newCaption , setNewCaption] = useState("")

    const [likePost, likePostResult] = useMutation(LIKE_POST)
    const [unlikePost, unlikePostResult] = useMutation(UNLIKE_POST)

    
    const [savePost, savePostResult] = useMutation(SAVE_POST)
    const [unsavePost, unsavePostResult] = useMutation(UNSAVE_POST)

    const [addComment, addComRes] = useMutation(ADD_COMMENT)

    const [comments, setComments] = useState({datas : []})

    function addCommentToDB(){
        addComment({
            variables:{
                username : localStorage.getItem("username"),
                postId : post_id,
                comment : comment
            }
        })

        window.location.reload()
    }

    function toggleEdit(){
        setEditVisible(!editVisible)
    }

    function changeCaption(){
        changeC({
            variables:{
                postId : post_id,
                caption : newCaption
            }
        })

        window.location.reload()
    }

    function addIdx(){
        if(postData.datas.length == imageIdx){
            return
        }else{
            setImageIdx(imageIdx++)
        }
    }

    function minIdx(){
        if(imageIdx == 0){
            return
        }else{
            setImageIdx(--imageIdx)
        }
    }

    function deletePost(){
        deleteP({
            variables :{
                postId : post_id
            }
        })

        window.location.reload()
    }

    function handleVideo(){
        if (bimbing.current!.paused) {
            bimbing.current!.play()
            setVideoPaused(true)
        }
        else {
            bimbing.current!.pause()
            setVideoPaused(false)
        }
    }
    
    const ChevronLeft = () =>                 <div className="chevron-left" onClick={minIdx}>
    <svg className="w-8 h-8" fill="none" stroke="darkgray" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
    </div>

    const ChevronRight = () =>                 <div className="chevron-right" onClick={addIdx}>
    <svg className="w-8 h-8" fill="none" stroke="darkgray" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
    </div>

    const Play = () => <svg onClick={handleVideo}  className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>

    const Pause = () => <svg onClick={handleVideo}  className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>


    useEffect(() => {
        
        select({
            variables :{
                postId : post_id, 
                id : localStorage.getItem("uid")
            }
        })

    }, []);

    useEffect(() => {
        
        if (selectResult.data != undefined && selectResult.data != null){


            if (selectResult.data.selectPostBasedID != null){
                // console.log(selectResult.data.selectPostBasedID)  


                if (selectResult.data.selectPostBasedID != null){
                    setPostDatas({
                        datas : selectResult.data.selectPostBasedID.post_contents.map((data,idx)=>{
                            console.log(data)
                            return{
                                type : data.type,
                                path : data.path
                            }
                        })
                    })
    
                    setCaption(selectResult.data.selectPostBasedID.caption)
                    setLikes(selectResult.data.selectPostBasedID.post_like)
                    setOwnerId(selectResult.data.selectPostBasedID.user_id)
    
                }
            }

            // console.log(selectResult.data.isSavedPost)

            if (selectResult.data.isSavedPost){
                setSave(true)
            }

            if (selectResult.data.getAllComment != null){
                setComments({
                    datas : selectResult.data.getAllComment.map ((data,idx) =>{

                        // console.log(data)

                        return {
                            comment_id : data.id,
                            sender : data.sender_username,
                            comment : data.comments,
                            comment_like : data.comment_like
                        }
                    })
                })
            }
        }


    }, [selectResult.data]);

    useEffect(() => {
        
        if(ownerId != 0){
            getUser({
                variables:{
                    uid : ownerId
                }
            })
        }

    }, [ownerId]);

    useEffect(() => {
        
        if (getUserRes.data != undefined && getUserRes.data != null){

            if (getUserRes.data.getUserBasedID != null){
                // console.log(getUserRes.data.getUserBasedID)

                setSender(getUserRes.data.getUserBasedID.username)
            }
        }

    }, [getUserRes.data]);


    function togglePopup(){
        // console.log('popap')
        setVisible(!isVisible)
    }   

    function toggleDelete(){
        setDeleteVisible(!deleteVisible)
    }

    function toggleShow(){
        setShow(!show)
    }

    function toggleLike(){
        setLiked(!liked)

        if (liked  == false){
            // like post ke db


            likePost({
                variables:{
                    postId : post_id
                }
            })

        }
        else if (liked == true){
            // unlike post   ke db
            // console.log('coba unlike')
            unlikePost({
                variables:{
                    postId : post_id
                }
            })
        }

        window.location.reload()

    }

    function toggleSave(){
        setSave(!saved)

        if (saved == false){
                // save data ke db
            savePost({
                variables:{
                    id : localStorage.getItem("uid"),
                    postId : post_id
                }
            })
        }

        else if (saved == true){
            // unsave data ke db
            unsavePost({
                variables:{
                    id : localStorage.getItem("uid"),
                    postId : post_id
                }
            })
        }   

        window.location.reload()
    }

    useEffect(()=>{ 

        var post = document.getElementById("post")

        if (comment == ""){
            post.classList.remove("user-comment-add")
        }
        else{
            post.classList.add("user-comment-add")
        }
    })

    const NormalCaption = ()=> <div className="post"><b className="author">{poster}</b> {caption}</div>

    const LongCaption = () =>   <div className="post">
    <b className="author">{poster}</b> {caption} <button onClick={toggleShow}>Hide</button>
</div>

    const DeprecatedCaption = ()=> <div className="post">
    <b className="author">{poster}</b> {caption.substr(0,8)}... <button onClick={toggleShow}>more</button>
</div>

    const SavedBtn =       ()=>   <svg className="w-8 h-8" onClick={toggleSave} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"   ><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" /></svg>
    const UnSaveBtn =  ()=>                  <svg className="w-8 h-8" onClick={toggleSave} fill="black" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"   ><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" /></svg>


    const LikeBtn = ()=>                     <svg xmlns="http://www.w3.org/2000/svg" onClick={toggleLike} className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
    </svg>

    const LikedBtn = ()=>  <svg xmlns="http://www.w3.org/2000/svg" onClick={toggleLike} className="h-8 w-8" fill="red" viewBox="0 0 24 24" stroke="red">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
    </svg>


    return (
        <div className="post-homepage" id="post-homepage">
            <div className="header">
                <div className="left-homepage">
                    <img src="./profile.png" width="50px" height="50px" alt="" />
                    <div className="names">

                        <div className="username">
                            {sender}
                        </div>  
                        <div className="detail">
                            Paid partnership with <b>luxgamelab</b>
                        </div>

                    </div>
                </div>

                <div className="right-homepage">

                        {/* Edit */}
                    <a href="#" onClick={toggleEdit}>
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path></svg>
                    </a>


                    {/* Delete */}
                    <a href="#" onClick = {toggleDelete}>
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                    </a>

                    <Popup
                        visible=  {deleteVisible}
                        onClose = {toggleDelete}
                    >
                        <div className="deletepopup">
                            Are you sure you want to delete?
                            <div>
                                <button className="yes" onClick ={deletePost}>Yes</button>
                                <button className="no" onClick = {toggleDelete}>No</button>
                            </div>
                        </div>
                    </Popup>

                    <Popup
                        visible=  {editVisible}
                        onClose = {toggleEdit}
                    >
                        <div className="deletepopup">
                            Input your new Caption
                            <input type="text" onChange={(e)=> setNewCaption(e.target.value)}/>
                            <div>
                                <button className="yes" onClick ={changeCaption}>Yes</button>
                                <button className="no" onClick = {toggleEdit}>No</button>
                            </div>
                        </div>
                    </Popup>

                </div>

            </div>

            <div className="post-content">
            {
                                            (postData.datas.length > 1 && imageIdx != 0) ?
                                            <ChevronLeft></ChevronLeft> :
                                            null
                }
                { 
                  postData.datas.map((data,idx)=>{


                            return (
                                <div className="post-container">                     

                                        <div className="posts">
                                            {
                                                (idx == imageIdx && data.type == "image") ? 
                                        
                                                <img src={data.path} alt="vamvang" className="show" /> : 
                                                
                                                <img src={data.path} alt="vamvang" className="hidden" />
                                            }
                                            {
                                                (idx == imageIdx && data.type == "video") ? 
                                                
                                                <video src={data.path} className="show" ref={bimbing} preload="auto"/> : 
                                                
                                                <video src={data.path}  className="hidden" ref={bimbing} preload="auto"/> 
    
                                            }

                                            {
                                                (data.type == "video" && idx == imageIdx) ? 
                                                    (!isVideoPaused) ?  <Play/> :  <Pause/> :  null
                                            }
                                            
                                        </div>                             

                                </div>
    
                            )
                        
                    })
                }

                {
                        (postData.datas.length > 1 && imageIdx != postData.datas.length-1) ?
                        <ChevronRight></ChevronRight> :
                            null
                }  
            </div>

            <div className="logo" id="logo">
                <div className="logo-1">
                    {/* love */}
                    {
                        (liked) ? <LikedBtn/> : <LikeBtn/>
                    }

                    {/* chat */}
                    <Link to ={"/postdetails/"+ post_id}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="black">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                    </Link>

                    {/* share */}
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" onClick={togglePopup}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>

                </div>

                <div className="logo-save">
                    {/* save */}
                    {
                        (saved) ? <UnSaveBtn/> : <SavedBtn/>
                    }
                </div>

                <Popup visible={isVisible} onClose = {togglePopup}>
                            <div className="popup">

                                <button>
                                    <svg viewBox="328 355 335 276" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="blue">
                                    <path d="
                                        M 630, 425
                                        A 195, 195 0 0 1 331, 600
                                        A 142, 142 0 0 0 428, 570
                                        A  70,  70 0 0 1 370, 523
                                        A  70,  70 0 0 0 401, 521
                                        A  70,  70 0 0 1 344, 455
                                        A  70,  70 0 0 0 372, 460
                                        A  70,  70 0 0 1 354, 370
                                        A 195, 195 0 0 0 495, 442
                                        A  67,  67 0 0 1 611, 380
                                        A 117, 117 0 0 0 654, 363
                                        A  65,  65 0 0 1 623, 401
                                        A 117, 117 0 0 0 662, 390
                                        A  65,  65 0 0 1 630, 425
                                        Z"
                                        />
                                    </svg>
                                </button>

                                <button>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="darkblue"><path d="M22.5 0c.83 0 1.5.67 1.5 1.5v21c0 .83-.67 1.5-1.5 1.5h-6v-9h3l.75-3.75H16.5v-1.5c0-1.5.75-2.25 2.25-2.25h1.5V3.75h-3c-2.76 0-4.5 2.16-4.5 5.25v2.25h-3V15h3v9H1.5A1.5 1.5 0 0 1 0 22.5v-21C0 .67.67 0 1.5 0h21z"/></svg>
                                </button>

                                <div>
                                    Share
                                </div>

                                <div>
                                    Copy to clipboard
                                    <CopyToClipboard text="Meprika Homo">
                                    <button><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path></svg></button>
                                    </CopyToClipboard>
                                </div>
                            </div>  
                </Popup>
            </div>


            <div className="liked-by">
                {millify(likes)} likes
            </div>

            <div className="comments">
                <div className="author-content">
                    <div className="post">
                        
                        {
                            (caption.length < 20) ? <NormalCaption/> : (show) ? <LongCaption/> : <DeprecatedCaption/>
                        }

                    </div>
                </div>
                <div className="people-comments">
                    <Link to ={"/postdetails/"+post_id} className="view" style={{textDecoration: 'none '}}>
                        View all {millify(3)} comments
                    </Link>


                    {
                        (comments.datas.length > 0) ?
                        comments.datas.map((data,idx) =>{
                            // console.log(data)

                            if (idx < 5)

                            return (
                                <Comment comment={data.comment} sender={data.sender} key={idx}/>
                            )

                            else {
                                null
                            }

                        }) : 
                        null
                    }
                


                    <div className="viewed">
                        1 DAY AGO
                    </div>
                </div>
            </div>

            <div className="user-comment" id="post">
                <input type="text" placeholder="Add a comment..." onChange={(e)=>setComment(e.target.value)} />
                <a href="#" onClick={addCommentToDB}>Post</a>
            </div>
        </div>
    )
}