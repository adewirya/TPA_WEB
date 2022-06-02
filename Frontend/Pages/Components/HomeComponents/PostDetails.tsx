import React, {useState, useEffect} from "react";
import UserNavbar from "../Navbars/UserNavbar";
import CommentDetails from "./CommentDetails";
import Popup2 from "react-animated-popup";
import CopyToClipboard from "react-copy-to-clipboard"
import millify from "millify";
import Reply from "./Reply";
import { useMutation } from "@apollo/client";
import { GET_POST_BASED_ID,SELECT_POST_BASED_ID , LIKE_POST, UNLIKE_POST, SAVE_POST, UNSAVE_POST,ADD_COMMENT, LIKE_COMMENT, UNLIKE_COMMENT, GET_USER_BASED_ID, GET_USER} from "../../../postgre/Mutation";
import { Link, useParams } from "react-router-dom";
import { useHistory } from "react-router";
import Popup from "reactjs-popup";
import { FacebookShareButton, TwitterShareButton } from "react-share";

export default function PostDetails(){

    const get = useParams()


    const history = useHistory()
    const [isFollow, setFollow ] = useState(false)
    const [liked, setLiked] = useState(false)
    const [saved, setSave] = useState(false)
    const [isVisible, setVisible] = useState(false)
    const [replyVisible, setReplyVisible] = useState(false)

    const [deleteVisible, setDeleteVisible] = useState(false)
    const [getData, postData] = useMutation(GET_POST_BASED_ID)
    const [post, setPost] = useState({datas : []})

    const [comments, setComments] = useState({datas : []})

    const [likePost, likePostResult] = useMutation(LIKE_POST)
    const [unlikePost, unlikePostResult] = useMutation(UNLIKE_POST)

    const [likeComment,  likeCommentResult] = useMutation(LIKE_COMMENT)
    const [unlikeComment, unlikeCommentResult] = useMutation(UNLIKE_COMMENT)

    const [savePost, savePostResult] = useMutation(SAVE_POST)
    const [unsavePost, unsavePostResult] = useMutation(UNSAVE_POST)

    const [addComment, addCommentResult] = useMutation(ADD_COMMENT)

    const [selectById, selectResult] = useMutation(SELECT_POST_BASED_ID)

    const [commentMultiple, setCommentMultiple] = useState(5)
    const [replyMultiple, setReplyMultiple] = useState(3)


    const [getUser, userRes] = useMutation(GET_USER_BASED_ID)

    const [user_id, setUid] = useState("")

    const [caption , setCaption ] = useState("")
    const [likes , setLikes ] = useState(0)
    const [postLike, setPostLike ] = useState(0)

    var [imageIdx, setImageIdx] = useState(0)

    const [comment , setComment ] = useState("")

    const [owner, setOwner] = useState(false)

    const[name, setName] = useState("")

    // console.log(get)
    const post_id = get.id 

    function toggleDelete(){
        setDeleteVisible(!deleteVisible)
    }

    function postNewComment(){
        addComment({
            variables:{
                username : localStorage.getItem("username"),
                postId : post_id,
                comment : comment
            }
        })

        window.location.reload()

    }

    useEffect(() => {

        // console.log(post_id)

        getData({
            variables:{
                postId :post_id ,
                id : localStorage.getItem("uid")
            }
        })

        selectById({
            variables:{
                postId : post_id
            }
        })


    }, [post_id]);

    useEffect(() => {
        
        if (postData.data != undefined && postData.data != null ){
            // console.log(pos  tData.data.selectPostBasedID)
            
            if (postData.data.isSavedPost){
                setSave(true)
            }

            // console.log(postData.data.selectPostBasedID.user_id)

            getUser({
                variables:{
                    uid : postData.data.selectPostBasedID.user_id
                }
            })

            if (postData.data.getAllComment != null ){
                setComments({
                    datas : postData.data.getAllComment.map ((data, idx) =>{
                        
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

        if (selectResult.data != null && selectResult.data != undefined){


            if (selectResult.data.selectPostBasedID != null){
                setPost({
                    datas : selectResult.data.selectPostBasedID.post_contents.map((data, idx) =>{
    
                        return{
                            path : data.path, 
                            type : data.type
                        }
                    })
                })
                
                setCaption(selectResult.data.selectPostBasedID.caption)
                setPostLike(selectResult.data.selectPostBasedID.post_like)
                setUid(selectResult.data.selectPostBasedID.user_id)

                if (selectResult.data.selectPostBasedID.user_id == localStorage.getItem("uid")){
                    setOwner(true)
                }
            }
        }


    }, [postData.data, selectResult.data]);

    useEffect(() => {
        
        if (userRes.data != undefined && userRes.data != null){

            // console.log(userRes.data.getUserBasedID.username)
            setName(userRes.data.getUserBasedID.username)
        }


    }, [userRes.data]);

    let hour = "16h"
    let time = 17;
    let repCount = 3;

    function toggleReply(){
        setReplyVisible(!replyVisible)

        if (replyVisible){
            document.getElementById('reply').style.display = 'flex'
        }
        else
            document.getElementById('reply').style.display = 'none'
    }

    function toggleFollow (){
        setFollow(!isFollow)
    }

    function toggleSave(){
        setSave(!saved)
        // console.log(saved)

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

    function deletePost(){

    }

    function togglePopup(){
        // console.log('popap')
        setVisible(!isVisible)
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

    function addIdx(){
        if(post.datas.length == imageIdx){
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

    useEffect(() => {
        
        if (!owner){

        }
    }, [owner])


    const FollowingBtn = ()=> <button onClick={toggleFollow}>
    Following
</button>

    const FollowBtn = ()=> <button style={{color: "blue"}} onClick={toggleFollow}>
        Follow
    </button>

    const SavedBtn =       ()=>   <svg className="w-6 h-6" onClick={toggleSave} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"   ><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" /></svg>
    const UnSaveBtn =  ()=>                  <svg className="w-6 h-6" onClick={toggleSave} fill="black" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"   ><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" /></svg>


    
    const LikeBtn = ()=>                     <svg xmlns="http://www.w3.org/2000/svg" onClick={toggleLike} className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
    </svg>

    const LikedBtn = ()=>  <svg xmlns="http://www.w3.org/2000/svg" onClick={toggleLike} className="h-6 w-6" fill="red" viewBox="0 0 24 24" stroke="red">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
    </svg>

    const ChevronLeft = () =>                 <div className="chevron-left" onClick={minIdx}>
    <svg className="w-8 h-8" fill="none" stroke="white" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
    </div>

    const ChevronRight = () =>                 <div className="chevron-right" onClick={addIdx}>
    <svg className="w-8 h-8" fill="none" stroke="white" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
    </div>

    // console.log(post.datas.length)

    return (

        <div className="post-details">
            <UserNavbar></UserNavbar>

            <div className="content">

                <div className="left">

                    {
                        post.datas.map((data,idx) =>{


                            return (

                                <div className="img-container">

                                    <label htmlFor="">
                                        {
                                            (idx == imageIdx && data.type == "image") ? 
                                            <img src={data.path} alt=""  className="show"/>
                                            : 
                                            <img src={data.path} alt="" className="hidden"/>
                                        }

                                        {
                                            (idx == imageIdx && data.type == "video") ? 
                                            <video src={data.path} className="show" controls preload="auto"/>
                                            : 
                                            <video src={data.path} className="hidden" controls preload="auto"/>
                                        }

                                        {
                                            (post.datas.length > 1 && imageIdx != 0) ?
                                            <ChevronLeft></ChevronLeft> :
                                            null
                                        }

                                        {
                                            (post.datas.length > 1 && imageIdx != post.datas.length-1) ?
                                            <ChevronRight></ChevronRight> :
                                            null
                                        }
                                    </label>
                                                                                

                                </div>
                            )
                        })
                    }
                </div>

                <div className="right">

                    <div className="header">

                        <div className="left-header">

                            <img src=".././profile.png" className="w-8 h-8" alt="" />

                            
                            <div className="name">

                                {
                                (owner) ? <Popup  
                                trigger = {    
                                    <Link to ="/profile" style={{textDecoration : 'none'}}>
                                                                        {name}
                                    </Link>  
                                }
                                on  = "hover"
                                position="bottom left">
                                    <iframe src={"/profile"} width="300" height="300"></iframe>
                                </Popup>

                                :
                                    <Popup  
                                    trigger = {    
                                        <Link to ={"/" } style={{textDecoration : 'none'}}>
                                                                            {name}
                                        </Link>  
                                    }
                                    on  = "hover"
                                    position="bottom left">
                                        <iframe src={"/"+localStorage.getItem("username")} width="300" height="300"></iframe>
                                    </Popup>

                            }
                            </div>
                            <div className="button">
                                {
                                    (user_id == localStorage.getItem("uid")) ? null : (isFollow) ? <FollowingBtn/> : <FollowBtn/>
                                }
                            </div>
                        </div>

                        <div className="right-header">
                            {/* delete */}
                        <a href="#" onClick = {toggleDelete}>
                            <svg className="w-6 h-6" fill="none" stroke="black" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                            </a>

                            <Popup2
                                visible=  {deleteVisible}
                                onClose = {toggleDelete}
                            >
                                <div className="deletepopup">
                                    Are you sure you want to delete?
                                    <div>
                                        <button className="yes" onClick ={toggleDelete}>Yes</button>
                                        <button className="no" onClick = {deletePost}>No</button>
                                    </div>
                                </div>
                            </Popup2>


                        </div>

                    </div>

                    <div className="content-chat">

                        <div className="caption-cont">
                            <div className="caption">
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

                            <div className="hour">
                                    {hour}
                            </div>

                            {
                                (comments.datas.length != 0) ? 
                                
                                comments.datas.map((mapdata, idx) => {

                                    if (idx < commentMultiple) 
                                    return (


                                        <CommentDetails caption={mapdata.comment} commentId={mapdata.comment_id} likes = {mapdata.comment_like} name={mapdata.sender} key={idx}/>
                                    )   
                                })
                                
                                : 
                                null
                            }

                            {
                                (comments.datas.length > 5 ) ?

                                <div className="show-more" onClick={()=>setCommentMultiple(commentMultiple+5)}>
                                    Show More
                                </div> 
                                : 
                                null
                            }


                        </div>
                        

                    </div>

                    <div className="bottom">

                        <div className="logo" id="logo">
                            <div className="logo-1">
                                {/* love */}
                                {
                                    (liked) ? <LikedBtn/> : <LikeBtn/>
                                }

                                {/* chat */}
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                </svg>

                                {/* share */}
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" onClick={togglePopup}>
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                </svg>

                            </div>

                            <div className="logo-save">
                                {/* save */}
                                {
                                    (saved) ? <UnSaveBtn/> : <SavedBtn/>
                                }
                            </div>

                            <Popup2 visible={isVisible} onClose = {togglePopup}>
                                        <div className="popup">

                                            <button>
                                                <TwitterShareButton
                                                    url="https://inkagram-7681a.web.app"
                                                >
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

                                                </TwitterShareButton>
                                            </button>

                                            <button>

                                            <FacebookShareButton
                                            url="https://inkagram-7681a.web.app">

                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="darkblue"><path d="M22.5 0c.83 0 1.5.67 1.5 1.5v21c0 .83-.67 1.5-1.5 1.5h-6v-9h3l.75-3.75H16.5v-1.5c0-1.5.75-2.25 2.25-2.25h1.5V3.75h-3c-2.76 0-4.5 2.16-4.5 5.25v2.25h-3V15h3v9H1.5A1.5 1.5 0 0 1 0 22.5v-21C0 .67.67 0 1.5 0h21z"/></svg>
                                            </FacebookShareButton>
                                            </button>

                                            <div>

                                                Share
                                            </div>

                                            <div>
                                                Copy to clipboard
                                                <CopyToClipboard text={"localhost:1234/postdetails/"+post_id}>
                                                <button><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path></svg></button>
                                                </CopyToClipboard>
                                            </div>
                                        </div>  
                            </Popup2>
                        </div>

                        <div className="liked">
                            <div className="like">
                                {millify(postLike)} likes
                            </div>
                            <div className="time">
                                {time} Hours ago
                            </div>
                        </div>

                        <div className="input">
                            <input type="text" placeholder= "Add a comment" onChange={(e)=>setComment(e.target.value)}/>
                            <button onClick={postNewComment}>Post</button>
                        </div>

                    </div>

                </div>

            </div>

        </div>
    )
}