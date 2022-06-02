import React, {useState, useEffect, useContext, useRef} from "react";
import UserNavbar from "../Components/Navbars/UserNavbar";
import Footer from "../Components/Footer/Footer";
import Post from "../Components/HomeComponents/Post";
import Suggestion from "../Components/HomeComponents/Suggestion";
import Story from "../Components/HomeComponents/Story";
import { JWTContext } from "../../App";
import { GET_USER, SELECT_ALL_HOMEPAGE} from "../../postgre/Mutation";
import { useMutation, useApolloClient} from "@apollo/client";
import ReactLoading from "react-loading"
export default function Home (){

    const [jwt, setJwt] = useContext(JWTContext)

    const [getUser, getUserData] = useMutation(GET_USER)

    const [email, setEmail ]= useState("")
    const [full_name, setFullName ]= useState("")
    const [username, setUsername ]= useState("")
    const [password, setPassword ]= useState("")
    const [id, setId ]= useState(0)

    const [mutuals, setMutuals] = useState({datas : []})

    useEffect(() => {
        getUser({
            variables:{
                token : jwt
            }
        })

    }, [])

    useEffect(() => {
        if (getUserData.data != null && getUserData.data != undefined){

            if (getUserData.data.sendUserBasedOnJWT != null){

                setId(getUserData.data.sendUserBasedOnJWT.user_id)
                setEmail(getUserData.data.sendUserBasedOnJWT.email)
                setFullName(getUserData.data.sendUserBasedOnJWT.full_name)
                setUsername(getUserData.data.sendUserBasedOnJWT.username)
                setPassword(getUserData.data.sendUserBasedOnJWT.password)
                
                localStorage.setItem("email",getUserData.data.sendUserBasedOnJWT.email)
                localStorage.setItem("uid", getUserData.data.sendUserBasedOnJWT.user_id)
                // localStorage.setItem("fullname", full_name)
                // localStorage.setItem("password", password)
                localStorage.setItem("username", getUserData.data.sendUserBasedOnJWT.username)
            }

            // console.log(getUserData.data)

            if (getUserData.data.sendUserBasedOnJWT.mutual_users != null){
                setMutuals({
                    datas : getUserData.data.sendUserBasedOnJWT.mutual_users.map((data,idx)=>{

                        return {
                            username : data.username,
                            profile_picture : data.profile_picture
                        }
                    })
                })
            }

            // console.log(id)
        }
    }, [getUserData.data])


    const [posts,setPosts]=useState({data:[]})
    const [nextpost,setNextPost] = useState("")
    const postsRef = useRef<HTMLDivElement>(null)
    const nextPostTriggerRef = useRef<HTMLDivElement>(null)
    const [isLoading,setIsLoading] = useState(false)
    const [observer,setObserver] = useState<IntersectionObserver>();
    const nextPostKeyRef = useRef(nextpost)
    const apollo = useApolloClient()
    const [hasnext,SetNext] = useState(true);

    useEffect(() => {
        nextPostKeyRef.current = nextpost 
    }, [nextpost])

    useEffect(()=>{

        // alert('masukk ')

        setObserver(new IntersectionObserver(
            (entries,observer)=>{
                if(!entries[0].isIntersecting ){
                    return;
                }
                
                observer.unobserve(nextPostTriggerRef.current!);
                setIsLoading(true)
                loadMoreItems()
            },
        ));
    },[])


    async function loadMoreItems() {

        // alert('masuk')   
        // console.log(id)
        const postPagged = await apollo.mutate({
            mutation:SELECT_ALL_HOMEPAGE,
            variables:{
                nextpost: nextPostKeyRef.current! === "" ? null : 
                    nextPostKeyRef.current!,
                uid : localStorage.getItem("uid")
            },
        });

        // console.log(localStorage.getItem("uid"))

        if (posts.data != undefined){
            // console.log(postPagged.data.selectPostExplorer)
            posts.data.push(...postPagged.data!.selectHomepage.posts);

            setPosts({data:posts.data})
            // console.log(postPagged.data.selectHomepage.nextposts)
            setNextPost(postPagged.data.selectHomepage.nextposts);
            SetNext(postPagged.data.selectHomepage.hasnext)
            setIsLoading(false);
        }
    }

    useEffect(() => {
        // alert('masuk observer')
        if(observer === undefined || isLoading || nextpost == null || hasnext == false){
            return;
        }
        observer!.observe(nextPostTriggerRef.current!);
        
    }, [observer,isLoading,nextpost,hasnext])

    return (
        <div className="homepage">
            <UserNavbar></UserNavbar>
            <div className="home">

                <div className="left">

                    <div className="stories">
                        <div className="stories-content">
                            <ul>
                                <Story/>
                                <Story/>
                                <Story/>
                                <Story/>
                                <Story/>
                                <Story/>
                                <Story/>
                                <Story/>
                                <Story/>
                                <Story/>
                                <Story/>
                            </ul>
                        </div>
                    </div>

                    <div ref = {postsRef}>                      

                        {
                            (posts.data.map(p=>{
                                // console.log(p.id)
                                
                                return (
                                    <Post post_id={p.id}/>
                                )
                            }))
                        }

                    </div>

                    {
                    isLoading ? <ReactLoading type={"spokes"} color={'white'} height={'10%'} width={'5%'}/> : <div ref={nextPostTriggerRef}>&nbsp;</div>
                }
                </div>

                <div className="right">

                    <div className='profile'>
                        <div className="names">
                            <img src="./profile.png" width="50px" height="50px" alt="" />
                            <div className="name-name">
                                <div className="username">
                                    {username}
                                </div>

                                <div className="full_name">
                                    {full_name}
                                </div>
                            </div>
                        </div>
                    </div>


                    <div className="suggestions">
                        <div className="title-cont">
                            Suggestions For You <a href="#">See All</a>
                        </div>

                        {
                            (mutuals.datas.length > 0) ? 
                            
                            mutuals.datas.map((data,idx)=>{{


                                if (idx < 5)

                                return (
                                    <div>
                                        <Suggestion username={data.username} path={data.profile_picture}/>
                                    </div>
                                )
                                
                            }})
                            
                            : null
                        }

                    </div>
                    
                    {/* <Footer></Footer> */}
                </div>

            </div>
        </div>
    )
}