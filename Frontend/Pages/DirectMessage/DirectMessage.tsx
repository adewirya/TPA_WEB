import React, {useState, useEffect,useMemo} from "react";
import UserNavbar from "../Components/Navbars/UserNavbar";
import ProfileDM from "../Components/DMComponents/ProfileDM";
import Chat from "../Components/DMComponents/Chat";
import YourChat from "../Components/DMComponents/YourChat";
import { useMutation } from "@apollo/client";
import { GET_USER_BASED_ID, SEARCH_USER_HEADER} from "../../postgre/Mutation";
import { debounceTime, map, distinctUntilChanged, Subject } from "rxjs";
import SearchPopup from "../Components/Navbars/SearchPopup";

export default function DirectMessage(){

    const [name, setName] = useState("")
    const [followingDatas, setFollowing] = useState({datas : []})

    const [getFollowing, followingRes] = useMutation(GET_USER_BASED_ID)

        // let name = "niko";
    let otherName = "pai";

    useEffect(() => {
    
        getFollowing({
            variables:{
                uid : localStorage.getItem("uid")
            }
        })

    }, []);

    useEffect(() => {

        
        if (followingRes.data != null && followingRes.data != undefined){

            if (followingRes.data.getUserBasedID.followed_id != null){
                setFollowing({
                    datas : followingRes.data.getUserBasedID.followed_id.map((data, idx) =>{

                        return {
                            id : data.target_id
                        }
                    })
                })
            }

            setName(followingRes.data.getUserBasedID.username)

        }

    }, [followingRes.data]);

    const [search, setSearch] = useState ({datas : []})
    const [visible, setVisible] = useState(false)

    let subject = useMemo(() => new Subject<string>(), [])

    let [searching, searchingResult] = useMutation(SEARCH_USER_HEADER)

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

        if (!subject.closed)
            setVisible(true)
        
        if (searchingResult.data  != undefined && searchingResult.data != null){
            // console.log(searchingResult.data.searchUserAuto)
            setSearch({
                datas : searchingResult.data.searchUser.map((searchingData, idx) =>{

                    // console.log(searchingData)
                    // console.log(searchingData)
                    return{
                        username : searchingData.username,
                        user_id : searchingData.user_id,
                        full_name : searchingData.full_name
                    }
                })
            })

            // console.log(search)
        }


        if (searchingResult.data == undefined){
            setVisible(false)
        }
        // console.log(subject)
        // setVisible(true)

    }, [searchingResult.data])
    
    return (

        <div className="direct-msg">
            <UserNavbar></UserNavbar>

            <div className="content">

                <div className="left">

                    <div className="header">
                            {name}
                            <input type="text" className="h-6" onChange={(e)=> subject.next(e.target.value)}/>
                    </div>

                    {
                        (visible) ?
                        <div className="search-popup">
                            
                            {
                                search.datas.map((data,idx)=>{
                                    
                                    // console.log(data)                                   
                                    return (    
                                        <SearchPopup username={data.username} full_name = {data.full_name}/>
                                    )
                                })
                            }

                        </div> : 
                        null  
                    }

                    <div className="list">

                        {
                            (followingDatas.datas.length > 0) ? 
                            
                            followingDatas.datas.map((data,idx)=>{

                                return (
                                    <ProfileDM id={data.id}/>
                                )
                            }) : 
                            null
                        }

                    </div>

                </div>

                <div className="right">

                    <div className="right-header">
                        <img src="./other-profile.png" className="w-6 h-6" alt="" />
                        {otherName}
                    </div>

                    <div className="chat-room">
                        
                        <Chat></Chat>
                        <Chat></Chat>
                        <Chat></Chat>
                        <Chat></Chat>
                        <Chat></Chat>
                        <Chat></Chat>
                        <Chat></Chat>
                        <Chat></Chat>
                        <Chat></Chat>
                        <YourChat></YourChat>


                    </div>

                    <div className="input">

                            <input type="text" placeholder = "Message..."/>
                    </div>
                </div>

            </div>

        </div>
    )
}