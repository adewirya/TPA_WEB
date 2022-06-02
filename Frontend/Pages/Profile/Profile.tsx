import React, {useEffect, useState, useContext} from "react";
import UserNavbar from "../Components/Navbars/UserNavbar";
import PostProfile from "../Components/ProfileComponent/PostProfile";
import Footer from "../Components/Footer/Footer";
import millify from "millify";
import { useMutation } from "@apollo/client";
import { GET_ALL_POST, SEARCH_USER, SELECT_POST_BASED_ID } from "../../postgre/Mutation";
import { JWTContext } from "../../App";
import { Link } from "react-router-dom";

export default function Profile (){

    const username = localStorage.getItem("username")
    const full_name = localStorage.getItem("fullname")

    const [postData, setPostData]  = useState({datas: []})
    const [savedData , setSavedData] = useState({datas : []})
    const [taggedData, setTaggedData] = useState({datas : []})


    const [jwt, setJwt] = useContext(JWTContext)
    const [select, selectResult] = useMutation(GET_ALL_POST)

    const [taggedPage, setTaggedPage] = useState(false)
    const [allPost, setAllPost] = useState(true)
    const [savedPost, setSavedPost] = useState(false)

    const [getSaved, savedResult] = useMutation(SEARCH_USER)


    const [getPost, postResult]= useMutation(SELECT_POST_BASED_ID)


    useEffect(() => {
        
        getSaved({
            variables:{
                username : localStorage.getItem("username")
            }
        })

    }, []);

    useEffect(() => {
        
        if (savedResult.data != null && savedResult.data != undefined){
            // console.log(savedResult.data.sendUserBasedOnUsername)

            if (savedResult.data.sendUserBasedOnUsername.saved_post != null){

                setSavedData({
                    datas : savedResult.data.sendUserBasedOnUsername.saved_post.map((data,idx)=>{
                        // console.log(data)
                        return {
                            post_id : data.post_id
                        }
                    })
                })
            }

            if (savedResult.data.sendUserBasedOnUsername.tagged_post != null){
                setTaggedData({
                    datas : savedResult.data.sendUserBasedOnUsername.tagged_post.map((data,idx) =>{

                        return {
                            post_id : data.post_id
                        }
                    })
                })
            }
        }


    }, [savedResult.data]);

    function toggleAll(){
        setTaggedPage(false)
        setSavedPost(false)
        setAllPost(true)
    }

    function toggleTagged(){
        setSavedPost(false)
        setAllPost(false)
        setTaggedPage(true)
    }

    function toggleSaved(){
        setTaggedPage(false)
        setAllPost(false)
        setSavedPost(true)
    }

    useEffect(() => {
        select({
            variables:{
                id : localStorage.getItem("uid")
            }
        })

    }, []);

    // con  sole.log(jwt)

    useEffect(() => {

        if (selectResult.data != undefined){
            if (selectResult.data.selectAllPost != null){
                setPostData({
                
                    datas : selectResult.data.selectAllPost.map((arr,idx) => {
    
                        return {
                            post_id : arr.id,
                            path : arr.post_contents[0].path,
                            type : arr.post_contents[0].type
                        };
            
                    }),
                } )
            }
            // console.log('masuk dalam')
        }

    }, [selectResult.data])


    return (
        <div className="profile-page">

            <UserNavbar/>

            <div className="container">

                <div className="top">

                    <div className="left">  
                        <Link to ="/stories" style = {{textDecoration : 'none'}}>
                            <img src="./profile.png" width="200px" height="200px" alt="" />
                        </Link>
                    </div>

                    <div className="right">

                        <div className="username">
                            {username}

                            <button>
                                Edit Profile
                            </button>

                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                        </div>


                        <div className="details">
                            <div className="post">
                                <b>{millify(20000)}</b> posts
                            </div>

                            <div className="followers">
                                <b>{millify(15000)}</b> followers
                            </div>

                            <div className="following">
                                <b>{millify(3000)}</b> following
                            </div>
                        </div>  

                        <div className="user-detail">
                            
                            <div className="full-name">
                                <b>{full_name}</b>
                            </div>

                            <p className="description">
                                Adewirya Niko Sidharta
                                <br />
                                施新发
                                <br />
                                NK 21-1
                                <br />
                                JB '20
                                <br />
                                B24
                            </p>

                        </div>

                    </div>

                </div>

                <div className="bottom">
                    <div className="pagination">

                        <div className="posts" onClick={toggleAll}>
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"></path></svg>
                            POSTS
                        </div>

                        <div className="saved" onClick={toggleSaved}>

                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" /></svg>
                            SAVED
                        </div>

                        <div className="tagged" onClick={toggleTagged}>
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" /></svg>
                            TAGGED
                        </div>

                    </div>

                    <div className="content-out">
                        <div className="content">

                            {
                                (allPost) ? 
                                    (postData.datas.length > 0) ?
                                        postData.datas.map((data, idx)=>{
                                            // console.log(postData.datas.length)
                                            return (
                                                <PostProfile key={data.post_id} id= {data.post_id}/>
                                            )
                                        })
                                    :

                                    <div>
                                        No post
                                    </div>
                                : 
                                null
                            }

                            { 
                                (savedPost) ? 

                                    (savedData.datas.length > 0) ? 

                                        savedData.datas.map((data,idx)=>{

                                            return(
                                                <PostProfile  id={data.post_id}/>
                                            )
                                        })
                                    :

                                    <div>
                                        no post
                                    </div>
                                
                                :
                                
                                null

                            }

                            {
                                (taggedPage) ? 
                                 
                                    (taggedData.datas.length > 0) ? 

                                        taggedData.datas.map((data,idx)=>{
                                            return (
                                                <PostProfile id={data.post_id}/>
                                                )
                                        })

                                    :
                                    <div>
                                        no post
                                    </div>
                                : 

                                null
                            }

                        </div>
                    </div>
                </div>

            </div> 
        
            <Footer></Footer> 
        </div>
    )
}