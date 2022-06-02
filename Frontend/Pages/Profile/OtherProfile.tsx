import React, {useState, useEffect} from "react";
import PostProfile from "../Components/ProfileComponent/PostProfile";
import UserNavbar from "../Components/Navbars/UserNavbar";
import Footer from "../Components/Footer/Footer";
import { useParams } from "react-router-dom";
import { SEARCH_USER,FOLLOW, GET_FOLLOW_STATUS, UNFOLLOW} from "../../postgre/Mutation";
import { useMutation } from "@apollo/client";
import { GET_ALL_POST } from "../../postgre/Mutation";

import { Redirect} from "react-router";
import millify from "millify";
import ReactLoading from "react-loading"
import { Link } from "react-router-dom";

export default function OtherProfile (){
    

    const get = useParams()
    const username = get.username;

    // if (username == localStorage.getItem("username")){
    //     return <div>
    //         please open on /profile
    //     </div>
    // }

    const [post, setPost] = useState(1231)
    const [followers, setFollowers] = useState(100000000)
    const [following , setFollowing] = useState(20000)
    const [once, setOnce] = useState(0)
    
    const [search, searchResult] = useMutation(SEARCH_USER)
    const [getFollowStatus, getStatusResult] = useMutation(GET_FOLLOW_STATUS)
    const [followPerson, getFollowResult] = useMutation(FOLLOW)
    const [unfollowPerson, getUnfollowResult] = useMutation(UNFOLLOW)
    const [select, selectResult] = useMutation(GET_ALL_POST)


    const [postData, setPostData]  = useState({datas: []})

    const [email ,setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [full_name, setFullName] = useState("")
    const [other_id, setOtherId] = useState(0)

    const [follow, setFollow] = useState(false)


    const [dataExist , setDataExists] = useState(false)

    
    if (localStorage.getItem("username") == ""){
        // document.getElementById('follow-btn').style.display = 'none'
    }
    
    useEffect(() => {

        search({
            variables:{
                username : username
            }
        })

    }, []);

    function Follow(){
        setFollow(true)
        followPerson({
            variables:{
                id : localStorage.getItem("uid"),
                targetId : other_id
            }, refetchQueries : [{query : GET_FOLLOW_STATUS}]
        })
    }

    function Unfollow(){
        setFollow(false)
        unfollowPerson({
            variables:{
                id : localStorage.getItem("uid"),
                targetId : other_id
            }, refetchQueries : [{query : GET_FOLLOW_STATUS}]
        })
    }

    useEffect(() => {

        if (!searchResult.error && searchResult.data != undefined){
            setOtherId(searchResult.data.sendUserBasedOnUsername.user_id);
            setEmail(searchResult.data.sendUserBasedOnUsername.email);
            setPassword(searchResult.data.sendUserBasedOnUsername.password);
            setFullName(searchResult.data.sendUserBasedOnUsername.full_name);
        }

    }, [searchResult.error, searchResult.data])

    useEffect(() => {

        if (other_id != 0){
            select({
                variables:{
                    id : other_id
                }
            })

            // console.log(localStorage.getItem("uid"))
            // console.log(other_id)
            
            getFollowStatus({
                variables:{
                    id : localStorage.getItem("uid"),
                    targetId : other_id
                }
            })
        }

        // console.log(other_id)

    }, [other_id])


    useEffect(() => {
        // console.log(selectResult.data)

        if (selectResult.data != undefined && selectResult.data != null ) {

            if (selectResult.data.selectAllPost != null){
                setPostData({
                
                    datas : selectResult.data.selectAllPost.map((arr,idx) => {
    
                        // console.log(arr.post_contents[0].path)
    
                        return {
                            post_id : arr.id,
                            path : arr.post_contents[0].path,
                            type : arr.post_contents[0].type
                        };
            
                    }),
                } )
                // console.log('masuk dalam')
    
                setDataExists(true)
            }
        }

    }, [selectResult.data])

    useEffect(() => {

        if (getStatusResult.data == undefined){
            setFollow(false)
            // console.log('masuk salah')
        }   

        else if (!getStatusResult.error || getStatusResult.data.getFollowStatus){
            setFollow(true)
            // console.log('masukkkk')
        }

    }, [getStatusResult.error , getStatusResult.data]);

    const [taggedPage, setTaggedPage] = useState(false)
    const [allPost, setAllPost] = useState(true)
    const [savedPost, setSavedPost] = useState(false)
    const [getSaved, savedResult] = useMutation(SEARCH_USER)


    const [savedData , setSavedData] = useState({datas : []})
    const [taggedData, setTaggedData] = useState({datas : []})

    useEffect(() => {
        
        getSaved({
            variables:{
                username : username
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

    const Followed = ()=>                             <button onClick={Unfollow}>
    <svg className="w-4 h-4" fill="black" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>

    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
    </button>


    const Unfollowed = () =>                <button onClick={Follow} className="follow" id="follow-btn">
        Follow
    </button>

    const LoadingButton = () => <button>
        <ReactLoading type={"spokes"} color={'black'} height={'15px'} width={'20px'}/>
    </button>
    

    return (
            <div className="profile-page">

            <UserNavbar/>

            <div className="container">

                <div className="top">

                    <div className="left">  
                        <img src=".././other-profile.png" width="200px" height="200px" alt="" />
                    </div>

                    <div className="right">

                        <div className="other-username">
                            {username}

                            <Link to ="/direct" style={{textDecoration : 'none'}}>
                                <button>
                                    Message
                                </button>
                            </Link>

                            { (getStatusResult.loading) ? <LoadingButton/> : (!follow) ? <Followed/> : <Unfollowed/>}

                            <button>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                            </button>

                            <div>
                                <a href="#">
                                    ...

                                </a>
                            </div>

                        </div>


                        <div className="details">
                            <div className="post">
                                <b>{millify(post)}</b> posts
                            </div>

                            <div className="followers">
                                <b>{millify(followers)}</b> followers
                            </div>

                            <div className="following">
                                <b>{millify(following)}</b> following
                            </div>
                        </div>  

                        <div className="user-detail">
                            
                            <div className="full-name">
                                <b>{full_name}</b>
                            </div>

                            <p className="description">
                            Was born from darkness, rises tomorrow
                            <br />
                            ✨ p.s I treat people accordingly ✨
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