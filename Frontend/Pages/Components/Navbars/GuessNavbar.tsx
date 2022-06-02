import React,{useContext, useState, useMemo, useEffect} from "react";
import { Link } from "react-router-dom"
import { debounceTime, map, distinctUntilChanged, Subject } from "rxjs";
import SearchPopup from "./SearchPopup";
import { useMutation } from "@apollo/client";
import { SEARCH_USER_HEADER } from "../../../postgre/Mutation";
import ReactLoading from "react-loading"
import HashtagPopup from "./HashtagPopup"
import ToggleTheme from "../ThemeToggle/ToggleTheme";

export default function GuessNavbar(){

    let subject = useMemo(() => new Subject<string>(), [])
    const [visible, setVisible] = useState(false)
    let [searching, searchingResult] = useMutation(SEARCH_USER_HEADER)
    const [autocomplete, setAutocomplete] = useState("")
    const [search, setSearch] = useState ({datas : []})
    const [hashtags, setHashtags] = useState({datas : []})


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
                        currUser : ""
                    }
                })
            })
        
        return (() => {subject.unsubscribe})

    }, [subject])
    
    

    useEffect(() => {

        if (searchingResult.data != undefined){
            setVisible(true)
        }
        
        if (searchingResult.data  != undefined && searchingResult.data != null){
            // console.log(searchingResult.data.searchUserAuto)
            setSearch({
                datas : searchingResult.data.searchUser.map((searchingData, idx) =>{

                    console.log(searchingData)
                    return{
                        username : searchingData.username,
                        user_id : searchingData.user_id,
                        full_name : searchingData.full_name
                    }
                })
            })

            setAutocomplete(searchingResult.data.searchUserAuto)

            // console.log(search)

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
        }

        

        if (searchingResult.data == undefined){
            setVisible(false)
        }

        // setVisible(true)

    }, [searchingResult.data])

    return (
        <div >
            <div className="guest-nav">
                <Link to="/login"  style={{ textDecoration: 'none' }}>
                    <div className="title">
                        InSOgram
                    </div>
                </Link>

                <ToggleTheme></ToggleTheme>

                <div className="search-bar">
                    <input type="search" name="search" id="search" placeholder="Search" onChange={(e)=> subject.next(e.target.value)}/>

                    {
                        (visible) ? 
                        <div className="search-popup" >

                            {
                                (searchingResult.loading) ? 
                                <div className="loading">
                                    <ReactLoading type={"spokes"} color={'black'} height={'10%'} width={'10%'}/>
                                </div>

                                :
                                search.datas.map((data,idx)=>{

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

                <div className="buttons">
                    <Link to="/login" className="login" style={{ textDecoration: 'none' }}>
                        Log In
                    </Link>
                    <Link to="/signup" className="sign-up" style={{ textDecoration: 'none' }}>
                        Sign Up
                    </Link>
                </div>
            </div>
        </div>
    )
}