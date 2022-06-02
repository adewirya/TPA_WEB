import React,{useContext, useState, useMemo, useEffect} from "react";
import { Link } from "react-router-dom";
import { JWTContext } from "../../../App";
import Popup from "reactjs-popup";
import { SEARCH_USER_HEADER , GET_USER_BASED_ID} from "../../../postgre/Mutation";
import { useMutation } from "@apollo/client";
import StartFollowing from "../ActivityComponents/StartFollowing";
import LikeComment from "../ActivityComponents/LikeComment";
import LikePost from "../ActivityComponents/LikePost";
import MentionStory from "../ActivityComponents/MentionStory";
import MentionComment from "../ActivityComponents/MentionComment";
import TagPost from "../ActivityComponents/TagPost";
import { debounceTime, map, distinctUntilChanged, Subject } from "rxjs";
import SearchPopup from "./SearchPopup";
import ReactLoading from "react-loading"
import HashtagPopup from "./HashtagPopup"
import ToggleTheme from "../ThemeToggle/ToggleTheme";
import HistoryPopup from "./HistoryPopup";

export default function UserNavbar (){

    let subject = useMemo(() => new Subject<string>(), [])

    let [searching, searchingResult] = useMutation(SEARCH_USER_HEADER)
    const [getUser, userRes] = useMutation(GET_USER_BASED_ID)

    const [_,setJWT] = useContext(JWTContext);

    const [visible, setVisible] = useState(false)

    const [search, setSearch] = useState ({datas : []})
    const [hashtags, setHashtags] = useState({datas : []})
    const [histories, setHistories] = useState({datas : []})

    const [home, setHome] = useState(false)
    const [message, setMessage] = useState(false)
    const [explore, setExplore] = useState(false)
    const [activity, setActivity] = useState(false)
    const[showHistory, setShowHistory] = useState(false)

    const [autocomplete, setAutocomplete] = useState("")

    const[path, setPath] = useState("")

    const uid = localStorage.getItem("uid")

    useEffect(() => {

        if (uid != "" ){
            getUser({
                variables:{
                    uid : uid
                }
            })
        }
    }, [uid])

    useEffect(() => {
        
        if (userRes.data != null && userRes.data != undefined){

            // setPath(userRes.data.getUserBasedID.profile_picture)
            setPath("./profile.png")

            if (userRes.data.getUserBasedID.history != null){

                setHistories({
                    datas : userRes.data.getUserBasedID.history.map((data,idx)=>{
                        return{
                            history : data.history
                        }
                    })
                })
            }
        }

        // if (userRes.data)

    }, [userRes.data])

    function toggleHome(){
        toggleAll()
        setHome(!home)
    }

    function toggleMessage(){
        toggleAll()
        setMessage(!message)
    }

    function toggleExplore(){
        toggleAll()
        setExplore(!explore)
    }

    function toggleActivity(){
        toggleAll()
        setActivity(!activity)
    }

    function toggleAll(){
        setHome(false)
        setMessage(false)
        setExplore(false)
        setActivity(false)
    }


    function logout(){
        setJWT("")
        localStorage.clear()
    }

    useEffect(() => {

        // console.log(subject)
        const subscribe = subject

            .pipe(
                debounceTime(500),
                distinctUntilChanged(),
                map(search => search.trim())
            )
            .subscribe(search => {
                searching({
                    variables:{
                        username: search,
                        currUser : localStorage.getItem("username")
                    }
                })
            })
        
        return (() => {subject.unsubscribe})

    }, [subject])
    

    useEffect(() => {

        if (!subject.closed){
            setVisible(true)
            setShowHistory(false)
        }
        else {
            setVisible(false)
            // setShowHistory
        }
        
        if (searchingResult.data  != undefined && searchingResult.data != null){
            // console.log(searchingResult.data.searchUserAuto)
            setSearch({
                datas : searchingResult.data.searchUser.map((searchingData, idx) =>{

                    // console.log(searchingData)
                    return{
                        username : searchingData.username,
                        user_id : searchingData.user_id,
                        full_name : searchingData.full_name
                    }
                })
            })

            // if (searchingResult)
            setAutocomplete(searchingResult.data.searchUserAuto)

            if (searchingResult.data.searchHashtag != null){
                setHashtags({
                    datas : searchingResult.data.searchHashtag.map((searchingData, idx) =>{
    
                        // console.log(searchingData)
                        return{
                            hashtag : searchingData.name
                        }
                    })
                })
            }

            // console.log(search)
        }


        if (searchingResult.data == undefined){
            setVisible(false)
            setShowHistory(false)
        }
        // console.log(subject)
        // setVisible(true)

    }, [searchingResult.data])

    // console.log(subject.next)

    const HomeUnclicked = ()=>                     <Link to= "/home" className="homess" onClick={toggleHome}>
    <svg className="w-8 h-8" fill="none" stroke="black" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
    {/* asdasdasdsada */}
</Link>

    const HomeClicked = ()=>                     <Link to= "/home" className="homess" onClick={toggleHome}>
    <svg className="w-8 h-8" fill="black" stroke="black" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
    {/* asdasdasdsada */}
</Link>
    

    // setVisible(true)

    return (
        <div className="user-navbar">
            <div className="user-nav-responsive">

                <div>
                    <Link to ="/home"  style={{ textDecoration: 'none'}} className="title">
                        InSOgram
                    </Link>
                </div>

                <ToggleTheme></ToggleTheme>

                <Popup
                    trigger={
                    <div className="profile">
                        <img src={path} className="w-8 h-8" alt="" />
                    </div>
                    }
                    position="bottom right"
                    // className="samting"
                    >
                        <div className="pop-up">
                            <div className="pop-up-container">

                                <div className="pop-up-content">
                                        <Link to ="/profile" style={{ textDecoration: 'none'}} className="pop-up-content-link">
                                            <svg className="w-6 h-6" fill="none" stroke="black" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                                Profile
                                        </Link>
                                </div>
                                
                                <div className="pop-up-content">
                                    <Link to = "" className="pop-up-content-link" style={{ textDecoration: 'none'}}>
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" /></svg>
                                        Saved
                                    </Link>
                                </div>

                                <div className="pop-up-content">

                                    <Link to = "/settings" className="pop-up-content-link" style={{ textDecoration: 'none'}} >
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                                        Settings
                                    </Link>
                                </div>

                                <div className="pop-up-content">

                                    <Link to = "" className="pop-up-content-link" style={{ textDecoration: 'none'}}>
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path></svg>

                                        Switch Account
                                    </Link>
                                </div>

                                <div className="pop-up-content logout"> 
                                    <Link to = "/login" className="pop-up-content-link" onClick={logout} style={{ textDecoration: 'none'}}>
                                        Log Out
                                    </Link>
                                </div>

                            </div>

                                
                        </div>

                    </Popup>

            </div>

            <div className="user-nav">
                <div>
                    <Link to ="/home"  style={{ textDecoration: 'none'}} className="title">
                        InSOgram
                    </Link>
                </div>

                <ToggleTheme></ToggleTheme>



                <div className="search-bar">
                    <input type="search" name="search" id="search" placeholder="Search"  onChange={(e)=> subject.next(e.target.value)} 
                    autoComplete={autocomplete} onClick={()=>setShowHistory(true)}
                    />


                    {
                        (visible || showHistory) ? 
                        <div className="search-popup" >

                            {
                                (showHistory) ? 
                                    (histories.datas.length > 0 ) ? 
                                    histories.datas.map((data,idx) =>{ 

                                        return (
                                            <HistoryPopup history={data.history} key = {idx}/>
                                        )
                                    }) : 
                                    null :

                                null

                            }


                            {
                                (searchingResult.loading) ? 
                                <div className="loading">
                                    <ReactLoading type={"spokes"} color={'black'} height={'10%'} width={'10%'}/>
                                </div>

                                :
                                search.datas.map((data,idx)=>{
                                    
                                    // console.log(data)                                   
                                    return (    
                                        <SearchPopup username={data.username} full_name = {data.full_name}/>
                                    )
                                })

                            }

                            {
                                (searchingResult.loading) ? 
                                <div className="loading">
                                    <ReactLoading type={"spokes"} color={'black'} height={'10%'} width={'10%'}/>
                                </div>

                                :

                                hashtags.datas.map((data,idx)=>{

                                    return (
                                        <HashtagPopup hashtag={data.hashtag}/>
                                    )
                                })
                            }

                        </div> : 
                        <div>

                        </div>

                    }


                </div>

                <div className="menus">

                    {
                        (home) ? <HomeClicked/>  : <HomeUnclicked/>
                    }

                    {/* Home */}


                    <Link to = "/newpost" className="homess">
                        <svg className="w-8 h-8" fill="none" stroke="black" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    </Link>

                    <Link to="/direct" className="message">
                        <svg className="w-8 h-8" fill="none" stroke="black" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" /></svg>
                        
                    </Link>

                    <Link to="/explore" className="pages">
                        <svg className="w-8 h-8" fill="none" stroke="black" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /></svg>
                    </Link>

                    <Popup
                        trigger = {
                            <div className="activities">
                            <svg className="w-8 h-8" fill="none" stroke="black" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                        </div>
                        }

                        position= "bottom right"
                    >
                        <div className ="pop-up-activities">
                            
                            <div className="pop-container">

                                <StartFollowing></StartFollowing>
                                <StartFollowing></StartFollowing>
                                <StartFollowing></StartFollowing>
                                <LikeComment></LikeComment>
                                <LikeComment></LikeComment>                                
                                <LikeComment></LikeComment>
                                <LikePost></LikePost>
                                <LikePost></LikePost>
                                <LikePost></LikePost>
                                <MentionComment></MentionComment>
                                <MentionComment></MentionComment>
                                <MentionComment></MentionComment>
                                <MentionStory></MentionStory>
                                <MentionStory></MentionStory>
                                <MentionStory></MentionStory>
                                <TagPost></TagPost>
                                <TagPost></TagPost>
                                <TagPost></TagPost>

                            </div>

                            <Link to ="/activity" className="show-all" style={{textDecoration: 'none'}}>
                                <button>
                                    Show All
                                </button>
                            </Link>
                            
                        </div>
                    
                    </Popup>

                    <Popup
                    trigger={
                    <div className="profile">
                        <img src={path} className="w-8 h-8" alt="" />
                    </div>
                    }
                    position="bottom right"
                    // className="samting"
                    >
                        <div className="pop-up">
                            <div className="pop-up-container">

                                <div className="pop-up-content">
                                        <Link to ="/profile" style={{ textDecoration: 'none'}} className="pop-up-content-link">
                                            <svg className="w-6 h-6" fill="none" stroke="black" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                                Profile
                                        </Link>
                                </div>
                                
                                <div className="pop-up-content">
                                    <Link to = "" className="pop-up-content-link" style={{ textDecoration: 'none'}}>
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" /></svg>
                                        Saved
                                    </Link>
                                </div>

                                <div className="pop-up-content">

                                    <Link to = "/settings" className="pop-up-content-link" style={{ textDecoration: 'none'}} >
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                                        Settings
                                    </Link>
                                </div>

                                <div className="pop-up-content">

                                    <Link to = "" className="pop-up-content-link" style={{ textDecoration: 'none'}}>
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path></svg>

                                        Switch Account
                                    </Link>
                                </div>

                                <div className="pop-up-content logout"> 
                                    <Link to = "/login" className="pop-up-content-link" onClick={logout} style={{ textDecoration: 'none'}}>
                                        Log Out
                                    </Link>
                                </div>

                            </div>

                                
                        </div>

                    </Popup>

                </div>
            </div>
        </div>
    )
}